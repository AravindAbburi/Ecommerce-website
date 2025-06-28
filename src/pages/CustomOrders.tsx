import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Ruler,
  Clock,
  MessageSquare,
  CheckCircle,
  Star,
  Heart,
  Users,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";

const CustomOrders = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    toyType: "",
    size: "",
    colorPreference: "",
    budget: "",
    deliveryTimeline: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const toyTypes = [
    "Traditional Dolls",
    "Animal Figurines",
    "Mythological Characters",
    "Religious Figures",
    "Rural Life Scenes",
    "Wedding Sets",
    "Festival Sets",
    "Educational Toys",
    "Custom Characters",
    "Other",
  ];

  const sizes = [
    "Small (3-5 inches)",
    "Medium (6-8 inches)",
    "Large (9-12 inches)",
    "Extra Large (12+ inches)",
    "Custom Size",
  ];

  const colorPreferences = [
    "Traditional Natural Colors",
    "Vibrant Bright Colors",
    "Pastel Soft Colors",
    "Monochrome Theme",
    "Specific Color Scheme",
    "Artist's Choice",
  ];

  const budgetRanges = [
    "₹500 - ₹1000",
    "₹1000 - ₹2500",
    "₹2500 - ₹5000",
    "₹5000 - ₹10000",
    "₹10000+",
    "Custom Budget",
  ];

  const deliveryTimelines = [
    "Express (1-2 weeks)",
    "Standard (2-4 weeks)",
    "Extended (4-6 weeks)",
    "No Rush (6+ weeks)",
  ];

  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Custom Colors",
      description:
        "Choose from traditional natural dyes or vibrant modern colors",
    },
    {
      icon: <Ruler className="h-8 w-8" />,
      title: "Custom Sizes",
      description:
        "From miniature to life-size, we craft to your specifications",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Flexible Timeline",
      description: "Express orders available, standard delivery in 2-4 weeks",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Personal Consultation",
      description:
        "Direct communication with master artisans for perfect results",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      text: "Ordered custom wedding dolls for my daughter's wedding. The artisans created exactly what I envisioned. Beautiful craftsmanship!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      text: "Custom Krishna-Radha set for our temple. The attention to detail and traditional techniques are outstanding.",
      rating: 5,
    },
    {
      name: "Anita Patel",
      location: "Ahmedabad",
      text: "Ordered personalized family figurines. The artisans captured our family's essence perfectly. Highly recommended!",
      rating: 5,
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
              Custom Order Submitted!
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-garamond">
              Thank you for your custom order request. Our master artisans will
              review your requirements and contact you within 24-48 hours to
              discuss the details and provide a quote.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="font-medium">Toy Type:</span>
                  <span>{formData.toyType || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Size:</span>
                  <span>{formData.size || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Budget Range:</span>
                  <span>{formData.budget || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Delivery Timeline:</span>
                  <span>{formData.deliveryTimeline || "Not specified"}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Place Another Order
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/products")}
              >
                Browse Products
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-4">
              Custom Orders
            </h1>
            <p className="text-xl md:text-2xl font-garamond mb-8 max-w-3xl mx-auto">
              Bring your vision to life with personalized Kondapalli toys
              crafted by master artisans
            </p>
            <div className="flex justify-center items-center gap-8 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Master Artisans</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>2-4 Weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
              Why Choose Custom Orders?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-garamond">
              Experience the perfect blend of traditional craftsmanship and
              personalized design
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-playfair">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-garamond">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
                Request Your Custom Order
              </h2>
              <p className="text-xl text-gray-600 font-garamond">
                Contact us to discuss your custom Kondapalli toy requirements
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      className="font-garamond"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="font-garamond"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="font-garamond"
                    />
                  </div>
                  <div>
                    <Label htmlFor="toyType">Toy Type *</Label>
                    <Select
                      id="toyType"
                      value={formData.toyType}
                      onValueChange={(value) =>
                        handleInputChange("toyType", value)
                      }
                      required
                    >
                      <SelectTrigger className="font-garamond">
                        <SelectValue placeholder="Select toy type" />
                      </SelectTrigger>
                      <SelectContent>
                        {toyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="size">Size *</Label>
                    <Select
                      id="size"
                      value={formData.size}
                      onValueChange={(value) =>
                        handleInputChange("size", value)
                      }
                      required
                    >
                      <SelectTrigger className="font-garamond">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="colorPreference">Color Preference *</Label>
                    <Select
                      id="colorPreference"
                      value={formData.colorPreference}
                      onValueChange={(value) =>
                        handleInputChange("colorPreference", value)
                      }
                      required
                    >
                      <SelectTrigger className="font-garamond">
                        <SelectValue placeholder="Select color preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorPreferences.map((preference) => (
                          <SelectItem key={preference} value={preference}>
                            {preference}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget Range *</Label>
                    <Select
                      id="budget"
                      value={formData.budget}
                      onValueChange={(value) =>
                        handleInputChange("budget", value)
                      }
                      required
                    >
                      <SelectTrigger className="font-garamond">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deliveryTimeline">
                      Delivery Timeline *
                    </Label>
                    <Select
                      id="deliveryTimeline"
                      value={formData.deliveryTimeline}
                      onValueChange={(value) =>
                        handleInputChange("deliveryTimeline", value)
                      }
                      required
                    >
                      <SelectTrigger className="font-garamond">
                        <SelectValue placeholder="Select delivery timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryTimelines.map((timeline) => (
                          <SelectItem key={timeline} value={timeline}>
                            {timeline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Custom Order Details *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Describe your custom toy requirements, including special instructions, reference images, and any other details..."
                      className="font-garamond"
                      required
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 text-lg font-semibold"
                  >
                    Submit Custom Order Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 font-garamond">
              Hear from customers who have experienced our custom order service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 font-garamond italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.location}
                        </p>
                      </div>
                      <Heart className="h-5 w-5 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 font-garamond">
              Simple steps to get your custom Kondapalli toy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Submit Request
              </h3>
              <p className="text-gray-600 text-sm font-garamond">
                Fill out the form with your requirements and vision
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-gray-600 text-sm font-garamond">
                Our artisans will contact you to discuss details and provide a
                quote
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Crafting</h3>
              <p className="text-gray-600 text-sm font-garamond">
                Master artisans handcraft your toy using traditional techniques
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-600 text-sm font-garamond">
                Your custom toy is carefully packaged and delivered to your
                doorstep
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomOrders;
