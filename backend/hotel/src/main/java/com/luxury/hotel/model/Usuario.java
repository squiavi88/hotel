package com.luxury.hotel.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Usuario", nullable = false)
    private Long id;

    @Column(name = "Nombre", length = 45, nullable = false)
    private String nombre;

    @Column(name = "Email", length = 45, nullable = false)
    private String email;

    @Column(name = "Contrasena", nullable = false)
    private String contrasena;

    @Column(name = "Fecha_Nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "Apellidos", length = 45, nullable = false)
    private String apellidos;


    @ManyToOne
    @JoinColumn(name = "Id_Rol")
    private Rol rol;

    @OneToMany(mappedBy = "usuario")
    @JsonIgnore
    private List<Reserva> reservaList;

    public Usuario() {
    }

    public Usuario(Long id, String nombre, String email, String contrasena, LocalDate fechaNacimiento, String apellidos, Rol rol, List<Reserva> reservaList) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
        this.fechaNacimiento = fechaNacimiento;
        this.apellidos = apellidos;
        this.rol = rol;
        this.reservaList = reservaList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public List<Reserva> getReservaList() {
        return reservaList;
    }

    public void setReservaList(List<Reserva> reservaList) {
        this.reservaList = reservaList;
    }
}
