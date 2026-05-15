package com.luxury.hotel.servicies;

import com.luxury.hotel.dto.ReservaEventoDTO;
import com.luxury.hotel.model.*;
import com.luxury.hotel.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * CAPA DE SERVICIO: Es el "cerebro" de la aplicación.
 * Aquí es donde transformamos los datos que envía el usuario (DTO)
 * en registros reales dentro de nuestra base de datos (Entidades).
 */
@Service
public class ReservaEventoService implements ServiceInterface<ReservaEvento, Long> {

    // Definimos los "almacenes" (repositorios) que necesitamos usar
    private final ReservaEventoRepository repository;
    private final ReservaRepository reservaRepository;
    private final EventoRepository eventoRepository;

    // Constructor: Aquí "conectamos" los repositorios para que el Service pueda usarlos
    public ReservaEventoService(ReservaEventoRepository repository,
                                ReservaRepository reservaRepository,
                                EventoRepository eventoRepository) {
        this.repository = repository;
        this.reservaRepository = reservaRepository;
        this.eventoRepository = eventoRepository;
    }

    /**
     * MÉTODO: procesarReservaEvento
     * Explicación para Junior: Este método recibe el "papelito" de la reserva (DTO),
     * comprueba que todo esté en orden, calcula el precio y lo guarda en la base de datos.
     */
    @Transactional // Si algo falla en medio del proceso, el sistema borra los cambios para no dejar datos corruptos
    public ReservaEvento procesarReservaEvento(ReservaEventoDTO dto) {

        // PASO 1: Obtener la información completa de la base de datos usando los IDs que envió el usuario
        // Buscamos la reserva de la habitación (estancia global)
        Reserva estancia = reservaRepository.findById(dto.getReservaId())
                .orElseThrow(() -> new RuntimeException("No se encontró la reserva de habitación con ID: " + dto.getReservaId()));

        // Buscamos el tipo de evento (Boda, Comunión, etc.) para saber su precio y capacidad
        Evento tipoEvento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new RuntimeException("El tipo de evento seleccionado no existe."));

        // PASO 2: Validación de Aforo (Regla de negocio básica)
        // Comprobamos si el número de personas cabe en ese evento según lo que dice la tabla 'Evento'
        if (dto.getParticipantes() > tipoEvento.getCapacidad()) {
            throw new RuntimeException("¡Error! La capacidad máxima es de " + tipoEvento.getCapacidad() + " personas.");
        }

        // PASO 3: Cálculo del precio (Lógica financiera)
        // Multiplicamos el precio base del evento por el número de personas.
        // Lo hacemos aquí en el servidor para que el usuario no pueda "trucar" el precio desde la web.
        BigDecimal precioCalculado = tipoEvento.getPrecioBase().multiply(new BigDecimal(dto.getParticipantes()));

        // PASO 4: Crear el objeto final que se guardará en la tabla 'Reserva_Evento'
        ReservaEvento nuevaReserva = new ReservaEvento();
        nuevaReserva.setReserva(estancia);
        nuevaReserva.setEvento(tipoEvento);
        nuevaReserva.setFecha(dto.getFecha());
        nuevaReserva.setParticipantes(dto.getParticipantes());
        nuevaReserva.setSala(dto.getSala());
        nuevaReserva.setCatering(dto.getCatering());
        nuevaReserva.setMonto(precioCalculado); // Guardamos el precio que calculamos nosotros

        // PASO 5: Actualizar la cuenta total del cliente
        // Le sumamos el precio de este evento al total que el cliente ya tenía que pagar por su habitación.
        BigDecimal totalAnterior = estancia.getPagoFinal();
        estancia.setPagoFinal(totalAnterior.add(precioCalculado));
        reservaRepository.save(estancia); // Guardamos la reserva de habitación actualizada con el nuevo precio

     // PASO 6: Guardar la reserva del evento y devolver el resultado
        return repository.save(nuevaReserva);    }


    // --- MÉTODOS ESTÁNDAR (CRUD) ---
    // Estos métodos son simples: solo llaman al repositorio para buscar, listar o borrar.

    @Override
    public List<ReservaEvento> findAll() {
        return repository.findAll();
    }

    @Override
    public ReservaEvento findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public ReservaEvento save(ReservaEvento e) {
        return repository.save(e);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public ReservaEvento update(Long id, ReservaEvento e) {
        // Antes de actualizar, verificamos si el ID existe para no crear uno nuevo por error
        if (repository.existsById(id)) {
            e.setId(id);
            return repository.save(e);
        }
        return null;
    }
}