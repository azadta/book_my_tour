import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";

import { usePackageList } from "@/hooks/usePackageList";
import { updateSearchParams } from "@/utils/updateSearchParams";

import {
  Calendar,
  Clock,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

const PackagesList = () => {
  const navigate=useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const {
    packages,
    totalPackagesCount,
    loadingCategories,
    loadingPackages,
    uniqueCategoryCount,
    fetchPackages,
    activeCategories,
  } = usePackageList();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [maxBudget, setMaxBudget] = useState(
    Number(searchParams.get("maxBudget")) || 100000,
  );
  const [maxDuration, setMaxDuration] = useState(
    Number(searchParams.get("maxDuration")) || 15,
  );

  const [debouncedSearch] = useDebounce(search,700);
  const [debouncedMaxBudget] = useDebounce(maxBudget, 500);
  const [debouncedMaxDuration] = useDebounce(maxDuration, 500);

  const selectedDate = searchParams.get("selectedDate") || "";
  const category = searchParams.get("category") || "All";

  const resultPerPage = 6;
  const totalPages = Math.ceil(totalPackagesCount / resultPerPage);

  const onPageChange = (page: number) => {
    setSearchParams((prev) => updateSearchParams(prev, { page }));
  };

  const clearFilters = () => {
    setSearch("");
    setMaxBudget(100000);
    setMaxDuration(15);
    setSearchParams({});
  };

  useEffect(() => {
    fetchPackages(searchParams.toString());
  }, [searchParams]);

  useEffect(() => {
    setSearchParams((prev) => {
      return updateSearchParams(prev, { maxBudget: debouncedMaxBudget });
    });
  }, [debouncedMaxBudget]);

  useEffect(() => {
    setSearchParams((prev) =>
      updateSearchParams(prev, { maxDuration: debouncedMaxDuration }),
    );
  }, [debouncedMaxDuration]);
  useEffect(() => {
    setSearchParams((prev) => {
      return updateSearchParams(prev, { search: debouncedSearch });
    });
  }, [debouncedSearch]);

  if (loadingCategories || loadingPackages) return <Loading />;

  return (
    <div className="min-h-screen  bg-gray-50  font-sans ">
      <div className="flex relative">
        <aside className="w-80 bg-white border-r border-gray-200 p-6 sticky top-15 h-[700px] pt-10  left-0 overflow-y-auto  z-40 hidden md:block   ">
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                max={"100000"}
                step={"100"}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 "
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1 ">
                {" "}
                <span>Rs 1k</span>
                <span>Rs 1 lack</span>
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
                  onChange={(e) =>
                    setSearchParams((prev) =>
                      updateSearchParams(prev, {
                        selectedDate: e.target.value,
                      }),
                    )
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all   "
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ">
                Category Idea
              </label>
              <div className="flex flex-wrap items-center  gap-2 ">
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === "All" ? "bg-blue-600 text-white shadow-sm " : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  onClick={() =>
                    setSearchParams((prev) =>
                      updateSearchParams(prev, { category: "All" }),
                    )
                  }
                >
                  All
                </button>
                {activeCategories?.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setSearchParams((prev) =>
                        updateSearchParams(prev, { category: cat._id }),
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat._id ? "bg-blue-600 text-white shadow-sm " : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {cat.name}
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
              <p>Tailored Iteneraries handpicked for absolute comfort</p>
            </div>

            <div className="flex items-center  divide-x divide-gray-200 ">
              <div className="text-center sm:text-left px-3">
                <span className="block text-2xl font-extrabold text-blue-600 ">
                  {totalPackagesCount}
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Packages Shown
                </span>
              </div>

              <div className="px-3 text-center sm:text-left">
                <span className="block text-2xl font-extrabold text-indigo-600 ">
                  {uniqueCategoryCount}
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Categories Shown
                </span>
              </div>
            </div>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {packages.map((pkg) => {
                return (
                  <div
                    key={pkg._id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm  hover:shadow-xl transition-all duration-300 flex flex-col  group  "
                  >
                    <div className="relative h-64 overflow-hidden ">
                      <img
                        src={pkg.images?.[0]}
                        alt={pkg.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 rigt-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm ">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {pkg.destinations[0].name}
                      </div>

                      {pkg.discount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md animate-pulse ">
                          Save {pkg.discount}%
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-gray-900/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded">
                        {pkg?.category?.name}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between  ">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600  transition-colors">
                            {pkg.name}
                          </h3>
                        </div>
                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md mb-4">
                          <Clock className="w-3.5 h-3.5 " />
                          {pkg.duration.day} Days / {pkg.duration.night} Nights
                        </div>
                        <div className="mb-4">
                          <span className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                            What's included
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.specifications
                              ?.split(",")

                              .map((fac, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-md border border-gray-100"
                                >
                                  {fac.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className="mb-6">
                          <span className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                            Curated Experience
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {pkg.activities?.split(",").map((act, idx) => (
                              <span
                                key={idx}
                                className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                              >
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                {act}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-auto flex justify-between items-center">
                        {pkg?.discount ? (
                          <div>
                            <span className="text-xs text-gray-400 line-through block">
                              Rs {pkg.amount.toFixed(2)}
                            </span>

                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-gray-900">
                                Rs{" "}
                                {Math.round(
                                  pkg.amount * (1 - pkg.discount / 100),
                                ).toLocaleString("en-IN")}
                              </span>
                              <span className="text-xs text-gray-500 font-medium">
                                / person
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900">
                              Rs {(pkg?.amount).toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              / person
                            </span>
                          </div>
                        )}

                        <button onClick={()=>navigate(`/user/package-details/${pkg._id}`)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95">
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
                  clearFilters();
                }}
                className="mt-5 text-xs font-bold text-blue-600 underline"
              >
                Clear All Filters
              </button>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
        </main>
      </div>
    </div>
  );
};

export default PackagesList;
