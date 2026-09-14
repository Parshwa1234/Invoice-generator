package com.invoice.api.repositories;

import com.invoice.api.models.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    java.util.List<Invoice> findByUserId(String userId);
}