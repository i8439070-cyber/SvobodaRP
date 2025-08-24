-- Svoboda RP schema
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  last_login TIMESTAMP NULL DEFAULT NULL,
  cash INT NOT NULL DEFAULT 500,
  bank INT NOT NULL DEFAULT 1000,
  faction_id INT NULL,
  faction_rank INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS factions (
  id INT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  short VARCHAR(16) NOT NULL,
  salary_json JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO factions (id, name, short, salary_json) VALUES
(1,'Поліція','LSPD','{"1":800,"2":1200,"3":1700,"4":2300}'),
(2,'Медики','EMS','{"1":700,"2":1100,"3":1500,"4":2000}'),
(3,'Армія','Army','{"1":900,"2":1300,"3":1800,"4":2400}'),
(4,'Мафія','Mafia','{"1":600,"2":900,"3":1300,"4":1800}')
ON DUPLICATE KEY UPDATE name=VALUES(name), short=VALUES(short), salary_json=VALUES(salary_json);

CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  model VARCHAR(64) NOT NULL,
  plate VARCHAR(16) NOT NULL,
  pos_x FLOAT NOT NULL DEFAULT 0,
  pos_y FLOAT NOT NULL DEFAULT 0,
  pos_z FLOAT NOT NULL DEFAULT 72,
  rot_x FLOAT NOT NULL DEFAULT 0,
  rot_y FLOAT NOT NULL DEFAULT 0,
  rot_z FLOAT NOT NULL DEFAULT 0,
  locked TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  type VARCHAR(32) NOT NULL,
  stackable TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_type ENUM('account','vehicle') NOT NULL,
  owner_id INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory_items (
  inventory_id INT NOT NULL,
  item_id INT NOT NULL,
  amount INT NOT NULL DEFAULT 1,
  PRIMARY KEY (inventory_id, item_id),
  FOREIGN KEY (inventory_id) REFERENCES inventories(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- базові предмети
INSERT INTO items (name, type, stackable) VALUES
('Вода', 'consumable', 1),
('Батончик', 'consumable', 1),
('Ключі від авто', 'key', 0)
ON DUPLICATE KEY UPDATE type=VALUES(type), stackable=VALUES(stackable);