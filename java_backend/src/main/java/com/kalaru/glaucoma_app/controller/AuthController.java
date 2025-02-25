package com.kalaru.glaucoma_app.controller;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    @PostMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        // Check if header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("No token provided");
        }

        // Extract token from header
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            return ResponseEntity.ok(new AuthResponse(
                decodedToken.getUid(),
                decodedToken.getEmail(),
                "Login successful"
            ));
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
}

class AuthResponse {
    private final String userId;
    private final String email;
    private final String message;

    public AuthResponse(String userId, String email, String message) {
        this.userId = userId;
        this.email = email;
        this.message = message;
    }

    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getMessage() { return message; }
}
