package com.thinkflow.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless APIs
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/user/profile", "/logout", "/login", "/error").permitAll() // Public endpoints
                        .anyRequest().authenticated() // Secure all other endpoints
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost:5173/feed", true) // Redirect after successful login
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // Custom logout URL
                        .invalidateHttpSession(true) // Invalidate session
                        .clearAuthentication(true) // Clear authentication
                        .deleteCookies("JSESSIONID") // Delete session cookie
                        .addLogoutHandler(logoutHandler()) // Add custom logout handler
                        .permitAll() // Allow everyone to access the logout endpoint
                );

        return http.build();
    }

    @Bean
    public LogoutHandler logoutHandler() {
        return new SecurityContextLogoutHandler(); // Handles session cleanup
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Allow frontend origin
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow all HTTP methods
        configuration.setAllowedHeaders(List.of("*")); // Allow all headers
        configuration.setAllowCredentials(true); // Allow credentials (cookies, authorization headers)
        configuration.setExposedHeaders(List.of("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")); // Expose necessary headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply CORS to all endpoints
        return source;
    }
}