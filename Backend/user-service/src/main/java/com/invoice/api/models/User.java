package com.invoice.api.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String clerkId; // The ID from Clerk authentication
    private String companyName;
    private String address;
    private String logoUrl; // Cloudinary URL
}
