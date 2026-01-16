package com.example.codexe.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private long accessExpirationMs;
    private long refreshExpirationMs;
    private String accessSecret;

    //getter methods
    public long getAccessExpirationMs(){
        return accessExpirationMs;
    }

    public long getRefreshExpirationMs(){
        return refreshExpirationMs;
    }

    public String getAccessSecret(){
        return accessSecret;
    }

    //setter methods
    public void setAccessExpirationMs(long accessExpirationMs){
        this.accessExpirationMs = accessExpirationMs;
    }

    public void setRefreshExpirationMs(long refreshExpirationMs){
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public void setAccessSecret(String accessSecret){
        this.accessSecret = accessSecret;
    }
}
