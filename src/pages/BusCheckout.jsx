import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import getIcon from '../utils/iconUtils';
import { toast } from 'react-toastify';
import { generateBookingReference } from '../utils/busUtils';

const BusCheckout = ({ bus, seats, onComplete }) => {
  const [passengerInfo, setPassengerInfo] = useState(
    seats.map(() => ({
      name: '',
      age: '',
      gender: '',
      seatNumber: ''
    }))
  );
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Assign seat numbers to passenger info
  useState(() => {
    const updatedPassengerInfo = passengerInfo.map((passenger, index) => ({
      ...passenger,
      seatNumber: seats[index]?.number || ''
    }));
    setPassengerInfo(updatedPassengerInfo);
  }, [seats]);

  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const CreditCardIcon = getIcon('CreditCard');
  const WalletIcon = getIcon('Wallet');
  const BankIcon = getIcon('Building');
  const UserIcon = getIcon('User');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const CheckIcon = getIcon('Check');

  const handlePassengerChange = (index, field, value) => {
    const newPassengerInfo = [...passengerInfo];
    newPassengerInfo[index] = {
      ...newPassengerInfo[index],
      [field]: value
    };
    setPassengerInfo(newPassengerInfo);
  };

  const handleContactChange = (field, value) => {
    setContactInfo({
      ...contactInfo,
      [field]: value
    });
  };

  const validateForm = () => {
    // Check passenger info
    for (let i = 0; i < passengerInfo.length; i++) {
      const passenger = passengerInfo[i];
      if (!passenger.name.trim()) {
        toast.error(`Please enter name for passenger ${i + 1}`);
        return false;
      }
      if (!passenger.age || passenger.age < 1) {
        toast.error(`Please enter valid age for passenger ${i + 1}`);
        return false;
      }
      if (!passenger.gender) {
        toast.error(`Please select gender for passenger ${i + 1}`);
        return false;
      }
    }
    
    // Check contact info
    if (!contactInfo.email.trim() || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!contactInfo.phone.trim() || !/^\d{10}$/.test(contactInfo.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const bookingInfo = {
        bookingId: generateBookingReference(),
        passengers: passengerInfo,
        contactInfo,
        paymentMethod,
        bus,
        seats,
        totalAmount: seats.reduce((total, seat) => total + seat.price, 0),
        bookingDate: new Date().toISOString()
      };
      
      setIsSubmitting(false);
      onComplete(bookingInfo);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => window.history.back()}
          className="btn btn-outline py-1 px-3 mr-4"
        >
          <ChevronLeftIcon size={16} className="mr-1" /> Back
        </button>
        <div>
          <h2 className="text-xl font-semibold">Checkout</h2>
          <p className="text-surface-500 text-sm">
            Complete your booking for {seats.length} {seats.length === 1 ? 'seat' : 'seats'}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Passenger Information */}
            <div className="card p-6">
              <h3 className="font-medium mb-4">Passenger Information</h3>
              
              {passengerInfo.map((passenger, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex items-center mb-3">
                    <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-2">
                      {index + 1}
                    </div>
                    <h4 className="font-medium">Passenger {index + 1} - Seat {passenger.seatNumber}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor={`name-${index}`} className="block text-sm font-medium mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
                          <UserIcon size={16} />
                        </div>
                        <input
                          type="text"
                          id={`name-${index}`}
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                          className="input-field pl-10"
                          placeholder="Full name as in ID"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor={`age-${index}`} className="block text-sm font-medium mb-1">Age</label>
                      <input
                        type="number"
                        id={`age-${index}`}
                        min="1"
                        max="120"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                        className="input-field"
                        placeholder="Age"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`gender-${index}`} className="block text-sm font-medium mb-1">Gender</label>
                      <select
                        id={`gender-${index}`}
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Contact Information */}
            <div className="card p-6">
              <h3 className="font-medium mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
                      <MailIcon size={16} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Your email address"
                    />
                  </div>
                  <p className="text-xs text-surface-500 mt-1">Booking confirmation will be sent to this email</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
                      <PhoneIcon size={16} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="card p-6">
              <h3 className="font-medium mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className={`flex p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'creditCard' 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-surface-200 dark:border-surface-700'
                }`}>
                  <input 
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={() => setPaymentMethod('creditCard')}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <CreditCardIcon size={20} className="mr-2 text-primary" />
                    <span>Credit/Debit Card</span>
                  </div>
                </label>
                
                <label className={`flex p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'wallet' 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-surface-200 dark:border-surface-700'
                }`}>
                  <input 
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <WalletIcon size={20} className="mr-2 text-primary" />
                    <span>Digital Wallet</span>
                  </div>
                </label>
                
                <label className={`flex p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'netBanking' 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-surface-200 dark:border-surface-700'
                }`}>
                  <input 
                    type="radio"
                    name="paymentMethod"
                    value="netBanking"
                    checked={paymentMethod === 'netBanking'}
                    onChange={() => setPaymentMethod('netBanking')}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <BankIcon size={20} className="mr-2 text-primary" />
                    <span>Net Banking</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-medium mb-4">Booking Summary</h3>
              
              <div className="mb-4">
                <p className="flex justify-between mb-2">
                  <span className="text-surface-500">Bus:</span>
                  <span className="font-medium">{bus.name}</span>
                </p>
                <p className="flex justify-between mb-2">
                  <span className="text-surface-500">Date:</span>
                  <span className="font-medium">{bus.date}</span>
                </p>
                <p className="flex justify-between mb-2">
                  <span className="text-surface-500">Time:</span>
                  <span className="font-medium">{bus.departureTime}</span>
                </p>
                <p className="flex justify-between mb-2">
                  <span className="text-surface-500">From:</span>
                  <span className="font-medium">{bus.from}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-surface-500">To:</span>
                  <span className="font-medium">{bus.to}</span>
                </p>
              </div>
              
              <div className="border-t border-b border-surface-200 dark:border-surface-700 py-4 mb-4">
                <h4 className="font-medium mb-3">Seat Details</h4>
                <div className="space-y-2">
                  {seats.map((seat, index) => (
                    <div key={seat.id} className="flex justify-between">
                      <span>Seat {seat.number}</span>
                      <span className="font-medium">₹{seat.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-primary">
                    ₹{seats.reduce((total, seat) => total + seat.price, 0)}
                  </span>
                </div>
                <p className="text-xs text-surface-500 text-right mt-1">
                  Includes all taxes and fees
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay ₹{seats.reduce((total, seat) => total + seat.price, 0)}
                  </>
                )}
              </motion.button>
              
              <p className="text-xs text-center mt-3 text-surface-500">
                By clicking this button, you agree to our Terms & Conditions and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

BusCheckout.propTypes = {
  bus: PropTypes.object.isRequired,
  seats: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired
};

export default BusCheckout;