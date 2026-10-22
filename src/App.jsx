import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, CarFront, Clock3, Fuel, MapPin, Phone, Snowflake, Users, UserRound, BriefcaseBusiness, Truck, MessageCircle, ChevronDown } from 'lucide-react';
import { business, fleet, towing } from './data.js';

const vehicles = [...fleet, towing];
const waLink = (message) => `https://wa.me/${business.phone}?text=${encodeURIComponent(message)}`;

export default function App() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState('trip');
  const [form, setForm] = useState({ pickup: '', destination: '', date: '', time: '', name: '', phone: '' });
  const [notice, setNotice] = useState('');
  const vehicle = vehicles[active];

  // Keep the current vehicle eager, then warm up adjacent images for faster switching.
  useEffect(() => {
    const neighbors = [
      vehicles[(active + 1) % vehicles.length],
      vehicles[(active + vehicles.length - 1) % vehicles.length],
    ];
    const preload = () => neighbors.forEach((item) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = item.image;
    });
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 1200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(preload, 250);
    return () => window.clearTimeout(id);
  }, [active]);

  const isTow = mode === 'towing' || active === 6;
  const chooseVehicle = (index) => {
    setActive(index);
    if (index === 6) setMode('towing');
    else setMode('trip');
    setNotice('');
  };
  const update = (key, value) => {
    setForm((old) => ({ ...old, [key]: value }));
    setNotice('');
  };
  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setNotice('Please enter your name and phone number.');
      return;
    }
    const message = isTow
      ? ['Hello Sriram Travels & Towing Services, I need towing assistance.', `Name: ${form.name}`, `Phone: ${form.phone}`, `Location: ${form.pickup || 'Not specified'}`].join('\n')
      : ['Hello Sriram Travels & Towing Services, I would like to enquire about a trip.', `Vehicle: ${vehicle.name}`, `Pickup: ${form.pickup}`, `Destination: ${form.destination}`, `Date: ${form.date}`, `Time: ${form.time}`, `Name: ${form.name}`, `Phone: ${form.phone}`, 'Please confirm availability and quote.'].join('\n');
    window.open(waLink(message), '_blank', 'noopener,noreferrer');
    setNotice('Opening WhatsApp with your enquiry…');
  };
  const previous = () => chooseVehicle((active + vehicles.length - 1) % vehicles.length);
  const next = () => chooseVehicle((active + 1) % vehicles.length);

  return <main className="premium-page">
    <div className="scenic-backdrop" aria-hidden="true" />
    <div className="backdrop-tint" aria-hidden="true" />
    <header className="premium-header">
      <a className="premium-brand" href="#home" aria-label="Sriram Travels home">
        <span className="brand-emblem">S</span>
        <span className="premium-brand-copy"><strong>SRIRAM</strong><small>TRAVELS & TOWING SERVICES</small><i>GOOTY, ANDHRA PRADESH</i></span>
      </a>
      <nav className="premium-nav" aria-label="Main navigation">
        <a className="current" href="#home">Home</a><a href="#fleet">Our Fleet</a><a href="#enquiry">Services</a><a href="#about">About</a><a href="#enquiry">Contact</a>
      </nav>
      <a className="call-pill" href={`tel:+${business.phone}`}><Phone size={17} /><span><small>Call Now</small><strong>{business.phoneDisplay}</strong></span></a>
    </header>

    <section className="premium-stage" id="home">
      <aside className="premium-fleet" id="fleet" aria-label="Choose a vehicle">
        {vehicles.map((item, index) => <button key={item.id} className={`premium-fleet-item ${active === index ? 'selected' : ''}`} onClick={() => chooseVehicle(index)} aria-pressed={active === index}>
          <span className="premium-fleet-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="premium-fleet-name">{item.name}</span>
        </button>)}
        <div className="fleet-count">{String(active + 1).padStart(2, '0')} <span>/</span> 07</div>
      </aside>

      <div className="hero-car-area" aria-live="polite">
        <div className="car-light-pool" />
        <img key={vehicle.id} className="premium-car-image" src={vehicle.image} alt={`${vehicle.name} vehicle`} loading="eager" decoding="async" fetchPriority="high" />
        <div className="car-image-shade" />
      </div>

      <section className="premium-enquiry" id="enquiry">
        <div className="enquiry-tabs" role="tablist" aria-label="Enquiry type">
          <button role="tab" aria-selected={mode === 'trip'} className={mode === 'trip' ? 'active' : ''} onClick={() => { setMode('trip'); if (active === 6) setActive(0); }}>Trip Enquiry</button>
          <button role="tab" aria-selected={mode === 'towing'} className={mode === 'towing' ? 'active' : ''} onClick={() => { setMode('towing'); setActive(6); }}>Towing Enquiry</button>
        </div>
        <form onSubmit={submit}>
          <label className="premium-field"><MapPin /><input value={form.pickup} onChange={e => update('pickup', e.target.value)} placeholder={isTow ? 'Current Location' : 'Pickup Location'} required={isTow || mode === 'trip'} /></label>
          {!isTow && <label className="premium-field"><MapPin /><input value={form.destination} onChange={e => update('destination', e.target.value)} placeholder="Destination" required /></label>}
          {!isTow && <div className="premium-field-row"><label className="premium-field"><CalendarDays /><input type="date" value={form.date} onChange={e => update('date', e.target.value)} aria-label="Journey date" required /></label><label className="premium-field"><Clock3 /><input type="time" value={form.time} onChange={e => update('time', e.target.value)} aria-label="Journey time" required /></label></div>}
          {!isTow && <label className="premium-field select-field"><CarFront /><select value={active} onChange={e => chooseVehicle(Number(e.target.value))} aria-label="Choose vehicle">{fleet.map((item, index) => <option key={item.id} value={index}>{item.name}</option>)}</select><ChevronDown className="select-chevron" /></label>}
          <label className="premium-field"><UserRound /><input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your Name" autoComplete="name" required /></label>
          <label className="premium-field"><Phone /><input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="Phone Number" inputMode="tel" autoComplete="tel" required /></label>
          {notice && <p className="premium-notice" role="status">{notice}</p>}
          <button className="whatsapp-submit" type="submit"><MessageCircle size={20} /><span>Send Enquiry on WhatsApp</span><ArrowRight size={19} /></button>
        </form>
        <p className="enquiry-footnote">Enquiry only · availability confirmed by our team</p>
      </section>

      <div className="premium-vehicle-info">
        <div className="vehicle-title-block" key={vehicle.id}><span className="vehicle-count-label">{String(active + 1).padStart(2, '0')} / 07</span><p>{isTow ? 'ROADSIDE SUPPORT' : vehicle.name.split(' ').slice(0, -1).join(' ').toUpperCase()}</p><h1>{isTow ? 'TOWING SUPPORT' : vehicle.name.split(' ').slice(-1)[0].toUpperCase()}</h1><span className="gold-underline" /><div className="vehicle-tagline">{isTow ? 'Help when you need it. Support for the road ahead.' : 'Comfortable. Reliable. Ready for every journey.'}</div></div>
        <div className="vehicle-specs" key={`specs-${vehicle.id}`}>
          <div><Users /><strong>{isTow ? 'On call' : '5–7'}</strong><span>{isTow ? 'Assistance' : 'Seater*'}</span></div>
          <div><Fuel /><strong>{isTow ? 'Recovery' : 'Petrol / Diesel'}</strong><span>{isTow ? 'Support' : 'Fuel type*'}</span></div>
          <div><Snowflake /><strong>{isTow ? 'Roadside' : 'AC*'}</strong><span>Comfort</span></div>
          <div><BriefcaseBusiness /><strong>{isTow ? 'Help' : 'Luggage'}</strong><span>For the trip</span></div>
        </div>
        <div className="vehicle-controls"><button onClick={previous} aria-label="Previous vehicle"><ArrowLeft /></button><a href="#enquiry">View Details <ArrowRight size={15} /></a><button onClick={next} aria-label="Next vehicle"><ArrowRight /></button></div>
      </div>
    </section>
    <footer className="premium-footer" id="about"><span>SRIRAM TRAVELS & TOWING SERVICES</span><span>*Vehicle specifications are indicative. Confirm details and availability with the team.</span><a href="https://www.google.com/maps/search/?api=1&query=Gooty+Andhra+Pradesh" target="_blank" rel="noreferrer">Gooty, Andhra Pradesh ↗</a></footer>
  </main>;
}
