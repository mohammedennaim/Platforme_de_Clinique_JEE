package org.example.clinique.entity;

import jakarta.persistence.*;
import org.example.clinique.entity.enums.Role;

@Entity
@Table(name = "staff", schema = "clinique")
public class Staff extends User {

    private String departmentAssigned;

    public Staff(Long id, String firstName, String lastName, String email, String passwordHash, Role role, Boolean isActive, String departmentAssigned) {
        super(id, firstName, lastName, email, passwordHash, role, isActive);
        this.departmentAssigned = departmentAssigned;
    }

    public Staff() {
        
    }

    public String getDepartmentAssigned() {
        return departmentAssigned;
    }

    public void setDepartmentAssigned(String departmentAssigned) {
        this.departmentAssigned = departmentAssigned;
    }

    @Override
    public String toString() {
        return "Staff{" +
                "id=" + getId() +
                ", departmentAssigned='" + departmentAssigned + '\'' +
                ", firstName='" + getFirstName() + '\'' +
                ", lastName='" + getLastName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", role=" + getRole() +
                '}';
    }
}
