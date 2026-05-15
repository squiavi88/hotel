package com.luxury.hotel.repositories;

import com.luxury.hotel.model.ReservaActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

@Repository
public interface ReservaActividadRepository extends JpaRepository<ReservaActividad, Long> {

    /**
     * Esta consulta es la clave de la disponibilidad.
     *
     * ¿POR QUÉ SUM(ra.participantes)?:
     * No nos basta con contar cuántas RESERVAS hay (count), necesitamos saber cuántas PERSONAS
     * van en cada reserva. Si hay 2 reservas de 5 personas, el total ocupado es 10.
     *
     * FILTROS (WHERE):
     * 1. ra.actividad.id: Filtra por la actividad específica (ej: "Yoga").
     * 2. ra.fecha: Filtra por el día elegido en el calendario del Front.
     * 3. ra.turno: Filtra por "Mañana" o "Tarde".
     */
    @Query("SELECT SUM(ra.participantes) FROM ReservaActividad ra " +
            "WHERE ra.actividad.id = :actividadId " +
            "AND ra.fecha = :fecha " +
            "AND ra.turno = :turno")
    Integer sumParticipantesByActividadIdAndFechaAndTurno(
            @Param("actividadId") Long actividadId,
            @Param("fecha") LocalDate fecha, // Recibe el LocalDate que parseamos en el Controller
            @Param("turno") String turno
    );
}