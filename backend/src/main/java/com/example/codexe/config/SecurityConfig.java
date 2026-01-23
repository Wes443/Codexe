package com.example.codexe.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.codexe.security.JwtAuthFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Enable CORS (cross origin resource sharing)
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Disable CSRF for JWT-based authentication
            .csrf(csrf -> csrf.disable())
            //stateless session for jwt
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            //authorization configuration
            .authorizeHttpRequests(auth -> auth
                //allow any requests that start with auth
                .requestMatchers("/auth/**").permitAll()
                //any other endpoint must be authenticated 
                .anyRequest().authenticated()
            )
            //filter every request before it is handled
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

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
        //allow server to accept cookies (for jwt tokens)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //apply this configuration to all endpoints
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
