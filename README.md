# 🎪 Kondapalli Toys - Traditional Handcrafted Toys

A modern e-commerce platform for authentic Kondapalli toys, preserving 400+ years of traditional Indian craftsmanship.

## 🌟 Features

### 🛍️ **E-commerce Features**

- **Product Catalog** - Browse traditional Kondapalli toys
- **Shopping Cart** - Add, remove, and manage items
- **Wishlist** - Save favorite products
- **User Authentication** - Secure login/register system
- **Order Management** - Track and manage orders
- **Custom Orders** - Request personalized toys
- **Achievements** - Showcase awards and recognition

### 🎨 **Design & UX**

- **Responsive Design** - Works on all devices
- **Modern UI** - Clean, intuitive interface
- **Traditional Aesthetics** - Celebrates Indian heritage
- **Smooth Animations** - Enhanced user experience
- **Accessibility** - Inclusive design principles

### 🔧 **Technical Features**

- **React + TypeScript** - Modern frontend framework
- **Node.js + Express** - Robust backend API
- **MongoDB** - Flexible database
- **JWT Authentication** - Secure user sessions
- **Real-time Updates** - Live cart and wishlist sync

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Kondapalli
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start the development servers**

   **Backend (Terminal 1):**

   ```bash
   npm run server
   ```

   **Frontend (Terminal 2):**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
Kondapalli/
├── src/                    # Frontend React code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── lib/               # Utility functions
├── routes/                # Backend API routes
├── models/                # MongoDB models
├── middleware/            # Express middleware
├── public/                # Static assets
└── server.js              # Backend entry point
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start frontend dev server
npm run server       # Start backend server
npm run build        # Build for production

# Database
npm run db:seed      # Seed database with sample data

# Utilities
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🎯 Key Pages

- **Home** (`/`) - Landing page with featured products
- **Products** (`/products`) - Browse all toys with filters
- **Product Detail** (`/product/:id`) - Individual product view
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Secure payment process
- **Custom Orders** (`/custom-orders`) - Request personalized toys
- **Achievements** (`/achievements`) - Awards and recognition
- **About** (`/about`) - Company history and artisans
- **Contact** (`/contact`) - Get in touch

## 🔐 Admin Features

- **Dashboard** (`/admin`) - Overview and analytics
- **Product Management** (`/admin/products`) - Add/edit products
- **Order Management** (`/admin/orders`) - Process orders
- **User Management** (`/admin/users`) - Manage customers
- **Analytics** (`/admin/analytics`) - Sales and performance data

## 🎨 Design System

### Colors

- **Primary**: Purple (#7C3AED) to Blue (#2563EB) gradient
- **Secondary**: Traditional Indian color palette
- **Accent**: Gold (#F59E0B) for highlights

### Typography

- **Headings**: Playfair Display (elegant serif)
- **Body**: Garamond (traditional serif)
- **UI**: System fonts for interface elements

### Components

- **Cards** - Product displays and content sections
- **Buttons** - Gradient primary, outline secondary
- **Forms** - Clean, accessible input fields
- **Navigation** - Responsive header and footer

## 🗄️ Database Schema

### Products

```javascript
{
  title: String,
  description: String,
  originalPrice: Number,
  salePrice: Number,
  images: [String],
  category: String,
  stock: Number,
  rating: Number,
  reviews: Number
}
```

### Users

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  address: Object
}
```

### Orders

```javascript
{
  userId: ObjectId,
  products: [Object],
  totalAmount: Number,
  status: String,
  shippingAddress: Object,
  paymentStatus: String
}
```

## 🔧 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id` - Update order status

## 🌟 Special Features

### Custom Orders

- **Personalized Design** - Custom colors, sizes, themes
- **Artisan Consultation** - Direct communication with craftsmen
- **Flexible Timeline** - Express to extended delivery
- **Quality Guarantee** - Traditional craftsmanship standards

### Cultural Heritage

- **GI Tagged Products** - Authentic Kondapalli toys
- **Traditional Techniques** - 400+ years of craftsmanship
- **Artisan Stories** - Meet the master craftsmen
- **Cultural Significance** - Preserving Indian heritage
