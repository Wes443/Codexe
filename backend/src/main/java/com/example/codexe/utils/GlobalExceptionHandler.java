package com.example.codexe.utils;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> hande(CustomException e){
        return new ResponseEntity<>(e.getMessage(), e.getStatus());
        // return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }
}
