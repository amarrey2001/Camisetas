# Gestión tienda de camisetas

Versión profesional del README para el proyecto de gestión de una tienda de camisetas.

Descripción
-----------
Aplicación de ejemplo para administrar un catálogo de camisetas, usuarios y pedidos. Interfaz basada en vistas Pug y lógica en Express (Node.js). Pensada para fines docentes y prácticos.

Stack tecnológico
-----------------
- Node.js
- Express
- Pug (vistas)
- MySQL (conector `mysql2`)

Requisitos
----------
- Node.js (v16+ recomendado) y npm
- MySQL o MariaDB para la base de datos
- Copiar/crear el fichero de entorno en `stack-camisetas/.env` con al menos las variables:
   - `APP_PORT` (puerto de la app)
   - `SESSION_SECRET` (secreto de sesión)
   - variables de conexión a la BBDD si procede

Instalación y ejecución
-----------------------
```bash
git clone <repo>
cd Camisetas
npm install
# Configurar `stack-camisetas/.env` con APP_PORT y SESSION_SECRET
node app.js
# Visit: http://localhost:$APP_PORT
```
º
Base de datos
-------------
El proyecto incluye un SQL de ejemplo en `stack-camisetas/db/init.sql`. A continuación se muestran las definiciones de tablas principales (conservadas para referencia y despliegue):

Tabla `camiseta`:

```sql
CREATE TABLE `camiseta` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `talla` ENUM('xxs','xs','s','m','l','xl','xxl') NOT NULL,
   `sexo` ENUM('chica','chico','unisex','niño','niña','unisex_infantil') NOT NULL,
   `color` VARCHAR(50) NOT NULL,
   `marca` VARCHAR(50) NOT NULL,
   `stock` INT UNSIGNED NOT NULL DEFAULT 0,
   `precio` DECIMAL(8,2) NOT NULL,
   `activo` BOOLEAN,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Tabla `usuario`:

```sql
CREATE TABLE `usuario` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `username` VARCHAR(50) NOT NULL UNIQUE,
   `password` VARCHAR(255) NOT NULL,
   `email` VARCHAR(100) NOT NULL UNIQUE,
   `telefono` VARCHAR(20),
   `direccion` VARCHAR(255),
   `tipo` ENUM('OPERARIO','CLIENTE'),
   `activo` BOOLEAN,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Tabla `pedido`:

```sql
CREATE TABLE `pedido` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `estado` ENUM('carrito','pagado','procesando','procesado','enviado','recibido') NOT NULL DEFAULT 'carrito',
   `cliente` INT UNSIGNED NOT NULL,
   `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`cliente`) REFERENCES `usuario`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Tabla `linea_pedido`:

```sql
CREATE TABLE `linea_pedido` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `pedido` INT UNSIGNED NOT NULL,
   `producto` INT UNSIGNED NOT NULL,
   `precio_venta` DECIMAL(8,2) NOT NULL,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`pedido`) REFERENCES `pedido`(`id`),
   FOREIGN KEY (`producto`) REFERENCES `camiseta`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Ejemplo de inserción de usuario (solo ejemplo de datos de prueba):

```sql
INSERT INTO `usuario` (`username`, `password`, `email`, `telefono`, `direccion`, `activo`) 
VALUES ('juan', '$2a$10$lI.aqorQqeC8Z7faW7npY.j8RKyK48df4c9Beo60FHZltPdaGnO3y', 'juansinmiedo@sincorreo.com', '555123456', 'Paseo de la Estación 44, 23008, JAEN', 1);
```

Rutas (endpoints)
------------------
Las rutas están definidas en `routes/` y montadas en `app.js`. El siguiente listado refleja la implementación actual (vistas Pug y formularios):

RUTA | MÉTODO | DESCRIPCIÓN | AUTENTICACIÓN
-----|--------|-------------|---------------
`/` | GET | Página principal / catálogo público | pública
`/auth/login` | GET | Formulario de acceso | pública
`/auth/login` | POST | Procesa login (`username`, `password`) | pública
`/auth/register` | GET | Formulario de registro | pública
`/auth/register` | POST | Crear nuevo usuario | pública
`/auth/logout` | GET | Cierra sesión | pública
`/admin/camiseta/` | GET | Lista de camisetas (admin) | requiere `OPERADOR`
`/admin/camiseta/add` | GET | Formulario añadir camiseta | requiere `OPERADOR`
`/admin/camiseta/add` | POST | Añadir camiseta | requiere `OPERADOR`
`/admin/camiseta/edit/:id` | GET | Formulario editar camiseta | requiere `OPERADOR`
`/admin/camiseta/edit/:id` | POST | Actualizar camiseta | requiere `OPERADOR`
`/admin/camiseta/del/:id` | GET | Confirmación borrado | requiere `OPERADOR`
`/admin/camiseta/del/:id` | POST | Borrar camiseta | requiere `OPERADOR`
`/admin/camiseta/:id` | GET | Ver camiseta (admin) | requiere `OPERADOR`
`/camiseta/` | GET | Catálogo público (montado desde `routes/productoRouter.js`) | pública
`/carro/` | GET | Mostrar carrito | sesión (cliente)
`/carro/add` | POST | Añadir al carrito | sesión (cliente)
`/carro/delete/:id` | POST | Eliminar del carrito | sesión (cliente)
`/pedido/` | GET | Mis pedidos | sesión
`/pedido/mis-pedidos` | GET | Alias: mis pedidos | sesión
`/pedido/crear` | GET | Formulario crear pedido | sesión
`/pedido/crear` | POST | Crear pedido | sesión
`/pedido/tramitar` | GET | Formulario tramitar pedido | sesión
`/pedido/tramitar` | POST | Tramitar pedido | sesión
`/pedido/edit/:id` | GET | Editar pedido (form) | sesión / roles según control
`/pedido/edit/:id` | POST | Actualizar pedido | sesión
`/pedido/:id` | GET | Detalle pedido | sesión
`/pedido/confirmado/:id` | GET | Pedido confirmado | sesión
`/pedido/confirmar` | POST | Confirmar / tramitar | sesión
`/admin/pedido/` | GET | Listar todos los pedidos (admin) | requiere `OPERADOR`
`/admin/pedido/:id/estado` | POST | Cambiar estado de pedido | requiere `OPERADOR`

Notas sobre seguridad y montaje
-----------------------------
- El middleware en `app.js` realiza la protección básica: redirige a `/auth/login` si se intenta acceder a `/admin` sin ser `OPERADOR`.
- Las rutas montadas en `app.js`:
   - `app.use('/admin/camiseta', camisetaRouter)`
   - `app.use('/auth', authRouter)`
   - `app.use('/carro', carroRouter)`
   - `app.use('/camiseta', productoRouter)` (catálogo público)
   - `app.use('/pedido', pedidoRouter)`
   - `app.use('/admin/pedido', adminPedidoRouter)`

