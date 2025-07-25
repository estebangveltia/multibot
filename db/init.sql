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

INSERT INTO tenants (name, slug) VALUES ('Empresa 1', 'empresa1') ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT INTO tenants (name, slug) VALUES ('Empresa 2', 'empresa2') ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Dummy menus
INSERT INTO menus (tenantId, opcion_num, label, response)
SELECT 1, 1, 'Consultar saldo', 'Su saldo es $1.000'
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE tenantId=1 AND opcion_num=1);
INSERT INTO menus (tenantId, opcion_num, label, response)
SELECT 1, 2, 'Ver movimientos', 'No hay movimientos recientes'
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE tenantId=1 AND opcion_num=2);

