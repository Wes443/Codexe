package com.example.codexe.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Enable CORS
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Disable CSRF for JWT-based authentication (to be configured)
            .csrf(csrf -> csrf.disable())
            //authorization configuration
            .authorizeHttpRequests(auth -> auth
                // for development purposes, permit all requests
                .anyRequest().permitAll()
                
                // .requestMatchers("/public/**").permitAll()
                // .anyRequest().authenticated()
            )
            // Use HTTP Basic Authentication
            .httpBasic(Customizer.withDefaults());

        return http.build();
        
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        //only allow requests from localhost:5173 (frontend)
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        //allowed response methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        //allow all headers
        config.setAllowedHeaders(List.of("*"));
        //allow credentials
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //apply this configuration to all endpoints
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
