package com.invoice.api.services;

import com.invoice.api.models.User;
import com.invoice.api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // This method will be called when a user logs in via Clerk
    public User getOrCreateUser(String clerkId, String email, String name) {
        Optional<User> existingUser = userRepository.findById(clerkId);
        
        if (existingUser.isPresent()) {
            return existingUser.get(); // Welcome back!
        }

        // New user! Let's save them to MongoDB.
        User newUser = new User();
        newUser.setId(clerkId); // We use their Clerk ID as our Database ID
        newUser.setClerkId(clerkId);
        newUser.setCompanyName(name + "'s Business");
        
        // Notice we just call .save() ! No database queries required!
        return userRepository.save(newUser);
    }
}
