package com.example.backend.repositories;

import com.example.backend.classes.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.compteSource.numero = :compteNum OR t.compteDestination.numero = :compteNum ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteNumero(@Param("compteNum") String compteNumero);

    @Query("SELECT t FROM Transaction t WHERE (t.compteSource.numero = :compteNum OR t.compteDestination.numero = :compteNum) AND t.dateTransaction BETWEEN :debut AND :fin ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteAndPeriode(
            @Param("compteNum") String compteNumero,
            @Param("debut") Date debut,
            @Param("fin") Date fin);
}