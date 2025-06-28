import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  title: String, // Store product title for reference
  image: String, // Store product image for reference
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: "India",
      },
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "upi", "digital_wallet", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    notes: String,
    estimatedDelivery: Date,
    trackingNumber: String,
    isCustomOrder: {
      type: Boolean,
      default: false,
    },
    customRequirements: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Get count of orders today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await mongoose.model("Order").countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    this.orderNumber = `KO${year}${month}${day}${(count + 1)
      .toString()
      .padStart(3, "0")}`;
  }
  next();
});

// Index for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "customer.email": 1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
