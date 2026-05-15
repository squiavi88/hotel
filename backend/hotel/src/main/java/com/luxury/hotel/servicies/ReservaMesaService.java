package com.luxury.hotel.servicies;

import com.luxury.hotel.dto.ReservaMesaDTO;
import com.luxury.hotel.dto.ReservaMesaOcupadaDTO;
import com.luxury.hotel.model.Mesa;
import com.luxury.hotel.model.Reserva;
import com.luxury.hotel.model.ReservaMesa;
import com.luxury.hotel.repositories.MesaRepository;
import com.luxury.hotel.repositories.ReservaMesaRepository;
import com.luxury.hotel.repositories.ReservaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ReservaMesaService implements ServiceInterface<ReservaMesa, Long> {

    // Ahora necesitamos 3 repositorios para que el Servicio pueda "pensar" y conectar datos
    private final ReservaMesaRepository reservaMesaRepository;
    private final ReservaRepository reservaRepository;
    private final MesaRepository mesaRepository;

    public ReservaMesaService(ReservaMesaRepository reservaMesaRepository,
                              ReservaRepository reservaRepository,
                              MesaRepository mesaRepository) {
        this.reservaMesaRepository = reservaMesaRepository;
        this.reservaRepository = reservaRepository;
        this.mesaRepository = mesaRepository;
    }

    /**
     * Reemplaza tu antiguo método save.
     * Este no solo guarda, sino que calcula el precio y actualiza la factura global.
     */
    @Transactional
    public ReservaMesa guardarReservaCompleta(ReservaMesaDTO dto) {
        // 1. Buscar la estancia general y la mesa física
        Reserva reservaGlobal = reservaRepository.findById(dto.getReservaID())
                .orElseThrow(() -> new RuntimeException("Reserva global no encontrada"));

        Mesa mesa = mesaRepository.findById(dto.getMesaId().longValue())
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        // 2. LÓGICA DE NEGOCIO: Calcular cuánto debe pagar
        BigDecimal precioCalculado = mesa.getPrecioBase().multiply(new BigDecimal(dto.getCantidadPersonas()));

        // 3. Crear el objeto que se guardará en la base de datos
        ReservaMesa nuevaReservaMesa = new ReservaMesa();
        nuevaReservaMesa.setReserva(reservaGlobal);
        nuevaReservaMesa.setMesa(mesa);
        nuevaReservaMesa.setFecha(dto.getFecha());
        nuevaReservaMesa.setHora(dto.getHora());
        nuevaReservaMesa.setTurno(dto.getTurno());
        nuevaReservaMesa.setCantidadPersonas(dto.getCantidadPersonas());
        nuevaReservaMesa.setMontoPago(precioCalculado);

        // 4. ACTUALIZAR FACTURA: Sumamos el precio de la mesa al total del hotel
        reservaGlobal.setPagoFinal(reservaGlobal.getPagoFinal().add(precioCalculado));
        reservaRepository.save(reservaGlobal);

        // 5. Guardar el detalle de la mesa
        return reservaMesaRepository.save(nuevaReservaMesa);
    }

    /**
     * Nuevo método para obtener ocupación filtrada desde el repositorio.
     */
    public List<ReservaMesaOcupadaDTO> buscarOcupacionPorMesa(Long mesaId) {
        return reservaMesaRepository.findByMesaId(mesaId).stream()
                .map(rm -> new ReservaMesaOcupadaDTO(
                        rm.getMesa().getId(),
                        rm.getTurno(),
                        rm.getHora(),
                        rm.getFecha()
                ))
                .toList();
    }

    // --- MÉTODOS DE LA INTERFACE (Mantenlos si son obligatorios) ---

    @Override
    public ReservaMesa save(ReservaMesa entity) {
        return reservaMesaRepository.save(entity);
    }

    @Override
    public List<ReservaMesa> findAll() {
        return reservaMesaRepository.findAll();
    }

    @Override
    public ReservaMesa findById(Long id) {
        return reservaMesaRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteById(Long id) {
        reservaMesaRepository.deleteById(id);
    }

    @Override
    public ReservaMesa update(Long id, ReservaMesa entity) {
        // Aquí podrías usar una lógica similar al guardarReservaCompleta si necesitas editar
        return reservaMesaRepository.save(entity);
    }
}