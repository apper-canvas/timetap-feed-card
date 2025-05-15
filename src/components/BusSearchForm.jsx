import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import getIcon from '../utils/iconUtils';
import { validateBusSearch } from '../utils/busUtils';

const BusSearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    busType: 'any'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Icons
  const MapPinIcon = getIcon('MapPin');
  const CalendarIcon = getIcon('Calendar');
  const UsersIcon = getIcon('Users');
  const SearchIcon = getIcon('Search');
  const SwapIcon = getIcon('ArrowsUpDown');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSwapLocations = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateBusSearch(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      onSearch(formData);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="from" className="block text-sm font-medium mb-1">From</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
              <MapPinIcon size={18} />
            </div>
            <input
              type="text"
              id="from"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className={`input-field pl-10 ${errors.from ? 'border-red-400 dark:border-red-600' : ''}`}
              placeholder="Departure city"
            />
          </div>
          {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
        </div>

        <div className="relative">
          <button 
            type="button"
            onClick={handleSwapLocations}
            className="absolute left-1/2 top-8 -translate-x-1/2 md:-translate-y-1/2 z-10 bg-surface-100 dark:bg-surface-700 text-primary hover:text-primary-dark p-2 rounded-full shadow-md hidden md:flex items-center justify-center"
            aria-label="Swap locations"
          >
            <SwapIcon size={16} />
          </button>
          
          <label htmlFor="to" className="block text-sm font-medium mb-1">To</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
              <MapPinIcon size={18} />
            </div>
            <input
              type="text"
              id="to"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className={`input-field pl-10 ${errors.to ? 'border-red-400 dark:border-red-600' : ''}`}
              placeholder="Destination city"
            />
          </div>
          {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">Date of Journey</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
              <CalendarIcon size={18} />
            </div>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`input-field pl-10 ${errors.date ? 'border-red-400 dark:border-red-600' : ''}`}
            />
          </div>
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="passengers" className="block text-sm font-medium mb-1">Passengers</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
              <UsersIcon size={18} />
            </div>
            <select
              id="passengers"
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="input-field pl-10"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="busType" className="block text-sm font-medium mb-1">Bus Type</label>
          <select
            id="busType"
            name="busType"
            value={formData.busType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="any">Any Bus Type</option>
            <option value="ac">AC</option>
            <option value="nonAc">Non-AC</option>
            <option value="sleeper">Sleeper</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <SearchIcon size={18} className="mr-2" /> Search Buses
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

BusSearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default BusSearchForm;