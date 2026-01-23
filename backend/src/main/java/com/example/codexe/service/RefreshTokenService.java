package com.example.codexe.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.codexe.dao.RefreshTokenDao;
import com.example.codexe.model.RefreshToken;
import com.example.codexe.model.User;
import com.example.codexe.security.JwtProperties;
import com.example.codexe.utils.CustomException;

@Service
public class RefreshTokenService {
    private JwtProperties jwtProperties;

    //refresh token data access object (dao)
    private RefreshTokenDao refreshTokenDao;

    //constructor
    public RefreshTokenService(JwtProperties jwtProperties, RefreshTokenDao refreshTokenDao){
        this.refreshTokenDao = refreshTokenDao;
        this.jwtProperties = jwtProperties;
    }

    //manually create new refresh token 
    public RefreshToken createRefreshToken(User user){
        //create a new refresh token object
        RefreshToken token = new RefreshToken();
        //set the user of the refresh token
        token.setUser(user);
        //set the token string
        token.setToken(generateRefreshToken());
        //get the current instant
        Instant now = Instant.now();
        //set the current issued time
        token.setIssuedAt(now);
        //set the expiration date of the token
        token.setExpiresAt(now.plusMillis(jwtProperties.getRefreshExpirationMs()));
        //save token to database
        return refreshTokenDao.save(token);
    }
    
    //automatically rotate (create new) token after the old one is used
    public RefreshToken rotateRefreshToken(RefreshToken oldRefreshToken){
        //create new refresh token object
        RefreshToken token = new RefreshToken();
        //set the user of the new refresh token
        token.setUser(oldRefreshToken.getUser());
        //set the token string
        token.setToken(generateRefreshToken());
        //set the expiration date of the token
        token.setExpiresAt(Instant.now().plusMillis(jwtProperties.getRefreshExpirationMs()));
        //delete the old refresh token from the database
        refreshTokenDao.delete(oldRefreshToken);
        //save the new token to the database
        return refreshTokenDao.save(token);
    }

    //generate refresh token string using random bytes
    private String generateRefreshToken() {
        byte[] randomBytes = new byte[64];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    //return the refresh token object based on the token string
    public RefreshToken getRefreshTokenById(String token){
        //get the refresh token object based on the token id
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
        //throw exception if the refresh token doesn't exist
        .orElseThrow(() -> new CustomException("Refresh Token Not Found", HttpStatus.NOT_FOUND));
        //if the refresh token is expired
        if(refreshToken.getExpiresAt().isBefore(Instant.now())){
            //delete it from the database
            refreshTokenDao.delete(refreshToken);
            //throw an exception
            throw new CustomException("Expird Refresh Token", HttpStatus.UNAUTHORIZED);
        }
        //rotate the old refresh token and return the new one
        return rotateRefreshToken(refreshToken);
    }

    //remove the refresh token from the database 
    public void deleteRefreshTokenById(String token){
        //get the refresh token object based on the token id
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
        //throw exception if the refresh token doesn't exist
        .orElseThrow(() -> new CustomException("Refresh Token Not Found", HttpStatus.NOT_FOUND));
        //remove the refresh token from the database
        refreshTokenDao.delete(refreshToken);
    }
}
