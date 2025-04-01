package com.thinkflow.blog.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
public class AuthController {

    // Logout endpoint
    @RequestMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Logout from Spring Security context
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, null);

        // Redirect to login page after logout
        return "redirect:/login"; // You can change the redirect URL if needed
    }
}