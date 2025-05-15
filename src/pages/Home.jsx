import { useState } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  // Icon declarations
  const ClockIcon = getIcon('Clock');
  const CalendarIcon = getIcon('Calendar');
  const BellIcon = getIcon('Bell');
  const UserCheckIcon = getIcon('UserCheck');

  // Features data
  const features = [
    {
      title: "24/7 Booking",
      description: "Book appointments any time, day or night, without waiting for business hours",
      icon: ClockIcon
    },
    {
      title: "Smart Scheduling",
      description: "Find and book the perfect time slot that works for your busy schedule",
      icon: CalendarIcon
    },
    {
      title: "Instant Confirmations",
      description: "Receive immediate booking confirmations and reminders via email",
      icon: BellIcon
    },
    {
      title: "Easy Management",
      description: "View, reschedule or cancel your appointments with just a few clicks",
      icon: UserCheckIcon
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 md:mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Book Appointments Online with Ease
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-surface-600 dark:text-surface-300"
          >
            Schedule services without phone calls or in-person visits. TimeTap makes booking simple and convenient.
          </motion.p>
        </div>
      </section>

      {/* Main Booking Feature */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-20"
      >
        <MainFeature />
      </motion.section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose TimeTap?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="neu-card flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
                <feature.icon className="text-primary dark:text-primary-light" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;