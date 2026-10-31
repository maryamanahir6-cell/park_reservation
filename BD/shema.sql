CREATE DATABASE IF NOT EXISTS parking_tp;
USE parking_tp;

CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifiant VARCHAR(50) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);

CREATE TABLE places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    id_place INT NOT NULL,
    heure_debut DATETIME NOT NULL,
    heure_fin DATETIME NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id),
    FOREIGN KEY (id_place) REFERENCES places(id)
);

-- Insertion de données de test
INSERT INTO utilisateurs (identifiant, mot_de_passe) VALUES ('etudiant1', 'azerty'), ('prof', 'admin');
INSERT INTO places (numero) VALUES ('A1'), ('A2'), ('A3'), ('B1'), ('B2');