package com.invoice.api.models;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LineItem {
    private String description;
    private int quantity;
    private BigDecimal rate;
    private BigDecimal amount;
}
