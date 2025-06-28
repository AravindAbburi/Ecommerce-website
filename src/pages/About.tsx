import { Link } from "react-router-dom";
import Header from "@/components/Header";
import {
  MapPin,
  Users,
  Award,
  Heart,
  Palette,
  Clock,
  Star,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";

const About = () => {
  const artisans = [
    {
      id: 1,
      name: "Sri Venkateswara Rao",
      age: 65,
      experience: "45 years",
      specialty: "Traditional Dolls",
      image: "/placeholder.svg",
      description:
        "Master craftsman specializing in traditional Kondapalli dolls. Known for his intricate detailing and authentic designs.",
      awards: ["National Award for Craftsmanship", "State Heritage Artist"],
    },
    {
      id: 2,
      name: "Smt. Lakshmi Devi",
      age: 58,
      experience: "40 years",
      specialty: "Animal Figurines",
      image: "/placeholder.svg",
      description:
        "Expert in creating lifelike animal figurines. Her work captures the essence of rural life and mythology.",
      awards: ["Best Traditional Artist", "Cultural Heritage Award"],
    },
    {
      id: 3,
      name: "Sri Krishna Prasad",
      age: 52,
      experience: "35 years",
      specialty: "Mythological Characters",
      image: "/placeholder.svg",
      description:
        "Specializes in mythological characters and religious figures. His work is known for spiritual significance.",
      awards: ["Religious Art Excellence", "Traditional Skills Award"],
    },
  ];

  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Natural Colors",
      description:
        "Hand-painted with eco-friendly natural dyes and vegetable colors",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Authentic Craftsmanship",
      description:
        "Made by certified Kondapalli artisans with generations of expertise",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Cultural Heritage",
      description:
        "Preserving 400+ years of traditional Indian toy-making heritage",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Unique Designs",
      description: "Each piece is handcrafted with unique artistic variations",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
      style={{
        fontFamily:
          "'Ancizar Serif', 'Cormorant Garamond', 'EB Garamond', 'PT Serif', 'Playfair Display', serif",
      }}
    >
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              The Art of Kondapalli
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover the 400-year-old legacy of handcrafted wooden toys from
              the heart of Andhra Pradesh
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Explore Our Collection
              </Link>
              <Link
                to="/products"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all"
              >
                Meet Our Artisans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                A Legacy of 400 Years
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Kondapalli toys trace their origins to the 16th century, when
                skilled artisans in the village of Kondapalli, near Vijayawada
                in Andhra Pradesh, began crafting wooden toys from the soft
                Tella Poniki wood. These toys were not just playthings but
                cultural artifacts that told stories of mythology, rural life,
                and Indian traditions.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The craft was traditionally passed down from father to son, with
                each generation adding their unique artistic touch while
                preserving the authentic techniques. Today, these toys are
                recognized as a Geographical Indication (GI) product, ensuring
                their authenticity and protecting the traditional knowledge.
              </p>
              <div className="flex items-center gap-4 text-purple-600">
                <MapPin className="h-6 w-6" />
                <span className="font-semibold">
                  Kondapalli, Andhra Pradesh, India
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">400+ Years</h3>
                    <p className="text-gray-600">
                      Of Traditional Craftsmanship
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      50+ Artisans
                    </h3>
                    <p className="text-gray-600">
                      Skilled Traditional Craftsmen
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">GI Tagged</h3>
                    <p className="text-gray-600">
                      Geographical Indication Product
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artisans Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Master Artisans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each Kondapalli toy is crafted by skilled artisans who have
              dedicated their lives to preserving this ancient craft. Meet the
              talented hands behind our beautiful creations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artisans.map((artisan) => (
              <div
                key={artisan.id}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 shadow-md flex items-center justify-center">
                    <Users className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {artisan.name}
                  </h3>
                  <p className="text-purple-600 font-medium">
                    {artisan.specialty}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{artisan.age} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{artisan.experience}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {artisan.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Awards & Recognition:
                  </h4>
                  <ul className="space-y-1">
                    {artisan.awards.map((award, index) => (
                      <li
                        key={index}
                        className="text-xs text-gray-600 flex items-center gap-2"
                      >
                        <Award className="h-3 w-3 text-yellow-500" />
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crafting Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Art of Creation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every Kondapalli toy is created through a meticulous process that
              combines traditional techniques with artistic vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Wood Selection
              </h3>
              <p className="text-gray-600 text-sm">
                Carefully selected Tella Poniki wood, known for its soft texture
                and durability
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Carving</h3>
              <p className="text-gray-600 text-sm">
                Hand-carved using traditional tools, each piece shaped with
                precision and care
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Painting</h3>
              <p className="text-gray-600 text-sm">
                Hand-painted with natural dyes and vegetable colors for
                authentic finish
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-pink-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Finishing</h3>
              <p className="text-gray-600 text-sm">
                Final touches and quality checks to ensure perfection in every
                piece
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Kondapalli Toys?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our toys are more than just playthings - they are pieces of
              cultural heritage that connect generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Our Commitment to Quality
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We are committed to preserving the authenticity and quality of
              traditional Kondapalli craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Truck className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-white/80">
                Free shipping on orders above ₹499 across India
              </p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-white/80">
                7-day return policy for your complete satisfaction
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="text-white/80">
                100% authentic Kondapalli toys with GI certification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements CTA Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Award className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Celebrating Our Achievements
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the awards, recognition, and milestones that celebrate
              our commitment to preserving traditional craftsmanship and
              promoting cultural heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/achievements"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                View Our Achievements
              </Link>
              <Link
                to="/products"
                className="border-2 border-yellow-500 text-yellow-600 px-8 py-4 rounded-full font-semibold hover:bg-yellow-500 hover:text-white transition-all"
              >
                Shop Authentic Toys
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Experience the Magic of Kondapalli
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Bring home a piece of Indian cultural heritage. Each toy tells a
            story, preserves tradition, and creates memories for generations to
            come.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Shop Our Collection
            </Link>
            <Link
              to="/products"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
