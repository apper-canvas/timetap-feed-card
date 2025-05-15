import { useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import getIcon from '../utils/iconUtils';

const BusConfirmation = ({ booking }) => {
  const CheckCircleIcon = getIcon('CheckCircle');
  const FileTextIcon = getIcon('FileText');
  const DownloadIcon = getIcon('Download');
  const ShareIcon = getIcon('Share2');
  const BusIcon = getIcon('Bus');
  const ClockIcon = getIcon('Clock');
  const MapPinIcon = getIcon('MapPin');
  const UserIcon = getIcon('User');
  const PhoneIcon = getIcon('Phone');
  const MailIcon = getIcon('Mail');
  const CreditCardIcon = getIcon('CreditCard');
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  // Simple QR code implementation (would use a real library in production)
  const QRCode = () => (
    <div className="bg-white p-2 w-32 h-32 mx-auto mb-3">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {Array(64).fill(0).map((_, i) => (
          <div 
            key={i} 
            className={`${Math.random() > 0.7 ? 'bg-black' : 'bg-white'} 
              ${i < 8 || i >= 56 || i % 8 === 0 || i % 8 === 7 ? 'bg-white' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );

  // Format payment method for display
  const formatPaymentMethod = (method) => {
    switch(method) {
      case 'creditCard': return 'Credit/Debit Card';
      case 'wallet': return 'Digital Wallet';
      case 'netBanking': return 'Net Banking';
      default: return method;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
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
          <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2">Booking Confirmed!</h2>
          <p className="text-surface-600 dark:text-surface-300">
            Your booking has been confirmed and ticket has been sent to your email.
          </p>
        </div>

        <div className="card max-w-3xl mx-auto overflow-hidden mb-8">
          <div className="bg-primary/10 dark:bg-primary/20 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <FileTextIcon className="text-primary mr-2" size={20} />
              <h3 className="font-semibold">E-Ticket</h3>
            </div>
            <div className="flex space-x-2">
              <button className="btn btn-outline py-1 px-3 text-sm">
                <DownloadIcon size={14} className="mr-1" /> Download
              </button>
              <button className="btn btn-outline py-1 px-3 text-sm">
                <ShareIcon size={14} className="mr-1" /> Share
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-surface-200 dark:border-surface-700 pb-4">
              <div>
                <h4 className="font-semibold text-lg">{booking.bus.name}</h4>
                <p className="text-surface-500 flex items-center">
                  <BusIcon size={14} className="mr-1" /> 
                  {booking.bus.type === 'ac' ? 'AC' : 
                   booking.bus.type === 'nonAc' ? 'Non-AC' : 
                   booking.bus.type === 'sleeper' ? 'Sleeper' : 'Luxury'}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="text-right">
                  <span className="font-medium">Booking ID:</span> {booking.bookingId}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-medium mb-2">Journey Details</h5>
                <div className="space-y-2">
                  <p className="flex items-start">
                    <ClockIcon size={16} className="mr-2 mt-1 text-surface-500" />
                    <span><span className="font-semibold">{booking.bus.date}</span> at <span className="font-semibold">{booking.bus.departureTime}</span></span>
                  </p>
                  <p className="flex items-start">
                    <MapPinIcon size={16} className="mr-2 mt-1 text-surface-500" />
                    <span>From: <span className="font-semibold">{booking.bus.from}</span></span>
                  </p>
                  <p className="flex items-start">
                    <MapPinIcon size={16} className="mr-2 mt-1 text-surface-500" />
                    <span>To: <span className="font-semibold">{booking.bus.to}</span></span>
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Passenger Details</h5>
                <div className="space-y-2">
                  {booking.passengers.map((passenger, index) => (
                    <p key={index} className="flex justify-between">
                      <span className="flex items-center">
                        <UserIcon size={14} className="mr-1 text-surface-500" />
                        {passenger.name}
                      </span>
                      <span className="font-semibold">Seat {passenger.seatNumber}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-medium mb-2">Contact Information</h5>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <PhoneIcon size={14} className="mr-1 text-surface-500" />
                    {booking.contactInfo.phone}
                  </p>
                  <p className="flex items-center">
                    <MailIcon size={14} className="mr-1 text-surface-500" />
                    {booking.contactInfo.email}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Payment Details</h5>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <CreditCardIcon size={14} className="mr-1 text-surface-500" />
                    {formatPaymentMethod(booking.paymentMethod)}
                  </p>
                  <p className="font-semibold text-lg">₹{booking.totalAmount}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between border-t border-surface-200 dark:border-surface-700 pt-6">
              <QRCode />
              <div className="text-center md:text-right mt-4 md:mt-0">
                <p className="text-surface-500 text-sm mb-1">Scan this QR code for boarding</p>
                <p className="font-medium">Valid until: {booking.bus.date} {booking.bus.departureTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/bus"
            className="btn btn-primary"
          >
            Book Another Trip
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/"
            className="btn btn-outline"
          >
            Return to Home
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

BusConfirmation.propTypes = {
  booking: PropTypes.object.isRequired
};

export default BusConfirmation;