package com.example.codexe.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.codexe.service.UserService;

import lombok.extern.slf4j.Slf4j;

import com.example.codexe.dto.LoginRequest;
import com.example.codexe.dto.UserRequest;
import com.example.codexe.model.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

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
    public ResponseEntity<String> createUser(@RequestBody UserRequest request){
        // //create new user object
        // User user = new User(request.getEmail(), request.getUsername(), request.getPassword());
        // //call user service 
        // userService.createUser(user);
        return new ResponseEntity<String>("User created successfully", HttpStatus.CONFLICT);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest credentials){
        User user = userService.validateCredentials(credentials.getUsername(), credentials.getPassword());

        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }
}
