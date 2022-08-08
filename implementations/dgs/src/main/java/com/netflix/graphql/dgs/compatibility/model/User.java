package com.netflix.graphql.dgs.compatibility.model;

public class User {
    private final String email;
    private final String name;
    private Integer totalProductsCreated;

    private int yearsOfEmployment = -1;

    public User(String email) {
        this.email = email;
        this.name = "Jane Smith";
        this.totalProductsCreated = 1337;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public Integer getTotalProductsCreated() {
        return totalProductsCreated;
    }

    public void setTotalProductsCreated(Integer totalProductsCreated) {
        this.totalProductsCreated = totalProductsCreated;
    }

    public int getYearsOfEmployment() {
        return yearsOfEmployment;
    }

    public void setYearsOfEmployment(int yearsOfEmployment) {
        this.yearsOfEmployment = yearsOfEmployment;
    }
}
