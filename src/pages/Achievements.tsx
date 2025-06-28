import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Star,
  Medal,
  Heart,
  Users,
  Globe,
  Calendar,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  icon: React.ReactNode;
  image?: string;
  location?: string;
  organization?: string;
  highlights?: string[];
}

const achievements: Achievement[] = [
  {
    id: "1",
    title: "National Award for Excellence in Traditional Crafts",
    description:
      "Recognized for outstanding contribution to preserving and promoting traditional Kondapalli toy-making techniques.",
    year: "2023",
    category: "National Recognition",
    icon: <Trophy className="h-8 w-8 text-yellow-500" />,
    organization: "Ministry of Textiles, Government of India",
    highlights: [
      "Excellence in traditional craftsmanship",
      "Innovation in design while maintaining authenticity",
      "Contribution to rural employment",
    ],
  },
  {
    id: "2",
    title: "GI Tag for Kondapalli Toys",
    description:
      "Geographical Indication tag awarded to protect the unique identity and heritage of Kondapalli toys.",
    year: "2022",
    category: "Heritage Protection",
    icon: <Medal className="h-8 w-8 text-blue-500" />,
    organization: "Geographical Indications Registry",
    location: "Kondapalli, Andhra Pradesh",
    highlights: [
      "Protection of traditional knowledge",
      "Preservation of cultural heritage",
      "Economic benefits for local artisans",
    ],
  },
  {
    id: "3",
    title: "Best Traditional Toy Manufacturer",
    description:
      "Awarded for maintaining the highest standards of quality and authenticity in traditional toy manufacturing.",
    year: "2023",
    category: "Industry Recognition",
    icon: <Award className="h-8 w-8 text-purple-500" />,
    organization: "Indian Toy Manufacturers Association",
    highlights: [
      "Quality craftsmanship",
      "Sustainable practices",
      "Customer satisfaction",
    ],
  },
  {
    id: "4",
    title: "Export Excellence Award",
    description:
      "Recognized for successfully promoting Indian traditional toys in international markets.",
    year: "2022",
    category: "International Recognition",
    icon: <Globe className="h-8 w-8 text-green-500" />,
    organization: "Export Promotion Council",
    highlights: [
      "International market expansion",
      "Cultural diplomacy",
      "Economic growth",
    ],
  },
  {
    id: "5",
    title: "Artisan Empowerment Award",
    description:
      "Acknowledged for empowering local artisans and preserving traditional skills.",
    year: "2023",
    category: "Social Impact",
    icon: <Users className="h-8 w-8 text-orange-500" />,
    organization: "Rural Development Ministry",
    highlights: [
      "Skill development programs",
      "Fair wages and working conditions",
      "Community development",
    ],
  },
  {
    id: "6",
    title: "Heritage Conservation Award",
    description:
      "Honored for efforts in conserving and promoting the rich cultural heritage of Kondapalli toy-making.",
    year: "2021",
    category: "Cultural Heritage",
    icon: <Heart className="h-8 w-8 text-red-500" />,
    organization: "Indian National Trust for Art and Cultural Heritage",
    highlights: [
      "Documentation of traditional techniques",
      "Training of new artisans",
      "Museum collaborations",
    ],
  },
  {
    id: "7",
    title: "Innovation in Traditional Crafts",
    description:
      "Recognized for innovative approaches while maintaining traditional authenticity.",
    year: "2023",
    category: "Innovation",
    icon: <Star className="h-8 w-8 text-yellow-400" />,
    organization: "Design Council of India",
    highlights: [
      "Modern design integration",
      "Sustainable materials",
      "Digital presence",
    ],
  },
  {
    id: "8",
    title: "Customer Choice Award",
    description:
      "Voted as the most trusted brand for traditional toys by customers across India.",
    year: "2023",
    category: "Customer Recognition",
    icon: <Medal className="h-8 w-8 text-bronze-500" />,
    organization: "Consumer Choice Awards",
    highlights: [
      "High customer satisfaction",
      "Quality assurance",
      "Authentic products",
    ],
  },
];

const categories = [
  "All",
  "National Recognition",
  "Heritage Protection",
  "Industry Recognition",
  "International Recognition",
  "Social Impact",
  "Cultural Heritage",
  "Innovation",
  "Customer Recognition",
];

const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const filteredAchievements =
    selectedCategory === "All"
      ? achievements
      : achievements.filter(
          (achievement) => achievement.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-4">
              Our Achievements
            </h1>
            <p className="text-xl md:text-2xl font-garamond mb-8 max-w-3xl mx-auto">
              Celebrating decades of excellence in traditional toy craftsmanship
              and cultural preservation
            </p>
            <div className="flex justify-center items-center gap-8 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>{achievements.length} Awards</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Since 2021</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Kondapalli, AP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="font-garamond"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={() => setSelectedAchievement(achievement)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-playfair mb-2">
                        {achievement.title}
                      </CardTitle>
                      <Badge variant="secondary" className="font-garamond">
                        {achievement.category}
                      </Badge>
                    </div>
                    <div className="ml-4">{achievement.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-garamond mb-4 line-clamp-3">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-medium">{achievement.year}</span>
                    {achievement.organization && (
                      <span className="text-right">
                        {achievement.organization}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center font-playfair mb-8">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">8+</div>
              <div className="text-gray-600 font-garamond">Awards Won</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600 font-garamond">
                Artisans Employed
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600 font-garamond">
                Countries Reached
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600 font-garamond">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {selectedAchievement.icon}
                  <div>
                    <h3 className="text-2xl font-bold font-playfair">
                      {selectedAchievement.title}
                    </h3>
                    <Badge variant="secondary" className="font-garamond">
                      {selectedAchievement.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAchievement(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <p className="text-gray-600 font-garamond mb-6">
                {selectedAchievement.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Year</h4>
                  <p className="text-gray-600 font-garamond">
                    {selectedAchievement.year}
                  </p>
                </div>
                {selectedAchievement.organization && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Organization
                    </h4>
                    <p className="text-gray-600 font-garamond">
                      {selectedAchievement.organization}
                    </p>
                  </div>
                )}
                {selectedAchievement.location && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Location
                    </h4>
                    <p className="text-gray-600 font-garamond">
                      {selectedAchievement.location}
                    </p>
                  </div>
                )}
              </div>

              {selectedAchievement.highlights && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Key Highlights
                  </h4>
                  <ul className="space-y-2">
                    {selectedAchievement.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 font-garamond">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
