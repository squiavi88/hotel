package com.luxury.hotel.api;


import com.luxury.hotel.model.Habitacion;
import com.luxury.hotel.model.Mesa;
import com.luxury.hotel.servicies.MesaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class MesasController {
    private final MesaService mesaService;

    public MesasController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @PostMapping("/mesas")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Mesa> saveMesas(@RequestBody List<Mesa> mesas) {

        List<Mesa> changedMesas = new ArrayList<>();

        for (Mesa mesa : mesas) {
            mesaService.save(mesa);
            changedMesas.add(mesa);
        }
        return changedMesas;
    }
}
