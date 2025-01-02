package net.ausiasmarch.iswart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuario")
public class UsuarioEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @NotNull
    @Size(min = 3, max = 255)
    private String nombre;

    @NotNull
    @Size(min = 3, max = 255)
    private String apellido1;

    @Size(min = 0, max = 255)
    private String apellido2;

    @Email
    private String email;

    private String telefono;

    private String direccion;

    private Long id_tipousuario;

    public UsuarioEntity() {
    }

    
    public UsuarioEntity(@NotNull @Size(min = 3, max = 255) String nombre,
            @NotNull @Size(min = 3, max = 255) String apellido1, @Size(min = 0, max = 255) String apellido2,
            @Email String email, String telefono, String direccion, Long id_tipousuario) {
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.id_tipousuario = id_tipousuario;
    }


    public UsuarioEntity(Long id, @NotNull @Size(min = 3, max = 255) String nombre,
            @NotNull @Size(min = 3, max = 255) String apellido1, @Size(min = 0, max = 255) String apellido2,
            @Email String email, String telefono, String direccion, Long id_tipousuario) {
        this.id = id;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.id_tipousuario = id_tipousuario;
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


    public String getApellido1() {
        return apellido1;
    }


    public void setApellido1(String apellido1) {
        this.apellido1 = apellido1;
    }


    public String getApellido2() {
        return apellido2;
    }


    public void setApellido2(String apellido2) {
        this.apellido2 = apellido2;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public String getTelefono() {
        return telefono;
    }


    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }


    public String getDireccion() {
        return direccion;
    }


    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }


    public Long getId_tipousuario() {
        return id_tipousuario;
    }


    public void setId_tipousuario(Long id_tipousuario) {
        this.id_tipousuario = id_tipousuario;
    }


}
