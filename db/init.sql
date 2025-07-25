CREATE DATABASE IF NOT EXISTS rasa;
USE rasa;

-- Base mínima para Rasa tracker_store ya la crea SQLAlchemy, solo añadimos tablas de admin/metrics
CREATE TABLE IF NOT EXISTS tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(150) NOT NULL,
  role ENUM('SUPER_ADMIN','TENANT_ADMIN','ANALYST','AGENT','VIEWER') NOT NULL,
  tenantId INT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenantId) REFERENCES tenants(id)
);

CREATE TABLE IF NOT EXISTS bots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tenantId INT NOT NULL,
  status VARCHAR(30) DEFAULT 'active',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenantId) REFERENCES tenants(id)
);

CREATE TABLE IF NOT EXISTS menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenantId INT NOT NULL,
  opcion_num INT NOT NULL,
  label VARCHAR(255) NOT NULL,
  response VARCHAR(1024) NOT NULL,
  UNIQUE KEY uniq_tenant_option (tenantId, opcion_num),
  FOREIGN KEY (tenantId) REFERENCES tenants(id)
);

CREATE TABLE IF NOT EXISTS interactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  tenantSlug VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  botId INT NULL,
  menuOption VARCHAR(100),
  message TEXT,
  response TEXT,
  intent VARCHAR(100),
  isFallback TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenantSlug VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('PENDING','IN_REVIEW','CLOSED') DEFAULT 'PENDING',
  requiresFollowup TINYINT(1) DEFAULT 0,
  resolvedByHuman TINYINT(1) DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS metricsdaily (
  day DATE NOT NULL,
  tenantSlug VARCHAR(100) NOT NULL,
  botId INT NULL,
  conversations INT NOT NULL,
  users INT NOT NULL,
  messages INT NOT NULL,
  fallbacks INT NOT NULL,
  avgPerConv FLOAT NOT NULL,
  PRIMARY KEY (day, tenantSlug, botId),
  INDEX (tenantSlug, day)
);

INSERT INTO tenants (name, slug) VALUES
  ('Empresa 1', 'empresa1'),
  ('Empresa 2', 'empresa2')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed admin users for each tenant
INSERT INTO users (email, password, name, role, tenantId)
VALUES
  ('admin@empresa1.com', '$2b$12$LZQ5EyTRro12qQvU2PRcoeQcJMAVswekYSiu70ONo5MiSheATMRcK',
   'Admin Empresa1', 'TENANT_ADMIN', 1),
  ('admin@empresa2.com', '$2b$12$LZQ5EyTRro12qQvU2PRcoeQcJMAVswekYSiu70ONo5MiSheATMRcK',
   'Admin Empresa2', 'TENANT_ADMIN', 2)
ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password);

-- Seed menu options for both tenants
-- Option numbers 1-10 with simple labels/responses
INSERT INTO menus (tenantId, opcion_num, label, response)
VALUES
  (1,1,'Opcion 1','Respuesta 1'),
  (1,2,'Opcion 2','Respuesta 2'),
  (1,3,'Opcion 3','Respuesta 3'),
  (1,4,'Opcion 4','Respuesta 4'),
  (1,5,'Opcion 5','Respuesta 5'),
  (1,6,'Opcion 6','Respuesta 6'),
  (1,7,'Opcion 7','Respuesta 7'),
  (1,8,'Opcion 8','Respuesta 8'),
  (1,9,'Opcion 9','Respuesta 9'),
  (1,10,'Opcion 10','Respuesta 10'),
  (2,1,'Opcion 1','Respuesta 1'),
  (2,2,'Opcion 2','Respuesta 2'),
  (2,3,'Opcion 3','Respuesta 3'),
  (2,4,'Opcion 4','Respuesta 4'),
  (2,5,'Opcion 5','Respuesta 5'),
  (2,6,'Opcion 6','Respuesta 6'),
  (2,7,'Opcion 7','Respuesta 7'),
  (2,8,'Opcion 8','Respuesta 8'),
  (2,9,'Opcion 9','Respuesta 9'),
  (2,10,'Opcion 10','Respuesta 10')
ON DUPLICATE KEY UPDATE label=VALUES(label), response=VALUES(response);

