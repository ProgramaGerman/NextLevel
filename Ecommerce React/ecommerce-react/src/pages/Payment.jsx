import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getCourseById } from '../lib/data'
import { generateInvoice, saveInvoice } from '../lib/invoice'
import { useCart } from '../context/CartContext'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Button } from '../components/ui/Button'
import { PageTransition } from '../components/PageTransition'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    CreditCard, 
    Smartphone, 
    Building2, 
    CheckCircle2, 
    AlertCircle,
    Lock,
    ShieldCheck,
    Wallet
} from 'lucide-react'

const Payment = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { clearCart } = useCart()
    
    // Check if it's a cart purchase or single item
    const isCartPurchase = id === 'carrito'
    const cartItems = location.state?.cartItems || []
    const totalAmount = location.state?.totalAmount || '0.00'
    
    // For single course purchases (legacy)
    const course = !isCartPurchase ? getCourseById(id) : null
    const selectedPlan = location.state?.plan
    const planData = location.state?.planData

    const [metodoSeleccionado, setMetodoSeleccionado] = useState('pago-movil')
    const [mostrarExito, setMostrarExito] = useState(false)
    const [procesando, setProcesando] = useState(false)
    const [errores, setErrores] = useState({})

    // Formulario Pago Móvil
    const [pagoMovil, setPagoMovil] = useState({
        banco: '',
        telefono: '',
        cedula: '',
        referencia: ''
    })

    // Formulario Visa
    const [visa, setVisa] = useState({
        numeroTarjeta: '',
        nombreTitular: '',
        fechaExpiracion: '',
        cvv: ''
    })

    // Formulario Transferencia
    const [transferencia, setTransferencia] = useState({
        bancoOrigen: '',
        bancoDestino: '',
        numeroCuenta: '',
        cedula: '',
        referencia: ''
    })

    // Formulario PayPal
    const [paypal, setPaypal] = useState({
        email: '',
        nombreCompleto: ''
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Redirect if no items to purchase
    useEffect(() => {
        if (isCartPurchase && cartItems.length === 0) {
            navigate('/carrito')
        }
        if (!isCartPurchase && (!selectedPlan || !planData)) {
            navigate(`/comprar/${id}`)
        }
    }, [isCartPurchase, cartItems, selectedPlan, planData, id, navigate])

    const bancos = [
        'Banesco',
        'Venezuela',
        'Mercantil',
        'Provincial',
        'Bicentenario',
        'Banco del Tesoro',
        'BNC',
        'BOD'
    ]

    // Validación específica por método
    const validarFormulario = () => {
        const nuevosErrores = {}

        if (metodoSeleccionado === 'pago-movil') {
            if (!pagoMovil.banco) nuevosErrores.banco = 'Selecciona un banco'
            if (!pagoMovil.telefono || pagoMovil.telefono.length !== 11) {
                nuevosErrores.telefono = 'Teléfono debe tener 11 dígitos'
            }
            if (!pagoMovil.cedula || pagoMovil.cedula.length < 7) {
                nuevosErrores.cedula = 'Cédula inválida'
            }
            if (!pagoMovil.referencia || pagoMovil.referencia.length < 4) {
                nuevosErrores.referencia = 'Referencia inválida'
            }
        } else if (metodoSeleccionado === 'visa') {
            if (!visa.numeroTarjeta || visa.numeroTarjeta.replace(/\s/g, '').length !== 16) {
                nuevosErrores.numeroTarjeta = 'Número de tarjeta inválido'
            }
            if (!visa.nombreTitular || visa.nombreTitular.length < 3) {
                nuevosErrores.nombreTitular = 'Nombre del titular requerido'
            }
            if (!visa.fechaExpiracion || !/^\d{2}\/\d{2}$/.test(visa.fechaExpiracion)) {
                nuevosErrores.fechaExpiracion = 'Formato MM/AA'
            }
            if (!visa.cvv || visa.cvv.length !== 3) {
                nuevosErrores.cvv = 'CVV debe tener 3 dígitos'
            }
        } else if (metodoSeleccionado === 'transferencia') {
            if (!transferencia.bancoOrigen) nuevosErrores.bancoOrigen = 'Selecciona banco origen'
            if (!transferencia.bancoDestino) nuevosErrores.bancoDestino = 'Selecciona banco destino'
            if (!transferencia.numeroCuenta || transferencia.numeroCuenta.length !== 20) {
                nuevosErrores.numeroCuenta = 'Cuenta debe tener 20 dígitos'
            }
            if (!transferencia.cedula || transferencia.cedula.length < 7) {
                nuevosErrores.cedula = 'Cédula inválida'
            }
            if (!transferencia.referencia || transferencia.referencia.length < 4) {
                nuevosErrores.referencia = 'Referencia inválida'
            }
        } else if (metodoSeleccionado === 'paypal') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!paypal.email || !emailRegex.test(paypal.email)) {
                nuevosErrores.email = 'Email inválido'
            }
            if (!paypal.nombreCompleto || paypal.nombreCompleto.length < 3) {
                nuevosErrores.nombreCompleto = 'Nombre completo requerido'
            }
        }

        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const handleProcesarPago = async (e) => {
        e.preventDefault()

        if (!validarFormulario()) {
            return
        }

        setProcesando(true)

        // Simular procesamiento
        setTimeout(() => {
            // Generate invoice
            const purchasedItems = isCartPurchase ? cartItems : [{
                ...course,
                plan: planData
            }]
            
            const paymentDetails = {
                method: metodoSeleccionado,
                details: metodoSeleccionado === 'pago-movil' ? pagoMovil : 
                        metodoSeleccionado === 'visa' ? visa : 
                        metodoSeleccionado === 'transferencia' ? transferencia : paypal,
                reference: metodoSeleccionado === 'pago-movil' || metodoSeleccionado === 'transferencia' 
                    ? (metodoSeleccionado === 'pago-movil' ? pagoMovil.referencia : transferencia.referencia)
                    : 'N/A'
            }
            
            const customerInfo = {
                name: metodoSeleccionado === 'paypal' ? paypal.nombreCompleto : 'Cliente',
                email: metodoSeleccionado === 'paypal' ? paypal.email : '',
                identification: metodoSeleccionado === 'pago-movil' ? pagoMovil.cedula : 
                               metodoSeleccionado === 'transferencia' ? transferencia.cedula : ''
            }
            
            const invoice = generateInvoice(purchasedItems, paymentDetails, customerInfo)
            saveInvoice(invoice)
            
            // Clear cart if it was a cart purchase
            if (isCartPurchase) {
                clearCart()
            }
            
            setProcesando(false)
            
            // Navigate to invoice page
            navigate(`/factura/${invoice.id}`)
        }, 2000)
    }

    const metodosPago = [
        {
            id: 'pago-movil',
            nombre: 'Pago Móvil',
            icono: Smartphone,
            descripcion: 'Pago instantáneo desde tu banco',
            color: 'from-blue-500 to-blue-700'
        },
        {
            id: 'visa',
            nombre: 'Tarjeta Visa',
            icono: CreditCard,
            descripcion: 'Tarjeta de crédito o débito',
            color: 'from-purple-500 to-purple-700'
        },
        {
            id: 'paypal',
            nombre: 'PayPal',
            icono: Wallet,
            descripcion: 'Pago seguro con PayPal',
            color: 'from-yellow-500 to-orange-600'
        },
        {
            id: 'transferencia',
            nombre: 'Transferencia',
            icono: Building2,
            descripcion: 'Transferencia bancaria nacional',
            color: 'from-green-500 to-green-700'
        }
    ]

    // Formateo de número de tarjeta
    const formatearNumeroTarjeta = (valor) => {
        const solo_numeros = valor.replace(/\D/g, '')
        const grupos = solo_numeros.match(/.{1,4}/g)
        return grupos ? grupos.join(' ') : solo_numeros
    }

    if ((!isCartPurchase && (!course || !planData)) || (isCartPurchase && cartItems.length === 0)) {
        return null
    }
    
    // Calculate total for display
    const displayTotal = isCartPurchase ? totalAmount : planData?.price

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Header />

                <div className="container mx-auto px-4 py-12">
                    {/* Notificación de éxito */}
                    <AnimatePresence>
                        {mostrarExito && (
                            <motion.div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
                                    initial={{ scale: 0.8, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.8, y: 20 }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                    >
                                        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold mb-2 text-green-500">¡Pago Exitoso!</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Tu transacción ha sido procesada correctamente
                                    </p>
                                    <div className="bg-muted rounded-lg p-4 mb-4">
                                        <p className="text-sm text-muted-foreground mb-1">Curso adquirido</p>
                                        <p className="font-semibold">{course.title}</p>
                                        <p className="text-sm text-muted-foreground mt-2">Plan: {planData.name}</p>
                                        <p className="text-2xl font-bold text-primary mt-2">${planData.price}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Redirigiendo en 3 segundos...
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="max-w-6xl mx-auto">
                        {/* Header de pago */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-4xl font-bold mb-2">Finalizar Compra</h1>
                            <p className="text-muted-foreground">Selecciona tu método de pago preferido</p>
                            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                                <Lock className="w-4 h-4" />
                                <span>Pago seguro y encriptado</span>
                            </div>
                        </motion.div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Área de métodos de pago */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Selector de métodos */}
                                <motion.div
                                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {metodosPago.map((metodo) => {
                                        const Icono = metodo.icono
                                        return (
                                            <button
                                                key={metodo.id}
                                                onClick={() => setMetodoSeleccionado(metodo.id)}
                                                className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                                                    metodoSeleccionado === metodo.id
                                                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                                        : 'border-border bg-card hover:border-primary/50'
                                                }`}
                                            >
                                                {metodoSeleccionado === metodo.id && (
                                                    <div className="absolute top-2 right-2">
                                                        <CheckCircle2 className="w-5 h-5 text-primary fill-primary" />
                                                    </div>
                                                )}
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${metodo.color} flex items-center justify-center mx-auto mb-2`}>
                                                    <Icono className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-semibold text-sm mb-1">{metodo.nombre}</h3>
                                                <p className="text-xs text-muted-foreground">{metodo.descripcion}</p>
                                            </button>
                                        )
                                    })}
                                </motion.div>

                                {/* Formularios */}
                                <motion.div
                                    className="bg-card border border-border rounded-2xl p-6 shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <form onSubmit={handleProcesarPago}>
                                        <AnimatePresence mode="wait">
                                            {/* Formulario Pago Móvil */}
                                            {metodoSeleccionado === 'pago-movil' && (
                                                <motion.div
                                                    key="pago-movil"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-4"
                                                >
                                                    <h3 className="text-xl font-bold mb-4">Datos de Pago Móvil</h3>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Banco</label>
                                                        <select
                                                            value={pagoMovil.banco}
                                                            onChange={(e) => setPagoMovil({...pagoMovil, banco: e.target.value})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.banco ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        >
                                                            <option value="">Selecciona tu banco</option>
                                                            {bancos.map(banco => (
                                                                <option key={banco} value={banco}>{banco}</option>
                                                            ))}
                                                        </select>
                                                        {errores.banco && <p className="text-red-500 text-xs mt-1">{errores.banco}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Teléfono</label>
                                                        <input
                                                            type="tel"
                                                            placeholder="04XX-XXXXXXX"
                                                            value={pagoMovil.telefono}
                                                            onChange={(e) => setPagoMovil({...pagoMovil, telefono: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.telefono ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Cédula</label>
                                                        <input
                                                            type="text"
                                                            placeholder="V-12345678"
                                                            value={pagoMovil.cedula}
                                                            onChange={(e) => setPagoMovil({...pagoMovil, cedula: e.target.value})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.cedula ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.cedula && <p className="text-red-500 text-xs mt-1">{errores.cedula}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Referencia</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Número de referencia"
                                                            value={pagoMovil.referencia}
                                                            onChange={(e) => setPagoMovil({...pagoMovil, referencia: e.target.value})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.referencia ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.referencia && <p className="text-red-500 text-xs mt-1">{errores.referencia}</p>}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Formulario Visa */}
                                            {metodoSeleccionado === 'visa' && (
                                                <motion.div
                                                    key="visa"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-4"
                                                >
                                                    <h3 className="text-xl font-bold mb-4">Datos de la Tarjeta</h3>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Número de Tarjeta</label>
                                                        <input
                                                            type="text"
                                                            placeholder="1234 5678 9012 3456"
                                                            value={visa.numeroTarjeta}
                                                            onChange={(e) => setVisa({...visa, numeroTarjeta: formatearNumeroTarjeta(e.target.value).slice(0, 19)})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.numeroTarjeta ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.numeroTarjeta && <p className="text-red-500 text-xs mt-1">{errores.numeroTarjeta}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Nombre del Titular</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Como aparece en la tarjeta"
                                                            value={visa.nombreTitular}
                                                            onChange={(e) => setVisa({...visa, nombreTitular: e.target.value.toUpperCase()})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.nombreTitular ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.nombreTitular && <p className="text-red-500 text-xs mt-1">{errores.nombreTitular}</p>}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">Fecha de Expiración</label>
                                                            <input
                                                                type="text"
                                                                placeholder="MM/AA"
                                                                value={visa.fechaExpiracion}
                                                                onChange={(e) => {
                                                                    let val = e.target.value.replace(/\D/g, '')
                                                                    if (val.length >= 2) {
                                                                        val = val.slice(0, 2) + '/' + val.slice(2, 4)
                                                                    }
                                                                    setVisa({...visa, fechaExpiracion: val})
                                                                }}
                                                                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                    errores.fechaExpiracion ? 'border-red-500' : 'border-input'
                                                                }`}
                                                            />
                                                            {errores.fechaExpiracion && <p className="text-red-500 text-xs mt-1">{errores.fechaExpiracion}</p>}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">CVV</label>
                                                            <input
                                                                type="text"
                                                                placeholder="123"
                                                                value={visa.cvv}
                                                                onChange={(e) => setVisa({...visa, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                                                                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                    errores.cvv ? 'border-red-500' : 'border-input'
                                                                }`}
                                                            />
                                                            {errores.cvv && <p className="text-red-500 text-xs mt-1">{errores.cvv}</p>}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Formulario Transferencia */}
                                            {metodoSeleccionado === 'transferencia' && (
                                                <motion.div
                                                    key="transferencia"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-4"
                                                >
                                                    <h3 className="text-xl font-bold mb-4">Datos de Transferencia</h3>
                                                    
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">Banco Origen</label>
                                                            <select
                                                                value={transferencia.bancoOrigen}
                                                                onChange={(e) => setTransferencia({...transferencia, bancoOrigen: e.target.value})}
                                                                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                    errores.bancoOrigen ? 'border-red-500' : 'border-input'
                                                                }`}
                                                            >
                                                                <option value="">Selecciona banco</option>
                                                                {bancos.map(banco => (
                                                                    <option key={banco} value={banco}>{banco}</option>
                                                                ))}
                                                            </select>
                                                            {errores.bancoOrigen && <p className="text-red-500 text-xs mt-1">{errores.bancoOrigen}</p>}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">Banco Destino</label>
                                                            <select
                                                                value={transferencia.bancoDestino}
                                                                onChange={(e) => setTransferencia({...transferencia, bancoDestino: e.target.value})}
                                                                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                    errores.bancoDestino ? 'border-red-500' : 'border-input'
                                                                }`}
                                                            >
                                                                <option value="">Selecciona banco</option>
                                                                {bancos.map(banco => (
                                                                    <option key={banco} value={banco}>{banco}</option>
                                                                ))}
                                                            </select>
                                                            {errores.bancoDestino && <p className="text-red-500 text-xs mt-1">{errores.bancoDestino}</p>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Número de Cuenta</label>
                                                        <input
                                                            type="text"
                                                            placeholder="01020123456789012345"
                                                            value={transferencia.numeroCuenta}
                                                            onChange={(e) => setTransferencia({...transferencia, numeroCuenta: e.target.value.replace(/\D/g, '').slice(0, 20)})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.numeroCuenta ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.numeroCuenta && <p className="text-red-500 text-xs mt-1">{errores.numeroCuenta}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Cédula del Titular</label>
                                                        <input
                                                            type="text"
                                                            placeholder="V-12345678"
                                                            value={transferencia.cedula}
                                                            onChange={(e) => setTransferencia({...transferencia, cedula: e.target.value})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.cedula ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.cedula && <p className="text-red-500 text-xs mt-1">{errores.cedula}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Número de Referencia</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Referencia de la transferencia"
                                                            value={transferencia.referencia}
                                                            onChange={(e) => setTransferencia({...transferencia, referencia: e.target.value})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.referencia ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.referencia && <p className="text-red-500 text-xs mt-1">{errores.referencia}</p>}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Formulario PayPal */}
                                            {metodoSeleccionado === 'paypal' && (
                                                <motion.div
                                                    key="paypal"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-4"
                                                >
                                                    <h3 className="text-xl font-bold mb-4">Pagar con PayPal</h3>
                                                    
                                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                                                        <div className="flex items-start gap-3">
                                                            <Wallet className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm font-semibold mb-1">Pago rápido y seguro</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Serás redirigido a PayPal para completar tu pago de forma segura
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Email de PayPal</label>
                                                        <input
                                                            type="email"
                                                            placeholder="tu@email.com"
                                                            value={paypal.email}
                                                            onChange={(e) => setPaypal({...paypal, email: e.target.value.toLowerCase()})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.email ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Como aparece en tu cuenta PayPal"
                                                            value={paypal.nombreCompleto}
                                                            onChange={(e) => setPaypal({...paypal, nombreCompleto: e.target.value})}
                                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                                                errores.nombreCompleto ? 'border-red-500' : 'border-input'
                                                            }`}
                                                        />
                                                        {errores.nombreCompleto && <p className="text-red-500 text-xs mt-1">{errores.nombreCompleto}</p>}
                                                    </div>

                                                    <div className="bg-muted rounded-lg p-4 mt-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ShieldCheck className="w-4 h-4 text-primary" />
                                                            <p className="text-sm font-semibold">Compra protegida</p>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            PayPal protege tus compras. Si hay un problema, te ayudamos.
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <Button
                                            type="submit"
                                            disabled={procesando}
                                            className="w-full mt-6 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 disabled:opacity-50"
                                        >
                                            {procesando ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Procesando...
                                                </span>
                                            ) : (
                                                'Confirmar Pago'
                                            )}
                                        </Button>
                                    </form>
                                </motion.div>
                            </div>

                            {/* Resumen del pedido */}
                            <motion.div
                                className="lg:col-span-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg sticky top-24">
                                    <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>
                                    
                                    {isCartPurchase ? (
                                        // Display cart items
                                        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                                            {cartItems.map((item, index) => (
                                                <div key={index} className="flex gap-3 pb-3 border-b border-border last:border-0">
                                                    <img
                                                        src={item.image || '/placeholder.svg'}
                                                        alt={item.title}
                                                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.title}</h4>
                                                        <p className="text-xs text-muted-foreground mb-1">Plan {item.plan?.name || 'Básico'}</p>
                                                        <p className="text-sm font-bold text-primary">
                                                            ${item.plan?.price || item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Display single course
                                        <div className="space-y-4">
                                            <div>
                                                <img
                                                    src={course.image}
                                                    alt={course.title}
                                                    className="w-full h-32 object-cover rounded-lg mb-3"
                                                />
                                                <h4 className="font-semibold">{course.title}</h4>
                                                <p className="text-sm text-muted-foreground">Por {course.instructor}</p>
                                            </div>

                                            <div className="border-t border-border pt-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-muted-foreground">Plan</span>
                                                    <span className="font-semibold">{planData.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-muted-foreground">Duración</span>
                                                    <span className="text-sm">{planData.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t border-border pt-4 mt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>${displayTotal}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">${displayTotal}</span>
                                        </div>
                                    </div>

                                    <div className="bg-primary/10 rounded-lg p-3 flex items-start gap-2 mt-4">
                                        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-muted-foreground">
                                            Tus datos están protegidos con encriptación de nivel bancario
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </PageTransition>
    )
}

export default Payment
