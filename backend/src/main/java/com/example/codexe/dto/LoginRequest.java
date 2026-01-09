package com.example.codexe.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Username is required")
    private String username;
    @NotBlank(message = "Password is required")
    private String password;

    //default constructor
    public LoginRequest(){}

    //getter methods
    public String getUsername(){
        return username;
    }

    public String getPassword(){
        return password;
    }

    //setter methods
    public void setUsername(String username){
        this.username = username;
    }

    public void setPassword(String password){
        this.password = password;
    }
}
