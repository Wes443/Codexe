package com.example.codexe.security;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.example.codexe.dao.UserDao;
import com.example.codexe.model.User;
import com.example.codexe.utils.CustomException;

@Service
public class CustomUserDetailsService implements UserDetailsService{
    //user data access object (dao)
    private final UserDao userDao;

    //constructor
    public CustomUserDetailsService(UserDao userDao){
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String userId){
        User user = userDao.findById(UUID.fromString(userId))
        .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        return new CustomUserDetails(user);
    }
}
