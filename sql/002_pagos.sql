-- =====================================================================
-- BIKE STORE — Migración 002: tabla pagos (pago simulado)
-- =====================================================================

USE bike_store;

CREATE TABLE IF NOT EXISTS pagos (
  id_pago              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido            INT UNSIGNED NOT NULL,
  metodo               ENUM('tarjeta', 'pse', 'efectivo') NOT NULL,
  estado               ENUM('aprobado', 'rechazado') NOT NULL,
  codigo_transaccion   VARCHAR(64) NOT NULL,
  monto                DECIMAL(12,2) NOT NULL,
  creado_en            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pago),
  UNIQUE KEY uq_pagos_codigo (codigo_transaccion),
  KEY idx_pagos_pedido (id_pedido),
  CONSTRAINT fk_pagos_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_pagos_monto CHECK (monto >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;