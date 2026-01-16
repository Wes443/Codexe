package com.example.codexe.dto;

public class LoginResponse {
    private String accessToken;
    private String refreshToken;

    //constructor
    public LoginResponse(String accessToken, String refreshToken){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    //getter methods
    public String getAccessToken(){
        return accessToken;
    }

    public String getRefreshToken(){
        return refreshToken;
    }
}
