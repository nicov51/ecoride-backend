-- Utilisateurs et rôles

CREATE TABLE user (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(100),
                      first_name VARCHAR(100),
                      email VARCHAR(255) UNIQUE,
                      password VARCHAR(255),
                      phone VARCHAR(20),
                      address VARCHAR(255),
                      birth_date DATE,
                      picture BLOB,
                      pseudo VARCHAR(50),
                      is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE role (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      label VARCHAR(50)
);

CREATE TABLE user_roles_role (
                                 user_id INT,
                                 role_id INT,
                                 PRIMARY KEY (user_id, role_id),
                                 FOREIGN KEY (user_id) REFERENCES user(id),
                                 FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Wallets et Transactions

CREATE TABLE wallet (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        balance FLOAT DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             wallet_id INT,
                             amount FLOAT,
                             type VARCHAR(50),
                             date DATETIME,
                             description TEXT,
                             FOREIGN KEY (wallet_id) REFERENCES wallet(id)
);

ALTER TABLE user ADD wallet_id INT;
ALTER TABLE user ADD FOREIGN KEY (wallet_id) REFERENCES wallet(id);

-- Plateforme

CREATE TABLE platform (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(100)
);

ALTER TABLE wallet ADD platform_id INT;
ALTER TABLE wallet ADD FOREIGN KEY (platform_id) REFERENCES platform(id);

-- Notifications

CREATE TABLE notification (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              content TEXT,
                              `read` BOOLEAN DEFAULT FALSE,
                              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                              user_id INT,
                              FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Voitures et marques

CREATE TABLE brand (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100)
);

CREATE TABLE car (
                     id INT AUTO_INCREMENT PRIMARY KEY,
                     model VARCHAR(100),
                     registration VARCHAR(50),
                     fuel ENUM('ELECTRIC', 'DIESEL', 'GASOLINE'),
                     color VARCHAR(50),
                     first_registration DATE,
                     brand_id INT,
                     owner_id INT,
                     FOREIGN KEY (brand_id) REFERENCES brand(id),
                     FOREIGN KEY (owner_id) REFERENCES user(id)
);

-- Zones de covoiturage

CREATE TABLE carpool_zone (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              label VARCHAR(100),
                              lat FLOAT,
                              lng FLOAT,
                              type VARCHAR(20)
);

-- Covoiturage

CREATE TABLE ride (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      departure_date DATE,
                      departure_place VARCHAR(255),
                      arrival_date DATE,
                      arrival_place VARCHAR(255),
                      departure_time TIME,
                      arrival_time TIME,
                      seats INT,
                      price FLOAT,
                      status VARCHAR(50),
                      departure_zone_id INT,
                      arrival_zone_id INT,
                      driver_id INT,
                      car_id INT,
                      FOREIGN KEY (departure_zone_id) REFERENCES carpool_zone(id),
                      FOREIGN KEY (arrival_zone_id) REFERENCES carpool_zone(id),
                      FOREIGN KEY (driver_id) REFERENCES user(id),
                      FOREIGN KEY (car_id) REFERENCES car(id)
);

-- Participations

CREATE TABLE participation (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               status VARCHAR(50),
                               joined_at DATETIME,
                               user_id INT,
                               ride_id INT,
                               FOREIGN KEY (user_id) REFERENCES user(id),
                               FOREIGN KEY (ride_id) REFERENCES ride(id)
);

-- Avis

CREATE TABLE review (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        comment TEXT,
                        rating INT,
                        status VARCHAR(50),
                        user_id INT,
                        ride_id INT,
                        FOREIGN KEY (user_id) REFERENCES user(id),
                        FOREIGN KEY (ride_id) REFERENCES ride(id)
);

-- Historique de recherche

CREATE TABLE search_history (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                departure VARCHAR(255),
                                arrival VARCHAR(255),
                                search_date DATETIME,
                                passengers INT,
                                preferences TEXT,
                                user_id INT,
                                FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Configuration système

CREATE TABLE configuration (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               name VARCHAR(100),
                               description TEXT,
                               updated_by_id INT,
                               FOREIGN KEY (updated_by_id) REFERENCES user(id)
);

CREATE TABLE parameter (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           `key` VARCHAR(100),
                           `value` TEXT,
                           configuration_id INT,
                           FOREIGN KEY (configuration_id) REFERENCES configuration(id)
);

INSERT INTO role (label) VALUES
                             ('chauffeur'),
                             ('passager');

INSERT INTO user (
    name, first_name, email, password, phone, address, birth_date, pseudo, is_verified
) VALUES
      ('Durand', 'Pierre', 'pierre.durand@example.com', 'hashedpwd1', '0601020304', '10 rue de Paris', '1990-04-12', 'pierro', true),
      ('Martin', 'Sophie', 'sophie.martin@example.com', 'hashedpwd2', '0611223344', '15 rue du Havre', '1988-09-25', 'soso', true),
      ('Lemoine', 'David', 'david.lemoine@example.com', 'hashedpwd3', '0677889900', '28 rue Toulouse', '1992-01-08', 'dave31', true);

-- Pierre est chauffeur
INSERT INTO user_roles_role (user_id, role_id) VALUES (1, 1);

-- Sophie est passager
INSERT INTO user_roles_role (user_id, role_id) VALUES (2, 2);

-- David est à la fois passager et chauffeur
INSERT INTO user_roles_role (user_id, role_id) VALUES (3, 1), (3, 2);

INSERT INTO brand (name) VALUES
                             ('Peugeot'),
                             ('Renault'),
                             ('Tesla');

-- Pierre (user_id: 1) a une Peugeot
INSERT INTO car (
    model, registration, fuel, color, first_registration, brand_id, owner_id
) VALUES
    ('208', 'AB-123-CD', 'DIESEL', 'bleue', '2018-06-01', 1, 1);

-- David (user_id: 3) a une Tesla
INSERT INTO car (
    model, registration, fuel, color, first_registration, brand_id, owner_id
) VALUES
    ('Model 3', 'EF-456-GH', 'ELECTRIC', 'noir', '2022-03-15', 3, 3);
