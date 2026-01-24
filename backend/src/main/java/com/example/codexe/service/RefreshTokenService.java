package com.example.codexe.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.codexe.dao.RefreshTokenDao;
import com.example.codexe.model.RefreshToken;
import com.example.codexe.model.User;
import com.example.codexe.security.JwtProperties;
import com.example.codexe.utils.CustomException;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class RefreshTokenService {
    //jwt properties object
    private JwtProperties jwtProperties;

    //refresh token data access object (dao)
    private RefreshTokenDao refreshTokenDao;

    @PersistenceContext
    private EntityManager entityManager;

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
        //detatch the old refresh token from Hibernate so it doens't sync
        entityManager.detach(oldRefreshToken);
        //delete the old refresh token
        refreshTokenDao.deleteById(oldRefreshToken.getTokenId());
        //create a new refresh token and return it
        return createRefreshToken(oldRefreshToken.getUser());
    }

    //generate refresh token string using random bytes
    private String generateRefreshToken() {
        byte[] randomBytes = new byte[64];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    //return the refresh token object based on the token string
    public RefreshToken getRefreshToken(String token){
        //get the refresh token object based on the token string
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
        //throw exception if the refresh token doesn't exist
        .orElseThrow(() -> new CustomException("Refresh Token Not Found", HttpStatus.NOT_FOUND));
        //if the refresh token is expired
        if(refreshToken.getExpiresAt().isBefore(Instant.now())){
            //delete it from the database
            deleteRefreshToken(token);
            //throw an exception
            throw new CustomException("Expired Refresh Token", HttpStatus.UNAUTHORIZED);
        }
        //rotate the old refresh token and return the new one
        return rotateRefreshToken(refreshToken);
    }

    //remove the refresh token from the database 
    @Transactional
    public void deleteRefreshToken(String token){
        //check if the refresh token exists
        if(!refreshTokenDao.existsByToken(token)){
            throw new CustomException("Refresh Token Not Found", HttpStatus.NOT_FOUND);
        }
        //remove the token from the database
        refreshTokenDao.deleteByToken(token);
    }
}
