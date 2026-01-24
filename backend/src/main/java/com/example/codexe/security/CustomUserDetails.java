package com.example.codexe.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.codexe.model.User;

public class CustomUserDetails implements UserDetails{
    private final User user;

    //constuctor
    public CustomUserDetails(User user){
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For now, assuming every user has "USER"
        // If you have roles in your User entity, map them here
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername(){
        return user.getUsername();
    }

    @Override
    public String getPassword(){
        return user.getPasswordHash();
    }

    public User getUser(){
        return user;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // You can add a field in User if needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // You can add a field in User if needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // You can add a field in User if needed
    }

    @Override
    public boolean isEnabled() {
        return true; // You can add a field in User if needed
    }
}
