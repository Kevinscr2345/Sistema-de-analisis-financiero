-- 1. CREACIÓN DE LA BASE DE DATOS
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'FinanzasInventarioDB')
BEGIN
    CREATE DATABASE FinanzasInventarioDB;
    PRINT 'Base de datos FinanzasInventarioDB creada exitosamente.';
END
GO

USE FinanzasInventarioDB;
GO

-- 2. LIMPIEZA DE TABLAS SI YA EXISTEN (ORDEN POR DEPENDENCIAS)
IF OBJECT_ID('dbo.AlertasStock', 'U') IS NOT NULL DROP TABLE dbo.AlertasStock;
IF OBJECT_ID('dbo.Presupuestos', 'U') IS NOT NULL DROP TABLE dbo.Presupuestos;
IF OBJECT_ID('dbo.TransaccionesFinancieras', 'U') IS NOT NULL DROP TABLE dbo.TransaccionesFinancieras;
IF OBJECT_ID('dbo.MovimientosInventario', 'U') IS NOT NULL DROP TABLE dbo.MovimientosInventario;
IF OBJECT_ID('dbo.Productos', 'U') IS NOT NULL DROP TABLE dbo.Productos;
IF OBJECT_ID('dbo.ClientesProveedores', 'U') IS NOT NULL DROP TABLE dbo.ClientesProveedores;
IF OBJECT_ID('dbo.Categorias', 'U') IS NOT NULL DROP TABLE dbo.Categorias;
GO

-- 3. CREACIÓN DE TABLAS DEL SISTEMA

-- Tabla: Categorias
CREATE TABLE dbo.Categorias (
    id_categoria INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NULL,
    tipo NVARCHAR(30) NOT NULL CHECK (tipo IN ('INVENTARIO', 'FINANZAS_INGRESO', 'FINANZAS_GASTO')),
    fecha_creacion DATETIME DEFAULT GETDATE()
);

-- Tabla: ClientesProveedores
CREATE TABLE dbo.ClientesProveedores (
    id_entidad INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(150) NOT NULL,
    tipo NVARCHAR(20) NOT NULL CHECK (tipo IN ('CLIENTE', 'PROVEEDOR', 'AMBOS')),
    identificacion NVARCHAR(50) NULL,
    telefono NVARCHAR(30) NULL,
    email NVARCHAR(100) NULL,
    direccion NVARCHAR(200) NULL,
    fecha_registro DATETIME DEFAULT GETDATE()
);

-- Tabla: Productos
CREATE TABLE dbo.Productos (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    codigo NVARCHAR(50) NOT NULL UNIQUE,
    nombre NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(255) NULL,
    id_categoria INT NOT NULL FOREIGN KEY REFERENCES dbo.Categorias(id_categoria),
    precio_compra DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    precio_venta DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 5,
    unidad_medida NVARCHAR(30) DEFAULT 'Unidades',
    fecha_creacion DATETIME DEFAULT GETDATE()
);

-- Tabla: MovimientosInventario
CREATE TABLE dbo.MovimientosInventario (
    id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
    id_producto INT NOT NULL FOREIGN KEY REFERENCES dbo.Productos(id_producto),
    tipo_movimiento NVARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
    cantidad INT NOT NULL,
    costo_unitario DECIMAL(18,2) NOT NULL,
    motivo NVARCHAR(255) NULL,
    id_entidad INT NULL FOREIGN KEY REFERENCES dbo.ClientesProveedores(id_entidad),
    fecha_movimiento DATETIME DEFAULT GETDATE()
);

-- Tabla: TransaccionesFinancieras
CREATE TABLE dbo.TransaccionesFinancieras (
    id_transaccion INT IDENTITY(1,1) PRIMARY KEY,
    tipo NVARCHAR(20) NOT NULL CHECK (tipo IN ('INGRESO', 'GASTO')),
    concepto NVARCHAR(200) NOT NULL,
    monto DECIMAL(18,2) NOT NULL,
    fecha_transaccion DATETIME DEFAULT GETDATE(),
    id_categoria INT NOT NULL FOREIGN KEY REFERENCES dbo.Categorias(id_categoria),
    id_entidad INT NULL FOREIGN KEY REFERENCES dbo.ClientesProveedores(id_entidad),
    comprobante NVARCHAR(50) NULL,
    metodo_pago NVARCHAR(30) NOT NULL DEFAULT 'EFECTIVO' CHECK (metodo_pago IN ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'OTRO'))
);

-- Tabla: Presupuestos
CREATE TABLE dbo.Presupuestos (
    id_presupuesto INT IDENTITY(1,1) PRIMARY KEY,
    id_categoria INT NOT NULL FOREIGN KEY REFERENCES dbo.Categorias(id_categoria),
    mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    anio INT NOT NULL,
    monto_presupuestado DECIMAL(18,2) NOT NULL,
    monto_ejecutado DECIMAL(18,2) DEFAULT 0.00,
    CONSTRAINT UQ_Presupuesto_Categoria_Periodo UNIQUE (id_categoria, mes, anio)
);

-- Tabla: AlertasStock
CREATE TABLE dbo.AlertasStock (
    id_alerta INT IDENTITY(1,1) PRIMARY KEY,
    id_producto INT NOT NULL FOREIGN KEY REFERENCES dbo.Productos(id_producto),
    tipo_alerta NVARCHAR(30) NOT NULL CHECK (tipo_alerta IN ('STOCK_BAJO', 'STOCK_AGOTADO', 'SOBRESTOCK')),
    mensaje NVARCHAR(255) NOT NULL,
    fecha_alerta DATETIME DEFAULT GETDATE(),
    estado NVARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'RESUELTA'))
);
GO

-- 4. CREACIÓN DE VISTAS ANALÍTICAS

-- Vista: Resumen Financiero General
CREATE OR ALTER VIEW dbo.vw_ResumenFinanciero AS
SELECT 
    YEAR(fecha_transaccion) AS Anio,
    MONTH(fecha_transaccion) AS Mes,
    SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) AS TotalIngresos,
    SUM(CASE WHEN tipo = 'GASTO' THEN monto ELSE 0 END) AS TotalGastos,
    SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE -monto END) AS BalanceNeto,
    CASE 
        WHEN SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) > 0 
        THEN ROUND(((SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE -monto END) / SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END)) * 100), 2)
        ELSE 0 
    END AS MargenUtilidadPorcentaje
FROM dbo.TransaccionesFinancieras
GROUP BY YEAR(fecha_transaccion), MONTH(fecha_transaccion);
GO

-- Vista: Valoración de Inventario
CREATE OR ALTER VIEW dbo.vw_ValoracionInventario AS
SELECT 
    p.id_producto,
    p.codigo,
    p.nombre AS Producto,
    c.nombre AS Categoria,
    p.stock_actual,
    p.stock_minimo,
    p.precio_compra,
    p.precio_venta,
    (p.stock_actual * p.precio_compra) AS ValorTotalCosto,
    (p.stock_actual * p.precio_venta) AS ValorTotalVenta,
    ((p.stock_actual * p.precio_venta) - (p.stock_actual * p.precio_compra)) AS GananciaPotencial,
    CASE 
        WHEN p.stock_actual = 0 THEN 'AGOTADO'
        WHEN p.stock_actual <= p.stock_minimo THEN 'STOCK BAJO'
        ELSE 'NORMAL'
    END AS EstadoStock
FROM dbo.Productos p
INNER JOIN dbo.Categorias c ON p.id_categoria = c.id_categoria;
GO

-- Vista: Flujo de Caja Mensual Detallado
CREATE OR ALTER VIEW dbo.vw_FlujoCajaMensual AS
SELECT 
    t.id_transaccion,
    t.fecha_transaccion,
    t.tipo,
    t.concepto,
    t.monto,
    t.metodo_pago,
    c.nombre AS Categoria,
    cp.nombre AS ClienteProveedor
FROM dbo.TransaccionesFinancieras t
INNER JOIN dbo.Categorias c ON t.id_categoria = c.id_categoria
LEFT JOIN dbo.ClientesProveedores cp ON t.id_entidad = cp.id_entidad;
GO

-- 5. PROCEDIMIENTOS ALMACENADOS DE NEGOCIO

-- Procedimiento: Registrar Venta con Descuento Automático de Stock e Ingreso Financiero
CREATE OR ALTER PROCEDURE dbo.sp_RegistrarVentaEInventario
    @id_producto INT,
    @cantidad INT,
    @precio_venta_unitario DECIMAL(18,2),
    @id_cliente INT = NULL,
    @metodo_pago NVARCHAR(30) = 'TRANSFERENCIA',
    @concepto NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Validar Stock
        DECLARE @stock_actual INT;
        DECLARE @nombre_prod NVARCHAR(150);
        DECLARE @id_cat INT;

        SELECT @stock_actual = stock_actual, @nombre_prod = nombre, @id_cat = id_categoria 
        FROM dbo.Productos WHERE id_producto = @id_producto;

        IF @stock_actual IS NULL
        BEGIN
            RAISERROR('El producto especificado no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @stock_actual < @cantidad
        BEGIN
            RAISERROR('Stock insuficiente para realizar la venta.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 1. Actualizar Stock del Producto
        UPDATE dbo.Productos 
        SET stock_actual = stock_actual - @cantidad 
        WHERE id_producto = @id_producto;

        -- 2. Insertar Movimiento de Inventario (SALIDA)
        INSERT INTO dbo.MovimientosInventario (id_producto, tipo_movimiento, cantidad, costo_unitario, motivo, id_entidad)
        VALUES (@id_producto, 'SALIDA', @cantidad, @precio_venta_unitario, 'Venta realizada desde el sistema', @id_cliente);

        -- 3. Insertar Transacción Financiera (INGRESO)
        DECLARE @monto_total DECIMAL(18,2) = @cantidad * @precio_venta_unitario;
        IF @concepto IS NULL 
            SET @concepto = CONCAT('Venta de ', @cantidad, ' unidad(es) de ', @nombre_prod);

        INSERT INTO dbo.TransaccionesFinancieras (tipo, concepto, monto, id_categoria, id_entidad, metodo_pago)
        VALUES ('INGRESO', @concepto, @monto_total, @id_cat, @id_cliente, @metodo_pago);

        -- 4. Verificar Alerta de Stock Bajo
        IF (@stock_actual - @cantidad) <= (SELECT stock_minimo FROM dbo.Productos WHERE id_producto = @id_producto)
        BEGIN
            INSERT INTO dbo.AlertasStock (id_producto, tipo_alerta, mensaje)
            VALUES (@id_producto, 'STOCK_BAJO', CONCAT('El producto ', @nombre_prod, ' ha alcanzado el límite de stock mínimo.'));
        END

        COMMIT TRANSACTION;
        PRINT 'Venta e inventario registrados exitosamente.';
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Procedimiento: Obtener KPIs Financieros y de Inventario
CREATE OR ALTER PROCEDURE dbo.sp_ObtenerKPIsFinancieros
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        ISNULL((SELECT SUM(monto) FROM dbo.TransaccionesFinancieras WHERE tipo = 'INGRESO'), 0) AS TotalIngresos,
        ISNULL((SELECT SUM(monto) FROM dbo.TransaccionesFinancieras WHERE tipo = 'GASTO'), 0) AS TotalGastos,
        ISNULL((SELECT SUM(monto) FROM dbo.TransaccionesFinancieras WHERE tipo = 'INGRESO'), 0) - 
        ISNULL((SELECT SUM(monto) FROM dbo.TransaccionesFinancieras WHERE tipo = 'GASTO'), 0) AS BalanceNeto,
        ISNULL((SELECT SUM(stock_actual * precio_compra) FROM dbo.Productos), 0) AS ValorInventarioCosto,
        ISNULL((SELECT COUNT(*) FROM dbo.Productos WHERE stock_actual <= stock_minimo), 0) AS TotalAlertasStock;
END;
GO

-- 6. DATOS SEMILLA
INSERT INTO dbo.Categorias (nombre, descripcion, tipo) VALUES
('Laptops y Portátiles', 'Laptops, notebooks y ultrabooks empresariales', 'INVENTARIO'),
('Computadoras de Escritorio', 'PCs de escritorio, All-in-One y estaciones de trabajo', 'INVENTARIO'),
('Monitores y Pantallas', 'Monitores 4K, pantallas LED y accesorios visuales', 'INVENTARIO'),
('Impresoras y Escáneres', 'Impresoras multifuncionales y escáneres de documentos', 'INVENTARIO'),
('Periféricos y Accesorios', 'Teclados, mouses, audífonos y docks', 'INVENTARIO'),
('Servidores y Redes', 'Servidores de rack, switches, routers y cableado', 'INVENTARIO'),
('Componentes y Almacenamiento', 'Discos SSD, memorias RAM, GPUs y procesadores', 'INVENTARIO'),
('Venta de Mercadería', 'Ingresos por venta directa de productos', 'FINANZAS_INGRESO'),
('Servicios Profesionales', 'Ingresos por asesoría y consultoría TI', 'FINANZAS_INGRESO'),
('Gastos Operativos', 'Servicios públicos, alquiler y mantenimiento', 'FINANZAS_GASTO'),
('Nómina y Salarios', 'Pago de empleados y contratistas', 'FINANZAS_GASTO');

INSERT INTO dbo.ClientesProveedores (nombre, tipo, identificacion, telefono, email, direccion) VALUES
('Tecnologías del Norte S.A.', 'PROVEEDOR', 'J03100004561', '+505 8899-7766', 'contacto@tecnorte.com', 'Zona Industrial 4, Managua'),
('Comercializadora Global R.L.', 'CLIENTE', 'J03100009872', '+505 2233-4455', 'ventas@comercializadorage.com', 'Plaza Central, Local 12'),
('Consultores Financieros Alfa', 'AMBOS', 'J03100001234', '+505 8765-4321', 'info@alfa.com', 'Avenida Principal #45');

INSERT INTO dbo.Productos (codigo, nombre, descripcion, id_categoria, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida) VALUES
('EQP-001', 'Laptop Dell Vostro 15', 'Core i5 12va Gen, 16GB RAM, 512GB SSD', 1, 650.00, 890.00, 12, 3, 'Unidades'),
('EQP-002', 'Monitor LG 27 pulgadas 4K', 'Panel IPS, HDMI/DisplayPort', 3, 240.00, 340.00, 8, 2, 'Unidades'),
('EQP-003', 'Teclado Mecánico Inalámbrico', 'Switch Red, retroiluminado RGB', 5, 45.00, 75.00, 4, 5, 'Unidades'),
('EQP-004', 'Servidor Dell PowerEdge T150', 'Xeon E-2314, 32GB RAM, 2TB HDD', 6, 1200.00, 1750.00, 3, 2, 'Unidades'),
('EQP-005', 'Impresora Multifuncional Epson', 'Tanque de tinta continuo EcoTank', 4, 180.00, 260.00, 2, 3, 'Unidades');

-- Transacciones Financieras de Demostración
INSERT INTO dbo.TransaccionesFinancieras (tipo, concepto, monto, fecha_transaccion, id_categoria, id_entidad, metodo_pago) VALUES
('INGRESO', 'Venta lote Laptops Vostro EQP-001', 3560.00, DATEADD(DAY, -15, GETDATE()), 8, 2, 'TRANSFERENCIA'),
('INGRESO', 'Servicios de Consultoría TI e Instalación', 1200.00, DATEADD(DAY, -10, GETDATE()), 9, 3, 'TRANSFERENCIA'),
('GASTO', 'Pago Alquiler de Local Comercial', 850.00, DATEADD(DAY, -8, GETDATE()), 10, NULL, 'TRANSFERENCIA'),
('GASTO', 'Pago de Servicios Públicos (Luz e Internet)', 230.00, DATEADD(DAY, -5, GETDATE()), 10, NULL, 'EFECTIVO'),
('GASTO', 'Compra de Servidores a Proveedor', 1950.00, DATEADD(DAY, -3, GETDATE()), 10, 1, 'TRANSFERENCIA'),
('INGRESO', 'Venta de Monitores LG EQP-002', 1020.00, DATEADD(DAY, -1, GETDATE()), 8, 2, 'TARJETA');

-- Alerta Inicial
INSERT INTO dbo.AlertasStock (id_producto, tipo_alerta, mensaje) VALUES
(3, 'STOCK_BAJO', 'El equipo Teclado Mecánico Inalámbrico tiene 4 unidades en stock (Mínimo: 5)'),
(5, 'STOCK_BAJO', 'El equipo Impresora Multifuncional Epson tiene 2 unidades en stock (Mínimo: 3)');
GO

