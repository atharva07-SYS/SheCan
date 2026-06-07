import { motion } from 'framer-motion';
import { BookOpen, Users, TrendingUp, ArrowRight } from 'lucide-react';

const cards = [
  {
    num: '01',
    icon: BookOpen,
    title: 'Educate',
    description: 'Providing access to quality education, digital literacy programs, and scholarship opportunities to help women build a strong foundation for success.',
    accent: 'from-purple-500 to-violet-600',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    num: '02',
    icon: Users,
    title: 'Empower',
    description: 'Developing leadership skills, fostering self-confidence, and creating support networks that enable women to take charge of their own futures.',
    accent: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Elevate',
    description: 'Advancing careers through mentorship, entrepreneurship training, and connecting women with industry leaders for meaningful growth.',
    accent: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const Mission = () => {
  return (
    <section id="mission" className="py-28 md:py-36 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header — editorial style */}
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Our Philosophy</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-title mt-5 text-gray-900 dark:text-white"
          >
            Change that starts with<br />
            <em>believing she can.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 mt-6 leading-relaxed max-w-lg text-base md:text-lg"
          >
            We believe in the transformative power of education, community, and
            opportunity. Our three-pillar approach creates lasting change.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.12 }}
                className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 lg:p-10 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 cursor-default overflow-hidden"
              >
                {/* Gradient accent bar at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Number */}
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-300 dark:text-gray-700 mb-6 block">
                  {card.num}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Mission;
