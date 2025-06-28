import express from "express";
import { WorkshopVisit } from "../models/index.js";

const router = express.Router();

// POST /api/workshop-visits - Submit workshop visit request
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      message,
      numberOfVisitors = 1,
      purpose = "general_visit",
      specialRequirements,
      isGuidedTour = false,
      contactMethod = "email",
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({
        message: "Name, email, phone, preferred date and time are required",
      });
    }

    // Validate date is not in the past
    const visitDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (visitDate < today) {
      return res.status(400).json({
        message: "Preferred date cannot be in the past",
      });
    }

    // Check workshop schedule (Monday-Friday: 10-5, Saturday: 11-3, Sunday: Closed)
    const dayOfWeek = visitDate.getDay();
    const time = preferredTime.split(":")[0];

    if (dayOfWeek === 0) {
      // Sunday
      return res.status(400).json({
        message: "Workshop is closed on Sundays",
      });
    }

    if (dayOfWeek === 6) {
      // Saturday
      if (time < 11 || time >= 15) {
        return res.status(400).json({
          message: "Saturday hours are 11:00 AM - 3:00 PM",
        });
      }
    } else {
      // Monday-Friday
      if (time < 10 || time >= 17) {
        return res.status(400).json({
          message: "Weekday hours are 10:00 AM - 5:00 PM",
        });
      }
    }

    // Check for existing visit requests on the same date/time
    const existingVisit = await WorkshopVisit.findOne({
      preferredDate: visitDate,
      preferredTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingVisit) {
      return res.status(400).json({
        message:
          "This time slot is already booked. Please choose a different time.",
      });
    }

    // Create workshop visit request
    const workshopVisit = new WorkshopVisit({
      name,
      email,
      phone,
      preferredDate: visitDate,
      preferredTime,
      message,
      numberOfVisitors,
      purpose,
      specialRequirements,
      isGuidedTour,
      contactMethod,
    });

    await workshopVisit.save();

    res.status(201).json({
      message: "Workshop visit request submitted successfully",
      visit: {
        id: workshopVisit._id,
        name: workshopVisit.name,
        preferredDate: workshopVisit.preferredDate,
        preferredTime: workshopVisit.preferredTime,
        status: workshopVisit.status,
      },
    });
  } catch (error) {
    console.error("Error submitting workshop visit:", error);
    res.status(500).json({
      message: "Error submitting workshop visit request",
      error: error.message,
    });
  }
});

// GET /api/workshop-visits - Get workshop visits (with filtering)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, email, date } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (email) {
      filter.email = email;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.preferredDate = { $gte: startDate, $lte: endDate };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const visits = await WorkshopVisit.find(filter)
      .sort({ preferredDate: 1, preferredTime: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await WorkshopVisit.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      visits,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalVisits: total,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching workshop visits:", error);
    res.status(500).json({
      message: "Error fetching workshop visits",
      error: error.message,
    });
  }
});

// GET /api/workshop-visits/schedule/available - Get available time slots
router.get("/schedule/available", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const visitDate = new Date(date);
    const dayOfWeek = visitDate.getDay();

    // Define available time slots based on day
    let availableSlots = [];

    if (dayOfWeek === 0) {
      // Sunday
      availableSlots = [];
    } else if (dayOfWeek === 6) {
      // Saturday
      availableSlots = ["11:00", "12:00", "13:00", "14:00"];
    } else {
      // Monday-Friday
      availableSlots = [
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
      ];
    }

    // Get booked slots for the date
    const bookedVisits = await WorkshopVisit.find({
      preferredDate: {
        $gte: new Date(visitDate.setHours(0, 0, 0, 0)),
        $lt: new Date(visitDate.setHours(23, 59, 59, 999)),
      },
      status: { $in: ["pending", "confirmed"] },
    }).select("preferredTime");

    const bookedSlots = bookedVisits.map((visit) => visit.preferredTime);

    // Filter out booked slots
    const availableTimeSlots = availableSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({
      date: date,
      availableSlots: availableTimeSlots,
      totalAvailable: availableTimeSlots.length,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      message: "Error fetching available time slots",
      error: error.message,
    });
  }
});

// GET /api/workshop-visits/stats/summary - Get visit statistics (Admin only)
router.get("/stats/summary", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const stats = await WorkshopVisit.aggregate([
      {
        $facet: {
          totalVisits: [{ $count: "count" }],
          todayVisits: [
            { $match: { preferredDate: { $gte: today } } },
            { $count: "count" },
          ],
          thisMonthVisits: [
            { $match: { preferredDate: { $gte: thisMonth } } },
            { $count: "count" },
          ],
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          purposeCounts: [{ $group: { _id: "$purpose", count: { $sum: 1 } } }],
        },
      },
    ]);

    const summary = {
      totalVisits: stats[0].totalVisits[0]?.count || 0,
      todayVisits: stats[0].todayVisits[0]?.count || 0,
      thisMonthVisits: stats[0].thisMonthVisits[0]?.count || 0,
      statusCounts: stats[0].statusCounts,
      purposeCounts: stats[0].purposeCounts,
    };

    res.json(summary);
  } catch (error) {
    console.error("Error fetching visit stats:", error);
    res.status(500).json({
      message: "Error fetching visit statistics",
      error: error.message,
    });
  }
});

// GET /api/workshop-visits/:id - Get single workshop visit
router.get("/:id", async (req, res) => {
  try {
    const visit = await WorkshopVisit.findById(req.params.id).lean();

    if (!visit) {
      return res.status(404).json({ message: "Workshop visit not found" });
    }

    res.json(visit);
  } catch (error) {
    console.error("Error fetching workshop visit:", error);
    res.status(500).json({
      message: "Error fetching workshop visit",
      error: error.message,
    });
  }
});

// PUT /api/workshop-visits/:id/status - Update visit status (Admin only)
router.put("/:id/status", async (req, res) => {
  try {
    const { status, confirmedDate, confirmedTime, adminNotes } = req.body;

    const updateData = { status };

    if (confirmedDate) updateData.confirmedDate = new Date(confirmedDate);
    if (confirmedTime) updateData.confirmedTime = confirmedTime;
    if (adminNotes) updateData.adminNotes = adminNotes;

    const visit = await WorkshopVisit.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!visit) {
      return res.status(404).json({ message: "Workshop visit not found" });
    }

    res.json(visit);
  } catch (error) {
    console.error("Error updating workshop visit status:", error);
    res.status(400).json({
      message: "Error updating workshop visit status",
      error: error.message,
    });
  }
});

export default router;
