import {
  Calendar,
  Clock,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";

const MOCK_PACKAGES = [
  {
    id: 1,
    title: "Tropical Bali Paradise Escape",
    destination: "Bali, Indonesia",
    category: "Honeymoon",
    price: 1200,
    originalPrice: 1500,
    days: 7,
    nights: 6,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    facilities: [
      "Free Wi-Fi",
      "Private Pool",
      "Airport Transfer",
      "Breakfast Included",
    ],
    activities: ["Snorkeling", "Temple Tour", "Spa Treatment"],
    availableFrom: "2026-07-01",
  },
  {
    id: 2,
    title: "Swiss Alps Winter Wonderland",
    destination: "Zermatt, Switzerland",
    category: "Adventure",
    price: 2400,
    days: 5,
    nights: 4,
    image:
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    facilities: ["Ski Pass", "Luxury Chalet", "Heated Pool", "Dinner Included"],
    activities: ["Skiing", "Cable Car Ride", "Ice Skating"],
    availableFrom: "2026-11-15",
  },
  {
    id: 3,
    title: "Cultural Wonders of Kyoto",
    destination: "Kyoto, Japan",
    category: "Cultural",
    price: 1800,
    originalPrice: 1950,
    days: 10,
    nights: 9,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    facilities: ["City Guide", "Bullet Train Pass", "Traditional Ryokan"],
    activities: ["Tea Ceremony", "Bamboo Forest Walk", "Shrine Tour"],
    availableFrom: "2026-08-10",
  },
  {
    id: 4,
    title: "Serengeti Luxury Wildlife Safari",
    destination: "Serengeti, Tanzania",
    category: "Wildlife",
    price: 3200,
    days: 6,
    nights: 5,
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    facilities: ["Luxury Tents", "All Meals", "Open 4x4 Jeep", "Expert Guide"],
    activities: ["Game Drives", "Hot Air Balloon", "Bush Dinner"],
    availableFrom: "2026-09-05",
  },
  {
    id: 5,
    title: "Tropical Bali Paradise Escape",
    destination: "Bali, Indonesia",
    category: "Honeymoon",
    price: 1200,
    originalPrice: 1500,
    days: 7,
    nights: 6,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    facilities: [
      "Free Wi-Fi",
      "Private Pool",
      "Airport Transfer",
      "Breakfast Included",
    ],
    activities: ["Snorkeling", "Temple Tour", "Spa Treatment"],
    availableFrom: "2026-07-01",
  },
  {
    id: 6,
    title: "Swiss Alps Winter Wonderland",
    destination: "Zermatt, Switzerland",
    category: "Adventure",
    price: 2400,
    days: 5,
    nights: 4,
    image:
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    facilities: ["Ski Pass", "Luxury Chalet", "Heated Pool", "Dinner Included"],
    activities: ["Skiing", "Cable Car Ride", "Ice Skating"],
    availableFrom: "2026-11-15",
  },
];
const CATEGORIES = ["All", "Adventure", "Honeymoon", "Cultural", "Wildlife"];
const PackagesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState(4000);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxDuration, setMaxDuration] = useState(12);

  const filteredPackages = useMemo(() => {
    return MOCK_PACKAGES.filter((pkg) => {
      const matchesSearch =
        pkg.destination
          .toLowerCase()
          .includes(searchQuery.toLocaleLowerCase()) ||
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBudget = pkg.price <= maxBudget;
      const matchesCategory =
        selectedCategory === "All" || pkg.category.includes(selectedCategory);
      const matchesDate =
        !selectedDate || new Date(maxDuration) <= new Date(pkg.availableFrom);
      const matchesDuration = pkg.days <= maxDuration;
      return (
        matchesBudget &&
        matchesCategory &&
        matchesDate &&
        matchesDuration &&
        matchesSearch
      );
    });
  }, [searchQuery, maxBudget, selectedDate, maxDuration, selectedCategory]);

  const activeCategoriesCount = useMemo(() => {
    const uniqueCategories = new Set(
      filteredPackages.map((pkg) => pkg.category),
    );
    return uniqueCategories.size;
  }, [filteredPackages]);

  return (
    <div className="min-h-screen  bg-gray-50  font-sans ">
      <div className="flex relative">
        <aside className="w-80 bg-white border-r border-gray-200 p-6 sticky  left-0 overflow-y-auto z-40 hidden md:block   ">
          <h2 className="text-lg font-bold text-gray-900 mb-6 ">
            Filter Tours
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Where to?
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 " />
                <input
                  type="text"
                  placeholder="Search destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all  "
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Max Budget
                </label>
                <span className="text-sm font-bold text-blue-600">
                  Rs {maxBudget.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={"1000"}
                max={"5000"}
                step={"100"}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 "
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1 ">
                {" "}
                <span>Rs 1k</span>
                <span>Rs 5k</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider  ">
                  Max Duration
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {maxDuration} days
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step={"1"}
                value={maxDuration}
                onChange={(e) => setMaxDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg  cursor-pointer appearance-none accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3 days</span>
                <span>15 days</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Travel Date(from)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all   "
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ">
                Category Idea
              </label>
              <div className="flex flex-wrap gap-2 ">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat ? "bg-blue-600 text-white shadow-sm " : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1  p-8 ">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4  ">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 ">
                Explore curated travel bundles
              </h1>
              <p>Tailored Iteneraries handpicked for ablsolute comfort</p>
            </div>

            <div className="flex items-center  divide-x divide-gray-200 ">
              <div className="text-center sm:text-left px-3">
                <span className="block text-2xl font-extrabold text-blue-600 ">
                  {filteredPackages.length}
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Packages Shown
                </span>
              </div>

              <div className="px-3 text-center sm:text-left">
                <span className="block text-2xl font-extrabold text-indigo-600 ">
                  {activeCategoriesCount}
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Categories Shown
                </span>
              </div>
            </div>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {filteredPackages.map((pkg) => {
                const discountPercentage = pkg.originalPrice
                  ? Math.round(
                      ((pkg.originalPrice - pkg.price) / pkg.originalPrice) *
                        100,
                    )
                  : null;
                return (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm  hover:shadow-xl transition-all duration-300 flex flex-col  group  "
                  >
                    <div className="relative h-64 overflow-hidden ">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 rigt-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm ">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {pkg.destination}
                      </div>

                      {discountPercentage && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md animate-pulse ">
                          Save {discountPercentage}%
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-gray-900/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded">
                        {pkg.category}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between  ">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600  transition-colors">
                            {pkg.title}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-sm font-bold">
                            <Star className="size-4 fill-amber-400 text-amber-400 " />
                            {pkg.rating}
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md mb-4">
                          <Clock className="w-3.5 h-3.5 " />
                          {pkg.days} Days / {pkg.nights} Nights
                        </div>
                        <div className="mb-4">
                          <span className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                            What's included
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.facilities.map((fac, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-md border border-gray-100"
                              >
                                {fac}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mb-6">
                          <span className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                            Curated Experience
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {pkg.activities.map((act, idx) => (
                              <span className="bg-emerald-50 text-emerald-700 text-xs px.2.5 py-1 rounded-full font-medium flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                {act}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-auto flex justify-between items-center">
                        <div>
                          {pkg.originalPrice && (
                            <span className="text-xs text-gray-400 line-through block">
                              Rs {pkg.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900">
                              Rs {pkg.price}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              / person
                            </span>
                          </div>
                        </div>

                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95">
                          View Itinerary
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center max-w-xl mx-auto mt-12">
              <Compass className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                No matching packages found
              </h3>
              <p className="text-sm text-gray-500">
                Try loosening your budget restrictions or extending your travel
                date horizon.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setMaxBudget(4000);
                  setSelectedCategory("All");
                  setMaxDuration(12);
                  setSelectedDate("");
                }}
                className="mt-5 text-xs font-bold text-blue-600 underline"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PackagesList;
