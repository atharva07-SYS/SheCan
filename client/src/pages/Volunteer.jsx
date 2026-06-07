import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, BookOpen, CheckCircle, ArrowLeft, Heart } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const availabilityOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Weekends Only', label: 'Weekends Only' },
  { value: 'Flexible', label: 'Flexible' },
]

const interestOptions = ['Education', 'Healthcare', 'Technology', 'Community Development', 'Fundraising', 'Event Management']

export default function Volunteer() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', skills: '', availability: '', interests: []
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [inquiryId, setInquiryId] = useState('')

  const validate = (data) => {
    const errs = {}
    if (!data.fullName.trim()) errs.fullName = 'Full name is required'
    if (!data.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Invalid email'
    if (data.phone && !/^[+]?[\d\s-]{7,15}$/.test(data.phone)) errs.phone = 'Invalid phone'
    if (!data.skills.trim()) errs.skills = 'Please tell us about your skills'
    if (!data.availability) errs.availability = 'Please select availability'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(formData)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: `Volunteer Application - ${formData.availability}`,
        category: 'Volunteer',
        message: `Skills: ${formData.skills}\nAvailability: ${formData.availability}\nAreas of Interest: ${formData.interests.join(', ') || 'Not specified'}`
      }
      const res = await api.post('/contact', payload)
      setInquiryId(res.data.inquiryId || res.data.data?.inquiryId || 'N/A')
      setIsSubmitted(true)
      toast.success('Volunteer application submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ fullName: '', email: '', phone: '', skills: '', availability: '', interests: [] })
    setErrors({})
    setIsSubmitted(false)
    setInquiryId('')
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our <span className="gradient-text">Mission</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Become a volunteer and help us empower women across communities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <div className="glass-light rounded-2xl p-8">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Aboard!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Your volunteer application has been submitted.</p>
                    <p className="text-sm text-gray-500 mb-1">Reference ID:</p>
                    <p className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400 mb-6">{inquiryId}</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">We'll contact you soon with next steps.</p>
                    <button onClick={resetForm}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer">
                      <ArrowLeft className="w-4 h-4" /> Submit Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Volunteer Registration</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`} />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`} />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`} />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability <span className="text-rose-500">*</span></label>
                        <select name="availability" value={formData.availability} onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border appearance-none cursor-pointer ${errors.availability ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}>
                          <option value="" disabled>Select availability</option>
                          {availabilityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills & Experience <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                        <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Tell us about your skills, experience, and what motivates you..."
                          rows={4}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border min-h-[100px] resize-none ${errors.skills ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`} />
                      </div>
                      {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Areas of Interest</label>
                      <div className="flex flex-wrap gap-3">
                        {interestOptions.map(interest => (
                          <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              formData.interests.includes(interest)
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
                            }`}>
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                      {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Heart className="w-5 h-5" />}
                      {isSubmitting ? 'Submitting...' : 'Join as Volunteer'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
            <div className="bg-gradient-to-br from-purple-600 to-rose-600 rounded-2xl p-8 text-white h-full relative overflow-hidden">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Make a Difference</h3>
                <p className="text-purple-100 mb-8">Join our community of changemakers and help empower women across India.</p>
                <div className="space-y-4">
                  {['Gain hands-on experience', 'Network with like-minded people', 'Build leadership skills', 'Create lasting impact', 'Flexible scheduling'].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-200 flex-shrink-0" />
                      <span className="text-purple-100">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-sm text-purple-200">🌟 Join 500+ volunteers making a difference</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
