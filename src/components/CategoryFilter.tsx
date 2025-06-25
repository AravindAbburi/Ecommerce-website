
import { Button } from "@/components/ui/button";

interface Category {
  name: string;
  count: number;
  active: boolean;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <Button
          key={category.name}
          onClick={() => onCategorySelect(category.name)}
          variant={selectedCategory === category.name ? "default" : "outline"}
          className={`rounded-full px-6 py-3 font-medium transition-all ${
            selectedCategory === category.name
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              : "border-gray-300 text-gray-700 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50"
          }`}
        >
          {category.name}
          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
            {category.count}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
