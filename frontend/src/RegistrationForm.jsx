import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import "./RegistrationForm.css";

export default function RegistrationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: id,
            ...form,
          }),
        }
      );

      const responseText = await response.text();

let data;

try {
  data = JSON.parse(responseText);
} catch {
  throw new Error(
    "The server returned HTML instead of JSON. Check the backend route and server."
  );
}

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage("Registration successful! 🎉");

      setForm({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      setMessage(error.message || "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <button
        className="registration-back"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Back to events
      </button>

      <div className="registration-card">
        <div className="registration-icon">
          <CalendarCheck size={30} />
        </div>

        <span className="registration-eyebrow">
          YOUR NEXT EXPERIENCE
        </span>

        <h1>Reserve your spot.</h1>

        <p className="registration-description">
          Fill in your details to register for this event.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="registration-submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Confirm Registration"}
          </button>
        </form>

        {message && (
          <p className="registration-message" role="status">
            {message}
          </p>
        )}

        <p className="registration-note">
          Your details will be saved securely in our database.
        </p>
      </div>
    </div>
  );
}