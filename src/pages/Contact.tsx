import React, { useState } from "react";
import Header from "@/components/Header";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/workshop-visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          preferredDate: form.date,
          preferredTime: form.time,
          message: form.message,
          numberOfVisitors: 1,
          purpose: "general_visit",
          isGuidedTour: false,
          contactMethod: "email",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to submit workshop visit request"
        );
      }

      const result = await response.json();
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting workshop visit:", err);
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
      style={{
        fontFamily:
          "'Ancizar Serif', 'Cormorant Garamond', 'EB Garamond', 'PT Serif', 'Playfair Display', serif",
      }}
    >
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h1 className="text-4xl font-bold mb-8 text-purple-700 text-center font-playfair">
            Contact & Workshop Visit
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-purple-700 font-garamond">
              Visit Our Workshop
            </h2>
            <p className="text-gray-700">
              We welcome you to visit our workshop and experience the artistry
              behind our creations. Please see the schedule below or contact us
              to arrange a visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-purple-700 font-garamond">
              Contact Details
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>
                Email:{" "}
                <a
                  href="mailto:info@clipkartemporium.com"
                  className="text-blue-600 underline"
                >
                  info@clipkartemporium.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+911234567890" className="text-blue-600 underline">
                  +91 12345 67890
                </a>
              </li>
              <li>Address: 123 Artisan Lane, Creative City, India</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-purple-700 font-garamond">
              How to Order
            </h2>
            <p className="text-gray-700">
              To place an order, contact us via email, phone, or visit our
              workshop. For custom designs, share your ideas and requirements,
              and we'll guide you through the process from design to delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-purple-700 font-garamond">
              Workshop Visit Schedule
            </h2>
            <p className="text-gray-700">
              <strong>Monday - Friday:</strong> 10:00 AM – 5:00 PM
              <br />
              <strong>Saturday:</strong> 11:00 AM – 3:00 PM
              <br />
              <strong>Sunday:</strong> Closed
              <br />
              Please call ahead to confirm your visit or to schedule a guided
              tour.
            </p>
          </section>

          {/* Visit Workshop Form */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-700 font-garamond text-center">
              Book a Workshop Visit
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="font-medium">
                    Request Submitted Successfully!
                  </span>
                </div>
                <p>
                  Thank you for your interest! We have received your request and
                  will contact you soon to confirm your visit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="time"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Preferred Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Let us know if you have any special requests or questions."
                    />
                  </div>
                </div>
                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-10 rounded-xl font-medium text-lg shadow-md transition-all disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Book Visit"
                    )}
                  </button>
                </div>
              </form>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-purple-700 font-garamond text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 bg-purple-50/60 border border-purple-100 rounded-xl p-6 shadow-sm">
              <div>
                <span role="img" aria-label="Globe" className="mr-2">
                  🌍
                </span>
                <strong>Do you ship internationally?</strong>
                <p className="ml-6 text-gray-700">
                  Yes, we ship worldwide. Shipping costs and delivery times vary
                  by location. Contact us for specific shipping rates to your
                  country.
                </p>
              </div>
              <div>
                <span role="img" aria-label="Art" className="mr-2">
                  🎨
                </span>
                <strong>Can I request a custom design?</strong>
                <p className="ml-6 text-gray-700">
                  Absolutely! We work with skilled artisans who can create
                  custom pieces based on your specifications. Whether it's a
                  unique design or a modification to an existing piece, we're
                  happy to discuss your ideas.
                </p>
              </div>
              <div>
                <span role="img" aria-label="Hourglass" className="mr-2">
                  ⏳
                </span>
                <strong>How long does it take to create a piece?</strong>
                <p className="ml-6 text-gray-700">
                  Each piece is handcrafted and takes time. Simple items may
                  take 1-2 weeks, while more complex pieces can take 3-4 weeks.
                  Custom designs may require additional time for design approval
                  and creation. We'll provide a specific timeline when you place
                  your order.
                </p>
              </div>
              <div>
                <span role="img" aria-label="Package" className="mr-2">
                  📦
                </span>
                <strong>How are the items packaged for shipping?</strong>
                <p className="ml-6 text-gray-700">
                  Each piece is carefully wrapped in protective materials and
                  placed in a sturdy box to ensure safe delivery. We take extra
                  care with fragile items and use appropriate packaging
                  materials to prevent any damage during transit.
                </p>
              </div>
              <div>
                <span role="img" aria-label="Credit Card" className="mr-2">
                  💳
                </span>
                <strong>What payment methods do you accept?</strong>
                <p className="ml-6 text-gray-700">
                  We accept various payment methods including bank transfers,
                  UPI, and digital wallets. For international orders, we can
                  arrange payment through secure international transfer methods.
                  Contact us for specific payment options available in your
                  region.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
