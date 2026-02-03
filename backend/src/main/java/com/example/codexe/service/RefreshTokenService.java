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

    //create new refresh token 
    @Transactional
    public RefreshToken createRefreshToken(User user){
        //create a new refresh token object
        RefreshToken token = new RefreshToken();
        //set token variables
        token.setUser(user);
        token.setToken(generateRefreshToken());

        Instant now = Instant.now();
        token.setIssuedAt(now);
        token.setExpiresAt(now.plusMillis(jwtProperties.getRefreshExpirationMs()));
        //save token to database
        return refreshTokenDao.save(token);
    }

    @Transactional
    public RefreshToken revokeToken(String token){
        //get the refresh token object based on the token string
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
        .orElseThrow(() -> new CustomException("Refresh Token Not Found", HttpStatus.NOT_FOUND));
        //set the refresh token to revoked
        refreshToken.setRevoked(true);
        //update the db
        refreshTokenDao.save(refreshToken);
        //return null if token expired
        if(refreshToken.getExpiresAt().isBefore(Instant.now())){
            return null;
        }
        //return the updated refresh token
        return refreshToken;
    }

    //rotate and return a new refresh token
    public RefreshToken getRefreshToken(String token){
        //get the old refresh token
        RefreshToken oldRefreshToken = revokeToken(token);
        //throw exception if expired token
        if(oldRefreshToken == null){
            throw new CustomException("Refresh Token is Expired", HttpStatus.UNAUTHORIZED);
        }
        //create and return a new refresh token
        return createRefreshToken(oldRefreshToken.getUser());
    }

    //remove the refresh token from the database upon logout
    @Transactional
    public void logout(String token){
        //get the refresh token object based on the token string
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
        .orElseThrow(() -> new CustomException("Refresh Token Not Found", HttpStatus.NOT_FOUND));
        //remove the token from the database
        refreshTokenDao.delete(refreshToken);
    }
}
