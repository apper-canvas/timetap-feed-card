import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, getDay, isBefore, isAfter } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icon declarations
  const CalendarIcon = getIcon('Calendar');
  const ClockIcon = getIcon('Clock');
  const UserCircleIcon = getIcon('UserCircle');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const CalendarDaysIcon = getIcon('CalendarDays');
  const CheckCircleIcon = getIcon('CheckCircle');
  const InfoIcon = getIcon('Info');
  const ArrowRightIcon = getIcon('ArrowRight');
  const ArrowLeftIcon = getIcon('ArrowLeft');

  // Services data
  const services = [
    { id: 1, name: "Haircut & Styling", duration: 60, price: 65 },
    { id: 2, name: "Manicure & Pedicure", duration: 90, price: 80 },
    { id: 3, name: "Massage Therapy", duration: 60, price: 75 },
    { id: 4, name: "Facial Treatment", duration: 45, price: 60 },
    { id: 5, name: "Personal Training", duration: 60, price: 50 },
  ];

  // Time slots for demonstration
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 17) slots.push(`${hour}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [dates, setDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Generate dates for 7 days starting from today
  useEffect(() => {
    const today = new Date();
    const nextDates = [];
    for (let i = 0; i < 7; i++) {
      nextDates.push(addDays(today, i));
    }
    setDates(nextDates);
  }, []);

  // Check if a slot is available (simple demo logic)
  const isSlotAvailable = (time, date) => {
    // For demo purposes: make some slots unavailable
    const dateStr = format(date, 'yyyy-MM-dd');
    const timeNum = parseInt(time.split(':')[0]);
    
    // Weekend afternoons tend to be busier
    if ((getDay(date) === 0 || getDay(date) === 6) && timeNum >= 13) {
      return Math.random() > 0.7; // 30% chance of being booked
    }
    
    // Lunch time tends to be busy
    if (timeNum === 12) {
      return Math.random() > 0.5; // 50% chance of being booked
    }
    
    // Otherwise, most slots available
    return Math.random() > 0.2; // 80% chance of being available
  };

  // Handle input changes for contact form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = [];
    
    if (!contactInfo.name.trim()) {
      errors.push("Name is required");
    }
    
    if (!contactInfo.email.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      errors.push("Email is invalid");
    }
    
    if (!contactInfo.phone.trim()) {
      errors.push("Phone number is required");
    } else if (!/^\d{10}$/.test(contactInfo.phone.replace(/\D/g, ''))) {
      errors.push("Phone number must be 10 digits");
    }
    
    return errors;
  };

  // Submit booking
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingComplete(true);
      toast.success("Appointment successfully booked!");
    }, 1500);
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep === 1 && !selectedService) {
      toast.warning("Please select a service");
      return;
    }
    
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      toast.warning("Please select both a date and time");
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  // Navigate to previous step
  const goToPrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Reset the form
  const resetBooking = () => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setContactInfo({
      name: '',
      email: '',
      phone: '',
      notes: ''
    });
    setCurrentStep(1);
    setBookingComplete(false);
  };

  // Step 1: Service Selection
  const renderServiceSelection = () => (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center">
        <CalendarDaysIcon className="mr-2 text-primary" size={24} />
        Select a Service
      </h2>
      
      <div className="space-y-4">
        {services.map(service => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedService(service)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
              selectedService?.id === service.id
                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
                : 'border-surface-200 dark:border-surface-700 hover:border-primary/50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">{service.name}</h3>
                <p className="text-surface-500 dark:text-surface-400 flex items-center mt-1">
                  <ClockIcon className="mr-1" size={14} /> {service.duration} min
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">${service.price}</p>
                {selectedService?.id === service.id && (
                  <CheckCircleIcon className="text-primary ml-auto mt-1" size={18} />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <button 
          onClick={goToNextStep} 
          className="btn btn-primary px-6"
        >
          Continue <ArrowRightIcon className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );

  // Step 2: Date and Time Selection
  const renderDateTimeSelection = () => (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center">
        <CalendarIcon className="mr-2 text-primary" size={24} />
        Select Date & Time
      </h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Choose a Date:</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {dates.map((date, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(date)}
              className={`cursor-pointer p-2 rounded-lg text-center ${
                selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              <p className="text-xs font-medium">{format(date, 'EEE')}</p>
              <p className="text-xl font-bold">{format(date, 'd')}</p>
              <p className="text-xs">{format(date, 'MMM')}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium mb-3">Choose a Time:</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((time, i) => {
              const available = isSlotAvailable(time, selectedDate);
              return (
                <motion.button
                  key={i}
                  whileHover={available ? { scale: 1.05 } : {}}
                  whileTap={available ? { scale: 0.95 } : {}}
                  onClick={() => available && setSelectedTime(time)}
                  disabled={!available}
                  className={`py-2 px-3 rounded-lg text-center transition-colors ${
                    !available
                      ? 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed line-through'
                      : selectedTime === time
                      ? 'bg-primary text-white'
                      : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
                  }`}
                >
                  {time}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="mt-8 flex justify-between">
        <button 
          onClick={goToPrevStep} 
          className="btn btn-outline"
        >
          <ArrowLeftIcon className="mr-2" size={16} /> Back
        </button>
        <button 
          onClick={goToNextStep} 
          className="btn btn-primary"
        >
          Continue <ArrowRightIcon className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );

  // Step 3: Contact Information
  const renderContactForm = () => (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center">
        <UserCircleIcon className="mr-2 text-primary" size={24} />
        Your Information
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
              <UserCircleIcon size={18} />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={contactInfo.name}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Your full name"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
              <MailIcon size={18} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={contactInfo.email}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Your email address"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
              <PhoneIcon size={18} />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Your phone number"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={contactInfo.notes}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Any special requests or information"
            rows={3}
          ></textarea>
        </div>
        
        <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
          <h3 className="font-medium mb-2">Appointment Summary</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-surface-500">Service:</span> {selectedService?.name}</p>
            <p><span className="text-surface-500">Date:</span> {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            <p><span className="text-surface-500">Time:</span> {selectedTime}</p>
            <p><span className="text-surface-500">Duration:</span> {selectedService?.duration} minutes</p>
            <p><span className="text-surface-500">Price:</span> ${selectedService?.price}</p>
          </div>
        </div>
        
        <div className="flex items-start pt-2">
          <InfoIcon className="text-primary-light flex-shrink-0 mt-0.5 mr-2" size={18} />
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Your appointment is not confirmed until you click the "Book Appointment" button below.
          </p>
        </div>
        
        <div className="mt-8 flex justify-between">
          <button 
            type="button"
            onClick={goToPrevStep} 
            className="btn btn-outline"
          >
            <ArrowLeftIcon className="mr-2" size={16} /> Back
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Book Appointment'
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // Confirmation Screen
  const renderConfirmation = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center py-8"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto flex items-center justify-center text-green-600 dark:text-green-400"
        >
          <CheckCircleIcon size={40} />
        </motion.div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Booking Confirmed!</h2>
      <p className="text-surface-600 dark:text-surface-300 mb-8">
        Your appointment has been successfully scheduled. A confirmation email has been sent to {contactInfo.email}.
      </p>
      
      <div className="glass-card p-6 mb-8 text-left">
        <h3 className="font-semibold mb-4 text-center">Appointment Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-surface-500">Service:</span>
            <span className="font-medium">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Date:</span>
            <span className="font-medium">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Time:</span>
            <span className="font-medium">{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Duration:</span>
            <span className="font-medium">{selectedService?.duration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Price:</span>
            <span className="font-medium">${selectedService?.price}</span>
          </div>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetBooking}
        className="btn btn-primary"
      >
        Book Another Appointment
      </motion.button>
    </motion.div>
  );

  // Render the main component
  return (
    <div className="card p-5 md:p-8">
      {!bookingComplete ? (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="hidden md:flex items-center w-full max-w-xl">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        step < currentStep
                          ? 'bg-primary text-white'
                          : step === currentStep
                          ? 'bg-primary-light dark:bg-primary-dark text-white ring-4 ring-primary/20'
                          : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                      }`}
                    >
                      {step}
                    </div>
                    <div
                      className={`flex-1 h-1 ${
                        step < 3
                          ? step < currentStep
                            ? 'bg-primary'
                            : 'bg-surface-200 dark:bg-surface-700'
                          : 'hidden'
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="md:hidden text-center">
                <div 
                  className="w-10 h-10 rounded-full mx-auto flex items-center justify-center font-semibold bg-primary-light dark:bg-primary-dark text-white"
                >
                  {currentStep}
                </div>
                <p className="text-sm mt-1 text-surface-500">
                  {currentStep === 1 ? 'Select Service' : currentStep === 2 ? 'Choose Date & Time' : 'Your Details'}
                </p>
              </div>
            </div>
          </div>

          {currentStep === 1 && renderServiceSelection()}
          {currentStep === 2 && renderDateTimeSelection()}
          {currentStep === 3 && renderContactForm()}
        </>
      ) : (
        renderConfirmation()
      )}
    </div>
  );
};

export default MainFeature;