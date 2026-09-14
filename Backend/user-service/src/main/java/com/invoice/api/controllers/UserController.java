package com.invoice.api.controllers;

import com.invoice.api.models.User;
import com.invoice.api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController{
    private final UserService userService;

    @PostMapping("/sync")
    public User syncUser(@RequestParam String clerkId, @RequestParam String email, @RequestParam String name){
        return userService.getOrCreateUser(clerkId,email,name);
    }
}