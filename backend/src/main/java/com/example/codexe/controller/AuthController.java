package com.example.codexe.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.codexe.dto.LoginRequest;
import com.example.codexe.dto.UserRequest;
import com.example.codexe.model.RefreshToken;
import com.example.codexe.model.User;
import com.example.codexe.security.JwtProperties;
import com.example.codexe.service.AccessTokenService;
import com.example.codexe.service.RefreshTokenService;
import com.example.codexe.service.UserService;
import com.example.codexe.utils.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {
    //service objects
    private final UserService userService;
    private final AccessTokenService accessTokenService;
    private final RefreshTokenService refreshTokenService;
    private final JwtProperties jwtProperties;

    //constructor
    public AuthController(UserService userService, AccessTokenService accessTokenService, RefreshTokenService refreshTokenService, JwtProperties jwtProperties) {
        this.userService = userService;
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
        this.jwtProperties = jwtProperties;
    }

    //mapping to create a new user
    @PostMapping("/create-user")
    public ResponseEntity<String> createUser(@RequestBody UserRequest request){
        //create new user object
        User user = new User(request.getEmail(), request.getUsername(), request.getPassword());
        //call user service 
        userService.createUser(user);
        //return response
        return new ResponseEntity<>("User created successfully", HttpStatus.OK);
    }
    
    //mapping to log the user in
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest credentials, HttpServletResponse response){
        //get user based on credentials
        User user = userService.validateCredentials(credentials.getUsername(), credentials.getPassword());
        //generate access token
        String accessToken = accessTokenService.generateAccessToken(user);
        //generate refresh token object and get the token string
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();
        //generate a http-cookie for the refresh token
        ResponseCookie refreshTokenCookie = CookieUtil.buildCookie("refresh-token", refreshToken, jwtProperties.getRefreshCookieExpirationS());
        //add the cookie to the response header 
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());
        //return access token
        return new ResponseEntity<>(accessToken, HttpStatus.OK);
    }

    //mapping when page is refreshed
    @PostMapping("/refresh")
    public ResponseEntity<String> refresh(@CookieValue(name="refresh-token") String refreshToken, HttpServletResponse response){
        //get refresh token from the http-cookie
        RefreshToken refreshTokenObj = refreshTokenService.getRefreshToken(refreshToken);
        //get user based on the refresh token
        User user = refreshTokenObj.getUser();
        //create new access token
        String accessToken = accessTokenService.generateAccessToken(user);
        //generate new http-cookie for the refresh token
        ResponseCookie refreshTokenCookie = CookieUtil.buildCookie("refresh-token", refreshTokenObj.getToken(), jwtProperties.getRefreshCookieExpirationS());
        //add the cookie to the response header 
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());
        //return access token
        return new ResponseEntity<>(accessToken, HttpStatus.OK);
    }

    //mapping when user logs out
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@CookieValue(name="refresh-token") String refreshToken, HttpServletResponse response){
        //remove refresh token from the database
        refreshTokenService.deleteRefreshToken(refreshToken);
        //create blank cookie
        ResponseCookie blankCookie = CookieUtil.buildCookie("refresh-token", "", 0);
        //add blank cookie to the response header
        response.addHeader("Set-Cookie", blankCookie.toString());
        //return response entity
        return new ResponseEntity<>("Logout Successfull", HttpStatus.OK);
    }
}
