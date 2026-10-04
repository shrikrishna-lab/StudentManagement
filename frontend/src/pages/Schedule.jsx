import React, { useState } from 'react';
import { Plus, Check, Clock } from 'lucide-react';

export default function Schedule({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Core Java', 'Data Structures', 'DBMS', 'Networks', 'Labs'];

  const days = [
    { name: '1 - Mon', isToday: false },
    { name: '2 - Tue', isToday: true },
    { name: '3 - Wed', isToday: false },
    { name: '4 - Thur', isToday: false },
    { name: '5 - Fri', isToday: false },
    { name: '6 - Sat', isToday: false },
    { name: '7 - Sun', isToday: false }
  ];

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'
  ];

  // Schedule events matching the pastel card layout of reference image 1
  const events = [
    {
      id: 1,
      dayIndex: 1, // Tue
      top: 15,
      height: 65,
      color: 'purple',
      title: 'Java OOP Exam',
      time: '07:00am - 07:45am',
      confirmed: false
    },
    {
      id: 2,
      dayIndex: 1, // Tue
      top: 85,
      height: 70,
      color: 'blue',
      title: 'Collections Lab',
      time: '08:00am - 09:15am',
      confirmed: false
    },
    {
      id: 3,
      dayIndex: 1, // Tue
      top: 240,
      height: 80,
      color: 'orange',
      title: 'Data Structures Practical',
      time: '10:30am - 12:00pm',
      confirmed: true
    },
    {
      id: 4,
      dayIndex: 3, // Thur
      top: 160,
      height: 60,
      color: 'purple',
      title: 'Operating Systems',
      time: '09:00am - 09:50am',
      confirmed: false
    },
    {
      id: 5,
      dayIndex: 3, // Thur
      top: 230,
      height: 80,
      color: 'green',
      title: 'Computer Networks Viva',
      time: '10:00am - 11:30am',
      confirmed: true
    },
    {
      id: 6,
      dayIndex: 5, // Sat
      top: 80,
      height: 65,
      color: 'blue',
      title: 'Algorithms Seminar',
      time: '08:00am - 09:00am',
      confirmed: false
    },
    {
      id: 7,
      dayIndex: 5, // Sat
      top: 155,
      height: 75,
      color: 'orange',
      title: 'Software Project Review',
      time: '09:15am - 10:45am',
      confirmed: true
    }
  ];

  return (
    <div>
      {/* Hero Header with Title & Filter Pills */}
      <div className="page-hero-bar">
        <div className="hero-date-title">
          01–07 October 2026
        </div>

        <div className="pill-group">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn-pill-dark" onClick={() => onNavigate('add')}>
            <Plus size={16} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Timetable Matrix View */}
      <div className="timetable-container">
        {/* Days Header */}
        <div className="timetable-header">
          <div className="day-header-cell" style={{ color: 'var(--text-muted)' }}>
            <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </div>
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`day-header-cell ${day.isToday ? 'active-day' : ''}`}
            >
              {day.name}
            </div>
          ))}
        </div>

        {/* Timetable Body Grid */}
        <div className="timetable-grid">
          {/* Time Slot Labels */}
          <div className="time-slot-column">
            {timeSlots.map((time, idx) => (
              <div key={idx} className="time-slot-label">
                {time}
              </div>
            ))}
          </div>

          {/* 7 Day Columns */}
          {days.map((day, dIdx) => (
            <div key={dIdx} className="day-column">
              {timeSlots.map((_, hIdx) => (
                <div key={hIdx} className="grid-cell-hour" />
              ))}

              {/* Current Time Indicator on Tuesday (Reference 1) */}


              {/* Render Events */}
              {events
                .filter((ev) => ev.dayIndex === dIdx)
                .map((ev) => (
                  <div
                    key={ev.id}
                    className={`event-card ${ev.color}`}
                    style={{
                      top: `${ev.top}px`,
                      height: `${ev.height}px`
                    }}
                  >
                    <div className="event-card-title">
                      <span>{ev.title}</span>
                      <span style={{ fontSize: '12px', opacity: 0.6 }}>•••</span>
                    </div>
                    <div className="event-card-time">{ev.time}</div>
                    {ev.confirmed && (
                      <div className="confirmed-chip">
                        <Check size={11} />
                        <span>Confirmed</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Pastel Pin Markers Footer (from reference 1) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
        <div className="action-circle" style={{ background: '#fed7aa', color: '#9a3412', width: 36, height: 36 }}>
          ✏️
        </div>
        <div className="action-circle" style={{ background: '#bae6fd', color: '#0369a1', width: 36, height: 36 }}>
          📌
        </div>
        <div className="action-circle" style={{ background: '#e9d5ff', color: '#6b21a8', width: 36, height: 36 }}>
          🏷️
        </div>
        <div className="action-circle" style={{ background: '#fecaca', color: '#991b1b', width: 36, height: 36 }}>
          📎
        </div>
      </div>
    </div>
  );
}
