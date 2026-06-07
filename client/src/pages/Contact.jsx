import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, FileText, MessageSquare, Send, CheckCircle, MapPin, Clock, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const categories = [
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Donation', label: 'Donation' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'General Inquiry', label: 'General Inquiry' },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', subject: '', category: '', message: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [inquiryId, setInquiryId] = useState('')

  const validate = (data) => {
    const errs = {}
    if (!data.fullName.trim()) errs.fullName = 'Full name is required'
    if (!data.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Invalid email format'
    if (data.phone && !/^[+]?[\d\s-]{7,15}$/.test(data.phone)) errs.phone = 'Invalid phone format'
    if (!data.subject.trim()) errs.subject = 'Subject is required'
    if (!data.category) errs.category = 'Please select a category'
    if (!data.message.trim()) errs.message = 'Message is required'
    else if (data.message.trim().length < 10) errs.message = 'Message must be at least 10 characters'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const errs = validate({ ...formData, [name]: value })
      setErrors(prev => ({ ...prev, [name]: errs[name] || '' }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const errs = validate(formData)
    setErrors(prev => ({ ...prev, [name]: errs[name] || '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(formData)
    setErrors(errs)
    setTouched({ fullName: true, email: true, phone: true, subject: true, category: true, message: true })
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/contact', formData)
      setInquiryId(res.data.inquiryId || res.data.data?.inquiryId || 'N/A')
      setIsSubmitted(true)
      toast.success('Message sent successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ fullName: '', email: '', phone: '', subject: '', category: '', message: '' })
    setErrors({})
    setTouched({})
    setIsSubmitted(false)
    setInquiryId('')
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Have a question or want to get involved? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass-light rounded-2xl p-8">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Your inquiry has been submitted successfully.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Your Inquiry ID:</p>
                    <p className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400 mb-6">{inquiryId}</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">We'll get back to you within 24 hours.</p>
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
                            placeholder="John Doe"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                          />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                            placeholder="john@example.com"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                            placeholder="+91 98765 43210"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subject <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input name="subject" value={formData.subject} onChange={handleChange} onBlur={handleBlur}
                            placeholder="How can we help?"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.subject ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                          />
                        </div>
                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select name="category" value={formData.category} onChange={handleChange} onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-xl border appearance-none cursor-pointer ${errors.category ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                        <textarea name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur}
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border min-h-[120px] resize-none ${errors.message ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                        />
                      </div>
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-purple-600 to-rose-600 rounded-2xl p-8 text-white h-full relative overflow-hidden">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Let's Connect</h3>
                <p className="text-purple-100 mb-8">
                  Whether you want to volunteer, donate, or partner with us, we're here to help make it happen.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Email</p>
                      <p className="font-medium">info@shecanfoundation.org</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Phone</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Address</p>
                      <p className="font-medium">Mumbai, Maharashtra, India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Hours</p>
                      <p className="font-medium">Mon - Sat: 9AM - 6PM</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-sm text-purple-200">✨ We typically respond within 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
