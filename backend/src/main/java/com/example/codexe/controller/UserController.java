package com.example.codexe.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.codexe.service.UserService;

import lombok.extern.slf4j.Slf4j;

import com.example.codexe.model.User;
import com.example.codexe.security.CustomUserDetails;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Slf4j
@RestController
public class UserController {
    //dependency injection of UserService
    private final UserService userService;
    
    //constructor
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/me")
    public String getUsername(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userDetails.getUsername();
    }
    
}
