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
@Table(name = "producto")
public class ProductoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Size(min = 3, max = 255)
    private String descripcion;
    
    @NotNull
    @Size(min = 3, max = 255)
    private String estilo;
    
    @NotNull
    @Size(min = 3, max = 255)
    private Long unidades;

    @NotNull
    @Size(min = 3, max = 255)
    private Double precio;

    public ProductoEntity() {
    }

    public ProductoEntity(@NotNull @Size(min = 3, max = 255) String descripcion,
            @NotNull @Size(min = 3, max = 255) String estilo, @NotNull @Size(min = 3, max = 255) Long unidades,
            @NotNull @Size(min = 3, max = 255) Double precio) {
        this.descripcion = descripcion;
        this.estilo = estilo;
        this.unidades = unidades;
        this.precio = precio;
    }

    public ProductoEntity(Long id, @NotNull @Size(min = 3, max = 255) String descripcion,
            @NotNull @Size(min = 3, max = 255) String estilo, @NotNull @Size(min = 3, max = 255) Long unidades,
            @NotNull @Size(min = 3, max = 255) Double precio) {
        this.id = id;
        this.descripcion = descripcion;
        this.estilo = estilo;
        this.unidades = unidades;
        this.precio = precio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstilo() {
        return estilo;
    }

    public void setEstilo(String estilo) {
        this.estilo = estilo;
    }

    public Long getUnidades() {
        return unidades;
    }

    public void setUnidades(Long unidades) {
        this.unidades = unidades;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }
 
    
}
