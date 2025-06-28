import mongoose from "mongoose";

const workshopVisitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rescheduled", "cancelled", "completed"],
      default: "pending",
    },
    confirmedDate: Date,
    confirmedTime: String,
    adminNotes: String,
    numberOfVisitors: {
      type: Number,
      default: 1,
      min: 1,
    },
    purpose: {
      type: String,
      enum: [
        "general_visit",
        "custom_order",
        "bulk_purchase",
        "artisan_meet",
        "other",
      ],
      default: "general_visit",
    },
    specialRequirements: String,
    isGuidedTour: {
      type: Boolean,
      default: false,
    },
    contactMethod: {
      type: String,
      enum: ["email", "phone", "whatsapp"],
      default: "email",
    },
  },
  {
    timestamps: true,
  }
);

// Validate that preferred date is not in the past
workshopVisitSchema.pre("save", function (next) {
  if (this.preferredDate && this.preferredDate < new Date()) {
    const error = new Error("Preferred date cannot be in the past");
    return next(error);
  }
  next();
});

// Index for better query performance
workshopVisitSchema.index({ status: 1, preferredDate: 1 });
workshopVisitSchema.index({ email: 1 });
workshopVisitSchema.index({ createdAt: -1 });

const WorkshopVisit = mongoose.model("WorkshopVisit", workshopVisitSchema);

export default WorkshopVisit;
