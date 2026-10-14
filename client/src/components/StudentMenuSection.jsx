// client/src/components/StudentMenuSection.jsx
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import {
  Utensils,
  Sun,
  Coffee,
  Apple,
  ShieldCheck,
  HeartPulse,
  Leaf,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { fetchMenu } from '../api';

export default function StudentMenuSection({ onOpenAdmin }) {
  const [menuDays, setMenuDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [loading, setLoading] = useState(true);

  const cardSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.96)' },
    to: { opacity: 1, transform: 'scale(1)' },
    reset: true,
    key: selectedDay,
    config: { tension: 280, friction: 20 }
  });

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await fetchMenu();
      if (data && data.days) {
        setMenuDays(data.days);
      }
    } catch (err) {
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentMenu = menuDays.find((m) => m.day.toLowerCase() === selectedDay.toLowerCase()) || menuDays[0];

  return (
    <section className="menu-section">
      <div className="container">
        {/* Section Header */}
        <div className="menu-header">
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>
            <Sparkles size={14} />
            <span>Parent Nutrition & Wellness Portal</span>
          </div>
          <h2 className="menu-title">
            Student Daily <span className="text-gold">Dining & Nutrition</span> Menu
          </h2>
          <p className="menu-desc">
            Designed by certified pediatric nutritionists across the Arabian Gulf. Every meal is 100% Halal certified,
            strictly nut-free, balanced for high cognitive performance, and transparent for parents.
          </p>
        </div>

        {/* GCC School Week Day Tabs (Sunday - Thursday) */}
        <div className="day-tabs-wrapper">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
            <button
              key={day}
              className={`day-tab ${selectedDay.toLowerCase() === day.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <Calendar size={15} />
              <span>{day}</span>
            </button>
          ))}
        </div>

        {/* Current Day's Culinary Breakdown */}
        {loading || !currentMenu ? (
          <div className="loading-box">Loading GCC dining schedule...</div>
        ) : (
          <animated.div style={cardSpring} className="menu-display-card glass-panel">
            {/* Day Theme Banner */}
            <div className="theme-bar">
              <div className="theme-info">
                <span className="theme-label">CATERING THEME</span>
                <h3 className="theme-title">{currentMenu.theme}</h3>
              </div>
              <div className="compliance-tags">
                <span className="badge badge-emerald">
                  <ShieldCheck size={14} /> 100% Halal Certified
                </span>
                <span className="badge badge-gold">
                  <Leaf size={14} /> Nut-Free Facility
                </span>
              </div>
            </div>

            {/* Meal Courses Grid */}
            <div className="courses-grid">
              {/* Course 1: Breakfast */}
              <div className="course-box">
                <div className="course-badge breakfast">
                  <Coffee size={18} />
                  <span>Morning Nourishment</span>
                </div>
                <h4 className="dish-name">{currentMenu.breakfast.dish}</h4>
                <div className="nutrition-pills">
                  <span className="nutri-tag">🔥 {currentMenu.breakfast.calories} kcal</span>
                  <span className="nutri-tag">💪 {currentMenu.breakfast.protein} protein</span>
                </div>
                <div className="beverage-note">
                  <strong>Morning Drink:</strong> {currentMenu.breakfast.drink}
                </div>
                <div className="allergens-list">
                  Allergens: {currentMenu.breakfast.allergens?.join(', ') || 'None'}
                </div>
              </div>

              {/* Course 2: Snack */}
              <div className="course-box">
                <div className="course-badge snack">
                  <Apple size={18} />
                  <span>Recess Brain Snack</span>
                </div>
                <h4 className="dish-name">{currentMenu.snack.dish}</h4>
                <div className="nutrition-pills">
                  <span className="nutri-tag">🔥 {currentMenu.snack.calories} kcal</span>
                  <span className="nutri-tag">⚡ Fast Clean Energy</span>
                </div>
                <div className="diet-note">
                  Fresh fruits & fiber tailored to replenish glycogen levels before noon classes.
                </div>
              </div>

              {/* Course 3: Hot Chef Lunch */}
              <div className="course-box highlight-lunch">
                <div className="course-badge lunch">
                  <Utensils size={18} />
                  <span>Executive Chef Lunch</span>
                </div>
                <h4 className="dish-name lunch-dish">{currentMenu.lunch.dish}</h4>
                <div className="nutrition-pills">
                  <span className="nutri-tag">🔥 {currentMenu.lunch.calories} kcal</span>
                  <span className="nutri-tag">💪 {currentMenu.lunch.protein} protein</span>
                  <span className="nutri-tag">🌾 {currentMenu.lunch.carbs} carbs</span>
                </div>
                <div className="veg-option">
                  <Leaf size={14} className="text-emerald" />
                  <span>
                    <strong>Vegetarian Choice:</strong> {currentMenu.lunch.vegetarianAlternative}
                  </span>
                </div>
                <div className="allergens-list">
                  Allergens: {currentMenu.lunch.allergens?.join(', ') || 'Halal Certified'}
                </div>
              </div>
            </div>

            {/* Parent Dietary Note */}
            <div className="parent-advisory">
              <Info size={18} className="text-gold" />
              <span>
                <strong>Parent Dietary Notice:</strong> Custom meal plans for students with specific allergies or medical requirements
                can be registered directly with the campus health officer during Parent-Teacher Consultations.
              </span>
            </div>
          </animated.div>
        )}
      </div>

      <style>{`
        .menu-section {
          padding: 60px 0;
        }

        .menu-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 36px;
        }

        .menu-title {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          margin-bottom: 12px;
        }

        .text-gold {
          color: #fbbf24;
        }

        .menu-desc {
          color: #94a3b8;
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .day-tabs-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 32px;
        }

        .day-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-size: 0.92rem;
          font-weight: 600;
          transition: all 0.25s ease;
        }

        .day-tab:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .day-tab.active {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #0f172a;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
          transform: translateY(-2px);
        }

        .menu-display-card {
          padding: 32px;
          border-radius: 28px;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .theme-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 24px;
          margin-bottom: 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .theme-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: 0.08em;
        }

        .theme-title {
          font-size: 1.6rem;
          color: #ffffff;
        }

        .compliance-tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .course-box {
          padding: 24px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .highlight-lunch {
          background: rgba(245, 158, 11, 0.04);
          border-color: rgba(245, 158, 11, 0.2);
        }

        .course-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .course-badge.breakfast {
          color: #60a5fa;
        }

        .course-badge.snack {
          color: #34d399;
        }

        .course-badge.lunch {
          color: #fbbf24;
        }

        .dish-name {
          font-size: 1.15rem;
          color: #ffffff;
          line-height: 1.4;
          min-height: 55px;
        }

        .nutrition-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .nutri-tag {
          font-size: 0.76rem;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          color: #cbd5e1;
          font-weight: 600;
        }

        .beverage-note, .veg-option, .diet-note {
          font-size: 0.85rem;
          color: #94a3b8;
          line-height: 1.5;
        }

        .allergens-list {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: auto;
          padding-top: 8px;
          border-top: 1px dashed rgba(255, 255, 255, 0.06);
        }

        .parent-advisory {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 14px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: #cbd5e1;
          font-size: 0.88rem;
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
