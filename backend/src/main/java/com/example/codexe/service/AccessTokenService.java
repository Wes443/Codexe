package com.example.codexe.service;

import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.codexe.model.User;
import com.example.codexe.utils.CustomException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AccessTokenService {
    //get the access token duration from the application properties (15 min)
    @Value("{jwt.access.expiration-ms}")
    private long accessTokenDuration;

    private final Key signingKey;

    //constructor
    public AccessTokenService(@Value("${jwt.access.secret}") String secretKey) {
        //convert the String into a Key object
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    //generate an access token for the user
    public String generateAccessToken(User user){
        return Jwts.builder()
            .setSubject(user.getUserId().toString())
            .setIssuedAt(new Date())
            .setExpiration(Date.from(Instant.now().plusMillis(accessTokenDuration)))
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact();
    }

    //validate if the access token is valid
    public Claims validateAccessToken(String token){
        try {
            return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        } catch (ExpiredJwtException e) {
            throw new CustomException("Access Token Expired", HttpStatus.UNAUTHORIZED);

        } catch (JwtException e){
            throw new CustomException("Invalid Access Token", HttpStatus.UNAUTHORIZED);
        } 
    }
}
