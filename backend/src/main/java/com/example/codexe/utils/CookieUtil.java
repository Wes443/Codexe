package com.example.codexe.utils;

import org.springframework.http.ResponseCookie;

public class CookieUtil {
    
    public static ResponseCookie buildCookie(String name, String value, long expiresAt){
        return ResponseCookie.from(name, value)
            .httpOnly(true) //prvent JS access; protect against XSS
            .secure(false) //set true if using https
            .path("/") //cookie is valid for all endpoints
            .maxAge(expiresAt) //set cookie expiration date (seconds)
            .sameSite("Strict") //Cross-Site Request Forgery (CSRF) protection
            .build();
    }
}
