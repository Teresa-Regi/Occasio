import RegistrationForm from "./RegistrationForm";
import PublicHome from "./PublicHome";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  CalendarDays,
  Plus,
  MapPin,
  Clock,
  Users,
  Pencil,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Search,
  X,
  ChevronRight,
} from "lucide-react";
import "./App.css";

const API = "http://localhost:5000/api/events";

// SIDEBAR
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <CalendarDays size={23} />
        </div>
        <div>
          <h2>
            occasio<span>.</span>
          </h2>
          <small>EVENT MANAGEMENT</small>
        </div>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <nav className="navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <LayoutDashboard size={19} />
          Dashboard
          <ChevronRight size={16} className="nav-arrow" />
        </NavLink>

        <NavLink
          to="/admin/add"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <Plus size={19} />
          Add Event
          <ChevronRight size={16} className="nav-arrow" />
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-decoration">
          <Sparkles size={20} />
        </div>
        <p>Make every moment count.</p>
        <small>
          Thoughtfully managed events, all in one place.
        </small>
      </div>

      <div className="profile">
        <div className="avatar">O</div>
        <div>
          <strong>Administrator</strong>
          <small>Event Manager</small>
        </div>
        <span className="online-dot"></span>
      </div>
    </aside>
  );
}

// DASHBOARD
function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API);
      setEvents(response.data);
    } catch (error) {
      alert(
        "Could not load events. Check that the backend and MongoDB are running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // DELETE EVENT
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== id)
      );
    } catch (error) {
      alert("Unable to delete the event.");
    }
  };

  const filteredEvents = events.filter((event) =>
    `${event.eventName} ${event.venue}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const registrations = events.reduce(
    (total, event) =>
      total + (event.totalRegistrations || 0),
    0
  );

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span> <strong>Dashboard</strong>
        </div>

        <div className="topbar-right">
          <span className="live-indicator"></span>
          Live overview
          <div className="top-avatar">O</div>
        </div>
      </header>

      <main className="page-content">
        <section className="welcome">
          <div>
            <div className="eyebrow">
              <Sparkles size={14} /> YOUR EVENT SPACE
            </div>

            <h1>
              Every event, <span>beautifully</span>
              <br />
              in place.
            </h1>

            <p>
              Manage your experiences, track registrations,
              and bring people together.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => navigate("/admin/add")}
          >
            <Plus size={18} />
            Create event
            <ArrowUpRight size={17} />
          </button>
        </section>

        {/* STATISTICS */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Events</span>
              <div className="stat-icon violet">
                <CalendarDays size={20} />
              </div>
            </div>

            <h2>{events.length.toString().padStart(2, "0")}</h2>

            <p>
              <span className="stat-dot"></span>
              Events in your workspace
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Registrations</span>
              <div className="stat-icon orange">
                <Users size={20} />
              </div>
            </div>

            <h2>{registrations.toString().padStart(2, "0")}</h2>

            <p>
              <span className="stat-dot orange-dot"></span>
              Across all your events
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Upcoming Events</span>
              <div className="stat-icon green">
                <Clock size={20} />
              </div>
            </div>

            <h2>
              {events
                .filter(
                  (event) =>
                    new Date(event.eventDate) >= new Date()
                )
                .length.toString()
                .padStart(2, "0")}
            </h2>

            <p>
              <span className="stat-dot green-dot"></span>
              Ready to happen
            </p>
          </div>
        </section>

        {/* EVENTS TABLE */}
        <section className="events-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">YOUR COLLECTION</div>

              <h2>
                Manage events{" "}
                <span className="count-badge">{events.length}</span>
              </h2>

              <p>All your experiences, in one place.</p>
            </div>

            <div className="search-box">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events..."
              />

              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>EVENT DETAILS</th>
                  <th>EVENT DATE</th>
                  <th>VENUE</th>
                  <th>REGISTRATIONS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Loading your events...
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <div className="empty-icon">
                        <CalendarDays size={27} />
                      </div>

                      <strong>
                        {search
                          ? "No matching events"
                          : "Your story starts here"}
                      </strong>

                      <p>
                        {search
                          ? "Try another search term."
                          : "Create your first event and watch your dashboard come alive."}
                      </p>

                      {!search && (
                        <button
                          className="primary-btn"
                          onClick={() => navigate("/add")}
                        >
                          <Plus size={17} />
                          Add your first event
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event, index) => (
                    <tr
                      key={event._id}
                      className="event-row"
                      style={{
                        animationDelay: `${index * 70}ms`,
                      }}
                    >
                      <td>
                        <div className="event-details">
                          <div
                            className={`event-symbol symbol-${index % 4}`}
                          >
                            <CalendarDays size={20} />
                          </div>

                          <div>
                            <strong>{event.eventName}</strong>
                            <small>
                              ID: {event._id.slice(-8).toUpperCase()}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="date-cell">
                          {new Date(
                            event.eventDate
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      <td>
                        <div className="venue-cell">
                          <MapPin size={15} />
                          {event.venue}
                        </div>
                      </td>

                      <td>
                        <span className="registration-badge">
                          <Users size={14} />
                          {event.totalRegistrations || 0}
                        </span>
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            className="icon-btn edit-btn"
                            title="Update event"
                            onClick={() =>
                              navigate(`/edit/${event._id}`)
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="icon-btn delete-btn"
                            title="Delete event"
                            onClick={() => deleteEvent(event._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Showing <strong>{filteredEvents.length}</strong> of{" "}
            <strong>{events.length}</strong> events
            <span>•</span> Powered by Occasio
          </div>
        </section>

        <footer className="footer">
          Made for moments that matter <span>✳</span>
        </footer>
      </main>
    </>
  );
}

// ADD / EDIT EVENT FORM
function EventForm({ editing = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    eventDate: "",
    venue: "",
  });

  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(editing);

  // LOAD EXISTING EVENT
  useEffect(() => {
    if (!editing) return;

    const loadEvent = async () => {
      try {
        const { data } = await axios.get(API);
        const event = data.find((item) => item._id === id);

        if (!event) {
          alert("Event not found.");
          navigate("/");
          return;
        }

        setForm({
          eventName: event.eventName || "",
          description: event.description || "",
          eventDate: event.eventDate
            ? new Date(event.eventDate).toISOString().slice(0, 10)
            : "",
          venue: event.venue || "",
        });
      } catch (error) {
        alert("Unable to load event details.");
        navigate("/");
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [editing, id, navigate]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // CREATE OR UPDATE EVENT
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        await axios.put(`${API}/${id}`, form);
      } else {
        await axios.post(API, form);
      }

      alert(
        editing
          ? "Event updated successfully!"
          : "Event created successfully!"
      );

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to save event."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          Workspace <span>/</span>{" "}
          <strong>{editing ? "Edit event" : "Add event"}</strong>
        </div>
      </header>

      <main className="page-content form-page">
        <button
          className="back-link"
          onClick={() => navigate("/")}
        >
          ← Back to dashboard
        </button>

        <div className="form-intro">
          <div className="eyebrow">
            <Sparkles size={14} />
            {editing
              ? "REFINE THE DETAILS"
              : "CREATE SOMETHING SPECIAL"}
          </div>

          <h1>
            {editing ? (
              "Edit your event."
            ) : (
              <>
                Every great moment
                <br />
                starts <span>somewhere.</span>
              </>
            )}
          </h1>

          <p>
            {editing
              ? "Make changes to your event details below."
              : "Give your next experience a name, a place, and a date."}
          </p>
        </div>

        {loadingEvent ? (
          <p>Loading event details...</p>
        ) : (
          <>
          <form className="event-form" onSubmit={handleSubmit}>
            <div className="form-title">
              <div className="form-title-icon">
                <CalendarDays size={21} />
              </div>

              <div>
                <h3>Event details</h3>
                <p>Fill in the essentials to get started.</p>
              </div>
            </div>

            <label>
              EVENT NAME <span>*</span>
              <input
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
                placeholder="e.g. Creative Minds Summit"
                required
              />
            </label>

            <label>
              EVENT DESCRIPTION <span>*</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell us what makes this event special..."
                rows="4"
                required
              />
            </label>

            <div className="form-row">
              <label>
                EVENT DATE <span>*</span>
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                  required
                />
              </label>

              <label>
                VENUE <span>*</span>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="e.g. Innovation Hub, Kochi"
                  required
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editing
                  ? "Save changes"
                  : "Create event"}

                <ArrowUpRight size={17} />
              </button>
            </div>
          </form>
          {previewMode && (
  <div className="event-preview">
    <div className="preview-header">
      <span>LIVE PREVIEW</span>
      <span className="preview-status">● Preview</span>
    </div>

    <div className="preview-art">
      <div className="preview-orbit orbit-one"></div>
      <div className="preview-orbit orbit-two"></div>

      <div className="preview-art-content">
        <span>OCCASIO EVENTS</span>

        <h2>
          {form.eventName || "Your next great event"}
        </h2>

        <p>
          {form.description ||
            "Your event description will appear here."}
        </p>
      </div>
    </div>

    <div className="preview-details">
      <div>
        <span>DATE</span>
        <strong>
          {form.eventDate
            ? new Date(
                `${form.eventDate}T00:00:00`
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Choose a date"}
        </strong>
      </div>

      <div>
        <span>VENUE</span>
        <strong>{form.venue || "Add a venue"}</strong>
      </div>
    </div>
  </div>

        )}
        </>
        )}
      </main>
    </>
  );
}
function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<EventForm />} />
          <Route path="edit/:id" element={<EventForm editing />} />
        </Routes>
      </div>
    </div>
  );
}
// MAIN LAYOUT
function Layout() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />

      <Route
        path="/admin/*"
        element={<DashboardLayout />}
      />
      <Route
  path="/register/:id"
  element={<RegistrationForm />}
/>
    </Routes>
  );
}

// APP ENTRY POINT
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}