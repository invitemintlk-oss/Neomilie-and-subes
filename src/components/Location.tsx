import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Compass, Map, Church, PartyPopper } from 'lucide-react';
import { WEDDING } from '../config';

const venues = [
  {
    key: 'church',
    tab: 'Holy Mass',
    icon: Church,
    label: 'The Holy Mass • 9:30 AM',
    name: WEDDING.ceremony.venue,
    address: WEDDING.ceremony.city,
    quote: 'Join us as we exchange our vows before God and receive His blessing.',
    embed: WEDDING.ceremony.embed,
    link: WEDDING.ceremony.mapLink,
  },
  {
    key: 'reception',
    tab: 'Reception',
    icon: PartyPopper,
    label: 'Celebration to Follow',
    name: WEDDING.reception.venue,
    address: WEDDING.reception.address,
    quote: 'Celebrate with us as we begin our new chapter together.',
    embed: WEDDING.reception.embed,
    link: WEDDING.reception.mapLink,
  },
];

export const Location: React.FC = () => {
  const [active, setActive] = useState(0);
  const venue = venues[active];

  return (
    <div className="max-w-[85rem] mx-auto px-6 relative py-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-beige/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Venue switcher */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 bg-white/80 backdrop-blur rounded-full border border-brand-beige/30 shadow-sm">
          {venues.map((v, i) => (
            <button
              key={v.key}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                active === i ? 'bg-brand-beige-deep text-white shadow-md' : 'text-stone-500 hover:text-brand-beige-deep'
              }`}
            >
              <v.icon className="w-4 h-4" />
              {v.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
        {/* Left Interactive Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="w-full lg:w-[45%] z-20"
        >
          <div className="bg-white/90 backdrop-blur-2xl p-10 sm:p-14 lg:p-16 rounded-[2.5rem] shadow-[0_30px_60px_rgba(176,137,104,0.15)] border border-brand-beige/30 lg:translate-x-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-champagne via-brand-beige to-brand-beige-deep" />

            <div className="mb-10 relative z-10">
              <div className="inline-flex items-center gap-4 mb-6">
                <span className="text-brand-beige-deep uppercase tracking-[0.5em] text-[10px] sm:text-[11px] font-bold drop-shadow-sm">
                  The Venues
                </span>
                <div className="w-16 h-[1px] bg-gradient-to-r from-brand-beige-deep/60 to-transparent" />
              </div>

              <h2 className="text-5xl sm:text-6xl font-display text-stone-800 mb-6 leading-tight drop-shadow-sm">
                Where We <br />
                <span className="italic font-light text-brand-beige-deep">Celebrate</span>
              </h2>

              <AnimatePresence mode="wait">
                <motion.div
                  key={venue.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-5 mt-10"
                >
                  <div className="w-12 h-12 bg-stone-50 rounded-full border border-brand-beige/40 shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="text-brand-beige-deep w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-beige-deep mb-2">{venue.label}</p>
                    <p className="text-2xl font-serif text-stone-800 mb-1">{venue.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-stone-400 leading-relaxed mb-6">{venue.address}</p>

                    <p className="text-stone-500/90 italic font-serif text-lg leading-relaxed max-w-sm mb-10 pl-4 border-l-[1.5px] border-brand-beige/40">
                      "{venue.quote}"
                    </p>

                    <a
                      href={venue.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-stone-800 text-brand-champagne px-8 py-4 rounded-full font-sans tracking-[0.2em] text-xs uppercase hover:bg-stone-900 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-95 group/btn"
                    >
                      <Navigation className="w-4 h-4 text-brand-gold group-hover/btn:rotate-45 transition-transform duration-300" />
                      Open in Google Maps
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <Compass className="absolute -bottom-16 -right-16 w-64 h-64 text-brand-beige/5 rotate-12 group-hover:rotate-45 transition-transform duration-[3s]" />
          </div>
        </motion.div>

        {/* Right Map Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="w-full lg:w-[65%] h-[450px] sm:h-[600px] lg:h-[700px] relative z-10"
        >
          <div className="absolute -inset-4 sm:-inset-6 border-[2px] border-brand-beige/30 rounded-[3rem] -z-10 translate-x-2 sm:translate-x-4 translate-y-2 sm:translate-y-4" />

          <div className="w-full h-full rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[8px] sm:border-[12px] border-white relative group/map">
            <div className="absolute inset-0 bg-brand-beige/10 mix-blend-multiply pointer-events-none z-20 group-hover/map:opacity-0 transition-opacity duration-1000" />

            <iframe
              key={venue.key}
              title={`${venue.name} Location`}
              src={venue.embed}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.1) saturate(1.2)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover/map:grayscale-0 transition-all duration-1000 ease-in-out"
            />

            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-brand-beige/30 shadow-lg flex items-center gap-2 pointer-events-none z-30">
              <Map className="w-4 h-4 text-brand-beige-deep animate-pulse" />
              <span className="text-[9px] uppercase tracking-widest font-bold text-stone-600">{venue.tab}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
