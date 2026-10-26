import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Sparkles,
} from "lucide-react";
import "./PublicHome.css";

const API = "http://localhost:5000/api/events";

export default function PublicHome() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("Unable to load events");
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events
    .filter((event) => {
      if (!event.eventDate) return true;

      const eventDate = new Date(
        `${String(event.eventDate).slice(0, 10)}T00:00:00`
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return (
        !Number.isNaN(eventDate.getTime()) &&
        eventDate >= today
      );
    })
    .sort(
      (a, b) =>
        new Date(a.eventDate) - new Date(b.eventDate)
    );

  return (
    <div className="public-home">
      {/* Navigation */}
      <nav className="public-nav">
        <Link to="/" className="public-brand">
          <span className="brand-symbol">
            <Sparkles size={21} />
          </span>

          <span>
            occasio<span className="brand-dot">.</span>
          </span>
        </Link>

        <div className="public-nav-links">
          <a href="#events">Explore Events</a>

          <Link to="/admin" className="admin-login-link">
            Admin Login
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="public-hero">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              YOUR NEXT EXPERIENCE STARTS HERE
            </span>

            <h1>
              Moments worth
              <br />
              <span>showing up for.</span>
            </h1>

            <p>
              Discover exciting events, meet new people, and
              create memories. Find your next experience with
              Occasio.
            </p>

            <a href="#events" className="explore-button">
              Explore events
              <ArrowUpRight size={18} />
            </a>

            <div className="hero-note">
              <span className="note-line"></span>
              Discover something extraordinary.
            </div>
          </div>

          {/* Decorative Hero Illustration */}
          {/* Event Photography Hero */}
<div className="hero-photo">
  <img
    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85"
    alt="A lively event with people enjoying a celebration"
    className="hero-photo-image"
  />

  <div className="hero-photo-overlay"></div>

  <div className="photo-top-label">
    <span className="photo-label-dot"></span>
    EXPERIENCES THAT CONNECT US
  </div>

  <div className="photo-caption">
    <span className="photo-caption-small">
      MAKE EVERY MOMENT COUNT
    </span>

    <h2>
      Your next
      <br />
      great memory
      <br />
      <span>starts here.</span>
    </h2>
  </div>

  <div className="photo-bottom-tag">
    <CalendarDays size={19} />

    <div>
      <strong>Discover something new</strong>
      <span>Find your next experience</span>
    </div>
  </div>
</div>

  </section>

        {/* Events Section */}
        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                FIND YOUR NEXT EXPERIENCE
              </span>

              <h2>
                Explore events<span>.</span>
              </h2>

              <p>
                Something interesting is always happening.
              </p>
            </div>

            <div className="event-count">
              <strong>
                {String(upcomingEvents.length).padStart(2, "0")}
              </strong>

              <span>UPCOMING EVENTS</span>
            </div>
          </div>

          {loading ? (
            <div className="events-message">
              Discovering events...
            </div>
          ) : error ? (
            <div className="events-message">{error}</div>
          ) : upcomingEvents.length === 0 ? (
            <div className="events-empty">
              <CalendarDays size={30} />

              <h3>Something exciting is coming.</h3>

              <p>
                There are no upcoming events just yet.
                Check back soon!
              </p>
            </div>
          ) : (
            <div className="public-event-grid">
              {upcomingEvents.map((event, index) => (
                <article
                  className="public-event-card"
                  key={event._id || index}
                >
                  <div
                    className={`event-card-art art-${index % 3}`}
                  >
                    <span className="event-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <CalendarDays size={34} />

                    <span className="event-card-label">
                      OCCASIO / EVENTS
                    </span>
                  </div>

                  <div className="public-event-info">
                    <div className="public-event-date">
                      <CalendarDays size={15} />

                      {event.eventDate
                        ? new Date(
                            `${String(event.eventDate).slice(0, 10)}T00:00:00`
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date to be announced"}
                    </div>

                    <h3>
                      {event.eventName || "Untitled Event"}
                    </h3>

                    <p className="public-event-description">
                      {event.description ||
                        "An experience waiting to be discovered."}
                    </p>

                    <div className="public-event-footer">
                      <span className="public-event-venue">
                        <MapPin size={15} />

                        {event.venue ||
                          "Venue to be announced"}
                      </span>

                      <Link
  to={`/register/${event._id}`}
  className="register-link"
>
  Register
  <ArrowUpRight size={17} />
</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Admin Call-to-Action */}
        <section className="public-cta">
          <Sparkles size={22} />

          <div>
            <h2>Have an event to organise?</h2>
            <p>Manage your events with Occasio.</p>
          </div>

          <Link to="/admin" className="cta-admin-link">
            Admin Portal
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <Link to="/" className="footer-brand">
          occasio.
        </Link>

        <span>Made for moments that matter.</span>

        <span>© {new Date().getFullYear()} Occasio</span>
      </footer>
    </div>
  );
}