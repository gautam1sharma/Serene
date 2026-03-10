import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Car,
  Fuel,
  Settings2
} from 'lucide-react';
import { carService } from '@/services/carService';
import type { Car as CarType, CarStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = ['All', 'SUV', 'Sedan', 'Electric', 'Hybrid', 'Luxury'];
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $30k', min: 0, max: 30000 },
  { label: '$30k - $50k', min: 30000, max: 50000 },
  { label: '$50k - $70k', min: 50000, max: 70000 },
  { label: 'Over $70k', min: 70000, max: Infinity }
];

export const CarBrowser: React.FC = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchQuery, selectedCategory, selectedPriceRange]);

  const loadCars = async () => {
    setIsLoading(true);
    const response = await carService.getCars(1, 100);
    if (response.success && response.data) {
      setCars(response.data.data);
      setFilteredCars(response.data.data);
    }
    setIsLoading(false);
  };

  const filterCars = () => {
    let filtered = [...cars];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(car =>
        car.model.toLowerCase().includes(query) ||
        car.description.toLowerCase().includes(query) ||
        car.features.some(f => f.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(car => 
        car.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    filtered = filtered.filter(car =>
      car.price >= selectedPriceRange.min && car.price <= selectedPriceRange.max
    );

    setFilteredCars(filtered);
  };

  const getStatusBadge = (status: CarStatus) => {
    const styles = {
      available: 'bg-green-100 text-green-700',
      sold: 'bg-gray-100 text-gray-700',
      reserved: 'bg-yellow-100 text-yellow-700',
      in_transit: 'bg-blue-100 text-blue-700',
      maintenance: 'bg-red-100 text-red-700'
    };
    return styles[status] || styles.available;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Vehicles</h1>
        <p className="text-gray-600">Explore our full range of Hyundai vehicles</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by model, features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedPriceRange.label === range.label
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredCars.length}</span> vehicles
        </p>
      </div>

      {/* Cars Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-16">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Link key={car.id} to={`/customer/cars/${car.id}`}>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
                {/* Image */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={car.images[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
                    alt={car.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium capitalize",
                      getStatusBadge(car.status)
                    )}>
                      {car.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                    <span className="font-bold text-gray-900">${car.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{car.model}</h3>
                      <p className="text-sm text-gray-500">{car.year} • {car.category}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {car.description}
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Settings2 className="w-4 h-4" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuelType}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {car.features.slice(0, 3).map((feature, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {car.features.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{car.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
