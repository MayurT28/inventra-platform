# Inventra — Smart Inventory & Sales Management System

## Overview

Inventra is a full-stack inventory and sales management system built for small businesses such as retail shops, grocery stores, and local stores.

The system helps businesses:
- manage products
- monitor stock levels
- track sales activity
- generate invoices
- control employee access using role-based authentication

Built using:
- React
- Spring Boot
- PostgreSQL
- Docker
- JWT Authentication

---

# Features

## Authentication & Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- Roles:
  - ADMIN
  - MANAGER
  - STAFF

---

# Dashboard Features

- Inventory analytics
- Category distribution chart
- Low stock alerts
- Recent inventory activity
- Revenue insights

---

# Sales Features

- POS billing system
- Add products to cart
- Quantity controls
- Invoice generation
- Printable receipt
- Recent sales tracking

---

# Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- Recharts

## Backend
- Spring Boot
- Spring Security
- JWT
- JPA / Hibernate

## Database
- PostgreSQL

## DevOps
- Docker
- Docker Compose

---

# RBAC Roles

| Role | Access |
|---|---|
| ADMIN | Dashboard + Inventory + User Management + Sales |
| MANAGER | Dashboard + Sales |
| STAFF | Sales Only |

---

# Run Using Docker

```bash
docker compose up --build