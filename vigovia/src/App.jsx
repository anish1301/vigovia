import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles (refined for closer Figma match: purple theme, sections, tables)
const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30, fontSize: 10 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#6B46C1', marginBottom: 20 },
  section: { marginBottom: 20 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#6B46C1', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cell: { flex: 1, padding: 5 },
  daySection: { marginBottom: 30 },
  dayTitle: { fontSize: 14, fontWeight: 'bold', color: '#6B46C1', marginBottom: 10 },
  timeline: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  timeSlot: { fontSize: 12, marginRight: 10, width: 60 },
  activity: { fontSize: 10, flex: 1 },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#6B46C1', borderRadius: 4, overflow: 'hidden' },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#6B46C1', padding: 8 },
  tableCell: { margin: 'auto', marginTop: 5, fontSize: 8 },
  footer: { fontSize: 8, textAlign: 'center', marginTop: 20, color: '#6B46C1' },
});

// PDF Document Component (expanded for all sections)
const ItineraryPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>PLAN.PACK.GO!</Text>

      {/* Greeting and Overview */}
      <View style={styles.section}>
        <Text style={{ fontSize: 18, color: '#6B46C1' }}>Hi, {data.name}!</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#6B46C1', marginTop: 5 }}>{data.destination} Itinerary</Text>
        <Text style={{ fontSize: 14, marginTop: 5 }}>{data.durationDays} Days {data.durationNights} Nights</Text>
        <View style={styles.row}>
          <Text>Departure From: {data.departureCity}</Text>
          <Text>Departure: {data.departureDate}</Text>
          <Text>Arrival: {data.arrivalDate}</Text>
          <Text>Destination: {data.destination}</Text>
          <Text>No. of Travellers: {data.travelers}</Text>
        </View>
      </View>

      {/* Days */}
      {data.days.map((day, index) => (
        <View key={index} style={styles.daySection}>
          <Text style={styles.dayTitle}>Day {index + 1}</Text>
          <View style={styles.timeline}>
            <Text style={styles.timeSlot}>Morning</Text>
            <Text style={styles.activity}>{day.morning}</Text>
          </View>
          <View style={styles.timeline}>
            <Text style={styles.timeSlot}>Afternoon</Text>
            <Text style={styles.activity}>{day.afternoon}</Text>
          </View>
          <View style={styles.timeline}>
            <Text style={styles.timeSlot}>Evening</Text>
            <Text style={styles.activity}>{day.evening}</Text>
          </View>
        </View>
      ))}

      {/* Activity Table */}
      <View style={styles.section}>
        <Text style={styles.title}>Activity Table</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>City</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Activity</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Type</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Time Required</Text>
          </View>
          {data.activities.map((act, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{act.city}</Text>
              <Text style={styles.tableCell}>{act.activity}</Text>
              <Text style={styles.tableCell}>{act.type}</Text>
              <Text style={styles.tableCell}>{act.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Flight Summary */}
      <View style={styles.section}>
        <Text style={styles.title}>Flight Summary</Text>
        {data.flights.map((flight, idx) => (
          <View key={idx} style={{ marginBottom: 5 }}>
            <Text>{flight.date}: {flight.details}</Text>
          </View>
        ))}
      </View>

      {/* Hotel Bookings */}
      <View style={styles.section}>
        <Text style={styles.title}>Hotel Bookings</Text>
        <View style={[styles.table, { width: '100%' }]}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>City</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Check In</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Check Out</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Nights</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Hotel Name</Text>
          </View>
          {data.hotels.map((hotel, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{hotel.city}</Text>
              <Text style={styles.tableCell}>{hotel.checkIn}</Text>
              <Text style={styles.tableCell}>{hotel.checkOut}</Text>
              <Text style={styles.tableCell}>{hotel.nights}</Text>
              <Text style={styles.tableCell}>{hotel.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Payment Plan */}
      <View style={styles.section}>
        <Text style={styles.title}>Payment Plan</Text>
        <View style={styles.row}>
          <Text>Total Amount</Text>
          <Text>₹{data.totalAmount} For {data.installments.length} Pax (Inclusive Of GST)</Text>
        </View>
        <View style={styles.row}>
          <Text>TCS</Text>
          <Text>Not Collected</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Installment</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Amount</Text>
            <Text style={[styles.tableCell, { borderBottomColor: '#6B46C1', fontWeight: 'bold', backgroundColor: '#F3E8FF' }]}>Due Date</Text>
          </View>
          {data.installments.map((inst, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>Installment {idx + 1}</Text>
              <Text style={styles.tableCell}>₹{inst.amount}</Text>
              <Text style={styles.tableCell}>{inst.dueDate}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Additional Sections (placeholders matching Figma) */}
      <View style={styles.section}>
        <Text style={styles.title}>Scope of Service</Text>
        <Text>{data.scopeOfService}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Inclusion Summary</Text>
        <Text>{data.inclusions}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Important Notes</Text>
        <Text>{data.importantNotes}</Text>
      </View>

      {/* Footer with Company Info */}
      <Text style={styles.footer}>Vigovia Tech Pvt. Ltd | Phone: +91-9504061112 | Email: utkarsh@vigovia.com | CIN: U79110KA2024PTC191980</Text>
    </Page>
  </Document>
);

// Main App Component (expanded form with add/remove for all sections)
const App = () => {
  const [data, setData] = useState({
    name: '',
    destination: '',
    durationDays: '',
    durationNights: '',
    travelers: '',
    departureCity: '',
    departureDate: '',
    arrivalDate: '',
    days: [{ title: '', morning: '', afternoon: '', evening: '' }],
    activities: [{ city: '', activity: '', type: '', time: '' }],
    flights: [{ date: '', details: '' }],
    hotels: [{ city: '', checkIn: '', checkOut: '', nights: '', name: '' }],
    totalAmount: '',
    installments: [{ amount: '', dueDate: '' }],
    scopeOfService: '',
    inclusions: '',
    importantNotes: '',
  });

  const addItem = (section) => {
    setData(prev => ({ ...prev, [section]: [...prev[section], section === 'days' ? { title: '', morning: '', afternoon: '', evening: '' } : section === 'activities' ? { city: '', activity: '', type: '', time: '' } : section === 'flights' ? { date: '', details: '' } : section === 'hotels' ? { city: '', checkIn: '', checkOut: '', nights: '', name: '' } : { amount: '', dueDate: '' }] }));
  };

  const removeItem = (section, index) => {
    setData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  };

  const updateItem = (section, index, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Itinerary Builder</h1>

        {/* Overview Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input type="text" name="name" placeholder="Your Name" value={data.name} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="destination" placeholder="Destination" value={data.destination} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="durationDays" placeholder="Duration Days" value={data.durationDays} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="durationNights" placeholder="Duration Nights" value={data.durationNights} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="travelers" placeholder="No. of Travellers" value={data.travelers} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="departureCity" placeholder="Departure City" value={data.departureCity} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="departureDate" placeholder="Departure Date" value={data.departureDate} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="arrivalDate" placeholder="Arrival Date" value={data.arrivalDate} onChange={handleInputChange} className="border p-2 rounded" />
        </div>

        {/* Days Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Days</h2>
          {data.days.map((day, index) => (
            <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
              <input type="text" placeholder="Day Title" value={day.title} onChange={(e) => updateItem('days', index, 'title', e.target.value)} className="border p-2 mb-2 w-full" />
              <input type="text" placeholder="Morning Activity" value={day.morning} onChange={(e) => updateItem('days', index, 'morning', e.target.value)} className="border p-2 mb-2 w-full" />
              <input type="text" placeholder="Afternoon Activity" value={day.afternoon} onChange={(e) => updateItem('days', index, 'afternoon', e.target.value)} className="border p-2 mb-2 w-full" />
              <input type="text" placeholder="Evening Activity" value={day.evening} onChange={(e) => updateItem('days', index, 'evening', e.target.value)} className="border p-2 mb-2 w-full" />
              <button type="button" onClick={() => removeItem('days', index)} className="bg-red-500 text-white px-4 py-1 rounded mr-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('days')} className="bg-green-500 text-white px-4 py-2 rounded">Add Day</button>
        </div>

        {/* Activities Section (similar for Flights, Hotels, Installments) */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Activities</h2>
          {data.activities.map((act, index) => (
            <div key={index} className="border p-4 mb-4 rounded bg-gray-50 grid grid-cols-4 gap-2">
              <input type="text" placeholder="City" value={act.city} onChange={(e) => updateItem('activities', index, 'city', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Activity" value={act.activity} onChange={(e) => updateItem('activities', index, 'activity', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Type" value={act.type} onChange={(e) => updateItem('activities', index, 'type', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Time Required" value={act.time} onChange={(e) => updateItem('activities', index, 'time', e.target.value)} className="border p-2" />
              <button type="button" onClick={() => removeItem('activities', index)} className="bg-red-500 text-white px-2 py-1 rounded col-span-4 mt-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('activities')} className="bg-green-500 text-white px-4 py-2 rounded">Add Activity</button>
        </div>

        {/* Flights */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Flights</h2>
          {data.flights.map((flight, index) => (
            <div key={index} className="border p-4 mb-4 rounded bg-gray-50 grid grid-cols-2 gap-2">
              <input type="text" placeholder="Date" value={flight.date} onChange={(e) => updateItem('flights', index, 'date', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Details" value={flight.details} onChange={(e) => updateItem('flights', index, 'details', e.target.value)} className="border p-2" />
              <button type="button" onClick={() => removeItem('flights', index)} className="bg-red-500 text-white px-2 py-1 rounded col-span-2 mt-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('flights')} className="bg-green-500 text-white px-4 py-2 rounded">Add Flight</button>
        </div>

        {/* Hotels */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Hotels</h2>
          {data.hotels.map((hotel, index) => (
            <div key={index} className="border p-4 mb-4 rounded bg-gray-50 grid grid-cols-5 gap-2">
              <input type="text" placeholder="City" value={hotel.city} onChange={(e) => updateItem('hotels', index, 'city', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Check In" value={hotel.checkIn} onChange={(e) => updateItem('hotels', index, 'checkIn', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Check Out" value={hotel.checkOut} onChange={(e) => updateItem('hotels', index, 'checkOut', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Nights" value={hotel.nights} onChange={(e) => updateItem('hotels', index, 'nights', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Hotel Name" value={hotel.name} onChange={(e) => updateItem('hotels', index, 'name', e.target.value)} className="border p-2" />
              <button type="button" onClick={() => removeItem('hotels', index)} className="bg-red-500 text-white px-2 py-1 rounded col-span-5 mt-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('hotels')} className="bg-green-500 text-white px-4 py-2 rounded">Add Hotel</button>
        </div>

        {/* Payment Plan */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Plan</h2>
          <input type="text" name="totalAmount" placeholder="Total Amount (₹)" value={data.totalAmount} onChange={handleInputChange} className="border p-2 mb-2 w-full" />
          {data.installments.map((inst, index) => (
            <div key={index} className="border p-4 mb-4 rounded bg-gray-50 grid grid-cols-2 gap-2">
              <input type="text" placeholder="Amount (₹)" value={inst.amount} onChange={(e) => updateItem('installments', index, 'amount', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Due Date" value={inst.dueDate} onChange={(e) => updateItem('installments', index, 'dueDate', e.target.value)} className="border p-2" />
              <button type="button" onClick={() => removeItem('installments', index)} className="bg-red-500 text-white px-2 py-1 rounded col-span-2 mt-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('installments')} className="bg-green-500 text-white px-4 py-2 rounded">Add Installment</button>
        </div>

        {/* Other Inputs */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <textarea name="scopeOfService" placeholder="Scope of Service" value={data.scopeOfService} onChange={handleInputChange} className="border p-2 rounded h-20" />
          <textarea name="inclusions" placeholder="Inclusions" value={data.inclusions} onChange={handleInputChange} className="border p-2 rounded h-20" />
          <textarea name="importantNotes" placeholder="Important Notes" value={data.importantNotes} onChange={handleInputChange} className="border p-2 rounded h-20" />
        </div>

        {/* Download Button */}
        <PDFDownloadLink document={<ItineraryPDF data={data} />} fileName="itinerary.pdf">
          {({ loading }) => (
            <button className="bg-purple-600 text-white px-6 py-3 rounded w-full text-center font-semibold">
              {loading ? 'Generating PDF...' : 'Get Itinerary'}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default App;