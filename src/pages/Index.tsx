import React from "react";

const Index = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
      style={{
        fontFamily:
          "'Ancizar Serif', 'Cormorant Garamond', 'EB Garamond', 'PT Serif', 'Playfair Display', 'Spectral', serif",
      }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Kondapalli Toys
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Celebrating the legacy, artisans, and cultural heritage of
              Kondapalli's world-famous wooden toys.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-50 to-transparent"></div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">The Art of Kondapalli</h2>
              <p className="text-lg mb-6 text-white/90 leading-relaxed">
                Discover the 400-year-old legacy of handcrafted wooden toys from
                the heart of Andhra Pradesh. Each piece tells a story of
                tradition, craftsmanship, and cultural heritage.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="font-bold">400+ Years</span> of Traditional
                  Craftsmanship
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">50+ Artisans</span> keep the
                  tradition alive
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">GI Tagged</span> Authentic
                  Products
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">Kondapalli, Andhra Pradesh</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">
                Meet Our Master Artisans
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xl">
                      VR
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sri Venkateswara Rao</h4>
                    <p className="text-white/80 text-sm">
                      Traditional Dolls • 45 years experience
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xl">
                      LD
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Smt. Lakshmi Devi</h4>
                    <p className="text-white/80 text-sm">
                      Animal Figurines • 40 years experience
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xl">
                      KP
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sri Krishna Prasad</h4>
                    <p className="text-white/80 text-sm">
                      Mythological Characters • 35 years experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/90">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-700">
            Why Kondapalli Toys?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-50 rounded-xl p-8 shadow-md text-center">
              <h3 className="text-xl font-bold mb-2 text-purple-600">
                Eco-Friendly Wood
              </h3>
              <p className="text-gray-700">
                Made from locally sourced Tella Poniki wood, safe for children
                and the environment.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-md text-center">
              <h3 className="text-xl font-bold mb-2 text-purple-600">
                Hand-Painted Masterpieces
              </h3>
              <p className="text-gray-700">
                Each toy is hand-painted with natural dyes, making every piece
                unique.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-md text-center">
              <h3 className="text-xl font-bold mb-2 text-purple-600">
                Cultural Heritage
              </h3>
              <p className="text-gray-700">
                A proud tradition recognized with a Geographical Indication (GI)
                tag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Support Our Artisans</h2>
          <p className="text-xl mb-8 text-white/90">
            Bring home a piece of Indian heritage and empower local craftsmen.
          </p>
          <a
            href="/products"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-block"
          >
            Shop Kondapalli Toys
          </a>
        </div>
      </section>
    </div>
  );
};

export default Index;
