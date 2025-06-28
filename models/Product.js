import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "Religious",
        "Figurines",
        "Sets",
        "Royal",
        "Performing Arts",
        "Toys",
        "Instruments",
        "Rural Life",
        "Animals",
      ],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    artisan: {
      name: String,
      experience: String,
      specialty: String,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    weight: Number,
    materials: [String],
    careInstructions: String,
    shippingInfo: {
      weight: Number,
      dimensions: String,
      fragile: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
productSchema.index({ title: "text", description: "text", category: 1 });
productSchema.index({ category: 1, isFeatured: 1 });
productSchema.index({ salePrice: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
