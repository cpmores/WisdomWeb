package com.websearch.websearch.dto;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String username;
    private String password;
    private String email;
    private String avatar;
    private String signature;
}