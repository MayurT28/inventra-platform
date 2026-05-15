package com.inventra.backend.security;

import com.inventra.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.util.List;
import java.io.IOException;
import com.inventra.backend.repository.UserRepository;
import com.inventra.backend.entity.User;

@Component
public class JwtAuthenticationFilter
                extends OncePerRequestFilter {

        private final JwtService jwtService;
        private final UserRepository userRepository;

        public JwtAuthenticationFilter(
                        JwtService jwtService,
                        UserRepository userRepository) {
                this.jwtService = jwtService;
                this.userRepository = userRepository;
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain) throws ServletException, IOException {

                String path = request.getServletPath();

                if (path.startsWith("/api/auth")) {
                        filterChain.doFilter(request, response);
                        return;
                }
                final String authHeader = request.getHeader("Authorization");

                // No token
                if (authHeader == null ||
                                !authHeader.startsWith("Bearer ")) {

                        filterChain.doFilter(request, response);

                        return;
                }

                // Extract token
                String token = authHeader.substring(7);

                // Extract email
                String email = jwtService.extractEmail(token);

                // Create authentication
                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow();

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(
                                                new SimpleGrantedAuthority(
                                                                "ROLE_" + user.getRole().name())));

                SecurityContextHolder
                                .getContext()
                                .setAuthentication(authToken);

                filterChain.doFilter(request, response);
        }
}