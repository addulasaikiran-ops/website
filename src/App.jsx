import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronRight, Clock3, Compass, MapPin, Menu, Phone, ShieldCheck, Sparkles, Truck, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { business, fleet, towing } from './data.js';

gsap.registerPlugin(ScrollTrigger);

const allVehicles = [...fleet, towing];
const waLink = (message) => `https://wa.me/${business.phone}?text=${encodeURIComponent(message)}`;
const minDate = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="topbar">
    <a className="wordmark" href="#home" aria-label="Sriram Travels home">
      <span className="brand-mark">S<span>.</span></span>
      <span className="brand-copy"><strong>SRIRAM</strong><small>TRAVELS & TOWING</small></span>
    </a>
    <nav className={`top-links ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
      <a onClick={() => setMenuOpen(false)} href="#fleet">The fleet</a>
      <a onClick={() => setMenuOpen(false)} href="#services">Services</a>
      <a onClick={() => setMenuOpen(false)} href="#about">Our story</a>
      <a onClick={() => setMenuOpen(false)} href="#contact">Contact</a>
    </nav>
    <a className="header-cta" href="#booking">Plan a journey <ArrowUpRight size={15} /></a>
    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
  </header>;
}

function FleetSidebar({ active, progress, onSelect }) {
  return <aside className="fleet-sidebar" aria-label="Fleet selector">
    <div className="sidebar-label">OUR COLLECTION <span>07</span></div>
    <div className="fleet-nav">
      {allVehicles.map((vehicle, index) => <button key={vehicle.id} className={`fleet-nav-item ${active === index ? 'active' : ''} ${index === 6 ? 'tow-nav' : ''}`} onClick={() => onSelect(index)} aria-current={active === index ? 'true' : undefined}>
        <span className="nav-number">{vehicle.id}</span>
        <span className="nav-car-icon">{index === 6 ? <Truck size={17} /> : <span className="car-glyph">▰</span>}</span>
        <span className="nav-car-name">{index === 6 ? 'Towing & recovery' : vehicle.name}</span>
        {active === index && <ChevronRight size={15} className="nav-arrow" />}
      </button>)}
    </div>
    <div className="sidebar-bottom"><span>SCROLL TO EXPLORE</span><div className="progress-track"><i style={{ width: `${progress}%` }} /></div><span className="progress-value">{String(Math.round(progress)).padStart(2, '0')}%</span></div>
  </aside>;
}

function BookingPanel({ selectedVehicle }) {
  const [form, setForm] = useState({ pickup: 'Gooty, Andhra Pradesh', dropoff: '', pickupDate: '', pickupTime: '09:00', returnDate: '', returnTime: '18:00' });
  const [feedback, setFeedback] = useState('');
  const today = minDate().slice(0, 10);
  const set = (key, value) => { setForm(old => ({ ...old, [key]: value })); setFeedback(''); };
  const submit = (event) => {
    event.preventDefault();
    const start = new Date(`${form.pickupDate}T${form.pickupTime}`);
    const end = new Date(`${form.returnDate}T${form.returnTime}`);
    if (!form.pickupDate || !form.returnDate || !form.pickup.trim() || !form.dropoff.trim()) {
      setFeedback('Please complete your locations and travel dates.'); return;
    }
    if (start < new Date()) { setFeedback('Please choose a pickup time that has not passed.'); return; }
    if (end <= start) { setFeedback('Return must be after your pickup date and time.'); return; }
    const message = [
      'Hello Sriram Travels & Towing Services, I would like to enquire about a trip.',
      `Vehicle: ${selectedVehicle.name}`,
      `Pickup: ${form.pickup}`,
      `Drop-off: ${form.dropoff}`,
      `Pickup: ${form.pickupDate} at ${form.pickupTime}`,
      `Return: ${form.returnDate} at ${form.returnTime}`,
      'Please share availability and a quote. I understand this is an enquiry, not a confirmed booking.',
    ].join('\n');
    setFeedback('Opening WhatsApp with your enquiry…');
    window.open(waLink(message), '_blank', 'noopener,noreferrer');
  };
  return <form className="booking-panel" onSubmit={submit} id="booking">
    <div className="booking-heading"><div><span className="eyebrow">LET'S GET YOU THERE</span><h3>Plan your journey<span>.</span></h3></div><span className="booking-icon"><CalendarDays size={20} /></span></div>
    <div className="selected-vehicle"><span className="selected-dot" /><span>YOUR SELECTION</span><strong>{selectedVehicle.name}</strong><button type="button" onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}>Change</button></div>
    <div className="form-grid">
      <label className="field full"><span><MapPin size={13} /> PICKUP LOCATION</span><input value={form.pickup} onChange={e => set('pickup', e.target.value)} placeholder="Where from?" required /></label>
      <label className="field full"><span><Compass size={13} /> DROP-OFF LOCATION</span><input value={form.dropoff} onChange={e => set('dropoff', e.target.value)} placeholder="Where to?" required /></label>
      <label className="field"><span><CalendarDays size={13} /> PICKUP DATE</span><input type="date" min={today} value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} required /></label>
      <label className="field"><span><Clock3 size={13} /> TIME</span><input type="time" value={form.pickupTime} onChange={e => set('pickupTime', e.target.value)} required /></label>
      <label className="field"><span><CalendarDays size={13} /> RETURN DATE</span><input type="date" min={form.pickupDate || today} value={form.returnDate} onChange={e => set('returnDate', e.target.value)} required /></label>
      <label className="field"><span><Clock3 size={13} /> TIME</span><input type="time" value={form.returnTime} onChange={e => set('returnTime', e.target.value)} required /></label>
    </div>
    {feedback && <p className={`form-feedback ${feedback.startsWith('Opening') ? 'success' : ''}`} role="status">{feedback}</p>}
    <button className="button button-dark submit-button" type="submit">Send trip enquiry <ArrowUpRight size={17} /></button>
    <p className="booking-disclaimer"><ShieldCheck size={13} /> Enquiry only. Availability and pricing are confirmed directly by the team.</p>
  </form>;
}

function VehicleShowcase({ vehicle, index, isTow, onBook }) {
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [vehicle.id]);
  return <section className={`showcase-section ${vehicle.scene} ${isTow ? 'towing-section' : ''}`} id={isTow ? 'towing' : `vehicle-${index + 1}`} data-vehicle-index={index}>
    <div className="showcase-pin">
      <div className="scene-grain" />
      <div className="scene-orbit orbit-one" /><div className="scene-orbit orbit-two" />
      <div className="scene-copy">
        <span className="section-kicker"><i /> {isTow ? 'WHEN THE UNEXPECTED HAPPENS' : `THE COLLECTION / 0${index + 1}`}</span>
        <p className="vehicle-category">{vehicle.category}</p>
        <h2>{isTow ? <>Help is<br /><em>on the way.</em></> : <>{vehicle.name.split(' ').slice(0, 2).join(' ')}<br /><em>{vehicle.name.split(' ').slice(2).join(' ') || 'for every road.'}</em></>}</h2>
        <p className="vehicle-description">{vehicle.description}</p>
        <div className="vehicle-facts"><span><i className="fact-icon">{isTow ? <Truck size={16} /> : <Compass size={16} />}</i><span>{isTow ? 'Towing support' : 'Local & outstation'}</span></span><span><i className="fact-icon"><MapPin size={16} /></i><span>Based in Gooty</span></span></div>
        <div className="vehicle-actions">
          <button className={`button ${isTow ? 'button-amber' : 'button-dark'}`} onClick={() => isTow ? window.location.href = `tel:+${business.phone}` : onBook(vehicle)}>{isTow ? 'Call for assistance' : 'Request a quote'} <ArrowUpRight size={16} /></button>
          {!isTow && <span className="price-note">Rates on request</span>}
        </div>
      </div>
      <div className="vehicle-visual-wrap">
        <div className="visual-halo" />
        {!imageFailed ? <img className="vehicle-visual" src={vehicle.image} alt={isTow ? 'Illustrative towing and roadside recovery vehicle' : `Illustrative vehicle visual for ${vehicle.name}`} loading="lazy" onError={() => setImageFailed(true)} /> : <div className="image-fallback">{isTow ? <Truck size={100} strokeWidth={1} /> : <div className="fallback-car">SR<span>.</span></div>}<span>Fleet image coming soon</span></div>}
        <div className="visual-caption"><span>SRIRAM / {vehicle.id}</span><span>{isTow ? 'RECOVERY SUPPORT' : 'VISUAL PREVIEW'}</span></div>
        <div className="visual-index">{vehicle.id}</div>
      </div>
      <div className="scene-footer"><span>GO FURTHER, BEAUTIFULLY</span><span>SCROLL TO DISCOVER <ArrowDown size={13} /></span></div>
    </div>
  </section>;
}

function Services() {
  return <section className="services-section" id="services">
    <div className="section-heading"><span className="eyebrow">MADE FOR THE JOURNEY</span><h2>Good journeys begin<br />with <em>good people.</em></h2><p>From the first kilometre to an unexpected stop, one local team to contact for travel and towing enquiries.</p></div>
    <div className="service-list">
      <article className="service-item"><span className="service-number">01</span><div className="service-symbol"><Compass /></div><div><h3>Local travel</h3><p>Everyday trips and getting around Gooty. Share your route and we'll help you enquire.</p></div><ArrowUpRight className="service-arrow" /></article>
      <article className="service-item"><span className="service-number">02</span><div className="service-symbol"><ArrowUpRight /></div><div><h3>Outstation journeys</h3><p>Planning a trip beyond town? Ask about a suitable vehicle and a quote for your itinerary.</p></div><ArrowUpRight className="service-arrow" /></article>
      <article className="service-item"><span className="service-number">03</span><div className="service-symbol"><Truck /></div><div><h3>Towing & recovery</h3><p>Contact the team to enquire about towing support when your vehicle needs help.</p></div><ArrowUpRight className="service-arrow" /></article>
    </div>
  </section>;
}

function ContactSection() {
  return <section className="contact-section" id="contact">
    <div className="contact-top"><span className="eyebrow">LET'S TALK</span><h2>Your next journey<br />starts <em>right here.</em></h2><p>Tell us what you need. The team can help you discuss a trip, request a quote or enquire about towing support.</p><div className="contact-actions"><a className="button button-light" href={`tel:+${business.phone}`}><Phone size={16} /> Call the team</a><a className="button button-outline-light" target="_blank" rel="noreferrer" href={waLink('Hello Sriram Travels & Towing Services, I would like to enquire about your services.')}>WhatsApp us <ArrowUpRight size={16} /></a></div></div>
    <div className="contact-details"><div className="contact-detail"><span>CALL US</span><a href={`tel:+${business.phone}`}>{business.phoneDisplay}</a></div><div className="contact-detail"><span>FIND US</span><p>{business.address}</p><a className="text-link" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=Door+No+1+960+RTC+Bus+Stand+Road+Gooty+Andhra+Pradesh+515401">Open directions <ArrowUpRight size={13} /></a></div><div className="contact-detail"><span>FOR BOOKINGS</span><p>Share your dates and route to request availability and a quote.</p></div></div>
  </section>;
}

export default function App() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bookingVehicle, setBookingVehicle] = useState(fleet[0]);
  const [showBooking, setShowBooking] = useState(false);
  const reducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const selectVehicle = (index) => {
    setActive(index);
    const target = index === 6 ? document.getElementById('towing') : document.getElementById(`vehicle-${index + 1}`);
    target?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };
  const bookVehicle = (vehicle) => {
    setBookingVehicle(vehicle);
    setShowBooking(true);
    window.setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' }), 40);
  };

  useEffect(() => {
    const triggers = [];
    const sections = gsap.utils.toArray('.showcase-section');
    sections.forEach((section, index) => {
      const stage = section.querySelector('.showcase-pin');
      const visual = section.querySelector('.vehicle-visual');
      const copy = section.querySelector('.scene-copy');
      const title = section.querySelector('h2');
      if (!reducedMotion) {
        triggers.push(ScrollTrigger.create({
          trigger: section, start: 'top top+=70', end: '+=45%', pin: stage, pinSpacing: true, scrub: 0.65,
          onUpdate: self => {
            if (visual) gsap.set(visual, { x: self.progress * -45, rotateY: self.progress * -4, scale: 1 - self.progress * 0.045 });
            if (copy) gsap.set(copy, { x: self.progress * -14, opacity: 1 - self.progress * 0.15 });
          }
        }));
        if (visual) gsap.fromTo(visual, { x: 100, rotateY: -9, scale: .88, opacity: .45 }, { x: 0, rotateY: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 20%', scrub: true } });
        if (title) gsap.fromTo(title, { y: 34, opacity: .3 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 78%', end: 'top 38%', scrub: true } });
      }
      triggers.push(ScrollTrigger.create({ trigger: section, start: 'top center', end: 'bottom center', onEnter: () => setActive(index), onEnterBack: () => setActive(index) }));
    });
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      triggers.forEach(trigger => trigger.kill());
      ScrollTrigger.getAll().forEach(trigger => { if (trigger.vars?.trigger && document.body.contains(trigger.vars.trigger)) trigger.kill(); });
    };
  }, [reducedMotion]);

  return <>
    <Header />
    <FleetSidebar active={active} progress={progress} onSelect={selectVehicle} />
    <main className="page-main">
      <section className="hero-section" id="home">
        <div className="hero-background"><img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=90" alt="" fetchPriority="high" /></div>
        <div className="hero-shade" />
        <div className="hero-content"><span className="hero-eyebrow"><span /> A LOCAL NAME. A WIDER ROAD.</span><h1>Go further,<br /><em>beautifully.</em></h1><p>Thoughtful travel and towing support from Gooty, Andhra Pradesh. Tell us where you're headed — we'll help you take the next step.</p><div className="hero-actions"><a className="button button-dark" href="#fleet">Explore the fleet <ArrowDownRight size={17} /></a><a className="hero-text-link" href="#booking">Plan a trip <ArrowUpRight size={15} /></a></div></div>
        <div className="hero-side-note"><span>EST. IN GOOTY</span><i /> <span>TRAVEL · TOWING · CARE</span></div>
        <div className="hero-bottom"><span>01 — 07 / FIND YOUR RIDE</span><a href="#fleet">DISCOVER THE COLLECTION <ArrowDown size={13} /></a></div>
        <div className="hero-stamp"><span>SR</span><small>TRAVEL<br />WITH CARE</small></div>
      </section>

      <section className="fleet-intro" id="fleet"><div><span className="eyebrow">THE FLEET / 001—006</span><h2>Every road has<br />a <em>right ride.</em></h2></div><p>Explore the collection. Fleet models and specifications are being confirmed with the business, so send an enquiry for the latest vehicle options and rates.</p><div className="intro-count"><strong>06</strong><span>CAR ENQUIRIES</span></div></section>

      {fleet.map((vehicle, index) => <VehicleShowcase key={vehicle.id} vehicle={vehicle} index={index} isTow={false} onBook={bookVehicle} />)}
      <VehicleShowcase vehicle={towing} index={6} isTow onBook={bookVehicle} />

      <Services />
      <section className="about-section" id="about"><div className="about-mark">S<span>.</span></div><div className="about-copy"><span className="eyebrow">ROOTED IN GOOTY</span><h2>Local knowledge.<br /><em>A human touch.</em></h2><p>Sriram Travels & Towing Services is listed in Gooty, Andhra Pradesh. Whether you're planning a local trip, an outstation journey or need to enquire about towing, contact the team directly to discuss your needs.</p><a className="text-link" href={business.listingUrl} target="_blank" rel="noreferrer">View public business listing <ArrowUpRight size={14} /></a></div><div className="about-quote"><Sparkles size={19} /><p>Every journey is different.<br />Let's plan yours together.</p><span>SRIRAM TRAVELS & TOWING</span></div></section>

      <section className="booking-section"><div className="booking-section-copy"><span className="eyebrow">YOUR JOURNEY, YOUR WAY</span><h2>Where to<br /><em>next?</em></h2><p>Share a few details and send your enquiry directly to the team on WhatsApp. No online payment, no assumed availability — just a straightforward way to get started.</p><div className="booking-promise"><span><Check size={14} /> Request a quote</span><span><Check size={14} /> Confirm details directly</span></div></div><BookingPanel selectedVehicle={bookingVehicle} /></section>
      <ContactSection />
    </main>
    <footer className="site-footer"><a className="wordmark footer-wordmark" href="#home"><span className="brand-mark">S<span>.</span></span><span className="brand-copy"><strong>SRIRAM</strong><small>TRAVELS & TOWING</small></span></a><p>Local journeys. Longer roads. Help when you need it.</p><div className="footer-links"><a href="#fleet">Fleet</a><a href="#services">Services</a><a href="#contact">Contact</a><a href={business.listingUrl} target="_blank" rel="noreferrer">Public listing <ArrowUpRight size={12} /></a></div><span className="copyright">© {new Date().getFullYear()} SRIRAM TRAVELS & TOWING SERVICES · GOOTY, AP</span></footer>
    {showBooking && <div className="booking-toast" role="status"><span><Check size={15} /></span><div><strong>Selected for your enquiry</strong><small>{bookingVehicle.name} · Fill the form below to continue</small></div><button aria-label="Dismiss message" onClick={() => setShowBooking(false)}><X size={16} /></button></div>}
    <a className="mobile-call" href={`tel:+${business.phone}`}><Phone size={17} /> Call Sriram Travels</a>
  </>;
}
