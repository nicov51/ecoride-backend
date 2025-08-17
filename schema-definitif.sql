-- Création de la base de données
CREATE DATABASE IF NOT EXISTS EcoRide DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE EcoRide;

-- Table des rôles utilisateur
CREATE TABLE roles (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       label VARCHAR(20) NOT NULL UNIQUE
);

-- Table utilisateurs
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(50) NOT NULL,
                       first_name VARCHAR(50) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       phone VARCHAR(20),
                       address VARCHAR(255),
                       birth_date DATE,
                       picture BLOB,
                       pseudo VARCHAR(30) NOT NULL UNIQUE,
                       is_verified BOOLEAN NOT NULL DEFAULT 0,
                       is_suspended BOOLEAN NOT NULL DEFAULT 0,
                       suspended_at DATETIME,
                       employee_number VARCHAR(20)
);

-- Table de liaison users-roles
CREATE TABLE user_roles (
                            user_id INT NOT NULL,
                            role_id INT NOT NULL,
                            PRIMARY KEY (user_id, role_id),
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Portefeuilles utilisateurs
CREATE TABLE wallets (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         user_id INT NOT NULL UNIQUE,
                         balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Plateforme
CREATE TABLE platforms (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           name VARCHAR(50) NOT NULL DEFAULT 'EcoRide',
                           wallet_id INT NOT NULL UNIQUE,
                           FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE RESTRICT
);

-- Transactions financières
CREATE TABLE transactions (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              amount DECIMAL(10,2) NOT NULL,
                              type ENUM('debit', 'credit') NOT NULL,
                              date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              description VARCHAR(255),
                              wallet_id INT NOT NULL,
                              platform_id INT NOT NULL,
                              FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
                              FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- Historique de recherche
CREATE TABLE search_histories (
                                  id INT AUTO_INCREMENT PRIMARY KEY,
                                  user_id INT NOT NULL,
                                  departure VARCHAR(255) NOT NULL,
                                  arrival VARCHAR(255) NOT NULL,
                                  search_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  passengers INT NOT NULL DEFAULT 1,
                                  preferences TEXT,
                                  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Marques automobiles
CREATE TABLE brands (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(30) NOT NULL UNIQUE
);

-- Voitures des utilisateurs
CREATE TABLE cars (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      model VARCHAR(50) NOT NULL,
                      registration VARCHAR(20) NOT NULL UNIQUE,
                      brand_id INT NOT NULL,
                      user_id INT NOT NULL,
                      fuel ENUM('ELECTRIC', 'DIESEL', 'GASOLINE') NOT NULL,
                      color VARCHAR(30),
                      first_registration DATE,
                      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
                      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Zones de covoiturage
CREATE TABLE carpool_zones (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               name VARCHAR(100) NOT NULL,
                               coordinates POINT SRID 4326 NOT NULL,
                               SPATIAL INDEX (coordinates)
);

-- Trajets
CREATE TABLE rides (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       departure_datetime DATETIME NOT NULL,
                       departure_place VARCHAR(255) NOT NULL,
                       departure_zone_id INT,
                       arrival_datetime DATETIME,
                       arrival_place VARCHAR(255) NOT NULL,
                       arrival_zone_id INT,
                       seats TINYINT UNSIGNED NOT NULL CHECK (seats > 0),
                       price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
                       status ENUM('pending', 'started', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
                       is_reported BOOLEAN NOT NULL DEFAULT 0,
                       preferences JSON,
                       car_id INT NOT NULL,
                       driver_id INT NOT NULL,
                       FOREIGN KEY (departure_zone_id) REFERENCES carpool_zones(id) ON DELETE SET NULL,
                       FOREIGN KEY (arrival_zone_id) REFERENCES carpool_zones(id) ON DELETE SET NULL,
                       FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
                       FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Participations aux trajets
CREATE TABLE participations (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                status ENUM('pending', 'confirmed', 'cancelled', 'refused') NOT NULL DEFAULT 'pending',
                                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                ride_id INT NOT NULL,
                                user_id INT NOT NULL,
                                FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                UNIQUE KEY participation_unique (ride_id, user_id)
);

-- Avis utilisateurs
CREATE TABLE reviews (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         comment TEXT,
                         rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
                         status ENUM('draft', 'submitted', 'published', 'archived') NOT NULL DEFAULT 'draft',
                         is_problem BOOLEAN NOT NULL DEFAULT 0,
                         reason TEXT,
                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         user_id INT NOT NULL,
                         ride_id INT NOT NULL,
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
);

-- Signalements
CREATE TABLE reports (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         description TEXT NOT NULL,
                         resolved BOOLEAN NOT NULL DEFAULT 0,
                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         reporter_id INT NOT NULL,
                         ride_id INT NOT NULL,
                         FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               content TEXT NOT NULL,
                               is_read BOOLEAN NOT NULL DEFAULT 0,
                               created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               user_id INT NOT NULL,
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index supplémentaires pour optimiser les requêtes
CREATE INDEX idx_rides_departure ON rides(departure_datetime, departure_place);
CREATE INDEX idx_rides_price ON rides(price);
CREATE INDEX idx_wallets_balance ON wallets(balance);
CREATE INDEX idx_users_email ON users(email);
