DROP DATABASE IF EXISTS `camisetas`;
CREATE DATABASE `camisetas`;
USE `camisetas`;

CREATE TABLE `usuario` (
                           `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                           `username` VARCHAR(50) NOT NULL UNIQUE,
                           `password` VARCHAR(255) NOT NULL,
                           `email` VARCHAR(100) NOT NULL UNIQUE,
                           `telefono` VARCHAR(20),
                           `direccion` VARCHAR(255),
                           `activo` BOOLEAN DEFAULT 1,
                           `tipo` ENUM('OPERADOR','CLIENTE') DEFAULT 'CLIENTE',
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `camiseta` (
                            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                            `talla` ENUM('xxs','xs','s','m','l','xl','xxl') NOT NULL,
                            `sexo` ENUM('chica','chico','unisex','niño','niña','unisex_infantil') NOT NULL,
                            `color` VARCHAR(50) NOT NULL,
                            `marca` VARCHAR(50) NOT NULL,
                            `stock` INT UNSIGNED NOT NULL DEFAULT 0,
                            `precio` DECIMAL(8,2) NOT NULL,
                            `activo` BOOLEAN DEFAULT 1,
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pedido` (
                          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                          `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          `estado` ENUM('carrito','pagado','procesando','procesado','enviado','recibido') NOT NULL DEFAULT 'carrito',
                          `cliente` INT UNSIGNED NOT NULL,
                          `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                          PRIMARY KEY (`id`),
                          FOREIGN KEY (`cliente`) REFERENCES `usuario`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `linea_pedido` (
                                `ID_linea_pedido` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                `ID_Pedido` INT UNSIGNED NOT NULL,
                                `ID_Camiseta` INT UNSIGNED NOT NULL,
                                `Precio_Venta` DECIMAL(10, 2) NOT NULL,
                                FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`id`),
                                FOREIGN KEY (`ID_Camiseta`) REFERENCES `camiseta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `carrito`(
                          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                          `usuario` INT UNSIGNED NOT NULL,
                          `camiseta` INT UNSIGNED NOT NULL,
                          `cantidad` INT UNSIGNED NOT NULL DEFAULT 1,
                          `precio_unitario` DECIMAL NOT NULL,
                          `subtotal` DECIMAL(10, 2) NOT NULL,
                          FOREIGN KEY (`usuario`) REFERENCES `usuario` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
                          FOREIGN KEY (`camiseta`) REFERENCES `camiseta` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `usuario` (`id`, `username`, `password`, `email`, `telefono`, `direccion`, `activo`, `tipo`) VALUES
                                                                                                             (1, 'pepe', '$2a$10$czRAAeghw4UntjfS4etcgOfCwXypg/PRC.MmfadS8qN1PRWlEJiI2', 'juansinmiedo@sincorreo.com', '555123456', 'Paseo de la Estación 44, 23008, JAEN', 1, 'OPERADOR'),
                                                                                                             (2, 'maria_admin', '$2a$10$czRAAeghw4UntjfS4etcgOfCwXypg/PRC.MmfadS8qN1PRWlEJiI2', 'admin@tienda.com', '666777888', 'Calle Comercio 1, 28001, MADRID', 1, 'OPERADOR'),
                                                                                                             (13, 'pepito', '$2b$10$.zbmFav.W7ZYXvuNerc4J.Saygg9JRE2mEudBrB1Cy71DwbBkJxcG', 'pepe@sinninguncorreo.com', '123-456-789', 'Paseo de la Estación 44, 23008, JAEN', 1, 'CLIENTE'),
                                                                                                             (14, 'lucas_gamer', '$2b$10$.zbmFav.W7ZYXvuNerc4J.Saygg9JRE2mEudBrB1Cy71DwbBkJxcG', 'lucas@gmail.com', '600111222', 'Av. Diagonal 50, 08005, BARCELONA', 1, 'CLIENTE'),
                                                                                                             (15, 'laura_moda', '$2b$10$.zbmFav.W7ZYXvuNerc4J.Saygg9JRE2mEudBrB1Cy71DwbBkJxcG', 'laura@hotmail.com', '777888999', 'Plaza Mayor 3, 41001, SEVILLA', 1, 'CLIENTE'),
                                                                                                             (16, 'cliente_inactivo', '$2b$10$.zbmFav.W7ZYXvuNerc4J.Saygg9JRE2mEudBrB1Cy71DwbBkJxcG', 'baja@baja.com', NULL, NULL, 0, 'CLIENTE');

INSERT INTO `camiseta` (`id`, `talla`, `sexo`, `color`, `marca`, `stock`, `precio`, `activo`) VALUES
                                                                                                  (1, 'xs', 'chico', '#e01b24', 'Adidas', 3, 20.00, 1),
                                                                                                  (2, 'xs', 'chico', '#a0aba4', 'Puma', 10, 15.00, 0),
                                                                                                  (3, 's', 'unisex', '#000000', 'Puma', 3, 1.20, 1),
                                                                                                  (4, 'xxs', 'niña', '#ed333b', 'Puma', 12, 12.00, 1),
                                                                                                  (5, 'xxl', 'niño', '#f9f06b', 'Adidas', 12, 34.00, 1),
                                                                                                  (6, 'm', 'chico', '#0000FF', 'Nike', 50, 25.50, 1),
                                                                                                  (7, 'l', 'chico', '#FFFFFF', 'Nike', 20, 25.50, 1),
                                                                                                  (8, 's', 'chica', '#FFC0CB', 'Zara', 15, 18.99, 1),
                                                                                                  (9, 'l', 'unisex', '#808080', 'Vans', 30, 35.00, 1),
                                                                                                  (10, 'xxl', 'unisex', '#FFFFFF', 'FruitLoom', 100, 9.99, 1),
                                                                                                  (11, 'm', 'unisex_infantil', '#FFA500', 'Puma', 0, 11.00, 1),
                                                                                                  (14, 'xs', 'unisex', '#e66100', 'Adidas', 3, 6.00, 1);

INSERT INTO `pedido` (`id`, `fecha`, `estado`, `cliente`, `total`) VALUES
                                                                       (1, '2023-09-15 10:00:00', 'recibido', 13, 35.00),
                                                                       (2, '2023-10-05 14:30:00', 'enviado', 13, 45.50),
                                                                       (3, '2023-10-20 09:15:00', 'procesando', 14, 51.00),
                                                                       (4, '2023-10-21 11:00:00', 'pagado', 13, 20.00);

INSERT INTO `linea_pedido` (`ID_Pedido`, `ID_Camiseta`, `Precio_Venta`) VALUES
                                                                            (1, 1, 20.00),
                                                                            (1, 2, 15.00),
                                                                            (2, 1, 20.00),
                                                                            (2, 6, 25.50),
                                                                            (3, 7, 25.50),
                                                                            (3, 7, 25.50),
                                                                            (4, 1, 20.00);

INSERT INTO `carrito` (`usuario`, `camiseta`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
                                                                                             (13, 3, 2, 1.20, 2.40),
                                                                                             (13, 5, 1, 34.00, 34.00),
                                                                                             (14, 9, 1, 35.00, 35.00),
                                                                                             (15, 8, 3, 18.99, 56.97);