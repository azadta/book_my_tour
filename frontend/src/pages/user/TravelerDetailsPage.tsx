import { usePackageDetails } from "@/hooks/usePackageDetails";
import { useTravelerDetailsPage } from "@/hooks/useTravelerDetailsPage";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CreditCard,
  LoaderCircle,
  Mail,
  MapPin,
  MapPinned,
  MinusCircle,
  Phone,
  PlusCircle,
  User,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface TourMemberDTO {
  type: "adult" | "child";
  index: number;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "male" | "female" | "other" | "";
  passportNumber?: string;
}

export interface PrimaryContactDTO {
  name: string;
  email: string;
  phone: string;
}
export interface BookingNavigationState {
  packageId: string;
  addedActivityIds: string[];
  removedActivityIds: string[];
  generalCouponCode: string | null;
  bankCouponCode: string | null;
  isWalletApplied: boolean;
  adultCount: number;
  childCount: number;
  walletDeduction: number;
  finalPayablePrice: number;
}

export interface FinalBookingPayload extends BookingNavigationState {
  primaryContact: PrimaryContactDTO;
  members: TourMemberDTO[];
}

const TravelerDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state as BookingNavigationState | null;
  if (!bookingData) {
    navigate(-1);
    return null;
  }
  const { pkg: packageData, packageLoading } = usePackageDetails(
    bookingData.packageId,
  );
  const addedActivities =
    packageData?.itinerary.flatMap((day) =>
      day.optionalActivities
        .filter((activity) =>
          bookingData.addedActivityIds.includes(activity.id),
        )
        .map((activity) => ({
          id: activity.id,
          name: activity.name,
        })),
    ) ?? [];

  const removedActivities = packageData?.itinerary?.flatMap(
    (day) =>
      day.activities
        .filter(
          (activity) =>
            activity.customizable &&
            bookingData.removedActivityIds.includes(activity.id),
        )
        .map((activity) => ({ id: activity.id, name: activity.name })) ?? [],
  );
  const { handleBooking, isSubmitting, fieldError, setFieldError } =
    useTravelerDetailsPage();
  const [primaryContact, setPrimaryContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [members, setMembers] = useState<TourMemberDTO[]>(() => {
    const list: TourMemberDTO[] = [];
    for (let i = 0; i < bookingData.adultCount; i++) {
      list.push({
        type: "adult",
        index: i + 1,
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
      });
    }
    for (let i = 0; i < bookingData.childCount; i++) {
      list.push({
        type: "child",
        index: i + 1,
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
      });
    }
    return list;
  });

  const handleMemberChange = (
    index: number,
    field: keyof TourMemberDTO,
    value: string,
  ) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };
  const handleFinalSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!primaryContact.name.trim()) {
      errors["primaryContact.name"] = "Full name is required";
    }
    if (!primaryContact.phone.trim()) {
      errors["primaryContact.phone"] = "Phone number is required";
    }
    if (!primaryContact.email.trim()) {
      errors["primaryContact.email"] = "Email address is required";
    }
    members.forEach((member, idx) => {
      if (!member.firstName.trim()) {
        errors[`members.${idx}.firstName`] = "First name is required";
      }
      if (!member.lastName.trim()) {
        errors[`members.${idx}.lastName`] = "Last name is required";
      }
      if (!member.dob.trim()) {
        errors[`members.${idx}.dob`] = "Date of birth is required";
      }
      if (!member.gender.trim()) {
        errors[`members.${idx}.gender`] = "Gender is required";
      }
    });
    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
      return;
    }

    const finalPayload: FinalBookingPayload = {
      ...bookingData,
      primaryContact,
      members,
    };
    handleBooking(finalPayload);
  };

  const walletPayable = bookingData.walletDeduction ?? 0;
  const razorpayPayable = bookingData.finalPayablePrice;
  const totalBookingAmount = walletPayable + razorpayPayable;

  const isFullyPaidByWallet = walletPayable > 0 && razorpayPayable === 0;

  return (
    <div className="min-h-[calc(100vh-19.81rem)] bg-gray-50/50 py-10  px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-3 py-2 gap-2 text-sm font-semibold text-gray-600 rounded-lg bg-gray-200 hover:text-gray-900 hover:bg-gray-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customization
          </button>
        </div>

        <form
          onSubmit={handleFinalSubmit}
          className="grid grid-cols-1 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.8fr)_minmax(250px,0.85fr)] gap-5 items-start]"
        >
          <aside className="lg:col-start-1 lg:row-start-1">
            <div className="lg:sticky lg:top-24 overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-lg shadow-sky-100/70  ">
              <div className="bg-sky-600 p-5 text-white">
                <div className="flex items-center gap-2 text-pink-100">
                  <MapPinned className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Your trip
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-extrabold leading-tight">
                  {packageData?.name}
                </h2>
                <p className="mt-2 text-sm text-pink-100 ">
                  <Clock3 className="mr-1 inline h-4 w-4" />
                  {packageData?.duration?.day} Days .{" "}
                  {packageData?.duration?.night} Nights
                </p>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Starting Date
                  </p>
                  <div className="flex items-start gap-2 text-sm font-semibold text-gray-800">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-pink-600" />
                    <span>
                      {packageData?.startDate
                        ? new Date(packageData.startDate).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )
                        : "Not specified"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Starting Point
                  </p>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pink-600" />
                    <span>{packageData?.startPoint}</span>
                  </div>
                </div>

                <div className="border-t  border-dashed border-pink-200 pt-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700">
                    <PlusCircle className="h-4 w-4" />
                    Added Activities
                  </p>
                  {addedActivities?.length ? (
                    <ul className="space-y-2">
                      {addedActivities.map((activity) => (
                        <li
                          key={activity.id}
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                        >
                          {activity.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400">
                      No additional Activities
                    </p>
                  )}
                </div>

                <div className="border-t border-dashed border-pink-200 pt-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-700">
                    <MinusCircle className="w-4 h-4 " />
                    Removed Activities
                  </p>
                  {removedActivities?.length ? (
                    <ul className="space-y-2">
                      {removedActivities.map((activity) => (
                        <li
                          key={activity.id}
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                        >
                          {activity.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400">
                      No Activities Removed
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
          <div className="lg:col-start-2 lg:row-start-1 space-y-6 min-w-0 ">
            <div className="bg-white rounded-3xl p-6 border border-pink-900 shadow-xs shadow-pink-200 space-y-4 ">
              <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                <div className="bg-pink-50 text-pink-600 p-2.5 rounded-2xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Contact Details
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name{" "}
                    <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={primaryContact.name}
                      onChange={(e) => {
                        setPrimaryContact({
                          ...primaryContact,
                          name: e.target.value,
                        });
                        setFieldError((prev) => ({
                          ...prev,
                          "primaryContact.name": "",
                        }));
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:bg-pink-100 focus:outline-none focus:border-2 transition"
                    />
                    {fieldError["primaryContact.name"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldError["primaryContact.name"]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number
                    <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={primaryContact.phone}
                      onChange={(e) => {
                        setPrimaryContact({
                          ...primaryContact,
                          phone: e.target.value,
                        });
                        setFieldError((prev) => ({
                          ...prev,
                          "primaryContact.phone": "",
                        }));
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:bg-pink-100 focus:outline-none focus:border-2 transition"
                    />
                    {fieldError["primaryContact.phone"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldError["primaryContact.phone"]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address
                    <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={primaryContact.email}
                      onChange={(e) => {
                        setPrimaryContact({
                          ...primaryContact,
                          email: e.target.value,
                        });
                        setFieldError((prev) => ({
                          ...prev,
                          "primaryContact.email": "",
                        }));
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:bg-pink-100 focus:outline-none focus:border-2 transition"
                    />
                    {fieldError["primaryContact.email"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldError["primaryContact.email"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-pink-900 shadow-xs  shadow-pink-200 space-y-6">
              <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                <div className="bg-pink-50 text-pink-600 p-2.5 rounded-2xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Traveler details
                  </h2>
                  <p className="text-xs text-gray-500">
                    Provide details for all {members.length} participating
                    guest(s){" "}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {members.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-gray-50/70 border border-pink-200 space-y-4"
                  >
                    <div className="flex items-center justify-between ">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        {member.type === "adult"
                          ? `Adult #${member.index}`
                          : `Child #${member.index}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px]  font-bold text-gray-700 mb-1">
                          First Name
                          <span className="text-red-500 font-bold ml-1">*</span>
                        </label>

                        <input
                          type="text"
                          placeholder="First name"
                          value={member.firstName}
                          onChange={(e) => {
                            handleMemberChange(
                              idx,
                              "firstName",
                              e.target.value,
                            );
                            setFieldError((prev) => ({
                              ...prev,
                              [`members.${idx}.firstName`]: "",
                            }));
                          }}
                          className="w-full px-3 py-2 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:outline-none focus:border-2 focus:bg-pink-100 transition"
                        />
                        {fieldError[`members.${idx}.firstName`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {fieldError[`members.${idx}.firstName`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px]  font-bold text-gray-700 mb-1">
                          Last Name
                          <span className="text-red-500 font-bold ml-1">*</span>
                        </label>

                        <input
                          type="text"
                          placeholder="Last name"
                          value={member.lastName}
                          onChange={(e) => {
                            handleMemberChange(idx, "lastName", e.target.value);
                            setFieldError((prev) => ({
                              ...prev,
                              [`members.${idx}.lastName`]: "",
                            }));
                          }}
                          className="w-full px-3 py-2 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:outline-none focus:border-2 focus:bg-pink-100 transition"
                        />
                        {fieldError[`members.${idx}.lastName`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {fieldError[`members.${idx}.lastName`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px]  font-bold text-gray-700 mb-1">
                          Date of Birth
                          <span className="text-red-500 font-bold ml-1">*</span>
                        </label>

                        <input
                          type="date"
                          placeholder="Last name"
                          value={member.dob}
                          onChange={(e) => {
                            handleMemberChange(idx, "dob", e.target.value);
                            setFieldError((prev) => ({
                              ...prev,
                              [`members.${idx}.dob`]: "",
                            }));
                          }}
                          className="w-full px-3 py-2 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:outline-none focus:border-2 focus:bg-pink-100 transition"
                        />
                        {fieldError[`members.${idx}.dob`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {fieldError[`members.${idx}.dob`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px]  font-bold text-gray-700 mb-1">
                          Gender
                          <span className="text-red-500 font-bold ml-1">*</span>
                        </label>

                        <select
                          value={member.gender}
                          onChange={(e) => {
                            handleMemberChange(idx, "gender", e.target.value);
                            setFieldError((prev) => ({
                              ...prev,
                              [`members.${idx}.gender`]: "",
                            }));
                          }}
                          className="w-full px-3 py-2 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:outline-none focus:border-2 focus:bg-pink-100 transition"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {fieldError[`members.${idx}.gender`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {fieldError[`members.${idx}.gender`]}
                          </p>
                        )}
                      </div>

                      <div className="">
                        <label className="block text-[11px]  font-bold text-gray-600 mb-1">
                          Passport Number{" "}
                          <span className="text-gray-600 font-normal">
                            (Optional)
                          </span>
                        </label>

                        <input
                          type="text"
                          placeholder="Enter passport number if required"
                          value={member.passportNumber || ""}
                          onChange={(e) => {
                            handleMemberChange(
                              idx,
                              "passportNumber",
                              e.target.value,
                            );
                            setFieldError((prev) => ({
                              ...prev,
                              [`members.${idx}.passportNumber`]: "",
                            }));
                          }}
                          className="w-full px-3 py-2 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:outline-none focus:border-2 focus:bg-pink-100 transition"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-start-3 lg:row-start-1">
            <div className="lg:sticky lg:top-24 overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-lg shadow-sky-100/70">
              <div className="border-b border-sky-100 bg-sky-50 p-5">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-sky-600 p-2 text-white">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Booking Details</h2>
                    <p className="text-xs text-gray-500">
                      Review before payment
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5">
                {packageData?.childPricing.enabled ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-pink-100 bg-pink-50/70 p-4 flex flex-col items-center justify-center">
                      <Users className="mb-2 h-5 w-5 text-pink-600" />
                      <p className="text-xs font-medium text-gray-500">
                        Adults
                      </p>
                      <p className="text-3xl font-black tracking-tight text-pink-700">
                        {bookingData.adultCount}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-pink-100 bg-pink-50/70 p-4 flex flex-col items-center justify-center">
                      <Users className="mb-2 h-5 w-5 text-pink-600" />
                      <p className="text-xs font-medium text-gray-500">
                        Children
                      </p>
                      <p className="text-3xl font-black tracking-tight text-pink-700">
                        {bookingData.childCount}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-pink-100 bg-pink-50/70 p-4 flex flex-col items-center justify-center ">
                    <Users className="mb-2 h-5 w-5 text-pink-600" />
                    <p className="text-xs font-medium text-gray-500">
                      Traveler Count
                    </p>
                    <p className="text-2xl font-black tracking-tight text-pink-600">
                      {bookingData.adultCount}
                    </p>
                  </div>
                )}

                <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
                  {walletPayable > 0 && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Wallet className="h-4 w-4 text-emerald-600" />
                        <span>Wallet Payable</span>
                      </div>

                      <span className="font-semibold text-gray-900">
                        Rs{" "}
                        {bookingData?.walletDeduction?.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  {razorpayPayable > 0 && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span>Razorpay Payable</span>
                      </div>

                      <span className="font-semibold text-gray-900">
                        Rs{" "}
                        {bookingData?.finalPayablePrice?.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 border-t border-dashed border-gray-200 pt-3">
                    <span className="font-bold text-gray-900">
                      Total Booking Amount
                    </span>
                    <span className="text- font-black text-pink-700">
                      Rs{" "}
                      {totalBookingAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-3 py-3 text-base font-bold text-white shadow-lg shadow-sky-100 transition-all hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50  cursor-pointer"
                >
                  <span>
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : razorpayPayable > 0 ? (
                      "Confirm & Pay"
                    ) : (
                      <>Pay Amount with wallet</>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </aside>
          <div className="flex justify-end"></div>
        </form>
      </div>
    </div>
  );
};

export default TravelerDetailsPage;
