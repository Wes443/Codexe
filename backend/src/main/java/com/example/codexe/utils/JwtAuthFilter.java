package com.example.codexe.utils;

import java.io.IOException;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.codexe.service.AccessTokenService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter{
    
    private final UserDetailsService userDetailsService;
    private final AccessTokenService accessTokenService;

    public JwtAuthFilter(UserDetailsService userDetailsService, AccessTokenService accessTokenService){
        this.userDetailsService = userDetailsService;
        this.accessTokenService = accessTokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
    throws ServletException, IOException {
        //extract the header
        String header = request.getHeader("Authorization");

        //if the request doesn't require authorization
        if (header == null || !header.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        //get the token from the request header (remove the string "Bearer ")
        String token = header.substring(7);

        try{
            //validate the access token
            Claims claim = accessTokenService.validateAccessToken(token);

            //get the userId from the claim
            UUID userId = UUID.fromString(claim.getSubject());

            //get the user's detail
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId.toString());

            //create authentication object
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );

            //set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

        }catch(JwtException | IllegalArgumentException e){
            //throw exception if the access token is invalid
            throw new CustomException("Invalid or Expired Access Token", HttpStatus.UNAUTHORIZED);
        }

        //continue filtering requests
        filterChain.doFilter(request, response);
    }
}
