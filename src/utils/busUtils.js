// Validate bus search form
export const validateBusSearch = (formData) => {
  const errors = {};
  
  if (!formData.from || formData.from.trim() === '') {
    errors.from = 'Departure city is required';
  }
  
  if (!formData.to || formData.to.trim() === '') {
    errors.to = 'Destination city is required';
  }
  
  if (formData.from && formData.to && formData.from.toLowerCase() === formData.to.toLowerCase()) {
    errors.to = 'Destination cannot be the same as departure';
  }
  
  if (!formData.date) {
    errors.date = 'Date of journey is required';
  } else {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.date = 'Date cannot be in the past';
    }
  }
  
  return errors;
};

// Generate a random booking reference
export const generateBookingReference = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Get available buses based on search params (mock data)
export const getAvailableBuses = (searchParams) => {
  // Format date for display
  const date = new Date(searchParams.date);
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  
  // Generate sample bus data
  return [
    {
      id: '1',
      name: 'Express Travels',
      from: searchParams.from,
      to: searchParams.to,
      date: formattedDate,
      departureTime: '06:30',
      arrivalTime: '12:45',
      duration: '6h 15m',
      type: 'ac',
      fare: 850,
      maxSeatsPerBooking: 6,
      amenities: {
        wifi: true,
        charging: true,
        entertainment: false,
        food: false
      }
    },
    {
      id: '2',
      name: 'Luxury Roadlines',
      from: searchParams.from,
      to: searchParams.to,
      date: formattedDate,
      departureTime: '09:15',
      arrivalTime: '14:30',
      duration: '5h 15m',
      type: 'luxury',
      fare: 1200,
      maxSeatsPerBooking: 6,
      amenities: {
        wifi: true,
        charging: true,
        entertainment: true,
        food: true
      }
    },
    {
      id: '3',
      name: 'Night Rider',
      from: searchParams.from,
      to: searchParams.to,
      date: formattedDate,
      departureTime: '22:00',
      arrivalTime: '05:30',
      duration: '7h 30m',
      type: 'sleeper',
      fare: 950,
      maxSeatsPerBooking: 6,
      amenities: {
        wifi: true,
        charging: true,
        entertainment: false,
        food: true
      }
    },
    {
      id: '4',
      name: 'Budget Transport',
      from: searchParams.from,
      to: searchParams.to,
      date: formattedDate,
      departureTime: '14:45',
      arrivalTime: '21:15',
      duration: '6h 30m',
      type: 'nonAc',
      fare: 600,
      maxSeatsPerBooking: 6,
      amenities: {
        wifi: false,
        charging: false,
        entertainment: false,
        food: false
      }
    },
    {
      id: '5',
      name: 'Royal Coaches',
      from: searchParams.from,
      to: searchParams.to,
      date: formattedDate,
      departureTime: '12:30',
      arrivalTime: '18:00',
      duration: '5h 30m',
      type: 'luxury',
      fare: 1350,
      maxSeatsPerBooking: 6,
      amenities: {
        wifi: true,
        charging: true,
        entertainment: true,
        food: true
      }
    }
  ];
};