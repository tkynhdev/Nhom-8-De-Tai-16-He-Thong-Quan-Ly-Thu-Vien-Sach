package com.library.repository;

import com.library.entity.BookCopy;
import com.library.enums.CopyStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {

    long countByBook_IdAndStatus(Long bookId, CopyStatus status);

    long countByStatus(CopyStatus status);

    Optional<BookCopy> findFirstByBook_IdAndStatus(Long bookId, CopyStatus status);

    @EntityGraph(attributePaths = "book")
    List<BookCopy> findAllByOrderByUpdatedAtDesc();

    @Query("SELECT bc FROM BookCopy bc JOIN FETCH bc.book ORDER BY bc.updatedAt DESC")
    List<BookCopy> findAllWithBookOrderByUpdatedAtDesc();
}
