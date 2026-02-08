import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllInvoices } from '../lib/invoice'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { motion } from 'framer-motion'
import {
  Receipt,
  Calendar,
  DollarSign,
  CreditCard,
  Filter,
  Download,
  Eye,
  TrendingUp,
  Smartphone,
  Building2
} from 'lucide-react'

const PaymentHistory = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')

  if (!currentUser) {
    navigate('/login')
    return null
  }

  // Get all invoices
  const allInvoices = getAllInvoices()

  // Filter invoices by current user (if cedula matches)
  const userInvoices = allInvoices.filter(invoice => 
    invoice.customerInfo?.identification === currentUser.cedula
  )

  // Filter by payment method and month
  const filteredInvoices = useMemo(() => {
    let filtered = userInvoices

    // Filter by payment method
    if (selectedMethod !== 'all') {
      filtered = filtered.filter(invoice => invoice.paymentInfo?.method === selectedMethod)
    }

    // Filter by month
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.date)
        const month = invoiceDate.getMonth()
        return month === parseInt(selectedMonth)
      })
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [userInvoices, selectedMethod, selectedMonth])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = userInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const byMethod = userInvoices.reduce((acc, inv) => {
      const method = inv.paymentInfo?.method
      acc[method] = (acc[method] || 0) + inv.total
      return acc
    }, {})

    return {
      total,
      count: userInvoices.length,
      average: userInvoices.length > 0 ? total / userInvoices.length : 0,
      byMethod
    }
  }, [userInvoices])

  const getMethodIcon = (method) => {
    switch (method) {
      case 'pago-movil':
        return <Smartphone className="w-4 h-4" />
      case 'visa':
        return <CreditCard className="w-4 h-4" />
      case 'transferencia':
        return <Building2 className="w-4 h-4" />
      case 'paypal':
        return <DollarSign className="w-4 h-4" />
      default:
        return <Receipt className="w-4 h-4" />
    }
  }

  const getMethodLabel = (method) => {
    const labels = {
      'pago-movil': 'Pago Móvil',
      'visa': 'Tarjeta Visa',
      'transferencia': 'Transferencia',
      'paypal': 'PayPal'
    }
    return labels[method] || method
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const months = [
    { value: 'all', label: 'Todos los meses' },
    { value: '0', label: 'Enero' },
    { value: '1', label: 'Febrero' },
    { value: '2', label: 'Marzo' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Mayo' },
    { value: '5', label: 'Junio' },
    { value: '6', label: 'Julio' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Septiembre' },
    { value: '9', label: 'Octubre' },
    { value: '10', label: 'Noviembre' },
    { value: '11', label: 'Diciembre' }
  ]

  const paymentMethods = [
    { value: 'all', label: 'Todos los métodos' },
    { value: 'pago-movil', label: 'Pago Móvil' },
    { value: 'visa', label: 'Tarjeta Visa' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'paypal', label: 'PayPal' }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Historial de Pagos</h1>
              <p className="text-muted-foreground">
                Revisa todas tus transacciones y facturas
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-card border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total Gastado</span>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(stats.total)}</p>
              </motion.div>

              <motion.div
                className="bg-card border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-muted-foreground">Transacciones</span>
                </div>
                <p className="text-3xl font-bold">{stats.count}</p>
              </motion.div>

              <motion.div
                className="bg-card border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-muted-foreground">Promedio</span>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(stats.average)}</p>
              </motion.div>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Filtros</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Método de Pago</label>
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mes</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            {filteredInvoices.length > 0 ? (
              <div className="space-y-4">
                {filteredInvoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Invoice Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Receipt className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">Factura #{invoice.invoiceNumber}</h3>
                          <Badge variant="outline" className="gap-1">
                            {getMethodIcon(invoice.paymentInfo.method)}
                            {getMethodLabel(invoice.paymentInfo.method)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(invoice.date)}
                          </div>
                          <div>
                            {invoice.items.length} {invoice.items.length === 1 ? 'curso' : 'cursos'}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount and Actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Total</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(invoice.total)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/factura/${invoice.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-medium mb-2">Cursos:</p>
                      <div className="flex flex-wrap gap-2">
                        {invoice.items.map((item, idx) => (
                          <Badge key={idx} variant="secondary">
                            {item.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Receipt className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No se encontraron pagos
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedMethod !== 'all' || selectedMonth !== 'all'
                    ? 'Intenta ajustar los filtros'
                    : 'Aún no has realizado ninguna compra'}
                </p>
                {selectedMethod === 'all' && selectedMonth === 'all' && (
                  <Button onClick={() => navigate('/')}>
                    Explorar Cursos
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

export default PaymentHistory
