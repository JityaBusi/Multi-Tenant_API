# Multi-Tenant_API
Implement a Resilient Multi-Tenant API with the Bulkhead Pattern
Multi-Tenant API with Bulkhead Isolation
📌 Overview

This project is a Node.js + Express + PostgreSQL based multi-tenant API implementing:

Tier-based tenant identification

True Bulkhead Pattern (resource isolation)

Independent DB connection pools per tier

Tier-based rate limiting

Dockerized deployment

Health monitoring

The system supports three tenant tiers:

free

pro

enterprise

Each tier operates within its own isolated resource boundary to prevent the noisy neighbor problem.

🏗 Architecture Overview
Folder Structure
Multi-Tenant_API/
│
├── src/
│   ├── bulkheads/
│   │    ├── free.js
│   │    ├── pro.js
│   │    └── enterprise.js
│   │
│   ├── app.js
│   ├── db.js
│   └── routes.js
│
├── Dockerfile
├── docker-compose.yml
├── init-db.sql
├── .env
├── package.json
└── README.md
🧠 Architectural Design
1️⃣ Multi-Tenant Identification

Tenants are identified via HTTP header:

X-Tenant-Tier: free | pro | enterprise

This determines:

Rate limiting policy

Database connection pool

Data filtering logic

2️⃣ Bulkhead Pattern Implementation

This system applies true resource isolation, not just logical filtering.

🔹 Layer 1 — Rate Limiting Isolation

Each tier has independent request limits:

Tier	Requests per Minute
Free	10
Pro	50
Enterprise	200

If Free tier exceeds its limit, only Free is affected.

🔹 Layer 2 — Database Connection Pool Isolation

Each tier has its own DB connection pool defined in:

src/bulkheads/

Example concept:

free.js → max 5 connections

pro.js → max 10 connections

enterprise.js → max 20 connections

This ensures:

Free cannot exhaust Pro connections

Pro cannot impact Enterprise

Connection starvation is isolated per tier

This is the core Bulkhead principle:

Failure or overload in one partition does not cascade to others.

3️⃣ Request Flow
Client Request
      │
      ▼
Express Server
      │
      ├── Tier Validation Middleware
      │
      ├── Tier-Specific Rate Limiter
      │
      ├── Route Handler
      │
      └── Tier-Specific DB Pool (Bulkhead)
              │
              ▼
          PostgreSQL
⚙️ Setup Instructions
1️⃣ Install Dependencies
npm install
2️⃣ Configure Environment Variables

Create .env:

DATABASE_URL=postgresql://postgres:password@localhost:5432/tenantdb
API_PORT=8080
3️⃣ Start with Docker (Recommended)

Run:

docker-compose up --build

This will:

Start PostgreSQL

Initialize database via init-db.sql

Start API server

4️⃣ Manual PostgreSQL Setup (Alternative)

Create database:

CREATE DATABASE tenantdb;

Run schema from:

init-db.sql
🚀 Running the Server
npm start

Server runs on:

http://localhost:8080
📡 API Endpoints
Get Tier Data
GET /api/data

Example:

curl -H "X-Tenant-Tier: free" http://localhost:8080/api/data

Response:

[
  {
    "id": 1,
    "tier": "free",
    "payload": { "message": "Free tier data point 1" },
    "created_at": "2026-02-25T19:11:34.426Z"
  }
]
Health Check
GET /health

Response:

{
  "status": "healthy"
}

Performs:

Database connectivity check

Returns system state

🛡 Failure Isolation Scenarios
Scenario	Result
Free tier floods traffic	Only free tier blocked
Free exhausts DB pool	Pro & Enterprise unaffected
Invalid tier header	Request rejected
Database down	Health endpoint returns unhealthy
🔥 Key Engineering Concepts Demonstrated

Multi-Tenant API Design

Bulkhead Pattern

Noisy Neighbor Prevention

Resource Segmentation

Tier-Based Traffic Shaping

Modular Backend Architecture

Dockerized Infrastructure

📈 Why This Matters

In real SaaS systems:

Free users should not degrade premium user experience.

Resource boundaries must be enforced.

Isolation must exist at both traffic and infrastructure levels.

This project demonstrates practical implementation of these principles.

🔮 Future Improvements

Circuit Breaker Pattern

Redis-backed distributed rate limiting

Prometheus metrics

Structured logging

Separate databases per tenant tier

Kubernetes deployment

Horizontal scaling

🎯 Conclusion

This project demonstrates how to build a scalable multi-tenant backend using:

Node.js

Express

PostgreSQL

Docker

while applying the Bulkhead architectural pattern to prevent resource contention across tenant tiers.