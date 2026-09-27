import type {
  IActivity,
  IItineraryDay,
  IOptionalActivity,
} from "@/interfaces/interfaces";
import { Camera, CheckCircle2, Clock, Trash2 } from "lucide-react";

interface ItineraryDayCardProps {
  dayPlan: IItineraryDay;
  activeDay: number;
  removedActivityIds: string[];
  addedActivityIds: string[];
  toggleRemovedActivity: (id: string) => void;
  toggleAddedActivity: (id: string) => void;
  setDayRef: (day: number, el: HTMLDivElement | null) => void;
}

export const ItineraryDayCard = ({
  activeDay,
  addedActivityIds,
  dayPlan,
  removedActivityIds,
  setDayRef,
  toggleAddedActivity,
  toggleRemovedActivity,
}: ItineraryDayCardProps) => {
  //   <div
  //     key={dayPlan.day}
  //     ref={(el) => setDayRef(dayPlan.day, el)}
  //     className={`bg-white border rounded-3xl p-6 transition-all duration-300 scroll-mt-28 ${activeDay === dayPlan.day ? "border-blue-500 shadow-md ring-4 ring-blue-50" : "border-gray-100 shadow-sm "}`}
  //   >
  //     <div className="flex items-center gap-3 mb-4">
  //       <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
  //         Day {dayPlan.day}
  //       </span>
  //     </div>

  //     <div className="bg-amber-50 border border-gray-100 rounded-2xl p-4 mt-5">
  //       <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5 ">
  //         <Camera className="w-3.5 h-3.5 text-gray-400" /> Day Activities Included
  //       </h4>
  //       <div className="space-y-2.5">
  //         {dayPlan.activities.map((act: IActivity) => {
  //           const isRemoved = removedActivityIds.includes(act.id);
  //           return (
  //             <div
  //               key={act.id}
  //               className={`flex justify-between items-center p-3 rounded-xl border transition-all text-sm ${isRemoved ? "bg-gray-100/50 border-dashed border-gray-200 " : "bg-white border-gray-100 shadow-xs"} `}
  //             >
  //               <div className="flex  items-start">
  //                 <div className=" w-full flex flex-col items-center gap-1">
  //                   {act.image && (
  //                     <img
  //                       src={act.image as string}
  //                       alt={act.name}
  //                       className="w-30 h-20 rounded-lg object-cover shrink-0"
  //                     />
  //                   )}
  //                   <span className="block text-[11px] text-gray-500">
  //                     <Clock className="inline-block w-3 h-3" /> {act.timing.from}{" "}
  //                     - {act.timing.to}
  //                   </span>
  //                   {act.cost > 0 && act.customizable && (
  //                     <span
  //                       className={`text-xs font-bold ${isRemoved ? "line-through text-gray-400 " : "text-gray-700"}`}
  //                     >
  //                       + Rs {act.cost}
  //                     </span>
  //                   )}
  //                   {act.customizable && (
  //                     <button
  //                       onClick={() => toggleRemovedActivity(act.id)}
  //                       className={`p-1.5  rounded-lg transition-colors `}
  //                     >
  //                       {isRemoved ? (
  //                         <p className="bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 px-1 cursor-pointer">
  //                           add
  //                         </p>
  //                       ) : (
  //                         <>
  //                           <p className="hidden bg-red-100 hover:bg-red-200 min-[360px]:inline rounded-md text-red-600 px-1 cursor-pointer">
  //                             Remove
  //                           </p>
  //                           <span className=" min-[360px]:hidden text-red-500 inline-flex items-center justify-center bg-red-200 hover:bg-red-300 p-1 rounded-lg ">
  //                             <Trash2 className="size-4" />
  //                           </span>
  //                         </>
  //                       )}
  //                     </button>
  //                   )}
  //                 </div>
  //                 {!isRemoved ? (
  //                   <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
  //                 ) : (
  //                   <div className="w-4 h-4 border border-gray-300 rounded-full shrink-0 mt-0.5" />
  //                 )}
  //                 <div>
  //                   <div className="flex  items-center justify-between">
  //                     <span
  //                       className={`${isRemoved ? "line-through text-gray-400" : "font-semibold text-gray-800"}`}
  //                     >
  //                       {act.name}
  //                     </span>
  //                     {act.customizable && (
  //                       <span className="block text-[11px] text-blue-600 font-medium mt-0.5">
  //                         {isRemoved
  //                           ? "✕ Activity Removed"
  //                           : "✨ Optional Activity"}
  //                       </span>
  //                     )}
  //                   </div>
  //                   <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
  //                     {act.description}
  //                   </p>
  //                 </div>
  //               </div>

  //               <div className="flex items-center gap-3 ml-4 shrink-0"></div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>

  //     <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-5">
  //       <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5 ">
  //         You can add extra activities
  //       </h4>
  //       <div className="space-y-2.5">
  //         {dayPlan.optionalActivities.map((act) => {
  //           const isAdded = addedActivityIds.includes(act.id);
  //           return (
  //             <div
  //               key={act.id}
  //               className={`flex justify-between items-center p-3 rounded-xl border transition-all text-sm ${!isAdded ? " border-dashed border-gray-200 " : "bg-white border-gray-100 shadow-xs"} `}
  //             >
  //               <div className="flex items-start gap-2.5">
  //                 {isAdded ? (
  //                   <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
  //                 ) : (
  //                   ""
  //                 )}
  //                 <div>
  //                   <span className={`text-gray-800 font-semibold`}>
  //                     {act.name}
  //                   </span>

  //                   <span className="block text-[11px] text-blue-600 font-medium mt-0.5">
  //                     {isAdded ? " Activity Added" : ""}
  //                   </span>
  //                 </div>
  //               </div>

  //               <div className="flex items-center gap-3 ml-4 shrink-0">
  //                 {act.cost > 0 && (
  //                   <span className={`text-xs font-bold `}>+ Rs {act.cost}</span>
  //                 )}

  //                 <button
  //                   onClick={() => toggleAddedActivity(act.id)}
  //                   className={`p-1.5  rounded-lg transition-colors`}
  //                 >
  //                   {!isAdded ? (
  //                     <p className="bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 px-1 cursor-pointer">
  //                       Add
  //                     </p>
  //                   ) : (
  //                     <>
  //                       <p className="hidden bg-red-100 hover:bg-red-200 min-[360px]:inline rounded-md text-red-600 px-1 cursor-pointer">
  //                         Remove
  //                       </p>
  //                       <span className=" min-[360px]:hidden text-red-500 inline-flex items-cener justify-center bg-red-200 hover:bg-red-300 p-1 rounded-lg ">
  //                         <Trash2 className="size-4" />
  //                       </span>
  //                     </>
  //                   )}
  //                 </button>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   </div>;

  return (
    <div
      key={dayPlan.day}
      ref={(el) => setDayRef(dayPlan.day, el)}
      className={`bg-white border rounded-3xl p-6 transition-all duration-300 scroll-mt-28 ${activeDay === dayPlan.day ? "border-blue-500 shadow-md ring-4 ring-blue-50" : "border-gray-100 shadow-sm "}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
          Day {dayPlan.day}
        </span>
      </div>

      <div className="bg-amber-50 border border-gray-100 rounded-2xl p-4 mt-5">
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5 ">
          <Camera className="w-3.5 h-3.5 text-gray-400" /> Day Activities
          Included
        </h4>
        <div className="space-y-3">
          {dayPlan.activities.map((act: IActivity) => {
            const isRemoved = removedActivityIds.includes(act.id);
            return (
              <div
                key={act.id}
                className={`flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border transition-all text-sm ${isRemoved ? "bg-gray-100/50 border-dashed border-gray-200 " : "bg-white border-gray-100 shadow-xs"} `}
              >
                <div className=" w-full flex flex-col items-center sm:items-start shrink-0 sm:w-36 ">
                  {act.image ? (
                    <img
                      src={act.image as string}
                      alt={act.name}
                      className="w-full h-24 rounded-lg object-cover shadow-xs mb-2.5"
                    />
                  ) : (
                    <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 mb-2.5">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}

                  <div className="w-full space-y-2">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md justify-center sm:justify-start">
                      <Clock className="text-gray-400 shrink-0 w-3 h-3" />{" "}
                      {act?.timing?.from} - {act?.timing?.to}
                    </span>
                    {act.cost > 0 && act.customizable && (
                      <div className="text-center sm:text-left text-xs font-semibold text-gray-700 px-1">
                        <span
                          className={` ${isRemoved ? "line-through text-gray-400 " : ""}`}
                        >
                          + Rs {act.cost}
                        </span>
                      </div>
                    )}
                    {act.customizable && (
                      <button
                        onClick={() => toggleRemovedActivity(act.id)}
                        className={`w-full transition-colors cursor-pointer `}
                      >
                        {isRemoved ? (
                          <span className=" block w-full bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 py-1 text-xs font-semibold text-center cursor-pointer">
                            Add Back
                          </span>
                        ) : (
                          <>
                            <p className="hidden w-full bg-red-100 hover:bg-red-200 min-[360px]:block rounded-md text-red-600 py-1 text-xs font-semibold text-center cursor-pointer">
                              Remove
                            </p>
                            <span className=" min-[360px]:hidden text-red-500 inline-flex items-center justify-center bg-red-200 hover:bg-red-300 py-1 rounded-lg ">
                              <Trash2 className="size-4" />
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {!isRemoved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded-full shrink-0 " />
                    )}

                    <span
                      className={`${isRemoved ? "line-through text-gray-400" : "font-semibold text-gray-800"}`}
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

                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {dayPlan.optionalActivities && dayPlan.optionalActivities.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-5">
          <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5 ">
            You can add extra activities
          </h4>
          <div className="space-y-3">
            {dayPlan.optionalActivities.map((act: IOptionalActivity) => {
              const isAdded = addedActivityIds.includes(act.id);
              return (
                <div
                  key={act.id}
                  className={`flex flex-col sm:flex-row  items-start gap-4 p-4 rounded-xl border transition-all text-sm ${!isAdded ? " border-dashed border-gray-200 bg-white/50 " : "bg-white border-gray-100 shadow-xs"} `}
                >
                  <div className=" w-full flex flex-col items-center sm:items-start shrink-0 sm:w-36 ">
                    {act.image ? (
                      <img
                        src={act.image as string}
                        alt={act.name}
                        className="w-full h-24 rounded-lg object-cover shadow-xs mb-2.5"
                      />
                    ) : (
                      <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 mb-2.5">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}

                    <div className="w-full space-y-2">
                      <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md justify-center sm:justify-start">
                        <Clock className="text-gray-400 shrink-0 w-3 h-3" />{" "}
                        {act?.timing?.from} - {act?.timing?.to}
                      </span>
                      {act.cost > 0 && (
                        <div className="text-center sm:text-left text-xs font-semibold text-gray-700 px-1">
                          + Rs {act.cost}
                        </div>
                      )}

                      <button
                        onClick={() => toggleAddedActivity(act.id)}
                        className={`w-full transition-colors cursor-pointer `}
                      >
                        {!isAdded ? (
                          <span className=" block w-full bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 py-1 text-xs font-semibold text-center cursor-pointer">
                            Add
                          </span>
                        ) : (
                          <>
                            <p className="hidden w-full bg-red-100 hover:bg-red-200 min-[360px]:block rounded-md text-red-600 py-1 text-xs font-semibold text-center cursor-pointer">
                              Remove
                            </p>
                            <span className=" min-[360px]:hidden text-red-500 inline-flex items-center justify-center bg-red-200 hover:bg-red-300 py-1 rounded-lg ">
                              <Trash2 className="size-4" />
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {!isAdded && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}

                      <span className="text-base font-semibold text-gray-900">
                        {act.name}
                      </span>
                      {isAdded && (
                        <span className="text-[11px] text-blue-600 font-medium ml-auto">
                          Activity Added
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500  leading-relaxed mt-1">
                      {act.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
