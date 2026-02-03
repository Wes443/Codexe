package com.example.codexe.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.codexe.service.AccessTokenService;
import com.example.codexe.utils.CustomException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter{
    private final CustomUserDetailsService userDetailsService;
    private final AccessTokenService accessTokenService;

    //constructor
    public JwtAuthFilter(CustomUserDetailsService userDetailsService, AccessTokenService accessTokenService){
        this.userDetailsService = userDetailsService;
        this.accessTokenService = accessTokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
    throws ServletException, IOException {
        //extract the auth header
        String header = request.getHeader("Authorization");

        //return if auth not needed
        if (header == null || !header.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        //get the token from header
        String token = header.substring(7);

        try{
            //validate token
            Claims claim = accessTokenService.validateAccessToken(token);
            //get the userId
            String userId = claim.getSubject();
            //create userDetail
            CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(userId);
            //create authentication object
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
            //set authentication details
            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );
            //set the request as authenticated 
            SecurityContextHolder.getContext().setAuthentication(authentication);

        }catch(JwtException | IllegalArgumentException | CustomException e){
            //set http status as 401 (unauthorized)
            response.setStatus(401);
            return;
        }

        //continue filtering requests
        filterChain.doFilter(request, response);
    }
}
