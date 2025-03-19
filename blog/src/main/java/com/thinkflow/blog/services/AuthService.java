package com.thinkflow.blog.services;

import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.authentication.OAuth2LoginAuthenticationToken;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

//    private final UserRepository userRepository;
//    private final OAuth2AuthorizedClientService authorizedClientService;
//
//    @Autowired
//    public AuthService(UserRepository userRepository, OAuth2AuthorizedClientService authorizedClientService) {
//        if (userRepository == null) {
//            System.out.println("UserRepository is not injected correctly!");
//        }
//        this.userRepository = userRepository;
//        this.authorizedClientService = authorizedClientService;
//    }
//
//    /**
//     * Process OAuth 2.0 user authentication and register them in the system if they don't exist.
//     * @param authentication The authentication object containing OAuth2 details.
//     * @return User The authenticated user or newly created user.
//     */
//    public User processOAuth2Login(Authentication authentication) {
//        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//
//        // Retrieve the user's email from the OAuth2User
//        String email = oAuth2User.getAttribute("email");
//
//        // Check if the user already exists in the database
//        Optional<User> userOptional = userRepository.findByEmail(email);
//        if (userOptional.isPresent()) {
//            // User exists, return the existing user
//            return userOptional.get();
//        } else {
//            // User does not exist, create a new one and save to database
//            User newUser = new User();
//            newUser.setEmail(email);
//            newUser.setRole("USER"); // Default role for new users
//
//            // Save the new user to MongoDB
//            return userRepository.save(newUser);
//        }
//    }
//
//    /**
//     * Handles post-login logic like token storage or other custom logic if needed.
//     * This method is optional and can be used for additional functionalities.
//     */
//    public void postLoginActions(OAuth2LoginAuthenticationToken authenticationToken) {
//        // Implement any custom actions post-login if needed
//        // E.g., token storage, session management, logging, etc.
//    }
}