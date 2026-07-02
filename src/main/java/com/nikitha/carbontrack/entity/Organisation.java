package com.nikitha.carbontrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "organisations")
public class Organisation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "admin_user_id")
    private Long adminUserId;
}
