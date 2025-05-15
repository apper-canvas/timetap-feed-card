import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import getIcon from '../utils/iconUtils';
import { toast } from 'react-toastify';

const BusSeatSelection = ({ bus, onContinue }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const InfoIcon = getIcon('Info');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const ArrowRightIcon = getIcon('ArrowRight');

  // Generate bus layout (5 rows x 8 seats) with some random unavailable seats
  const generateBusLayout = () => {
    const layout = [];
    const totalRows = 10;
    const seatsPerRow = 4; // 2 on each side with an aisle
    
    // Predefined unavailable seats (about 30% of seats)
    const unavailableSeats = new Set();
    const totalSeats = totalRows * seatsPerRow;
    const unavailableCount = Math.floor(totalSeats * 0.3);
    
    while (unavailableSeats.size < unavailableCount) {
      const row = Math.floor(Math.random() * totalRows) + 1;
      const seatNum = Math.floor(Math.random() * seatsPerRow) + 1;
      const seatId = `${row}-${seatNum}`;
      unavailableSeats.add(seatId);
    }
    
    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = [];
      
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatId = `${row}-${seat}`;
        const seatLetter = seat === 1 ? 'A' : seat === 2 ? 'B' : seat === 3 ? 'C' : 'D';
        const seatNumber = `${row}${seatLetter}`;
        
        rowSeats.push({
          id: seatId,
          number: seatNumber,
          position: seat,
          available: !unavailableSeats.has(seatId),
          price: bus.fare
        });
      }
      
      layout.push({
        row: row,
        seats: rowSeats
      });
    }
    
    return layout;
  };

  const busLayout = generateBusLayout();

  const handleSeatClick = (seat) => {
    if (!seat.available) return;
    
    setSelectedSeats(prev => {
      // If seat is already selected, remove it
      if (prev.some(s => s.id === seat.id)) {
        return prev.filter(s => s.id !== seat.id);
      }
      
      // Check if maximum number of seats is reached
      if (prev.length >= bus.maxSeatsPerBooking) {
        toast.warning(`You can select a maximum of ${bus.maxSeatsPerBooking} seats`);
        return prev;
      }
      
      // Add the seat
      return [...prev, seat];
    });
  };

  const getTotalAmount = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat to continue');
      return;
    }
    
    onContinue(selectedSeats);
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
          <h2 className="text-xl font-semibold">Select Your Seats</h2>
          <p className="text-surface-500 text-sm flex items-center">
            {bus.name} - {bus.departureTime} to {bus.arrivalTime}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">Bus Layout</h3>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-surface-200 dark:bg-surface-700 rounded mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-primary rounded mr-2"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-surface-400 dark:bg-surface-500 rounded mr-2"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mb-6 py-3 px-12 bg-surface-200 dark:bg-surface-700 rounded-lg">
              <div className="font-medium">Driver</div>
            </div>
            
            <div className="mb-8">
              <div className="space-y-2">
                {busLayout.map((row) => (
                  <div key={row.row} className="flex justify-center space-x-10">
                    <div className="flex space-x-2">
                      {row.seats.slice(0, 2).map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={!seat.available}
                          className={`h-9 w-9 rounded-t-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            selectedSeats.some(s => s.id === seat.id)
                              ? 'bg-primary text-white'
                              : seat.available
                              ? 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'
                              : 'bg-surface-400 dark:bg-surface-500 text-surface-100 dark:text-surface-200 cursor-not-allowed'
                          }`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      {row.seats.slice(2, 4).map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={!seat.available}
                          className={`h-9 w-9 rounded-t-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            selectedSeats.some(s => s.id === seat.id)
                              ? 'bg-primary text-white'
                              : seat.available
                              ? 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'
                              : 'bg-surface-400 dark:bg-surface-500 text-surface-100 dark:text-surface-200 cursor-not-allowed'
                          }`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center text-surface-500 text-sm flex items-center justify-center">
              <InfoIcon size={16} className="mr-1" />
              Click on a seat to select or deselect it
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-medium mb-4">Booking Summary</h3>
            
            <div className="mb-4">
              <p className="flex justify-between mb-2">
                <span className="text-surface-500">Bus:</span>
                <span className="font-medium">{bus.name}</span>
              </p>
              <p className="flex justify-between mb-2">
                <span className="text-surface-500">Route:</span>
                <span className="font-medium">{bus.from} to {bus.to}</span>
              </p>
              <p className="flex justify-between mb-2">
                <span className="text-surface-500">Date:</span>
                <span className="font-medium">{bus.date}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-surface-500">Time:</span>
                <span className="font-medium">{bus.departureTime} - {bus.arrivalTime}</span>
              </p>
            </div>
            
            <div className="border-t border-b border-surface-200 dark:border-surface-700 py-4 mb-4">
              <h4 className="font-medium mb-2">Selected Seats ({selectedSeats.length})</h4>
              {selectedSeats.length > 0 ? (
                <div className="space-y-2">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between items-center">
                      <span>Seat {seat.number}</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">₹{seat.price}</span>
                        <button 
                          onClick={() => handleSeatClick(seat)}
                          className="h-5 w-5 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 flex items-center justify-center"
                        >
                          <XIcon size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-surface-500 text-sm italic">No seats selected</p>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold text-primary">₹{getTotalAmount()}</span>
              </div>
              <p className="text-xs text-surface-500 text-right mt-1">
                Includes all taxes and fees
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className="btn btn-primary w-full"
            >
              Continue to Checkout <ArrowRightIcon size={16} className="ml-1" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

BusSeatSelection.propTypes = {
  bus: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired
};

export default BusSeatSelection;