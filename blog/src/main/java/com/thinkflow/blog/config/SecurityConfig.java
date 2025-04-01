package com.thinkflow.blog.config;

import com.thinkflow.blog.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private AuthService authService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // Changed to ALWAYS for iOS
                        .sessionFixation().migrateSession()
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/login",
                                "/error",
                                "/ws/**",
                                "/api/auth/user",
                                "/oauth2/**"
                        ).permitAll()
                        .requestMatchers("/user/profile", "/logout").authenticated()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(authService))
                        .successHandler((request, response, authentication) -> {
                            request.getSession().setAttribute("user", authentication.getPrincipal());
                            String redirectUrl = (String) request.getSession().getAttribute("redirectAfterLogin");
                            if (redirectUrl == null) {
                                redirectUrl = "https://thinkflow-flax.vercel.app/feed";
                            }
                            // Add cache control headers for iOS
                            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                            response.sendRedirect(redirectUrl);
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                            response.sendRedirect("https://thinkflow-flax.vercel.app/login?error=true");
                        })
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                        .addLogoutHandler(logoutHandler())
                        .logoutSuccessHandler((request, response, authentication) -> {
                            // iOS-specific headers
                            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                            response.setHeader("Pragma", "no-cache");
                            response.setHeader("Expires", "0");
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("Logout successful");
                        })
                        .permitAll()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                        })
                );

        return http.build();
    }

    @Bean
    public LogoutHandler logoutHandler() {
        return new SecurityContextLogoutHandler();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow both Vercel and local development origins
        configuration.setAllowedOrigins(Arrays.asList(
                "https://thinkflow-flax.vercel.app"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        // iOS-specific exposed headers
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "Set-Cookie",  // Critical for iOS
                "X-Requested-With"
        ));
        // Safari cache settings
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}