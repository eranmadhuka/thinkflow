package com.thinkflow.blog.config;

import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract user details
        String googleId = oAuth2User.getAttribute("sub");
        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");

        // Save or update user in MongoDB
        User user = userRepository.findByGoogleId(googleId)
                .orElse(new User());
        user.setGoogleId(googleId);
        user.setName(name);
        user.setEmail(email);
        userRepository.save(user);

        return oAuth2User;
    }
}
