import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  ChevronRight,
  Info,
  Trash2,
  Plus,
  ArrowLeft,
  Camera,
} from "lucide-react";

// Robust Mock detailed backend response for a single package
const MOCK_ITINERARY_DATA = {
  id: 1,
  title: "Tropical Bali Paradise Escape",
  destination: "Bali, Indonesia",
  category: "Honeymoon",
  basePrice: 1200,
  rating: 4.9,
  daysCount: 7,
  nightsCount: 6,
  destinationsCovered: ["Ubud", "Seminyak", "Nusa Penida", "Uluwatu"],
  images: [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80", // Main Large Image
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80", // Side Image 1
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80", // Side Image 2
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival & Traditional Welcome",
      dayImage:
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=500&q=80",
      description:
        "Land at Denpasar Airport. Meet your guide and transfer to your luxury private pool villa in Ubud. Spend the evening relaxing or exploring local markets.",
      activities: [
        {
          id: "act-1-1",
          name: "Airport Private Transfer",
          cost: 0,
          customizable: false,
        },
        {
          id: "act-1-2",
          name: "Welcome Flower Garland & Drinks",
          cost: 0,
          customizable: false,
        },
      ],
    },
    {
      day: 2,
      title: "Sacred Monkey Forest & Rice Terraces",
      dayImage:
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=500&q=80",
      description:
        "Dive into Bali's lush nature. Stroll through the iconic Tegallalang Rice Terraces and meet the wildlife at Ubud Monkey Forest.",
      activities: [
        {
          id: "act-2-1",
          name: "Guided Monkey Forest Walking Tour",
          cost: 30,
          customizable: false,
        },
        {
          id: "act-2-2",
          name: "Tegallalang Rice Terrace Swing Experience",
          cost: 45,
          customizable: true,
        },
        {
          id: "act-2-3",
          name: "Traditional Balinese Lunch Buffet",
          cost: 25,
          customizable: true,
        },
      ],
    },
    {
      day: 3,
      title: "Spiritual Temples & Waterfall Trekking",
      dayImage:
        "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=500&q=80",
      description:
        "Visit Pura Tirta Empul for a spiritual cleansing ritual and hike down to the stunning Tegenungan Waterfall.",
      activities: [
        {
          id: "act-3-1",
          name: "Tirta Empul Holy Water Blessing Entry",
          cost: 20,
          customizable: false,
        },
        {
          id: "act-3-2",
          name: "Private Photographer for Waterfall Session",
          cost: 60,
          customizable: true,
        },
      ],
    },
    {
      day: 4,
      title: "Nusa Penida Island Day Cruise",
      dayImage:
        "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=500&q=80",
      description:
        "Board a high-speed catamaran to Nusa Penida. Visit the Instagram-famous Kelingking Beach and snorkel with manta rays.",
      activities: [
        {
          id: "act-4-1",
          name: "Fast Boat Round-Trip Tickets",
          cost: 80,
          customizable: false,
        },
        {
          id: "act-4-2",
          name: "Manta Bay Snorkeling Adventure",
          cost: 50,
          customizable: true,
        },
        {
          id: "act-4-3",
          name: "Kelingking Cliffside Guided Walk",
          cost: 15,
          customizable: false,
        },
      ],
    },
    {
      day: 5,
      title: "Leisure Day & Luxury Spa Treats",
      dayImage:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80",
      description:
        "A completely open day for shopping in Seminyak or sunbathing. In the afternoon, enjoy an authentic flower bath treatment.",
      activities: [
        {
          id: "act-5-1",
          name: "2-Hour Luxury Balinese Spa & Flower Bath",
          cost: 75,
          customizable: true,
        },
      ],
    },
    {
      day: 6,
      title: "Uluwatu Sunset & Kecak Fire Dance",
      dayImage:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=500&q=80",
      description:
        "Head to the southwestern tip of Bali. Witness a cliffside sunset over Uluwatu Temple accompanied by a dramatic Kecak dance performance.",
      activities: [
        {
          id: "act-6-1",
          name: "Uluwatu Temple Entrance & Guide",
          cost: 15,
          customizable: false,
        },
        {
          id: "act-6-2",
          name: "Kecak Dance VIP Front-Row Seating",
          cost: 35,
          customizable: true,
        },
        {
          id: "act-6-3",
          name: "Jimbaran Bay Seafood Candlelight Dinner",
          cost: 90,
          customizable: true,
        },
      ],
    },
    {
      day: 7,
      title: "Departure Homeward Bound",
      dayImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      description:
        "Enjoy your final floating breakfast at the villa before packing your bags. Your private driver will drop you back off at the airport.",
      activities: [
        {
          id: "act-7-1",
          name: "Luxury Floating Breakfast Experience",
          cost: 40,
          customizable: true,
        },
        {
          id: "act-7-2",
          name: "Private Departure Airport Transfer",
          cost: 0,
          customizable: false,
        },
      ],
    },
  ],
};

const TourItinerary = ({ onBackClick }) => {
  const data = MOCK_ITINERARY_DATA;
  const [removedActivityIds, setRemovedActivityIds] = useState([]);
  const [activeDay, setActiveDay] = useState(1);
  const dayRefs = useRef({});
  const isAutoScrolling = useRef(false);

  // Calculate current final dynamic package price
  const currentPrice =
    data.basePrice -
    data.itinerary.reduce((acc, day) => {
      const dayDeductions = day.activities.reduce((sum, act) => {
        return (
          sum +
          (act.customizable && removedActivityIds.includes(act.id)
            ? act.cost
            : 0)
        );
      }, 0);
      return acc + dayDeductions;
    }, 0);

  const toggleActivity = (id) => {
    if (removedActivityIds.includes(id)) {
      setRemovedActivityIds(removedActivityIds.filter((item) => item !== id));
    } else {
      setRemovedActivityIds([...removedActivityIds, id]);
    }
  };

  // Improved target scrolling to avoid elements hiding beneath margins
  const scrollToDay = (dayNum) => {
    const element = dayRefs.current[dayNum];
    if (element) {
      isAutoScrolling.current = true;
      setActiveDay(dayNum);

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Release layout locks after smooth animations settle
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 800);
    }
  };

  // Watch manual user viewport scroll transformations
  useEffect(() => {
    const handleScroll = () => {
      if (isAutoScrolling.current) return;

      const scrollPosition = window.scrollY + 200;

      for (let dayPlan of data.itinerary) {
        const el = dayRefs.current[dayPlan.day];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveDay(dayPlan.day);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data.itinerary]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Return Navigation Anchor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={onBackClick}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Packages
        </button>
      </div>

      {/* Top Multi-Picture Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[260px] md:h-[400px] rounded-3xl overflow-hidden shadow-sm bg-gray-200">
          {/* Main Large Image */}
          <div className="md:col-span-2 h-full relative group overflow-hidden">
            <img
              src={data.images[0]}
              alt={data.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
          </div>
          {/* Side Image 1 */}
          <div className="hidden md:block h-full overflow-hidden relative group">
            <img
              src={data.images[1]}
              alt="Destination Vista 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* Side Image 2 */}
          <div className="hidden md:block h-full overflow-hidden relative group">
            <img
              src={data.images[2]}
              alt="Destination Vista 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Main Structural Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Sticky Day Timeline Navigator (3-Columns wide) */}
        

          {/* MIDDLE COLUMN: Detail Content Streams (6-Columns wide) */}
          <main className="col-span-1 lg:col-span-6 space-y-8">
            {/* Header Package Package Summary Node Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md mb-2 inline-block">
                    {data.category} Experience
                  </span>
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    {data.title}
                  </h1>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl text-sm font-bold shrink-0">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {data.rating}
                </div>
              </div>

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 border-b border-gray-100 pb-4 mb-4">
                <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600" />{" "}
                  {data.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" /> {data.daysCount}{" "}
                  Days / {data.nightsCount} Nights
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Destinations Covered
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.destinationsCovered.map((dest, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 border border-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-xl font-medium"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Itinerary Stream Content blocks with custom scroll offset matching anchors */}
            <div className="space-y-6">
              {data.itinerary.map((dayPlan) => (
                <div
                  key={dayPlan.day}
                  ref={(el) => (dayRefs.current[dayPlan.day] = el)}
                  className={`bg-white border rounded-3xl p-6 transition-all duration-300 scroll-mt-28 ${
                    activeDay === dayPlan.day
                      ? "border-blue-500 shadow-md ring-4 ring-blue-50"
                      : "border-gray-100 shadow-sm"
                  }`}
                >
                  {/* Title Bar Line */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                      Day {dayPlan.day}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {dayPlan.title}
                    </h3>
                  </div>

                  {/* Day Overview Layout Grid featuring Integrated Pictures */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    <div className="sm:col-span-1 h-32 rounded-2xl overflow-hidden shadow-xs border border-gray-100 bg-gray-100">
                      <img
                        src={dayPlan.dayImage}
                        alt={`Day ${dayPlan.day} route scenery`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-col justify-center">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {dayPlan.description}
                      </p>
                    </div>
                  </div>

                  {/* Activity Schedules Subcard Container */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-gray-400" /> Day
                      Activities Schedule
                    </h4>
                    <div className="space-y-2.5">
                      {dayPlan.activities.map((act) => {
                        const isRemoved = removedActivityIds.includes(act.id);
                        return (
                          <div
                            key={act.id}
                            className={`flex justify-between items-center p-3 rounded-xl border transition-all text-sm ${
                              isRemoved
                                ? "bg-gray-100/50 border-dashed border-gray-200 opacity-60"
                                : "bg-white border-gray-100 shadow-xs"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {!isRemoved ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-4 h-4 border border-gray-300 rounded-full shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span
                                  className={
                                    isRemoved
                                      ? "line-through text-gray-400"
                                      : "font-semibold text-gray-800"
                                  }
                                >
                                  {act.name}
                                </span>
                                {act.customizable && (
                                  <span className="block text-[11px] text-blue-600 font-medium mt-0.5">
                                    {isRemoved
                                      ? "✕ Activity Removed"
                                      : "✨ Optional Activity"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 ml-4 shrink-0">
                              {act.cost > 0 && (
                                <span
                                  className={`text-xs font-bold ${isRemoved ? "line-through text-gray-400" : "text-gray-700"}`}
                                >
                                  + Rs {act.cost}
                                </span>
                              )}
                              {act.customizable && (
                                <button
                                  onClick={() => toggleActivity(act.id)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isRemoved
                                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                      : "bg-red-50 text-red-600 hover:bg-red-100"
                                  }`}
                                  title={
                                    isRemoved
                                      ? "Add activity back"
                                      : "Remove optional activity"
                                  }
                                >
                                  {isRemoved ? (
                                    <Plus className="w-3.5 h-3.5" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
          <div className="flex flex-col gap-2 items-center justify-center w-full">
          {/* RIGHT COLUMN: Price Terminal Tracker Card (3-Columns wide) */}
          <aside className="w-full lg:col-span-3 sticky top-28 bg-white border border-gray-100 p-6 rounded-3xl shadow-lg">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Pricing Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Base Package Cost</span>
                <span className="font-semibold text-gray-800">
                  Rs {data.basePrice.toFixed(2)}
                </span>
              </div>

              {/* List out subtracted entries accurately */}
              {data.itinerary.map((day) =>
                day.activities.map((act) => {
                  if (act.customizable && removedActivityIds.includes(act.id)) {
                    return (
                      <div
                        key={act.id}
                        className="flex justify-between text-xs text-red-500 font-medium bg-red-50/50 p-1.5 rounded-md"
                      >
                        <span className="truncate max-w-[130px]">
                          Omitted: {act.name}
                        </span>
                        <span>- Rs {act.cost.toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                }),
              )}

              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">
                  Final Total
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600">
                    Rs {currentPrice.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">
                    per person / all taxes incl.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 mb-6 flex gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-normal">
                Modifying optional tour features updates your billing
                calculation in real time.
              </p>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-98">
              Proceed to Booking
            </button>
          </aside>
      
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourItinerary;
