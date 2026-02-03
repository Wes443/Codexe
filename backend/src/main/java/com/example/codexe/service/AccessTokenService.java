package com.example.codexe.service;

import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.codexe.model.User;
import com.example.codexe.security.JwtProperties;
import com.example.codexe.utils.CustomException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AccessTokenService {
    private final JwtProperties jwtProperties;
    private final Key signingKey;

    //constructor
    public AccessTokenService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        //get signing key based on secret
        byte[] keyBytes = Base64.getDecoder().decode(this.jwtProperties.getAccessSecret());
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    //generate an access token for the user
    public String generateAccessToken(User user){
        return Jwts.builder()
            .setSubject(user.getUserId().toString())
            .setIssuedAt(new Date())
            .setExpiration(Date.from(Instant.now().plusMillis(jwtProperties.getAccessExpirationMs())))
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact();
    }

    //validate if the access token is valid
    public Claims validateAccessToken(String token){
        try {
            //create a jwts parser
            return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                //verify the access token
                .parseClaimsJws(token)
                //extract the claim from the parser
                .getBody();

        } catch (ExpiredJwtException e) {
            throw new CustomException("Access Token Expired", HttpStatus.UNAUTHORIZED);

        } catch (JwtException e){
            throw new CustomException("Invalid Access Token", HttpStatus.UNAUTHORIZED);
        } 
    }
}
