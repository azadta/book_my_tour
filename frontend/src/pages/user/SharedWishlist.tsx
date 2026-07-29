import Loading from "@/components/Loading";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useSharedWishlist } from "@/hooks/useSharedWishlist";
import {
  ArrowRight,
  Compass,
  MapPin,
  Share2,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { useParams } from "react-router-dom";

const SharedWishlist = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  if (!shareToken) return;
  const { loading, wishlistGroup } = useSharedWishlist({ shareToken });
  const packageCount = wishlistGroup?.packages?.length || 0;
  const calculateGroupTotal = wishlistGroup?.packages.reduce(
    (acc: number, pkg: any) => {
      const price = pkg.discount
        ? Math.round(pkg.amount * (1 - pkg.discount / 100))
        : pkg.amount;
      return acc + price;
    },
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8  relative ">
      {loading && <Loading />}
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-50 rounded-full pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles className="w-5 h-5 " />
                Shared Trip Wishlist
              </span>
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(window.location.href);
                  e.currentTarget.blur();
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors hover:cursor-pointer "
              >
                <Share2 className="w-3.5 h-3.5" />
                Copy Link
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-400  tracking-tight ">
                  {wishlistGroup?.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-xs text-gray-400 uppercase font-semibold ">
                      Total cost
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      Rs {calculateGroupTotal?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {wishlistGroup?.description && (
                <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
                  {wishlistGroup?.description}
                </p>
              )}
            </div>

            <div className="p-2 flex items-center gap-2 text-xs font-medium text-slate-500 ">
              <span>
                {packageCount} {packageCount === 1 ? "package" : "packages"}{" "}
                Saved
              </span>
            </div>
          </div>
        </header>
        {wishlistGroup?.notes && wishlistGroup?.notes.length > 0 && (
          <div className="mt-4 pt-4  space-y-2  ">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-amber-500" />
              Notes for you
            </h4>
            <div className="flex flex-wrap gap-2">
              {wishlistGroup.notes.map((note: any, index: number) => (
                <div
                  key={note._id || index}
                  className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 max-w-sm"
                >
                  {note.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {packageCount > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 ">
              <Compass className="w-5 h-5 text-indigo-600" />
              Saved packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {wishlistGroup?.packages?.map((pkg: any) => (
                <article
                  key={pkg._id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between "
                >
                  {pkg.images && (
                    <div className="h-45 w-full overflow-hidden bg-slate-100">
                      <img
                        src={pkg.images[0]}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between ">
                    <div className="space-y-2">
                      {pkg.destinations && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                          <MapPin className="w-3.5 h-3.5" />
                          {pkg.destinations
                            .map((dest: any) => dest.name)
                            .join(", ")}
                        </span>
                      )}
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {pkg.name}
                      </h3>
                      <a
                        href={FRONTEND_ROUTES.USER.PACKAGE_DETAILS(pkg._id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600  transition-transform hover:cursor-pointer bg-indigo-100/50 px-2 py-1 rounded-xl shadow-md shadow-indigo-100"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SharedWishlist;
