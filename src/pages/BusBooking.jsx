import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import BusSearchForm from '../components/BusSearchForm';
import BusResults from './BusResults';
import BusSeatSelection from './BusSeatSelection';
import BusCheckout from './BusCheckout';
import BusConfirmation from './BusConfirmation';

const BusBooking = () => {
  const navigate = useNavigate();
  const BusIcon = getIcon('Bus');
  const [searchParams, setSearchParams] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingInfo, setBookingInfo] = useState(null);

  const handleSearch = (params) => {
    setSearchParams(params);
    navigate('/bus/results');
    toast.success('Searching for buses between ' + params.from + ' and ' + params.to);
  };

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
    navigate('/bus/seats');
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
    navigate('/bus/checkout');
  };

  const handleBookingComplete = (info) => {
    setBookingInfo(info);
    navigate('/bus/confirmation');
    toast.success('Booking completed successfully!');
  };

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <BusIcon className="text-primary" size={32} />
            <span>Bus Booking Portal</span>
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">
            Book bus tickets for your journey with ease and comfort
          </p>
        </div>

        <Routes>
          <Route path="/" element={
            <div className="card max-w-3xl mx-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Search For Bus Tickets</h2>
                <BusSearchForm onSearch={handleSearch} />
              </div>
            </div>
          } />
          <Route 
            path="/results" 
            element={searchParams ? <BusResults searchParams={searchParams} onSelectBus={handleBusSelect} /> : <Navigate to="/bus" />} 
          />
          <Route 
            path="/seats" 
            element={selectedBus ? <BusSeatSelection bus={selectedBus} onContinue={handleSeatSelect} /> : <Navigate to="/bus" />} 
          />
          <Route path="/checkout" element={selectedSeats.length > 0 ? <BusCheckout bus={selectedBus} seats={selectedSeats} onComplete={handleBookingComplete} /> : <Navigate to="/bus" />} />
          <Route path="/confirmation" element={bookingInfo ? <BusConfirmation booking={bookingInfo} /> : <Navigate to="/bus" />} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default BusBooking;