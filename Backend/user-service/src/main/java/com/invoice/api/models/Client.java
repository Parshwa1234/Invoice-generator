package com.invoice.api.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "clients")
public class Client {
    @Id
    private String id;
    private String userId; // Links to the User who created this client
    private String name;
    private String email;
    private String billingAddress;
}
