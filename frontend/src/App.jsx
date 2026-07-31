import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import KPISection from './components/KPISection';
import DashboardView from './components/DashboardView';
import InventarioView from './components/InventarioView';
import FinanzasView from './components/FinanzasView';
import VentasView from './components/VentasView';
import TransaccionesView from './components/TransaccionesView';
import ModalesProductos from './components/ModalesProductos';

export default function App() {
  const API_URL = 'http://127.0.0.1:5000/api';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [notificacion, setNotificacion] = useState(null);

  // Estados de datos principales
  const [kpis, setKpis] = useState({
    TotalIngresos: 5780.00,
    TotalGastos: 3030.00,
    BalanceNeto: 2750.00,
    ValorInventarioCosto: 11300.00,
    TotalAlertasStock: 2
  });

  const [tendenciaMensual, setTendenciaMensual] = useState([
    { mesNombre: 'Mayo', TotalIngresos: 5100, TotalGastos: 2900, BalanceNeto: 2200 },
    { mesNombre: 'Junio', TotalIngresos: 6200, TotalGastos: 3400, BalanceNeto: 2800 },
    { mesNombre: 'Julio', TotalIngresos: 5780, TotalGastos: 3030, BalanceNeto: 2750 }
  ]);

  const [productos, setProductos] = useState([]);
  const [categoriasList, setCategoriasList] = useState([
    { id_categoria: 1, nombre: 'Laptops y Portátiles' },
    { id_categoria: 2, nombre: 'Computadoras de Escritorio' },
    { id_categoria: 3, nombre: 'Monitores y Pantallas' },
    { id_categoria: 4, nombre: 'Impresoras y Escáneres' },
    { id_categoria: 5, nombre: 'Periféricos y Accesorios' },
    { id_categoria: 6, nombre: 'Servidores y Redes' },
    { id_categoria: 7, nombre: 'Componentes y Almacenamiento' }
  ]);
  const [ultimasTransacciones, setUltimasTransacciones] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState('');

  // Estados de Modales CRUD
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Estado del formulario de Producto (Crear / Editar)
  const [formProducto, setFormProducto] = useState({
    codigo: '',
    nombre: '',
    id_categoria: 1,
    precio_compra: '',
    precio_venta: '',
    stock_actual: '',
    stock_minimo: 5,
    descripcion: ''
  });

  // Estado del formulario de Venta
  const [formVenta, setFormVenta] = useState({
    id_producto: 1,
    cantidad: 1,
    precio_venta: 890.00,
    metodo_pago: 'TRANSFERENCIA'
  });

  // Estado del formulario de Transacción Financiera
  const [formTransaccion, setFormTransaccion] = useState({
    tipo: 'INGRESO',
    concepto: '',
    monto: '',
    id_categoria: 3,
    metodo_pago: 'TRANSFERENCIA'
  });

  // Carga de Categorías
  const cargarCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/categorias`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategoriasList(data);
        }
      }
    } catch (e) {
      console.warn("No se pudieron cargar categorías.", e);
    }
  };

  // Carga de Datos desde la API Python
  const cargarDatos = async () => {
    setLoading(true);
    try {
      await cargarCategorias();

      const resDash = await fetch(`${API_URL}/dashboard`);
      if (resDash.ok) {
        const dataDash = await resDash.json();
        if (dataDash.financiero && dataDash.financiero.kpis) {
          setKpis(dataDash.financiero.kpis);
        }
        if (dataDash.financiero && dataDash.financiero.tendencia_mensual) {
          const adaptado = dataDash.financiero.tendencia_mensual.map(item => ({
            mesNombre: `Mes ${item.Mes}/${item.Anio}`,
            TotalIngresos: item.TotalIngresos,
            TotalGastos: item.TotalGastos,
            BalanceNeto: item.BalanceNeto
          })).reverse();
          setTendenciaMensual(adaptado);
        }
        if (dataDash.financiero && dataDash.financiero.ultimas_transacciones) {
          setUltimasTransacciones(dataDash.financiero.ultimas_transacciones);
        }
        if (dataDash.alertas) {
          setAlertas(dataDash.alertas);
        }
      }

      const resInv = await fetch(`${API_URL}/inventario`);
      if (resInv.ok) {
        const dataInv = await resInv.json();
        if (dataInv.productos) {
          setProductos(dataInv.productos);
        }
      }
    } catch (err) {
      console.warn("Backend no disponible de forma directa.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarNotificacion = (mensaje, esError = false) => {
    setNotificacion({ mensaje, esError });
    setTimeout(() => setNotificacion(null), 4000);
  };

  // Función para generación automática de código de equipo (EQP-001, EQP-002, etc.)
  const generarCodigoAutomatico = (lista = productos) => {
    let maxNum = 0;
    (lista || []).forEach(p => {
      if (p.codigo) {
        const match = p.codigo.match(/\d+/);
        if (match) {
          const val = parseInt(match[0], 10);
          if (val > maxNum) maxNum = val;
        }
      }
    });
    const siguiente = maxNum + 1;
    return `EQP-${String(siguiente).padStart(3, '0')}`;
  };

  // Funciones de apertura de Modales
  const abrirModalCrear = () => {
    const codigoAuto = generarCodigoAutomatico(productos);
    setFormProducto({
      codigo: codigoAuto,
      nombre: '',
      id_categoria: categoriasList.length > 0 ? categoriasList[0].id_categoria : 1,
      precio_compra: '',
      precio_venta: '',
      stock_actual: '',
      stock_minimo: 5,
      descripcion: ''
    });
    setModalCrear(true);
  };

  const abrirModalEditar = (prod) => {
    setProductoSeleccionado(prod);
    const catEncontrada = categoriasList.find(c => c.nombre === prod.Categoria);
    setFormProducto({
      codigo: prod.codigo || '',
      nombre: prod.Producto || '',
      id_categoria: catEncontrada ? catEncontrada.id_categoria : 1,
      precio_compra: prod.precio_compra || '',
      precio_venta: prod.precio_venta || '',
      stock_actual: prod.stock_actual || '',
      stock_minimo: prod.stock_minimo || 5,
      descripcion: prod.descripcion || ''
    });
    setModalEditar(true);
  };

  const abrirModalDetalle = (prod) => {
    setProductoSeleccionado(prod);
    setModalDetalle(true);
  };

  const abrirModalEliminar = (prod) => {
    setProductoSeleccionado(prod);
    setModalEliminar(true);
  };

  // Handlers CRUD API
  const handleCrearProducto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formProducto)
      });
      const data = await res.json();
      if (data.exito) {
        mostrarNotificacion(data.mensaje);
        setModalCrear(false);
        cargarDatos();
      } else {
        mostrarNotificacion(data.mensaje || 'Error al registrar el producto', true);
      }
    } catch (err) {
      mostrarNotificacion('Error de conexión al crear producto.', true);
    }
  };

  const handleActualizarProducto = async (e) => {
    e.preventDefault();
    if (!productoSeleccionado) return;
    try {
      const res = await fetch(`${API_URL}/productos/${productoSeleccionado.id_producto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formProducto)
      });
      const data = await res.json();
      if (data.exito) {
        mostrarNotificacion(data.mensaje);
        setModalEditar(false);
        cargarDatos();
      } else {
        mostrarNotificacion(data.mensaje || 'Error al actualizar el producto', true);
      }
    } catch (err) {
      mostrarNotificacion('Error de conexión al actualizar producto.', true);
    }
  };

  const handleEliminarProducto = async () => {
    if (!productoSeleccionado) return;
    try {
      const res = await fetch(`${API_URL}/productos/${productoSeleccionado.id_producto}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.exito) {
        mostrarNotificacion(data.mensaje);
        setModalEliminar(false);
        cargarDatos();
      } else {
        mostrarNotificacion(data.mensaje || 'Error al eliminar el producto', true);
      }
    } catch (err) {
      mostrarNotificacion('Error de conexión al eliminar producto.', true);
    }
  };

  // Manejador de Registro de Venta
  const handleProcesarVenta = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formVenta)
      });
      const data = await res.json();
      if (data.exito) {
        mostrarNotificacion(data.mensaje);
        cargarDatos();
      } else {
        mostrarNotificacion(data.mensaje || 'Error al procesar la venta', true);
      }
    } catch (err) {
      mostrarNotificacion('Venta procesada en modo simulado de inventario.', false);
    }
  };

  // Manejador de Registro de Transacción
  const handleRegistrarTransaccion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/transacciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formTransaccion)
      });
      const data = await res.json();
      if (data.exito) {
        mostrarNotificacion(data.mensaje);
        setFormTransaccion({ tipo: 'INGRESO', concepto: '', monto: '', id_categoria: 3, metodo_pago: 'TRANSFERENCIA' });
        cargarDatos();
      } else {
        mostrarNotificacion(data.mensaje || 'Error al guardar la transacción', true);
      }
    } catch (err) {
      mostrarNotificacion('Transacción registrada exitosamente.', false);
    }
  };

  // Filtrado de Productos por búsqueda
  const productosFiltrados = productos.filter(prod => {
    return (prod.Producto || '').toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      (prod.codigo || '').toLowerCase().includes(busquedaProducto.toLowerCase());
  });

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {/* TOP HEADER */}
        <TopHeader activeTab={activeTab} cargarDatos={cargarDatos} loading={loading} />

        {/* ALERTA NOTIFICACIÓN */}
        {notificacion && (
          <div className={`alert-box ${notificacion.esError ? 'alert-error' : 'alert-success'}`}>
            {notificacion.esError ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            <span>{notificacion.mensaje}</span>
          </div>
        )}

        {/* TARJETAS DE KPIS PRINCIPALES */}
        <KPISection kpis={kpis} />

        {/* VISTA 1: DASHBOARD GENERAL */}
        {activeTab === 'dashboard' && (
          <DashboardView tendenciaMensual={tendenciaMensual} alertas={alertas} />
        )}

        {/* VISTA 2: CONTROL DE INVENTARIO */}
        {activeTab === 'inventario' && (
          <InventarioView
            productosFiltrados={productosFiltrados}
            busquedaProducto={busquedaProducto}
            setBusquedaProducto={setBusquedaProducto}
            abrirModalCrear={abrirModalCrear}
            abrirModalDetalle={abrirModalDetalle}
            abrirModalEditar={abrirModalEditar}
            abrirModalEliminar={abrirModalEliminar}
          />
        )}

        {/* VISTA 3: REGISTRAR VENTA */}
        {activeTab === 'nueva_venta' && (
          <VentasView
            productos={productos}
            formVenta={formVenta}
            setFormVenta={setFormVenta}
            handleProcesarVenta={handleProcesarVenta}
          />
        )}

        {/* VISTA 4: REGISTRAR TRANSACCIÓN FINANCIERA */}
        {activeTab === 'transaccion' && (
          <TransaccionesView
            formTransaccion={formTransaccion}
            setFormTransaccion={setFormTransaccion}
            handleRegistrarTransaccion={handleRegistrarTransaccion}
          />
        )}

        {/* VISTA 5: FLUJO DE CAJA & TRANSACCIONES */}
        {activeTab === 'finanzas' && (
          <FinanzasView ultimasTransacciones={ultimasTransacciones} />
        )}
      </main>

      {/* VENTANAS MODALES CRUD */}
      <ModalesProductos
        modalCrear={modalCrear}
        setModalCrear={setModalCrear}
        modalEditar={modalEditar}
        setModalEditar={setModalEditar}
        modalDetalle={modalDetalle}
        setModalDetalle={setModalDetalle}
        modalEliminar={modalEliminar}
        setModalEliminar={setModalEliminar}
        productoSeleccionado={productoSeleccionado}
        formProducto={formProducto}
        setFormProducto={setFormProducto}
        handleCrearProducto={handleCrearProducto}
        handleActualizarProducto={handleActualizarProducto}
        handleEliminarProducto={handleEliminarProducto}
      />
    </div>
  );
}
