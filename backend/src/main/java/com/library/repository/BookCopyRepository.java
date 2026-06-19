package com.library.repository;

import com.library.entity.BookCopy;
import com.library.enums.CopyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {

    long countByBook_IdAndStatus(Long bookId, CopyStatus status);

    Optional<BookCopy> findFirstByBook_IdAndStatus(Long bookId, CopyStatus status);
}
