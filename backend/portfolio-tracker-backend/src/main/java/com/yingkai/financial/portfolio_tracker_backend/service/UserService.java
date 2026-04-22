package com.yingkai.financial.portfolio_tracker_backend.service;

import com.yingkai.financial.portfolio_tracker_backend.entity.User;
import com.yingkai.financial.portfolio_tracker_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}