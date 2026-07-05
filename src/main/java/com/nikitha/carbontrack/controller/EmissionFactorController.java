package com.nikitha.carbontrack.controller;

import com.nikitha.carbontrack.entity.EmissionFactor;
import com.nikitha.carbontrack.service.EmissionFactorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emissionfactors")
public class EmissionFactorController {

    private final EmissionFactorService emissionFactorService;

    public EmissionFactorController(EmissionFactorService emissionFactorService) {
        this.emissionFactorService = emissionFactorService;
    }

    @PostMapping
    public EmissionFactor addEmissionFactor(@RequestBody EmissionFactor emissionFactor) {
        return emissionFactorService.saveEmissionFactor(emissionFactor);
    }

    @GetMapping
    public List<EmissionFactor> getAllEmissionFactors() {
        return emissionFactorService.getAllEmissionFactors();
    }
}
