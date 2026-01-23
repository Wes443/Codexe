package com.example.codexe.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.codexe.dto.LoginRequest;
import com.example.codexe.dto.LoginResponse;
import com.example.codexe.dto.UserRequest;
import com.example.codexe.model.User;
import com.example.codexe.service.AccessTokenService;
import com.example.codexe.service.RefreshTokenService;
import com.example.codexe.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final AccessTokenService accessTokenService;
    private final RefreshTokenService refreshTokenService;

    //constructor
    public AuthController(UserService userService, AccessTokenService accessTokenService, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/create-user")
    public ResponseEntity<String> createUser(@RequestBody UserRequest request){
        //create new user object
        User user = new User(request.getEmail(), request.getUsername(), request.getPassword());
        //call user service 
        userService.createUser(user);
        return new ResponseEntity<>("User created successfully", HttpStatus.OK);
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest credentials){
        //get user based on credentials
        User user = userService.validateCredentials(credentials.getUsername(), credentials.getPassword());
        //generate access token
        String accessToken = accessTokenService.generateAccessToken(user);
        //generate refresh token object and get the token string
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();
        //return login response object
        return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken));
    }
}
