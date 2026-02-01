import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getInvoiceById, formatInvoiceDate } from '../lib/invoice'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PageTransition } from '../components/PageTransition'
import { motion } from 'framer-motion'
import { Printer, Download, CheckCircle2, Home } from 'lucide-react'

const Invoice = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [invoice, setInvoice] = useState(null)
    const [isPrinting, setIsPrinting] = useState(false)

    useEffect(() => {
        const loadedInvoice = getInvoiceById(id)
        if (!loadedInvoice) {
            navigate('/')
            return
        }
        setInvoice(loadedInvoice)
    }, [id, navigate])

    const handlePrint = () => {
        setIsPrinting(true)
        setTimeout(() => {
            window.print()
            setIsPrinting(false)
        }, 100)
    }

    if (!invoice) {
        return null
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <div className="no-print">
                    <Header />
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* Success Message - Solo en pantalla */}
                    <motion.div
                        className="no-print mb-8 bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold text-green-500 mb-2">¡Compra Exitosa!</h2>
                        <p className="text-muted-foreground">
                            Tu pago ha sido procesado correctamente. A continuación encuentras tu factura.
                        </p>
                    </motion.div>

                    {/* Botones de acción - Solo en pantalla */}
                    <div className="no-print flex justify-center gap-4 mb-8">
                        <Button
                            onClick={handlePrint}
                            disabled={isPrinting}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            {isPrinting ? 'Preparando...' : 'Imprimir Factura'}
                        </Button>
                        <Link to="/">
                            <Button variant="outline">
                                <Home className="w-4 h-4 mr-2" />
                                Volver al Inicio
                            </Button>
                        </Link>
                    </div>

                    {/* Factura - Se imprime y muestra en pantalla */}
                    <motion.div
                        className="bg-white shadow-2xl rounded-xl overflow-hidden max-w-4xl mx-auto print:shadow-none print:rounded-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Header de la factura */}
                        <div className="bg-gradient-to-r from-primary to-green-600 text-white p-8 print:bg-gradient-to-r">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">NextLevel</h1>
                                    <p className="text-sm opacity-90">Plataforma de Cursos Online</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-90">Factura</p>
                                    <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cuerpo de la factura */}
                        <div className="p-8 text-gray-900">
                            {/* Información y fecha */}
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">FACTURADO A:</h3>
                                    <p className="font-semibold text-lg">{invoice.customerInfo.name}</p>
                                    {invoice.customerInfo.email && (
                                        <p className="text-sm text-gray-600">{invoice.customerInfo.email}</p>
                                    )}
                                    {invoice.customerInfo.phone && (
                                        <p className="text-sm text-gray-600">{invoice.customerInfo.phone}</p>
                                    )}
                                    {invoice.customerInfo.identification && (
                                        <p className="text-sm text-gray-600">CI: {invoice.customerInfo.identification}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">INFORMACIÓN DE PAGO:</h3>
                                    <p className="text-sm"><span className="font-semibold">Fecha:</span> {formatInvoiceDate(invoice.date)}</p>
                                    <p className="text-sm"><span className="font-semibold">Método:</span> {invoice.paymentInfo.method}</p>
                                    <p className="text-sm"><span className="font-semibold">Referencia:</span> {invoice.paymentInfo.reference}</p>
                                    <Badge className="mt-2 bg-green-500">
                                        {invoice.status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Tabla de items */}
                            <div className="mb-8">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">DESCRIPCIÓN</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">PLAN</th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">PRECIO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-200">
                                                <td className="py-4 px-2">
                                                    <p className="font-semibold">{item.title}</p>
                                                    <p className="text-sm text-gray-600">Por {item.instructor}</p>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <p className="text-sm">{item.plan?.name || 'Básico'}</p>
                                                    <p className="text-xs text-gray-500">{item.plan?.duration}</p>
                                                </td>
                                                <td className="py-4 px-2 text-right">
                                                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                                                    {item.originalPrice > item.price && (
                                                        <p className="text-xs text-gray-500 line-through">
                                                            ${item.originalPrice.toFixed(2)}
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totales */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
                                    </div>
                                    {invoice.discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Descuento:</span>
                                            <span className="font-semibold">-${invoice.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-300">
                                        <span>TOTAL:</span>
                                        <span className="text-primary">${invoice.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                    ¡Gracias por tu compra! Disfruta de tus cursos en NextLevel
                                </p>
                                <p className="text-xs text-gray-500">
                                    Para cualquier consulta, contáctanos en soporte@nextlevel.com
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Información adicional - Solo en pantalla */}
                    <motion.div
                        className="no-print max-w-4xl mx-auto mt-8 bg-card border border-border rounded-xl p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="font-semibold mb-3">📚 Accede a tus cursos</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Puedes acceder a tus cursos en cualquier momento desde tu cuenta. Si tienes alguna pregunta, no dudes en contactarnos.
                        </p>
                        <div className="flex gap-3">
                            <Link to="/" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Ver mis cursos
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <div className="no-print">
                    <Footer />
                </div>
            </div>
        </PageTransition>
    )
}

export default Invoice
