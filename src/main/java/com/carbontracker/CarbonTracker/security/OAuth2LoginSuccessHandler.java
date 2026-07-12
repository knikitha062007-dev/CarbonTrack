package com.carbontracker.CarbonTracker.security;

import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        System.out.println("===== GOOGLE SUCCESS HANDLER =====");
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        System.out.println(oauthUser.getAttributes());
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            user = User.builder()
                    .email(email)
                    .fullName(name)
                    .password("")
                    .preferredUnit("kg")
                    .goalVisibility(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(user);
        }

        String token = jwtService.generateToken(user.getEmail());

        response.sendRedirect(
                "http://localhost:5173/oauth-success?token="
                        + token
                        + "&name="
                        + name
                        + "&email="
                        + email
        );
    }
}