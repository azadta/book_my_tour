import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import SaveToWishlistModal from "@/components/SaveToWishlistModal";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";

import { usePackageList } from "@/hooks/usePackageList";
import type { RootState } from "@/redux/store";
import { updateSearchParams } from "@/utils/updateSearchParams";

import {
  Calendar,
  Clock,
  Compass,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

const PackagesList = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { currentUser } = useSelector((state: RootState) => state.user);

  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const {
    packages,
    totalPackagesCount,
    loadingCategories,
    loadingPackages,
    uniqueCategoryCount,
    fetchPackages,
    activeCategories,
    wishlistGroups,
    selectedPackageForWishList,
    setSelectedPackageForWishlist,
    handleCreateWishlistGroup,
    handleToggleWishlistGroup,
  } = usePackageList();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const destination = searchParams.get("destination") || "";
  const destinationName = searchParams.get("destinationName") || "";
  const [maxBudget, setMaxBudget] = useState(
    Number(searchParams.get("maxBudget")) || 100000,
  );
  const [maxDuration, setMaxDuration] = useState(
    Number(searchParams.get("maxDuration")) || 15,
  );

  const [debouncedSearch] = useDebounce(search, 700);
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = e.target.value.split(":");
    setSearchParams((prev) =>
      updateSearchParams(prev, {
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      }),
    );
  };

  const hasActiveFiters = [...searchParams.keys()].some(
    (key) => key !== "page",
  );

  useEffect(() => {
    fetchPackages(searchParams.toString());
  }, [searchParams]);

  useEffect(() => {
    const value = debouncedMaxBudget === 100000 ? null : debouncedMaxBudget;
    setSearchParams((prev) => {
      return updateSearchParams(prev, { maxBudget: value });
    });
  }, [debouncedMaxBudget]);

  useEffect(() => {
    const value = debouncedMaxDuration === 15 ? null : debouncedMaxDuration;
    setSearchParams((prev) => updateSearchParams(prev, { maxDuration: value }));
  }, [debouncedMaxDuration]);
  useEffect(() => {
    const value = debouncedSearch === "" ? null : debouncedSearch;
    setSearchParams((prev) => {
      return updateSearchParams(prev, { search: value });
    });
  }, [debouncedSearch]);
  if (loadingPackages || loadingCategories) return <Loading />;

  return (
    <div className="min-h-screen  bg-gray-50  font-sans ">
      <div className="flex relative">
        {showMobileFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-50 md:hidden "
            onClick={() => setShowMobileFilters(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 w-80 bg-white p-6 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto border-r border-gray-200 ${showMobileFilters ? "translate-x-0 max-w-[250px]" : "-translate-x-full"} md:sticky md:translate-x-0 md:top-15 md:h-[calc(100vh-60px)] md:z-40 md:block  `}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 mt-5">
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
        <main className="flex-1  p-3 xs:p-4 sm:p-6 md:p-8 ">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4  ">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 ">
                {destinationName ? (
                  <>
                    <span className="text-yellow-400">{destinationName}</span>{" "}
                    Tour Packages
                  </>
                ) : (
                  `Explore curated travel bundles`
                )}
              </h1>

              {hasActiveFiters && (
                <button
                  onClick={clearFilters}
                  className=" font-semibold text-sm text-white border-gray-600  border bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-xl mt-2 mb-1 hover:cursor-pointer"
                >
                  Clear All filters
                </button>
              )}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-sm hover:bg-blue-700 transition-colors"
              >
                <SlidersHorizontal className="size-3.5" /> Filters
              </button>

              {!destination && (
                <p>Tailored Iteneraries handpicked for absolute comfort</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start  sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase traking-wider whitespace-nowrap ">
                  Sort By
                </label>
                <select
                  value={`${sortBy}:${sortOrder}`}
                  onChange={handleSortChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer "
                >
                  <option value="createdAt:desc">Newest First</option>
                  <option value="price:asc">Price: Low to High</option>
                  <option value="price:desc">Price: High to Low</option>
                  <option value="rating:desc">Highest Rating</option>
                </select>
              </div>

              <div className="flex items-center divide-x divide-gray-200 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 ">
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
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-1 relative  ">
              {(loadingCategories || loadingPackages) && <Loading />}
              {packages.map((pkg) => {
                const isSavedAnywhere = wishlistGroups.some((g) =>
                  g.packages.some((p: any) => {
                    const id = typeof p === "string" ? p : p._id;
                    return id === pkg._id;
                  }),
                );
                return (
                  <div
                    key={pkg._id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm  hover:shadow-xl transition-all duration-300 flex flex-col  group relative  "
                  >
                    <div className="relative h-64 overflow-hidden ">
                      <img
                        src={pkg.images?.[0]}
                        alt={pkg.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 z-10 flex gap-2 items-center justify-center">
                        {pkg.discount && (
                          <div className=" bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md animate-pulse ">
                            Save {pkg.discount}%
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!currentUser) {
                              toast.info(
                                FEEDBACK_MESSAGES.WISHLIST.ERROR.LOGIN,
                              );
                              navigate(FRONTEND_ROUTES.USER.LOGIN);
                            }
                            setSelectedPackageForWishlist(pkg._id);
                          }}
                          className=" p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:scale-110 transition-all active:scale-95 "
                        >
                          <Heart
                            className={`w-5 h-5 ${isSavedAnywhere ? "fill-rose-500 text-rose-500" : "text-gray-600 hover:text-rose-500"}`}
                          />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 rigt-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm ">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {pkg.destinations[0].name}
                      </div>

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
                          {pkg.averageRating &&
                          pkg.reviewCount &&
                          pkg.reviewCount > 0 ? (
                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg shrink-0">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 " />
                              <span> {pkg.averageRating.toFixed(1)}</span>(
                              {pkg.reviewCount})
                            </div>
                          ) : null}
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
                            {pkg?.specifications
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
                            Destinations covered
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {pkg?.destinations.map((dest, idx) => (
                              <span
                                key={idx}
                                className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                              >
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                {dest.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-auto xs:flex xs:flex-row flex-col  justify-between   gap-3">
                        {pkg?.discount ? (
                          <div>
                            <span className="text-xs text-gray-400 line-through  block">
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

                        <button
                          onClick={() =>
                            navigate(
                              FRONTEND_ROUTES.USER.PACKAGE_DETAILS(pkg._id),
                            )
                          }
                          className="bg-blue-600 w-full max-w-[150px]  xs:w-auto hover:bg-blue-700 text-white font-semibold text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 whitespace-nowrap text-center"
                        >
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
      <SaveToWishlistModal
        isOpen={Boolean(selectedPackageForWishList)}
        onClose={() => setSelectedPackageForWishlist(null)}
        groups={wishlistGroups}
        packageId={selectedPackageForWishList || ""}
        onToggleGroup={handleToggleWishlistGroup}
        onCreateGroup={handleCreateWishlistGroup}
      />
    </div>
  );
};

export default PackagesList;
