package com.example.codexe.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.codexe.service.UserService;

import lombok.extern.slf4j.Slf4j;

import com.example.codexe.dto.LoginRequest;
import com.example.codexe.model.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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

    @PostMapping("/create-user")
    public ResponseEntity<String> createUser(@RequestBody User user){
        try {
            userService.createUser(user);
            log.info("User created successfully");
            return new ResponseEntity<>("User created successfully", HttpStatus.OK);
        } catch (Exception e){
            log.error("user could not be created", e);
            return new ResponseEntity<>("User could not be created", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request){
        User user = userService.validateCredentials(request.getUsername(), request.getPassword());
        
        return new ResponseEntity<String>("Login Successful", HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
            return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

}
