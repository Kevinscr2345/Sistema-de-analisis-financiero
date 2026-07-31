# SistemFinance - Plataforma de Análisis Financiero y Control de Inventarios

Sistema integral de gestión financiera y valoración de inventario enfocado en **Equipos Informáticos**, desarrollado con una arquitectura limpia por capas en **Python (Flask)**, **React** y **Microsoft SQL Server**.

---

## 🚀 Tecnologías Utilizadas

### **Frontend (Interfaz de Usuario)**
- **React 18**: Biblioteca principal para la construcción de interfaces declarativas y reactivas.
- **Vite 6**: Tooling y bundling ultra rápido para desarrollo y compilación de producción.
- **Recharts**: Librería de visualización de datos para gráficas analíticas interactivas de tendencia financiera.
- **Lucide React**: Conjunto de iconografía moderna y ligera.
- **Vanilla CSS3 Modular**: Sistema de estilos basado en Design Tokens, variables CSS, Glassmorphism y diseño fluido responsive.

### **Backend (Servidor API RESTful)**
- **Python 3**: Lenguaje de programación principal.
- **Flask**: Microframework para la construcción de la API RESTful.
- **Flask-CORS**: Gestión de políticas de acceso cruzado entre el servidor y el cliente.
- **PyODBC**: Conector nativo de Python a Microsoft SQL Server mediante drivers ODBC.

### **Base de Datos (Persistencia y Lógica Transaccional)**
- **Microsoft SQL Server / SQL Server Express**: Motor de base de datos relacional.
- **Procedimientos Almacenados (Stored Procedures)**: Ejecución de operaciones transaccionales compuestas (ej. `sp_RegistrarVentaEInventario`).
- **Vistas Analíticas (Views)**: Vistas optimizadas como `vw_ValoracionInventario` y `vw_ResumenFinanciero` para cálculo de métricas financieras al instante.

---

## 🏛️ Arquitectura del Proyecto

El sistema está diseñado bajo una **Arquitectura Monolítica por Capas (Layered Architecture)** que garantiza la separación de responsabilidades y la mantenibilidad del código:

```
Sistema de análisis financiero/
├── app/                        # Capa Backend Python (Flask)
│   ├── database.py             # Conexión y ejecución SQL mediante PyODBC
│   ├── routes/                 # Capa de Controladores (Rutas API RESTful)
│   │   └── api_routes.py
│   ├── services/               # Capa de Lógica de Negocio
│   │   ├── financial_service.py
│   │   └── inventory_service.py
│   └── repositories/           # Capa de Acceso a Datos (DAL / Repositorios SQL)
│       ├── financial_repository.py
│       └── inventory_repository.py
├── frontend/                   # Capa Frontend React
│   ├── src/
│   │   ├── components/         # Componentes Modulares de la Interfaz
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopHeader.jsx
│   │   │   ├── KPISection.jsx
│   │   │   ├── DashboardView.jsx
│   │   │   ├── InventarioView.jsx
│   │   │   ├── FinanzasView.jsx
│   │   │   ├── VentasView.jsx
│   │   │   ├── TransaccionesView.jsx
│   │   │   └── ModalesProductos.jsx
│   │   ├── styles/             # Hojas de Estilos CSS Modulares
│   │   │   ├── variables.css
│   │   │   ├── layout.css
│   │   │   ├── components.css
│   │   │   ├── forms.css
│   │   │   └── modals.css
│   │   ├── App.jsx             # Ensamblador Principal y Estado Global
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js
├── config.py                   # Configuración del servidor SQL Server
├── run.py                      # Punto de entrada para iniciar el Backend Flask
└── database_setup.sql          # Script DDL/DML de creación de la Base de Datos
```

---

## 💡 Beneficios del Sistema

1. **Codificación Automática de Equipos (`EQP-001`):**
   Generación correlativa e inteligente de códigos de inventario sin intervención del usuario, eliminando duplicados y errores manuales de registro.

2. **Valoración Financiera de Almacén en Tiempo Real:**
   Cálculo automático de la valoración total a costo de compra, valor comercial a precio de venta y estimación de ganancia potencial de inventario.

3. **Integración Transaccional Automática:**
   Al registrar una salida o venta, el sistema efectúa la deducción atómica de stock en SQL Server y genera automáticamente el registro del flujo de caja.

4. **Alertas de Stock Crítico:**
   Detección preventiva de productos que alcanzan su límite mínimo de existencia para evitar desabastecimiento.

5. **Experiencia de Usuario Moderna (Dark Mode & Glassmorphism):**
   Interfaz veloz, reactiva y visualmente atractiva con navegación fluida entre pestañas.

---

## 👥 Beneficiarios del Proyecto

- **Empresas de Tecnología y Comercializadoras de Equipos Informáticos:**
  Permite administrar laptops, servidores, monitores y componentes en un catálogo especializado.
- **Gerentes Financieros y Administradores:**
  Obtienen visibilidad inmediata del balance neto, ingresos, gastos y liquidez operativa.
- **Encargados de Compras y Almacén:**
  Monitorean las unidades disponibles y reaccionan oportunamente ante alertas de reabastecimiento.
- **Equipos de Ventas:**
  Realizan registros de salidas con verificación instantánea de existencias y precios unitarios.

---

## 🛠️ Guía de Ejecución

### **1. Servidor Backend (Python)**
```powershell
.\.venv\Scripts\python.exe run.py
```

### **2. Servidor Frontend (React + Vite)**
```powershell
cd frontend
npm.cmd run dev
```
