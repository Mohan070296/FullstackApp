package com.fooddelivery.security;

import com.fooddelivery.entity.Role;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Value("${app.admin-email}")
    private String adminEmail;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String googleId = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String avatarUrl = oauth2User.getAttribute("picture");

        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> userRepository.findByEmail(email).orElse(null));

        if (user == null) {
            Role role = adminEmail.equalsIgnoreCase(email) ? Role.ADMIN : Role.USER;
            user = User.builder()
                    .googleId(googleId)
                    .email(email)
                    .name(name)
                    .avatarUrl(avatarUrl)
                    .role(role)
                    .build();
        } else {
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
            }
        }

        user = userRepository.save(user);
        return new CustomOAuth2User(oauth2User, user);
    }
}
