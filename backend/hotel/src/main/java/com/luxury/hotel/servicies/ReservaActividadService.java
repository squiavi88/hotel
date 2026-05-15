package com.luxury.hotel.servicies;

import com.luxury.hotel.dto.DisponibilidadActividadDTO;
import com.luxury.hotel.model.Actividad;
import com.luxury.hotel.model.ReservaActividad;
import com.luxury.hotel.repositories.ReservaActividadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaActividadService implements ServiceInterface<ReservaActividad, Long>{
    private final ReservaActividadRepository reservaActividadRepository;
    private final ActividadService actividadService; // <--- AGREGA ESTA LÍNEA

    public ReservaActividadService(ReservaActividadRepository reservaActividadRepository, ActividadService actividadService ) {
        this.reservaActividadRepository = reservaActividadRepository;
        this.actividadService = actividadService; // <--- AGREGA ESTA LÍNEA
    }



    @Override
    public ReservaActividad save(ReservaActividad reservaActividad) {
        // 1. Buscamos la actividad (findById suele devolver la entidad directamente o un Optional)
        Actividad actividadOficial = actividadService.findById(reservaActividad.getActividad().getId());

        // 2. CÁLCULO DEL MONTO con BigDecimal:
        // En Java, para dinero usamos: precio.multiply(new BigDecimal(cantidad))
        java.math.BigDecimal precio = actividadOficial.getPrecioBase();
        java.math.BigDecimal personas = java.math.BigDecimal.valueOf(reservaActividad.getParticipantes());

        java.math.BigDecimal montoTotal = precio.multiply(personas);

        // 3. Guardamos el monto en la reserva
        reservaActividad.setMonto(montoTotal);

        return reservaActividadRepository.save(reservaActividad);
    }
    @Override
    public List<ReservaActividad> findAll() {
        return reservaActividadRepository.findAll();
    }

    @Override
    public ReservaActividad findById(Long id) {
        return reservaActividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaActividad no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        reservaActividadRepository.deleteById(id);
    }

    @Override
    public ReservaActividad update(Long id, ReservaActividad reservaActividad) {
        ReservaActividad modified = reservaActividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaActividad no encontrado"));

        modified.setReserva(reservaActividad.getReserva());
        modified.setActividad(reservaActividad.getActividad());
        modified.setTurno(reservaActividad.getTurno());
        modified.setFecha(reservaActividad.getFecha());
        modified.setParticipantes(reservaActividad.getParticipantes());
        modified.setMonto(reservaActividad.getMonto());

        return reservaActividadRepository.save(modified);
    }
    public DisponibilidadActividadDTO consultarDisponibilidad(Long actividadId, java.time.LocalDate fecha, String turno) {
        // A. CAPACIDAD TOTAL: La trae de la configuración de la actividad (ej: 20 personas)
        var actividad = actividadService.findById(actividadId);
        int capacidadMax = actividad.getCapacidad().intValue();

        // B. OCUPADOS: El Repository suma el campo 'participantes' de todas las reservas
        // que coincidan con ese día y turno.
        Integer ocupados = reservaActividadRepository.sumParticipantesByActividadIdAndFechaAndTurno(actividadId, fecha, turno);

        // C. CONTROL DE SEGURIDAD: Si no hay reservas, 'ocupados' es null, lo pasamos a 0.
        if (ocupados == null) ocupados = 0;

        // D. RESULTADO: La resta final que se envía al Front.
        int disponibles = capacidadMax - ocupados;

        return new DisponibilidadActividadDTO(disponibles, capacidadMax);
    }
}
