package com.invoice.api.models;

import lombok.Data;

/**
 * Lightweight embedded Client info stored inside each Invoice document.
 * This is NOT a separate MongoDB collection — it's just the client details
 * that are embedded inside the Invoice document.
 */
@Data
public class Client {
    private String name;
    private String email;
    private String billingAddress;
}
