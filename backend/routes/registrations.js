const express = require("express");
const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "Registration route is working!" });
});

const Registration = require("../models/Registration");
const Event = require("../models/Event");

// Register for an event
router.post("/", async (req, res) => {
  try {
    const { eventId, name, email, phone } = req.body;

    if (!eventId || !name || !email) {
      return res.status(400).json({
        message: "Event, name, and email are required.",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    const existingRegistration = await Registration.findOne({
      eventId,
      email: email.trim().toLowerCase(),
    });

    if (existingRegistration) {
      return res.status(409).json({
        message: "This email is already registered for this event.",
      });
    }

    const registration = await Registration.create({
      eventId,
      eventName: event.eventName,
      name,
      email,
      phone,
    });

    res.status(201).json({
      message: "Registration successful!",
      registration,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Unable to register. Please try again.",
    });
  }
});

// Get all registrations (admin view)
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({
      createdAt: -1,
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);

    res.status(500).json({
      message: "Failed to fetch registrations",
    });
  }
});

module.exports = router;
