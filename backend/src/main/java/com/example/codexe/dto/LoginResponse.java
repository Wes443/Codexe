package com.example.codexe.dto;

public class LoginResponse {
    private String accessToken;

    //constructor
    public LoginResponse(String accessToken){
        this.accessToken = accessToken;
    }

    //getter methods
    public String getAccessToken(){
        return accessToken;
    }
}
