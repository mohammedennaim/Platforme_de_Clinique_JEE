package org.example.clinique.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "staff", schema = "clinique")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String departmentAssigned;

    public Staff(Long id, User user, String departmentAssigned) {
        this.id = id;
        this.user = user;
        this.departmentAssigned = departmentAssigned;
    }

    public Staff() {
        
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDepartmentAssigned() {
        return departmentAssigned;
    }

    public void setDepartmentAssigned(String departmentAssigned) {
        this.departmentAssigned = departmentAssigned;
    }
}
