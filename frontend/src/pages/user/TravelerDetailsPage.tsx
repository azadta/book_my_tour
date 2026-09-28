import { useTravelerDetailsPage } from "@/hooks/useTravelerDetailsPage";
import { ArrowLeft, Mail, Phone, User, UserCheck } from "lucide-react";
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

  return (
    <div className="min-h-[calc(100vh-19.81rem)] bg-gray-50/50 py-10  px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-3 py-2 gap-2 text-sm font-semibold text-gray-600 rounded-lg bg-gray-100 hover:text-gray-900 hover:bg-gray-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customization
          </button>
        </div>

        <form onSubmit={handleFinalSubmit} className="space-y-6">
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
                          handleMemberChange(idx, "firstName", e.target.value);
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className=" bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50   "
            >
              <span>
                {isSubmitting
                  ? "Processing Booking"
                  : "Proceed to secure Payment"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelerDetailsPage;
