import { Link } from 'react-router-dom';
import { Heart, Globe, Mail, MessageCircle, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0e0d0b] text-gray-400 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Column 1 — Brand */}
          <div>
            <Link to="/" className="inline-flex items-baseline gap-1.5 group mb-4">
              <span className="font-serif text-2xl font-medium text-white group-hover:text-purple-400 transition-colors">
                She Can
              </span>
              <span className="text-xs font-semibold tracking-[0.12em] uppercase text-gray-600">
                Foundation
              </span>
            </Link>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6 mt-2">
              Empowering women through education, leadership, and opportunity.
              Together, we build a future where every woman can reach her full potential.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Heart, href: 'https://instagram.com', label: 'ig' },
                { icon: Globe, href: 'https://shecanfoundation.org', label: 'web' },
                { icon: Mail, href: 'mailto:info@shecanfoundation.org', label: 'mail' },
                { icon: MessageCircle, href: 'https://twitter.com', label: 'tw' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center hover:text-purple-400 hover:border-purple-800 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-5">Navigation</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/#mission', label: 'Our Mission' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/volunteer', label: 'Volunteer' },
                { to: '/#faq', label: 'FAQ' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-[15px] text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-5">Contact</h4>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: 'Mumbai, Maharashtra, India' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'info@shecanfoundation.org' },
                { icon: Clock, text: 'Mon – Sat: 9AM – 6PM' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-[15px] text-gray-500">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-5">Stay Connected</h4>
            <p className="text-[15px] text-gray-500 mb-5 leading-relaxed">
              Subscribe to our newsletter for impact stories, events, and opportunities.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-full bg-transparent border border-gray-800 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-600 transition-colors"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all flex-shrink-0 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/50 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2024 She Can Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
          </div>
          <p className="text-xs text-gray-700 hidden sm:block">
            Designed with intention.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
