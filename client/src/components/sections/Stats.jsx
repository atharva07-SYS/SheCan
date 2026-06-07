import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Users, Globe } from 'lucide-react';

const statsData = [
  { icon: Heart, value: 10000, suffix: '+', label: 'Women Empowered' },
  { icon: BookOpen, value: 50, suffix: '+', label: 'Programs Running' },
  { icon: Users, value: 500, suffix: '+', label: 'Active Volunteers' },
  { icon: Globe, value: 25, suffix: '+', label: 'Communities Reached' },
];

const marqueeItems = [
  'Education', 'Leadership', 'Mentorship', 'Entrepreneurship',
  'Digital Literacy', 'Community', 'Career Growth', 'Empowerment',
];

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

const CountUp = ({ target, suffix }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState('0');
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 2000;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOutQuart(progress) * target);
      setDisplay(current.toLocaleString());
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(target.toLocaleString());
    };
    requestAnimationFrame(step);
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { animate(); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return <span ref={ref}>{display}{suffix}</span>;
};

const Stats = () => {
  return (
    <>
      {/* Marquee strip */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Stats section */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-rose-950" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.2em] uppercase text-purple-300/60">
              <span className="w-8 h-px bg-purple-400/30" />
              The Proof
            </span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mt-5 leading-tight">
              Real numbers.<br />
              <em className="text-purple-300">Real impact.</em>
            </h2>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {statsData.map(({ icon: Icon, value, suffix, label }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto mb-5 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-purple-300" />
                </div>
                <div className="font-serif text-5xl md:text-6xl font-medium text-white tracking-tight">
                  <CountUp target={value} suffix={suffix} />
                </div>
                <div className="text-purple-300/50 mt-3 text-sm tracking-wider uppercase font-medium">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Stats;
