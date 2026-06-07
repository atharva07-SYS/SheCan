import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 } },
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-rose-900 animate-gradient" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute top-40 right-20 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-400/8 rounded-full blur-[80px] animate-float" style={{ animationDelay: '6s' }} />

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column — Text */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="mb-8">
              <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-purple-300/80">
                <span className="w-8 h-px bg-purple-400/50" />
                Empowering Women Since 2020
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.5rem] text-white leading-[1.1] tracking-tight"
            >
              Empowering Women,
              <br />
              <em className="bg-gradient-to-r from-purple-300 via-pink-300 to-rose-400 bg-clip-text text-transparent">
                Transforming Lives.
              </em>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-purple-200/80 max-w-xl mt-8 leading-relaxed font-light"
            >
              She Can Foundation is dedicated to creating opportunities for women
              through education, mentorship, and community programs. Join us in
              building a world where every woman can thrive.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/volunteer"
                className="group inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-base tracking-wide shadow-2xl shadow-black/20 hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Involved
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 border border-white/20 text-white/90 px-8 py-4 rounded-full font-medium text-base tracking-wide hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                Contact Us
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="mt-16 flex flex-wrap gap-10 md:gap-16"
            >
              {[
                { value: '10K+', label: 'Women Empowered' },
                { value: '50+', label: 'Programs' },
                { value: '500+', label: 'Volunteers' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl md:text-5xl font-serif font-medium text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-purple-300/60 mt-2 tracking-wide uppercase font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column — Images */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            className="relative hidden lg:block h-full min-h-[600px] w-full"
          >
            {/* Image 1 (Back, offset right) */}
            <div className="absolute top-0 right-0 w-[80%] h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/50 border border-white/10 z-10">
              <img 
                src="/images/hero2.png" 
                alt="Women collaborating" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay"></div>
            </div>

            {/* Image 2 (Front, offset left & down) */}
            <div className="absolute bottom-0 left-0 w-[70%] h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 z-20 translate-y-12">
              <img 
                src="/images/hero1.png" 
                alt="Confident woman" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay"></div>
            </div>

            {/* Floating decorative glass card */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 -left-12 z-30 glass-light dark:glass px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/20 backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 flex items-center justify-center text-white font-serif text-xl">
                &ldquo;
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Impact Verified</div>
                <div className="text-xs text-purple-200/80">Changing lives since 2020</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
