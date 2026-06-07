import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    question: 'How can I volunteer with She Can Foundation?',
    answer: 'You can volunteer by visiting our Volunteer page and filling out the registration form. We offer various opportunities including mentoring, teaching, event coordination, and community outreach. Our team will reach out to you within 48 hours of your application.',
  },
  {
    question: 'How can I make a donation?',
    answer: 'We accept donations through our website via secure online payment, bank transfer, or UPI. All donations are tax-deductible under Section 80G. You can also set up recurring monthly donations to support our ongoing programs.',
  },
  {
    question: 'What programs does She Can Foundation offer?',
    answer: 'We offer a range of programs including digital literacy workshops, leadership development courses, entrepreneurship training, career mentorship, financial literacy classes, and community building events.',
  },
  {
    question: 'Who is eligible to participate?',
    answer: 'Our programs are open to all women and girls aged 16 and above, regardless of educational background or socioeconomic status. Some specialized programs may have specific eligibility criteria.',
  },
  {
    question: 'How can my organization partner with She Can Foundation?',
    answer: 'We welcome partnerships with corporations, NGOs, educational institutions, and government bodies. Partners can collaborate through CSR initiatives, sponsorships, resource sharing, or co-hosted programs. Contact us at partnerships@shecanfoundation.org.',
  },
  {
    question: 'Does She Can Foundation organize events?',
    answer: 'Yes! We organize regular events including workshops, seminars, networking meetups, annual galas, and community drives. Follow us on social media or subscribe to our newsletter to stay updated.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-28 md:py-36 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Questions</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mt-4 text-gray-900 dark:text-white"
          >
            Things people<br />
            <em>ask us.</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* FAQ Accordion */}
          <div className="lg:col-span-3 space-y-3">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20'
                      : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center p-6 text-left cursor-pointer"
                  >
                    <span className="font-medium text-gray-900 dark:text-white pr-4 text-base">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Contact aside */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 sticky top-28">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-purple-600 dark:text-purple-400">
                Get in Touch
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white mt-3 mb-2">
                Still have questions?<br />We're here.
              </h3>
              <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                Our team responds within 24 hours. You can also call, email, or just walk in — we always have time for a question.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: MapPin, label: 'Mumbai', value: 'Maharashtra, India' },
                  { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                  { icon: Mail, label: 'Email', value: 'info@shecanfoundation.org' },
                  { icon: MessageCircle, label: 'Hours', value: 'Mon – Sat: 9AM – 6PM' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</div>
                      <div className="text-[15px] text-gray-700 dark:text-gray-300 font-medium">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-rose-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
