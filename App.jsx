import { useEffect, useState } from 'react'
import './App.css'
import appointmentData from './data/appointments.json'

const defaultData = {
  doctors: appointmentData.doctors,
  schedule: appointmentData.schedule,
}

const stats = [
  { value: '12k+', label: 'Patients cared' },
  { value: '50+', label: 'Expert doctors' },
  { value: '4.9/5', label: 'Patient rating' },
]

const services = [
  { icon: '🩺', title: 'Primary Care', text: 'Routine checkups and preventive treatment for the whole family.' },
  { icon: '🧠', title: 'Mental Health', text: 'Compassionate support for stress, anxiety, and emotional wellness.' },
  { icon: '💉', title: 'Urgent Care', text: 'Same-day treatment for injuries, fevers, and urgent symptoms.' },
]

const initialForm = {
  fullName: '',
  department: '',
  date: '',
  time: '',
}

function App() {
  const [doctors, setDoctors] = useState(defaultData.doctors)
  const [schedule] = useState(defaultData.schedule)
  const [formData, setFormData] = useState(initialForm)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await fetch('/api/doctors')
        if (!response.ok) {
          throw new Error('Backend unavailable')
        }

        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data)
        }
      } catch {
        setDoctors(defaultData.doctors)
      }
    }

    loadDoctors()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('Saving appointment...')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to save appointment')
      }

      setStatus('Appointment saved successfully to MongoDB.')
      setFormData(initialForm)
    } catch (error) {
      setStatus(error.message || 'Something went wrong while saving appointment.')
    }
  }

  return (
    <div className="hospital-app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">+</span>
          <span>MediCare</span>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#doctors">Doctors</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button type="button" className="primary-btn">
          Book Now
        </button>
      </header>

      <main className="page-shell">
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Your health comes first</p>
            <h1>Healthcare made simple and personal.</h1>
            <p className="subtext">
              Book trusted clinicians, manage appointments, and access care that fits your routine.
            </p>

            <div className="cta-row">
              <button type="button" className="primary-btn large">
                Book Appointment
              </button>
              <button type="button" className="secondary-btn">
                Learn More
              </button>
            </div>

            <div className="stats-row">
              {stats.map((item) => (
                <div key={item.label} className="stat-box">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-label="Doctor profile card">
            <div className="doctor-panel">
              <div className="doctor-avatar">✚</div>
              <div className="doctor-meta">
                <p className="label">Available doctor</p>
                <h3>Dr. Yug Pathak</h3>
                <span>General Physician</span>
              </div>
            </div>

            <div className="booking-card">
              <span>Doctor</span>
              <strong>Yug</strong>
            </div>

            <div className="floating-note">24/7 Care Support</div>
          </div>
        </section>

        <section className="services" id="services">
          <div className="section-heading">
            <p className="eyebrow">Why choose us</p>
            <h2>Complete healthcare services</h2>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article key={service.title} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="doctor-section" id="doctors">
          <div className="section-heading">
            <p className="eyebrow">Meet our specialists</p>
            <h2>Qualified doctors ready to help</h2>
          </div>

          <div className="doctor-list">
            {doctors.map((doctor) => (
              <article key={doctor.name} className="doctor-card">
                <div className="mini-avatar">✚</div>
                <div>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialty}</p>
                </div>
                <div className="doctor-info">
                  <span>{doctor.time}</span>
                  <em className={doctor.badge === 'Available' ? 'available' : 'booked'}>
                    {doctor.badge}
                  </em>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="appointment-row" id="about">
          <div className="schedule-panel">
            <div className="section-heading left-align">
              <p className="eyebrow">Calendar</p>
              <h2>Available schedule</h2>
            </div>

            <div className="schedule-list">
              {schedule.map((item) => (
                <div key={item.day} className="slot-row">
                  <span>{item.day}</span>
                  <strong>{item.slot}</strong>
                  <em className={item.status === 'Open' ? 'open' : 'booked'}>{item.status}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="booking-form" id="contact">
            <p className="eyebrow">Request appointment</p>
            <h2>Book your visit today</h2>

            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <label>
                  Full name
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Department
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select department
                    </option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Neurology</option>
                  </select>
                </label>
              </div>

              <div className="field-row">
                <label>
                  Date
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Time
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <button type="submit" className="primary-btn large wide">
                Confirm Appointment
              </button>

              {status && <p className="form-status">{status}</p>}
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
