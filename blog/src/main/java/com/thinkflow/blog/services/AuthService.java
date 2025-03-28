package com.thinkflow.blog.services;

import com.thinkflow.blog.models.User;
import com.thinkflow.blog.models.User.ProviderIdentity;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AuthService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId(); // "google" or "facebook"
        String providerId = "google".equals(provider) ? oAuth2User.getAttribute("sub") : oAuth2User.getAttribute("id");
        if (providerId == null) {
            throw new OAuth2AuthenticationException("Provider ID not found for " + provider);
        }

        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        String picture = oAuth2User.getAttribute("picture");

        User user = userRepository.findByProviderId(providerId).orElse(null);

        if (user == null) {
            Optional<User> existingUserByEmail = userRepository.findByEmail(email);
            if (existingUserByEmail.isPresent()) {
                // Add new provider identity to existing user
                user = existingUserByEmail.get();
                user.getIdentities().add(new ProviderIdentity(providerId, provider));
            } else {
                // New user
                user = new User();
                user.getIdentities().add(new ProviderIdentity(providerId, provider));
                user.setName(name);
                user.setEmail(email);
                user.setPicture(picture);
                user.setStatus("Prefer Not to Say");
                user.setFollowers(new ArrayList<>());
                user.setFollowing(new ArrayList<>());
                user.setSavedPosts(new ArrayList<>());
            }
        } else {
            // Update syncable fields
            user.setEmail(email);
            if (user.getPicture() == null || user.getPicture().isEmpty()) {
                user.setPicture(picture);
            }
        }

        userRepository.save(user);
        return oAuth2User;
    }
}