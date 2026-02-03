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

   //generate refresh token string using random bytes
    private String generateRefreshToken() {
        byte[] randomBytes = new byte[64];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    //manually create new refresh token 
    @Transactional
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

    @Transactional
    public void revokeToken(String token){
        //get refresh token
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
        .orElseThrow(() -> new CustomException("Refresh Token Not Found", HttpStatus.NOT_FOUND));
        //set the refresh token to revoked
        refreshToken.setRevoked(true);
        //update the db
        refreshTokenDao.save(refreshToken);
    }

    //rotate and return a new refresh token
    @Transactional
    public RefreshToken rotateRefreshToken(String token){
        //get old token
        RefreshToken oldToken = refreshTokenDao.findByToken(token)
        .orElseThrow(() -> new CustomException("Invalid Token", HttpStatus.NOT_FOUND));

        //detach object persistence by hibernate
        entityManager.detach(oldToken);

        //delete the token
        refreshTokenDao.delete(oldToken);

        //create new token
        RefreshToken newToken = new RefreshToken();
        newToken.setUser(oldToken.getUser());
        newToken.setToken(generateRefreshToken());
        Instant now = Instant.now();
        newToken.setIssuedAt(now);
        newToken.setExpiresAt(now.plusMillis(jwtProperties.getRefreshExpirationMs()));

        //save and return token
        return refreshTokenDao.save(newToken);
    }

    //remove the refresh token from the database upon logout
    @Transactional
    public void logout(String token){
        //get the refresh token object based on the token string
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
        //throw exception if the refresh token doesn't exist
        .orElseThrow(() -> new CustomException("Refresh Token Not Found", HttpStatus.NOT_FOUND));
        //remove the token from the database
        refreshTokenDao.delete(refreshToken);
    }
}
