package com.invoice.api.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Document(collection = "invoices")
public class Invoice {
    @Id
    private String id;
    private String invoiceNumber;
    private String userId; // The business owner
    private String userEmail; // The business owner's email address
    private Client client; // The customer's details (embedded)
    
    private LocalDate issueDate;
    private LocalDate dueDate;
    
    private List<LineItem> lineItems;
    private BigDecimal subTotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    
    private String status; // "DRAFT", "UNPAID", "PAID"
    private String notes;
}
