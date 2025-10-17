import React, { useState } from 'react';
import { Plus, Minus, Download, Calendar, Users, Plane, Hotel, MapPin, AlertCircle, X } from 'lucide-react';

const ItineraryBuilder = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    clientName: '',
    destination: '',
    departureFrom: '',
    departureDate: '',
    arrivalDate: '',
    totalTravelers: '',
    days: [
      {
        date: '27th November',
        title: 'Arrival in Singapore & City Exploration',
        morning: 'Arrive in Singapore. Transfer From Airport To Hotel.',
        afternoon: 'Check Into Your Hotel.\nVisit Marina Bay Sands Sky Park (2-3 Hours).\nOptional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge.',
        evening: 'Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours).'
      }
    ],
    flights: [
      { date: '', airline: 'Fly Air India (AX-123)', route: 'From Delhi (DEL) To Singapore (SIN).' }
    ],
    hotels: [
      {
        city: 'Singapore',
        checkIn: '',
        checkOut: '',
        nights: 2,
        hotelName: 'Super Townhouse Oak Vashi Formerly Blue Diamond'
      }
    ],
    inclusions: {
      flights: 2,
      touristTax: 2,
      hotels: 2,
      transfers: true,
      activities: true
    },
    payment: {
      total: 900000,
      installments: [
        { name: 'Installment 1', amount: 350000, dueDate: 'Initial Payment' },
        { name: 'Installment 2', amount: 400000, dueDate: 'Post Visa Approval' },
        { name: 'Installment 3', amount: 0, dueDate: '20 Days Before Departure' }
      ]
    }
  });

  const addDay = () => {
    setFormData({
      ...formData,
      days: [
        ...formData.days,
        {
          date: '',
          title: '',
          morning: '',
          afternoon: '',
          evening: ''
        }
      ]
    });
  };

  const removeDay = (index) => {
    const newDays = formData.days.filter((_, i) => i !== index);
    setFormData({ ...formData, days: newDays });
  };

  const updateDay = (index, field, value) => {
    const newDays = [...formData.days];
    newDays[index][field] = value;
    setFormData({ ...formData, days: newDays });
  };

  // Date validation function
  const validateDates = () => {
    const newErrors = {};
    
    if (formData.departureDate && formData.arrivalDate) {
      const depDate = new Date(formData.departureDate);
      const arrDate = new Date(formData.arrivalDate);
      
      if (arrDate < depDate) {
        newErrors.arrivalDate = 'Arrival date cannot be before departure date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format date for display (YYYY-MM-DD to DD/MM/YYYY or readable format)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return as-is if invalid
    
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // DD/MM/YYYY format
  };

  const formatDateLong = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // e.g., "10 Jan 2024"
  };

  // Update form data with date validation
  const handleDateChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const addFlight = () => {
    setFormData({
      ...formData,
      flights: [...formData.flights, { date: '', airline: '', route: '' }]
    });
  };

  const removeFlight = (index) => {
    if (formData.flights.length > 1) {
      const newFlights = formData.flights.filter((_, i) => i !== index);
      setFormData({ ...formData, flights: newFlights });
    }
  };

  const addHotel = () => {
    setFormData({
      ...formData,
      hotels: [...formData.hotels, { city: '', checkIn: '', checkOut: '', nights: 0, hotelName: '' }]
    });
  };

  const removeHotel = (index) => {
    if (formData.hotels.length > 1) {
      const newHotels = formData.hotels.filter((_, i) => i !== index);
      setFormData({ ...formData, hotels: newHotels });
    }
  };

  const validateStep1 = () => {
    if (!formData.clientName.trim()) {
      alert('Please enter client name');
      return false;
    }
    if (!formData.destination.trim()) {
      alert('Please enter destination');
      return false;
    }
    if (!formData.departureFrom.trim()) {
      alert('Please enter departure location');
      return false;
    }
    if (!formData.departureDate) {
      alert('Please select departure date');
      return false;
    }
    if (!formData.arrivalDate) {
      alert('Please select arrival date');
      return false;
    }
    if (new Date(formData.arrivalDate) < new Date(formData.departureDate)) {
      alert('Arrival date cannot be before departure date');
      return false;
    }
    if (formData.totalTravelers < 1) {
      alert('Number of travelers must be at least 1');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    for (let i = 0; i < formData.days.length; i++) {
      const day = formData.days[i];
      if (!day.date) {
        alert(`Please enter date for Day ${i + 1}`);
        return false;
      }
      if (!day.title.trim()) {
        alert(`Please enter title for Day ${i + 1}`);
        return false;
      }
      if (!day.morning.trim() && !day.afternoon.trim() && !day.evening.trim()) {
        alert(`Please add at least one activity for Day ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const generatePDF = () => {
    // Validate dates before generating PDF
    if (!validateDates()) {
      alert('Please fix the date errors before generating the PDF');
      return;
    }

    const printWindow = window.open('', '_blank');
    const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Singapore Itinerary - ${formData.clientName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      color: #1a1a1a;
      background: white;
      line-height: 1.5;
    }
    .page { 
      width: 210mm;
      margin: 0 auto;
      background: white;
      padding: 15mm;
      page-break-after: always;
    }
    .header {
      background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%);
      color: white;
      padding: 40px 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      text-align: center;
    }
    .logo { 
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 5px;
      letter-spacing: -1px;
    }
    .logo .viago { color: #fff; }
    .logo .via { color: #A78BFA; }
    .tagline { 
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 25px;
    }
    .header h1 { 
      font-size: 32px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .header .subtitle { 
      font-size: 18px;
      font-weight: 300;
      margin-bottom: 15px;
    }
    .icons {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 15px;
      font-size: 20px;
    }
    .trip-info {
      background: #F8F9FA;
      padding: 20px 25px;
      border-radius: 10px;
      margin-bottom: 30px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 15px;
      border: 1px solid #E5E7EB;
    }
    .info-item {
      text-align: center;
    }
    .info-label {
      font-size: 11px;
      color: #6B7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 13px;
      color: #1F2937;
      font-weight: 600;
    }
    .day-container {
      display: flex;
      gap: 20px;
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .day-label {
      background: #2D1B69;
      color: white;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      padding: 15px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      min-width: 50px;
      text-align: center;
      letter-spacing: 1px;
    }
    .day-content {
      flex: 1;
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      overflow: hidden;
    }
    .day-header {
      background: #F9FAFB;
      padding: 15px 20px;
      border-bottom: 2px solid #E5E7EB;
    }
    .day-date {
      font-size: 16px;
      font-weight: 700;
      color: #2D1B69;
      margin-bottom: 3px;
    }
    .day-title {
      font-size: 12px;
      color: #6B7280;
      font-weight: 500;
    }
    .timeline {
      padding: 20px;
    }
    .timeline-item {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      position: relative;
    }
    .timeline-item:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 25px;
      bottom: -15px;
      width: 2px;
      background: #E5E7EB;
    }
    .timeline-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: white;
      border: 3px solid #7B68EE;
      flex-shrink: 0;
      margin-top: 2px;
      z-index: 1;
    }
    .timeline-content {
      flex: 1;
    }
    .timeline-time {
      font-size: 13px;
      font-weight: 700;
      color: #2D1B69;
      margin-bottom: 6px;
    }
    .timeline-text {
      font-size: 12px;
      color: #4B5563;
      line-height: 1.6;
      white-space: pre-line;
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #1F2937;
      margin: 35px 0 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #7B68EE;
    }
    .table-container {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 25px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #2D1B69;
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 12px 15px;
      font-size: 12px;
      color: #4B5563;
      border-bottom: 1px solid #F3F4F6;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:nth-child(even) {
      background: #F9FAFB;
    }
    .payment-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    .payment-card {
      background: white;
      border: 2px solid #E5E7EB;
      border-radius: 10px;
      padding: 18px;
      text-align: center;
    }
    .payment-title {
      font-size: 11px;
      color: #6B7280;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .payment-amount {
      font-size: 22px;
      font-weight: 700;
      color: #2D1B69;
      margin-bottom: 6px;
    }
    .payment-due {
      font-size: 11px;
      color: #6B7280;
    }
    .total-section {
      background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 25px;
      text-align: center;
    }
    .total-label {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    .total-amount {
      font-size: 28px;
      font-weight: 700;
    }
    .footer {
      background: #F9FAFB;
      padding: 20px;
      border-radius: 10px;
      border: 1px solid #E5E7EB;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .company-info {
      font-size: 10px;
      color: #6B7280;
      line-height: 1.6;
    }
    .company-name {
      font-weight: 700;
      color: #2D1B69;
      margin-bottom: 3px;
    }
    @media print {
      .page { margin: 0; padding: 15mm; }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo"><span class="viago">viago</span><span class="via">via</span></div>
      <div class="tagline">PLAN.PACK.GO</div>
      <h1>Hi, ${formData.clientName}!</h1>
      <div class="subtitle">${formData.destination} Itinerary</div>
      <div class="subtitle">${formData.days.length} Days ${formData.days.length - 1} Nights</div>
      <div class="icons">✈️ 🏨 🎫 🚗 🎭</div>
    </div>

    <div class="trip-info">
      <div class="info-item">
        <div class="info-label">Departure From</div>
        <div class="info-value">${formData.departureFrom}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Departure</div>
        <div class="info-value">${formatDate(formData.departureDate)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Arrival</div>
        <div class="info-value">${formatDate(formData.arrivalDate)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Destination</div>
        <div class="info-value">${formData.destination}</div>
      </div>
      <div class="info-item">
        <div class="info-label">No. Of Travellers</div>
        <div class="info-value">${formData.totalTravelers}</div>
      </div>
    </div>

    ${formData.days.map((day, index) => `
      <div class="day-container">
        <div class="day-label">Day ${index + 1}</div>
        <div class="day-content">
          <div class="day-header">
            <div class="day-date">${day.date}</div>
            <div class="day-title">${day.title}</div>
          </div>
          <div class="timeline">
            ${day.morning ? `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-time">Morning</div>
                  <div class="timeline-text">${day.morning}</div>
                </div>
              </div>
            ` : ''}
            ${day.afternoon ? `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-time">Afternoon</div>
                  <div class="timeline-text">${day.afternoon}</div>
                </div>
              </div>
            ` : ''}
            ${day.evening ? `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-time">Evening</div>
                  <div class="timeline-text">${day.evening}</div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="page">
    <h2 class="section-title">Flight Summary</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Flight Details</th>
          </tr>
        </thead>
        <tbody>
          ${formData.flights.map(flight => `
            <tr>
              <td>${formatDateLong(flight.date)}</td>
              <td><strong>${flight.airline}</strong> ${flight.route}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <h2 class="section-title">Hotel Bookings</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Nights</th>
            <th>Hotel Name</th>
          </tr>
        </thead>
        <tbody>
          ${formData.hotels.map(hotel => `
            <tr>
              <td>${hotel.city}</td>
              <td>${formatDate(hotel.checkIn)}</td>
              <td>${formatDate(hotel.checkOut)}</td>
              <td>${hotel.nights}</td>
              <td>${hotel.hotelName}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <h2 class="section-title">Inclusion Summary</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Flight</td>
            <td>${formData.inclusions.flights}</td>
            <td>All Flights Mentioned</td>
            <td>Awaiting Confirmation</td>
          </tr>
          <tr>
            <td>Tourist Tax</td>
            <td>${formData.inclusions.touristTax}</td>
            <td>Yotel (Singapore), Oakwood (Sydney), etc.</td>
            <td>Awaiting Confirmation</td>
          </tr>
          <tr>
            <td>Hotel</td>
            <td>${formData.inclusions.hotels}</td>
            <td>Airport To Hotel · Hotel To Attractions · Day Trips If Any</td>
            <td>Included</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="section-title">Payment Plan</h2>
    <div class="total-section">
      <div class="total-label">Total Amount</div>
      <div class="total-amount">₹ ${formData.payment.total.toLocaleString('en-IN')} For 3 Pax (Inclusive Of GST)</div>
    </div>

    <div class="payment-grid">
      ${formData.payment.installments.map(inst => `
        <div class="payment-card">
          <div class="payment-title">${inst.name}</div>
          <div class="payment-amount">₹${inst.amount.toLocaleString('en-IN')}</div>
          <div class="payment-due">${inst.dueDate}</div>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <div class="company-info">
        <div class="company-name">Vigovia Tech Pvt. Ltd</div>
        <div>Registered Office: Hd-109 Cinnabar Hills,</div>
        <div>Links Business Park, Karnataka, India.</div>
      </div>
      <div class="company-info" style="text-align: right;">
        <div><strong>Phone:</strong> +91-9504061112</div>
        <div><strong>Email ID:</strong> Utkarsh@Vigovia.Com</div>
        <div><strong>CIN:</strong> U79110KA2024PTC191890</div>
      </div>
      <div class="logo" style="font-size: 28px;">
        <span class="viago" style="color: #2D1B69;">viago</span><span class="via" style="color: #7B68EE;">via</span>
      </div>
    </div>
  </div>
</body>
</html>`;

    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/image.png" alt="Vigovia Logo" className="h-12 w-auto" />
              <div>
                <p className="text-lg font-semibold">Professional Itinerary Builder</p>
                <p className="text-xs text-purple-100">Create stunning travel plans in minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Daily Itinerary' },
            { num: 3, label: 'Flights & Hotels' },
            { num: 4, label: 'Payment & Generate' }
          ].map((s) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-3 ${step >= s.num ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s.num ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {s.num}
                </div>
                <span className="font-medium text-gray-700">{s.label}</span>
              </div>
              {s.num < 4 && <div className="w-16 h-1 bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto min-h-[600px] max-h-[650px] overflow-hidden flex flex-col">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Users className="text-purple-600" />
                  Basic Trip Information
                </h2>
                <p className="text-gray-600 mt-1">Let's start with the essentials</p>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter client name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Destination *</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Singapore"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Departure From *</label>
                  <input
                    type="text"
                    value={formData.departureFrom}
                    onChange={(e) => setFormData({ ...formData, departureFrom: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Travelers *</label>
                  <input
                    type="number"
                    value={formData.totalTravelers}
                    onChange={(e) => setFormData({ ...formData, totalTravelers: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Departure Date *</label>
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => handleDateChange('departureDate', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Arrival Date *</label>
                  <input
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => handleDateChange('arrivalDate', e.target.value)}
                    min={formData.departureDate}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      errors.arrivalDate 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-purple-500'
                    }`}
                  />
                  {errors.arrivalDate && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle size={14} />
                      <span>{errors.arrivalDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Continue to Daily Itinerary →
              </button>
            </div>
          )}

          {/* Step 2: Daily Itinerary */}
          {step === 2 && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="border-b pb-4 flex justify-between items-start flex-shrink-0">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <MapPin className="text-purple-600" size={32} />
                    Daily Itinerary
                  </h2>
                  <p className="text-gray-500 mt-2">Plan your day-by-day activities and experiences</p>
                </div>
                <button
                  onClick={addDay}
                  className="bg-green-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-600 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus size={20} /> Add Day
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 mt-4 mb-4 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100">
                <div className="space-y-5">
                  {formData.days.map((day, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                      {/* Day Header */}
                      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-lg shadow-md">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">Day {index + 1}</h3>
                            <p className="text-sm text-gray-500">Enter details for this day</p>
                          </div>
                        </div>
                        {formData.days.length > 1 && (
                          <button
                            onClick={() => removeDay(index)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                          >
                            <X size={18} /> Remove Day
                          </button>
                        )}
                      </div>

                      {/* Date and Title Row */}
                      <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-purple-600" />
                            Date *
                          </label>
                          <input
                            type="date"
                            value={day.date}
                            onChange={(e) => updateDay(index, 'date', e.target.value)}
                            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Day Title *
                          </label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => updateDay(index, 'title', e.target.value)}
                            placeholder="e.g., Arrival in Singapore & City Exploration"
                            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Activities Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Activities</h4>
                        
                        {/* Morning */}
                        <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                          <label className="block text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                            <span className="text-lg">🌅</span> Morning Activities
                          </label>
                          <textarea
                            value={day.morning}
                            onChange={(e) => updateDay(index, 'morning', e.target.value)}
                            placeholder="Describe morning activities (e.g., Hotel check-in, breakfast, sightseeing)..."
                            className="w-full px-4 py-3 text-sm border-2 border-orange-300 bg-white rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none resize-none transition-all"
                            rows="3"
                          />
                        </div>

                        {/* Afternoon */}
                        <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                          <label className="block text-sm font-bold text-yellow-700 mb-2 flex items-center gap-2">
                            <span className="text-lg">☀️</span> Afternoon Activities
                          </label>
                          <textarea
                            value={day.afternoon}
                            onChange={(e) => updateDay(index, 'afternoon', e.target.value)}
                            placeholder="Describe afternoon activities (e.g., Lunch, attractions, shopping)..."
                            className="w-full px-4 py-3 text-sm border-2 border-yellow-300 bg-white rounded-lg focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 focus:outline-none resize-none transition-all"
                            rows="3"
                          />
                        </div>

                        {/* Evening */}
                        <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
                          <label className="block text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
                            <span className="text-lg">🌙</span> Evening Activities
                          </label>
                          <textarea
                            value={day.evening}
                            onChange={(e) => updateDay(index, 'evening', e.target.value)}
                            placeholder="Describe evening activities (e.g., Dinner, entertainment, relaxation)..."
                            className="w-full px-4 py-3 text-sm border-2 border-indigo-300 bg-white rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none resize-none transition-all"
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4 border-t-2 border-gray-200 flex-shrink-0">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all shadow-md text-lg"
                >
                  ← Back
                </button>
                <button
                  onClick={() => {
                    if (validateStep2()) {
                      setStep(3);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-lg"
                >
                  Continue to Flights & Hotels →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Flights & Hotels */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Plane className="text-purple-600" />
                  Flights & Hotels
                </h2>
                <p className="text-gray-600 mt-1">Add flight and accommodation details</p>
              </div>

              {/* Flights Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-gray-700">Flight Details</h3>
                  <button
                    onClick={addFlight}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add Flight
                  </button>
                </div>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {formData.flights.map((flight, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-blue-700">Flight {index + 1}</span>
                        {formData.flights.length > 1 && (
                          <button
                            onClick={() => removeFlight(index)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="date"
                          value={flight.date}
                          onChange={(e) => {
                            const newFlights = [...formData.flights];
                            newFlights[index].date = e.target.value;
                            setFormData({ ...formData, flights: newFlights });
                          }}
                          className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={flight.airline}
                          onChange={(e) => {
                            const newFlights = [...formData.flights];
                            newFlights[index].airline = e.target.value;
                            setFormData({ ...formData, flights: newFlights });
                          }}
                          placeholder="Airline & Flight No"
                          className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={flight.route}
                          onChange={(e) => {
                            const newFlights = [...formData.flights];
                            newFlights[index].route = e.target.value;
                            setFormData({ ...formData, flights: newFlights });
                          }}
                          placeholder="Route"
                          className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-gray-700 flex items-center gap-2">
                    <Hotel size={18} />
                    Hotel Bookings
                  </h3>
                  <button
                    onClick={addHotel}
                    className="bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600 flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add Hotel
                  </button>
                </div>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {formData.hotels.map((hotel, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-green-700">Hotel {index + 1}</span>
                        {formData.hotels.length > 1 && (
                          <button
                            onClick={() => removeHotel(index)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <input
                          type="text"
                          value={hotel.city}
                          onChange={(e) => {
                            const newHotels = [...formData.hotels];
                            newHotels[index].city = e.target.value;
                            setFormData({ ...formData, hotels: newHotels });
                          }}
                          placeholder="City"
                          className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                        <input
                          type="date"
                          value={hotel.checkIn}
                          onChange={(e) => {
                            const newHotels = [...formData.hotels];
                            newHotels[index].checkIn = e.target.value;
                            
                            // Auto-calculate nights if checkout exists
                            if (newHotels[index].checkOut && e.target.value) {
                              const checkIn = new Date(e.target.value);
                              const checkOut = new Date(newHotels[index].checkOut);
                              if (checkOut < checkIn) {
                                alert('Check-out date cannot be before check-in date');
                                return;
                              }
                              const diffTime = Math.abs(checkOut - checkIn);
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              newHotels[index].nights = diffDays;
                            }
                            
                            setFormData({ ...formData, hotels: newHotels });
                          }}
                          className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                        <input
                          type="date"
                          value={hotel.checkOut}
                          onChange={(e) => {
                            const newHotels = [...formData.hotels];
                            
                            if (newHotels[index].checkIn && e.target.value) {
                              const checkIn = new Date(newHotels[index].checkIn);
                              const checkOut = new Date(e.target.value);
                              if (checkOut < checkIn) {
                                alert('Check-out date cannot be before check-in date');
                                return;
                              }
                              const diffTime = Math.abs(checkOut - checkIn);
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              newHotels[index].nights = diffDays;
                            }
                            
                            newHotels[index].checkOut = e.target.value;
                            setFormData({ ...formData, hotels: newHotels });
                          }}
                          className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                        <input
                          type="number"
                          value={hotel.nights}
                          onChange={(e) => {
                            const newHotels = [...formData.hotels];
                            newHotels[index].nights = parseInt(e.target.value) || 0;
                            setFormData({ ...formData, hotels: newHotels });
                          }}
                          placeholder="Nights"
                          className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={hotel.hotelName}
                        onChange={(e) => {
                          const newHotels = [...formData.hotels];
                          newHotels[index].hotelName = e.target.value;
                          setFormData({ ...formData, hotels: newHotels });
                        }}
                        placeholder="Hotel Name"
                        className="w-full px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment & Generate */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-purple-600" />
                  Payment Plan
                </h2>
                <p className="text-gray-600 mt-1">Configure payment installments</p>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-xl border-2 border-purple-300">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Package Amount (₹) *</label>
                <input
                  type="number"
                  value={formData.payment.total}
                  onChange={(e) => setFormData({
                    ...formData,
                    payment: { ...formData.payment, total: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-xl font-bold"
                  placeholder="900000"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-700">Payment Installments</h3>
                <div className="max-h-[140px] overflow-y-auto pr-2 space-y-2">
                  {formData.payment.installments.map((inst, index) => (
                    <div key={index} className="grid grid-cols-3 gap-3 p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <input
                        type="text"
                        value={inst.name}
                        onChange={(e) => {
                          const newInst = [...formData.payment.installments];
                          newInst[index].name = e.target.value;
                          setFormData({
                            ...formData,
                            payment: { ...formData.payment, installments: newInst }
                          });
                        }}
                        placeholder="Installment Name"
                        className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={inst.amount}
                        onChange={(e) => {
                          const newInst = [...formData.payment.installments];
                          newInst[index].amount = parseInt(e.target.value);
                          setFormData({
                            ...formData,
                            payment: { ...formData.payment, installments: newInst }
                          });
                        }}
                        placeholder="Amount"
                        className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={inst.dueDate}
                        onChange={(e) => {
                          const newInst = [...formData.payment.installments];
                          newInst[index].dueDate = e.target.value;
                          setFormData({
                            ...formData,
                            payment: { ...formData.payment, installments: newInst }
                          });
                        }}
                        placeholder="Due Date"
                        className="px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <h3 className="text-base font-bold text-gray-700 mb-3">Inclusions</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Flights</label>
                    <input
                      type="number"
                      value={formData.inclusions.flights}
                      onChange={(e) => setFormData({
                        ...formData,
                        inclusions: { ...formData.inclusions, flights: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tourist Tax</label>
                    <input
                      type="number"
                      value={formData.inclusions.touristTax}
                      onChange={(e) => setFormData({
                        ...formData,
                        inclusions: { ...formData.inclusions, touristTax: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hotels</label>
                    <input
                      type="number"
                      value={formData.inclusions.hotels}
                      onChange={(e) => setFormData({
                        ...formData,
                        inclusions: { ...formData.inclusions, hotels: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={generatePDF}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Generate PDF Itinerary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/image.png" alt="Vigovia Logo" className="h-16 w-auto mx-auto mb-4" />
          <div className="text-sm text-gray-300 space-y-1">
            <p>Vigovia Tech Pvt. Ltd</p>
            <p>Hd-109 Cinnabar Hills, Links Business Park, Karnataka, India</p>
            <p>Phone: +91-9504061112 | Email: Utkarsh@Vigovia.Com</p>
            <p className="text-xs text-gray-500 mt-2">CIN: U79110KA2024PTC191890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;