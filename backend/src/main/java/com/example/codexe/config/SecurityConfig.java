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
    //auth filter object
    private final JwtAuthFilter jwtAuthFilter;

    //constructor
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    //password encoder bean 
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    //filter chain for all http requests
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //implement custom config 
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            //disable CSRF for JWT-based authentication
            .csrf(csrf -> csrf.disable())
            //stateless session for jwt
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            //authorization configuration
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            //filter authenticated requests
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        //return build
        return http.build();
    }

    //configuration source for CORS (cross origin resource sharing)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("*"));
        config.setAllowedHeaders(List.of("*"));
        //allow server to accept cookies (for jwt tokens)
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //apply this configuration to all endpoints
        source.registerCorsConfiguration("/**", config);
        //return source
        return source;
    }
}
