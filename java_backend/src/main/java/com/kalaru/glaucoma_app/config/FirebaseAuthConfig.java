package com.kalaru.glaucoma_app.config;

import com.kalaru.glaucoma_app.middleware.FirebaseAuthMiddleware;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseAuthConfig {

    @Bean
    public FilterRegistrationBean<FirebaseAuthMiddleware> firebaseAuthFilter() {
        FilterRegistrationBean<FirebaseAuthMiddleware> registrationBean = new FilterRegistrationBean<>();
        
        registrationBean.setFilter(new FirebaseAuthMiddleware());
        registrationBean.addUrlPatterns("/api/*"); // Apply to all API endpoints
        
        return registrationBean;
    }
} 