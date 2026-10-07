package com.ecommerce.authservice.service;

import com.ecommerce.authservice.dto.UserSummaryResponse;
import com.ecommerce.authservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserSummaryResponse(u.getId(), u.getUserName(), u.getEmail(), u.getRole()))
                .toList();
    }

    /** Deletes a customer account. Admin accounts are protected so the store can't lock itself out. */
    public boolean deleteUser(String id) {
        return userRepository.findById(id)
                .filter(u -> !"ADMIN".equals(u.getRole()))
                .map(u -> {
                    userRepository.deleteById(id);
                    return true;
                })
                .orElse(false);
    }
}
