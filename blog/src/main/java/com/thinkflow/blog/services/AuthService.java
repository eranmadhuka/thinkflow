package com.thinkflow.blog.services;
import com.thinkflow.blog.models.User;
import com.thinkflow.blog.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class AuthService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract user details from Google
        String googleId = oAuth2User.getAttribute("sub");
        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");

        // Look up the user by googleId
        User user = userRepository.findByGoogleId(googleId).orElse(null);

        if (user == null) {
            // New user: create and populate with Google data
            user = new User();
            user.setGoogleId(googleId);
            user.setName(name); // Set initial name from Google
            user.setEmail(email);
        } else {
            // Existing user: only update fields that should sync with Google
            user.setEmail(email); // e.g., keep email in sync with Google
            // Do NOT overwrite name here; let the user’s custom name persist
        }

        userRepository.save(user);
        return oAuth2User;
    }
}