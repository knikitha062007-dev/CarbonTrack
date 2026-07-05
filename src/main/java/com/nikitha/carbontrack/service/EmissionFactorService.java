package com.nikitha.carbontrack.service;

import com.nikitha.carbontrack.entity.EmissionFactor;
import com.nikitha.carbontrack.repository.EmissionFactorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmissionFactorService {

    private final EmissionFactorRepository emissionFactorRepository;

    public EmissionFactorService(EmissionFactorRepository emissionFactorRepository) {
        this.emissionFactorRepository = emissionFactorRepository;
    }

    public EmissionFactor saveEmissionFactor(EmissionFactor emissionFactor) {
        return emissionFactorRepository.save(emissionFactor);
    }

    public List<EmissionFactor> getAllEmissionFactors() {
        return emissionFactorRepository.findAll();
    }
}
