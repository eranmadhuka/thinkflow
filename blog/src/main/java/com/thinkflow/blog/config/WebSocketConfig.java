package com.thinkflow.blog.config;

import org.springframework.beans.factory.annotation.Value; // Correct import for @Value
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/user"); // Enable broker for topics and user-specific destinations
        config.setApplicationDestinationPrefixes("/app"); // Prefix for client messages
        config.setUserDestinationPrefix("/user"); // Prefix for user-specific messages
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(frontendUrl) // Use the injected frontendUrl
                .withSockJS(); // Enable SockJS fallback
    }
}