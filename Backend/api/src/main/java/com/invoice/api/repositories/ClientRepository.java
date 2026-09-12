package com.invoice.api.repositories;

import com.invoice.api.models.Client;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends MongoRepository<Client, String>
{
    java.util.List<Client> findByUserId(String userId);
}