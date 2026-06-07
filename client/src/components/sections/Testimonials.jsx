import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: 'She Can Foundation changed my life completely. The education and mentorship I received gave me the confidence to pursue my dreams and start my own business. I went from having no direction to building something meaningful.',
    name: 'Priya Sharma',
    role: 'Program Graduate',
    initials: 'P',
    color: 'bg-purple-600',
  },
  {
    quote: 'The leadership program helped me discover strengths I never knew I had. Volunteering here has been the most rewarding experience of my life. I\'ve grown more in one year than in the previous five.',
    name: 'Anita Desai',
    role: 'Volunteer',
    initials: 'A',
    color: 'bg-rose-600',
  },
  {
    quote: 'As a partner organization, we have seen firsthand the incredible impact She Can Foundation has on communities. Their programs are thoughtful, inclusive, and genuinely transformative.',
    name: 'Meera Patel',
    role: 'Partner NGO Director',
    initials: 'M',
    color: 'bg-amber-600',
  },
  {
    quote: 'The skills I learned through their entrepreneurship program allowed me to launch a successful startup. From zero confidence to a registered company — She Can made it real.',
    name: 'Kavita Reddy',
    role: 'Entrepreneur',
    initials: 'K',
    color: 'bg-emerald-600',
  },
];

const variants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const current = testimonials[currentIndex];

  return (
    <section className="py-28 md:py-36 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Stories</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mt-4 text-gray-900 dark:text-white"
          >
            Words from people<br />
            who <em>came back.</em>
          </motion.h2>
        </div>

        {/* Testimonial card */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Featured quote — large card */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12 relative min-h-[320px] flex flex-col justify-between shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className="font-serif text-6xl text-purple-200 dark:text-purple-800 mb-4 leading-none">&ldquo;</div>
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                    {current.quote}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${current.color} flex items-center justify-center text-white font-semibold text-lg`}>
                    {current.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-base">{current.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{current.role}</div>
                  </div>
                </div>

                {/* Stars */}
                <div className="text-amber-400 tracking-wider text-lg hidden sm:block">★★★★★</div>
              </div>
            </div>
          </div>

          {/* Right side — navigation + info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={goPrev}
                className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 transition-all cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 transition-all cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-base text-gray-400 dark:text-gray-500 ml-3 font-mono">
                {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-purple-600 w-8'
                      : 'bg-gray-200 dark:bg-gray-700 w-4 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Mini testimonial cards */}
            {testimonials.filter((_, i) => i !== currentIndex).slice(0, 2).map((t, i) => (
              <div
                key={t.name}
                onClick={() => setCurrentIndex(testimonials.indexOf(t))}
                className="p-5 bg-white dark:bg-gray-900 rounded-xl cursor-pointer hover:shadow-md transition-all group border border-gray-100 dark:border-gray-800"
              >
                <p className="text-[15px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  &ldquo;{t.quote.substring(0, 80)}...&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-semibold`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</div>
                    <div className="text-[10px] text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
