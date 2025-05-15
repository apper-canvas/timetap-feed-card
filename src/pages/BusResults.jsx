import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import getIcon from '../utils/iconUtils';
import { getAvailableBuses } from '../utils/busUtils';

const BusResults = ({ searchParams, onSelectBus }) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [filters, setFilters] = useState({
    price: { min: 0, max: 5000 },
    departureTime: 'all',
    busType: searchParams.busType === 'any' ? 'all' : searchParams.busType
  });

  // Icons
  const BusIcon = getIcon('Bus');
  const ClockIcon = getIcon('Clock');
  const CalendarIcon = getIcon('Calendar');
  const WifiIcon = getIcon('Wifi');
  const TvIcon = getIcon('Tv');
  const PlugIcon = getIcon('Power');
  const SnackIcon = getIcon('Coffee');
  const ArrowRightIcon = getIcon('ArrowRight');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  
  useEffect(() => {
    // Simulate API call to get buses
    setLoading(true);
    setTimeout(() => {
      const availableBuses = getAvailableBuses(searchParams);
      setBuses(availableBuses);
      setFilteredBuses(availableBuses);
      setLoading(false);
    }, 1500);
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [filters, buses]);

  const applyFilters = () => {
    let result = [...buses];
    
    // Filter by price
    result = result.filter(bus => 
      bus.fare >= filters.price.min && bus.fare <= filters.price.max
    );
    
    // Filter by departure time
    if (filters.departureTime !== 'all') {
      const hour = parseInt(bus.departureTime.split(':')[0]);
      if (filters.departureTime === 'morning') {
        result = result.filter(bus => hour >= 4 && hour < 12);
      } else if (filters.departureTime === 'afternoon') {
        result = result.filter(bus => hour >= 12 && hour < 17);
      } else if (filters.departureTime === 'evening') {
        result = result.filter(bus => hour >= 17 && hour < 21);
      } else if (filters.departureTime === 'night') {
        result = result.filter(bus => hour >= 21 || hour < 4);
      }
    }
    
    // Filter by bus type
    if (filters.busType !== 'all') {
      result = result.filter(bus => bus.type === filters.busType);
    }
    
    setFilteredBuses(result);
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Format journey time
  const getJourneyDuration = (departure, arrival) => {
    const [depHour, depMin] = departure.split(':').map(Number);
    const [arrHour, arrMin] = arrival.split(':').map(Number);
    
    let hourDiff = arrHour - depHour;
    let minDiff = arrMin - depMin;
    
    if (minDiff < 0) {
      hourDiff--;
      minDiff += 60;
    }
    
    if (hourDiff < 0) {
      hourDiff += 24;
    }
    
    return `${hourDiff}h ${minDiff}m`;
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
          <h2 className="text-xl font-semibold">Buses from {searchParams.from} to {searchParams.to}</h2>
          <p className="text-surface-500 text-sm flex items-center">
            <CalendarIcon size={14} className="mr-1" /> 
            {new Date(searchParams.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <span className="mx-2">•</span>
            {searchParams.passengers} {searchParams.passengers === 1 ? 'Passenger' : 'Passengers'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-medium text-lg mb-4">Filters</h3>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-surface-500">₹{filters.price.min}</span>
                <span className="text-sm text-surface-500">₹{filters.price.max}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                value={filters.price.max} 
                onChange={(e) => handleFilterChange('price', { ...filters.price, max: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Departure Time</h4>
              <div className="space-y-2">
                {['all', 'morning', 'afternoon', 'evening', 'night'].map(time => (
                  <label key={time} className="flex items-center">
                    <input 
                      type="radio" 
                      name="departureTime" 
                      checked={filters.departureTime === time}
                      onChange={() => handleFilterChange('departureTime', time)}
                      className="mr-2" 
                    />
                    <span className="capitalize">{time === 'all' ? 'All Times' : time}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Bus Type</h4>
              <div className="space-y-2">
                {['all', 'ac', 'nonAc', 'sleeper', 'luxury'].map(type => (
                  <label key={type} className="flex items-center">
                    <input 
                      type="radio" 
                      name="busType" 
                      checked={filters.busType === type}
                      onChange={() => handleFilterChange('busType', type)}
                      className="mr-2" 
                    />
                    <span className="capitalize">
                      {type === 'all' ? 'All Types' : 
                       type === 'ac' ? 'AC' : 
                       type === 'nonAc' ? 'Non-AC' : 
                       type === 'sleeper' ? 'Sleeper' : 'Luxury'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bus List */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="card p-12 text-center">
              <div className="animate-pulse flex flex-col items-center justify-center">
                <BusIcon size={48} className="text-surface-300 dark:text-surface-600 mb-4" />
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-48 mb-3"></div>
                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-32"></div>
              </div>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="card p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No buses found</h3>
              <p className="text-surface-500">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            filteredBuses.map((bus, index) => (
              <motion.div 
                key={bus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <div className="p-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 flex justify-between items-center">
                  <div className="flex items-center">
                    <BusIcon size={24} className="text-primary mr-2" />
                    <h3 className="font-semibold">{bus.name}</h3>
                  </div>
                  <div className="text-sm text-surface-500">
                    <span className={`px-2 py-0.5 rounded ${
                      bus.type === 'ac' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                      bus.type === 'sleeper' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      bus.type === 'luxury' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {bus.type === 'ac' ? 'AC' : 
                       bus.type === 'nonAc' ? 'Non-AC' : 
                       bus.type === 'sleeper' ? 'Sleeper' : 'Luxury'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="mb-3 md:mb-0">
                      <p className="text-2xl font-bold">{bus.departureTime}</p>
                      <p className="text-surface-500 text-sm">{searchParams.from}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-surface-500 mb-1">
                        {getJourneyDuration(bus.departureTime, bus.arrivalTime)}
                      </p>
                      <div className="w-24 md:w-40 h-0.5 bg-surface-200 dark:bg-surface-700 relative">
                        <span className="absolute -top-1.5 -right-1 w-3 h-3 rounded-full bg-primary"></span>
                        <span className="absolute -top-1.5 -left-1 w-3 h-3 rounded-full bg-surface-400"></span>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0 text-right">
                      <p className="text-2xl font-bold">{bus.arrivalTime}</p>
                      <p className="text-surface-500 text-sm">{searchParams.to}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex items-center text-sm text-surface-500 mb-2">
                        <ClockIcon size={14} className="mr-1" />
                        {bus.date}
                      </div>
                      <div className="flex space-x-2">
                        {bus.amenities.wifi && <WifiIcon size={16} className="text-primary" title="WiFi" />}
                        {bus.amenities.entertainment && <TvIcon size={16} className="text-primary" title="Entertainment" />}
                        {bus.amenities.charging && <PlugIcon size={16} className="text-primary" title="Charging Points" />}
                        {bus.amenities.food && <SnackIcon size={16} className="text-primary" title="Snacks/Meal" />}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{bus.fare}</p>
                      <button 
                        onClick={() => onSelectBus(bus)}
                        className="btn btn-primary mt-2"
                      >
                        Select Seats <ArrowRightIcon size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

BusResults.propTypes = {
  searchParams: PropTypes.object.isRequired,
  onSelectBus: PropTypes.func.isRequired
};

export default BusResults;