/**
 * @typedef {Object} Invoice
 * @property {string} id - Unique invoice ID
 * @property {string} invoiceNumber - Human-readable invoice number
 * @property {Date} date - Invoice date
 * @property {Array} items - Purchased items
 * @property {Object} paymentInfo - Payment information
 * @property {number} total - Total amount
 * @property {string} status - Invoice status (paid, pending, cancelled)
 */

const INVOICE_STORAGE_KEY = 'nextlevel_invoices'
const INVOICE_COUNTER_KEY = 'nextlevel_invoice_counter'

/**
 * Generate a unique invoice number
 * Format: NL-YYYY-XXXXX
 */
const generateInvoiceNumber = () => {
    try {
        const year = new Date().getFullYear()
        const counter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '0') + 1
        localStorage.setItem(INVOICE_COUNTER_KEY, counter.toString())
        
        const paddedCounter = counter.toString().padStart(5, '0')
        return `NL-${year}-${paddedCounter}`
    } catch (error) {
        console.error('Error generating invoice number:', error)
        return `NL-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`
    }
}

/**
 * Generate invoice from cart items and payment info
 * @param {Array} cartItems - Items purchased
 * @param {Object} paymentInfo - Payment information
 * @param {Object} customerInfo - Customer information (optional)
 * @returns {Invoice}
 */
export const generateInvoice = (cartItems, paymentInfo, customerInfo = {}) => {
    const invoice = {
        id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        invoiceNumber: generateInvoiceNumber(),
        date: new Date().toISOString(),
        items: cartItems.map(item => ({
            courseId: item.id,
            title: item.title,
            instructor: item.instructor,
            plan: item.plan,
            price: parseFloat(item.plan?.price || item.price),
            originalPrice: parseFloat(item.plan?.originalPrice || item.originalPrice || 0)
        })),
        subtotal: cartItems.reduce((sum, item) => sum + parseFloat(item.plan?.price || item.price), 0),
        discount: cartItems.reduce((sum, item) => {
            const original = item.plan?.originalPrice || item.originalPrice || 0
            const current = item.plan?.price || item.price
            return sum + (original - current)
        }, 0),
        total: cartItems.reduce((sum, item) => sum + parseFloat(item.plan?.price || item.price), 0),
        paymentInfo: {
            method: paymentInfo.method,
            details: paymentInfo.details,
            reference: paymentInfo.reference || 'N/A'
        },
        customerInfo: {
            name: customerInfo.name || 'Cliente',
            email: customerInfo.email || '',
            phone: customerInfo.phone || '',
            identification: customerInfo.identification || ''
        },
        status: 'paid',
        createdAt: new Date().toISOString()
    }
    
    return invoice
}

/**
 * Save invoice to localStorage
 * @param {Invoice} invoice
 */
export const saveInvoice = (invoice) => {
    try {
        const invoices = getAllInvoices()
        invoices.push(invoice)
        localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices))
        return true
    } catch (error) {
        console.error('Error saving invoice:', error)
        return false
    }
}

/**
 * Get all invoices from localStorage
 * @returns {Invoice[]}
 */
export const getAllInvoices = () => {
    try {
        const invoices = localStorage.getItem(INVOICE_STORAGE_KEY)
        return invoices ? JSON.parse(invoices) : []
    } catch (error) {
        console.error('Error loading invoices:', error)
        return []
    }
}

/**
 * Get invoice by ID
 * @param {string} invoiceId
 * @returns {Invoice|null}
 */
export const getInvoiceById = (invoiceId) => {
    try {
        const invoices = getAllInvoices()
        return invoices.find(inv => inv.id === invoiceId) || null
    } catch (error) {
        console.error('Error getting invoice:', error)
        return null
    }
}

/**
 * Get invoice by invoice number
 * @param {string} invoiceNumber
 * @returns {Invoice|null}
 */
export const getInvoiceByNumber = (invoiceNumber) => {
    try {
        const invoices = getAllInvoices()
        return invoices.find(inv => inv.invoiceNumber === invoiceNumber) || null
    } catch (error) {
        console.error('Error getting invoice:', error)
        return null
    }
}

/**
 * Delete invoice by ID
 * @param {string} invoiceId
 */
export const deleteInvoice = (invoiceId) => {
    try {
        const invoices = getAllInvoices()
        const filtered = invoices.filter(inv => inv.id !== invoiceId)
        localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(filtered))
        return true
    } catch (error) {
        console.error('Error deleting invoice:', error)
        return false
    }
}

/**
 * Format date for invoice display
 * @param {string|Date} date
 * @returns {string}
 */
export const formatInvoiceDate = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
