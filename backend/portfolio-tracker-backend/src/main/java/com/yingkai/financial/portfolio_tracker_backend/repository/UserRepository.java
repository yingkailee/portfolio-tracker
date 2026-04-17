package com.yingkai.financial.portfolio_tracker_backend.repository;

import com.yingkai.financial.portfolio_tracker_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}