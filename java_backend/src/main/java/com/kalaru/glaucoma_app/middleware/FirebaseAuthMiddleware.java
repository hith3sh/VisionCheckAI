package com.kalaru.glaucoma_app.middleware;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Arrays;

public class FirebaseAuthMiddleware implements Filter {
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
        "/login", "/aboutus", "/contactus", "/register", "/"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String path = httpRequest.getRequestURI();

         // Add CORS headers to all responses
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");

        // Allow OPTIONS requests (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Skip authentication for public endpoints
        if (PUBLIC_ENDPOINTS.stream().anyMatch(path::endsWith)) {
            chain.doFilter(request, response);
            return;
        }

        // Get Authorization header
        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendErrorResponse(httpResponse, HttpServletResponse.SC_UNAUTHORIZED, "No token provided");
            return;
        }

        String token = authHeader.substring(7);

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            request.setAttribute("userId", decodedToken.getUid());
            request.setAttribute("userEmail", decodedToken.getEmail());
            chain.doFilter(request, response);
        } catch (FirebaseAuthException e) {
            sendErrorResponse(httpResponse, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        }
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}
