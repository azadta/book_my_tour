import type { IReviewItem, IReviewStats } from "@/interfaces/interfaces";
import type { RootState } from "@/redux/store";
import { CheckCircle2, Edit2, MessageSquare, Star, Trash2 } from "lucide-react";
import type React from "react";
import { useSelector } from "react-redux";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";

interface PackageReviewProps {
  stats: IReviewStats | null;
  reviews: IReviewItem[];

  onEditReview: (editPayload: any) => void;
  onDeleteReview: (reviewId: string) => void;
  openCreateModal: () => void;
}

const PackageReviews: React.FC<PackageReviewProps> = ({
  stats,
  reviews,
  openCreateModal,
  onDeleteReview,
  onEditReview,
}) => {
  if (!stats || !reviews || stats.totalReviews === 0) return;
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => Promise<void>>(
    () => async () => {},
  );

  const ratingBars = [
    { label: "5 Stars", count: stats?.fiveStar },
    { label: "4 Stars", count: stats?.fourStar },
    { label: "3 Stars", count: stats?.threeStar },
    { label: "2 Stars", count: stats?.twoStar },
    { label: "1 Star", count: stats?.oneStar },
  ];
    const openConfirmationModel = (
    message: string,
    action: () => Promise<void>,
  ) => {
    setModalMessage(message);
    setModalAction(() => action);
    setModalOpen(true);
  };

  return (
    <section
      id="reviews-section"
      className=" max-w-[1540px] mx-auto px-4  mt-5 bg-white border border-gray-100 rounded-3xl py-6 shadow-sm space-y-8"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4  ">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Traveler Reviews
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 ">
            Verified Feedback from past travelers
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-4 py-2 rounded-xl transition-colors "
        >
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 ">
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6 ">
          <span className="text-5xl font-black text-gray-900">
            {stats?.averageRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(stats.averageRating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-500">
            Based on {stats.totalReviews} reviews
          </span>
        </div>

        <div className="md:col-span-8 space-y-2">
          {ratingBars.map((bar, idx) => {
            const percentage =
              stats.totalReviews > 0
                ? (bar.count / stats.totalReviews) * 100
                : 0;
            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-gray-600 shrink-0">
                  {bar.label}
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full  overflow-hidden ">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  >
                    {" "}
                  </div>
                </div>
                <span className="w-8 text-right text-gray-400 font-medium">
                  {bar.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: "Tour Guide", score: stats.avgGuide },
          { title: "Value for Money", score: stats.avgValue },
          { title: "Itinerary", score: stats.avgItinerary },
          { title: "Transport", score: stats.avgTransport },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl text-center"
          >
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              {item.title}
            </span>
            <span className="text-sm font-extrabold text-gray-800">
              {item.score.toFixed(1)}/5.0
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-5 pt-2">
        {reviews.map((rev) => {
          const isOwner = rev.userId._id === currentUser?._id;
          return (
            <div
              key={rev._id}
              className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {rev.userId.image ? (
                    <img
                      src={rev.userId.image}
                      alt={rev.userId.name}
                      className="w-10 h-10 rounded-full object-cover "
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {rev.userId.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      {rev.userId.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3 " />
                        Verified Booker
                      </span>
                      <span>•</span>
                      <span>{rev.travelerType || "Couples"}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs text-gray-400 ">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className=" flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? "text-amber-400 fill-amber-400 " : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed ">
                {rev.comment}
              </p>
              <div className="flex items-end gap-4 pt-2 justify-between">
                {rev.images && rev.images.length > 0 ? (
                  <div className="flex gap-2 pt-1 overflow-x-auto">
                    {rev.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Traveler upload"
                        className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                      />
                    ))}
                  </div>
                ) : (
                  <div />
                )}

                {isOwner && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onEditReview(rev);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer "
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        openConfirmationModel(
                          "Are you sure you want to delete?",
                          async () => {
                            onDeleteReview(rev._id);
                          },
                        );
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer "
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onConfirm={async () => {
          await modalAction();
          setModalOpen(false);
        }}
      />
    </section>
  );
};

export default PackageReviews;
