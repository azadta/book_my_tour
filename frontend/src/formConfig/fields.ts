import type { FormField } from "../interfaces/interfaces";

export interface Option {
  label: string;
  value: string;
}

export const userLoginfields = [
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    label: "Email",
    required: true,
  },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
    label: "Password",
    required: true,
  },
];

export const userFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
    label: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
    label: "Email",
    readOnly: true,
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: false,
    label: "Mobile",
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
    required: false,
    label: "Image",
  },
  {
    id: "address.houseNo",
    type: "text",
    placeholder: "House NO",
    required: false,
    label: "House No",
  },
  {
    id: "address.country",
    type: "select",
    placeholder: "Country",
    required: false,
    label: "Country",
  },
  {
    id: "address.state",
    type: "select",
    placeholder: "State",
    required: false,
    label: "State",
  },
  {
    id: "address.city",
    type: "text",
    placeholder: "City",
    required: false,
    label: "City",
  },

  {
    id: "address.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: false,
    label: "Postal Code",
  },
  {
    id: "coinsEarned",
    type: "text",
    placeholder: "Coins Earned",
    readOnly: true,
    required: false,
    label: "Coins Earned",
  },
  {
    id: "isPremium",
    type: "text",
    placeholder: "Premium",
    readOnly: true,
    required: false,
    label: "Is Premium",
  },
  {
    id: "referralCode",
    type: "text",
    placeholder: "Referral Code",
    readOnly: true,
    required: false,
    label: "Referral Code",
  },
  {
    id: "referredBy",
    type: "text",
    placeholder: "Referred By",
    readOnly: true,
    required: false,
    label: "Referred By",
  },
];

export const userRegisterfields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
    label: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
    label: "Email",
  },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
    required: true,
    label: "Password",
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
    required: true,
    label: "Confirm Password",
  },
];

export const userResetPasswordfields: FormField[] = [
  {
    id: "newPassword",
    type: "password",
    placeholder: "Enter new password",
    label: "New Password",
    required: true,
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm new password",
    label: "Confirm Password",
    required: true,
  },
];

export const resetAuthenticatedPasswordFields: FormField[] = [
  {
    id: "oldPassword",
    type: "password",
    placeholder: "Enter old  password",
    label: "Old Password",
    required: true,
  },
  {
    id: "newPassword",
    type: "password",
    placeholder: "Enter new  password",
    label: "New Password",
    required: true,
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm password",
    label: "Confirm Password",
    required: true,
  },
];

export const operatorRegisterFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
    label: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
    label: "Email",
  },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
    required: true,
    label: "Password",
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
    required: true,
    label: "Confirm Password",
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: true,
    label: "Mobile",
  },

  {
    id: "verificationDetails.companyName",
    type: "text",
    placeholder: "Company Name",
    required: true,
    label: "Company Name",
  },
  {
    id: "verificationDetails.licenseNo",
    type: "text",
    placeholder: "License No",
    required: true,
    label: "LIcense No",
  },
  {
    id: "verificationDetails.businessAddress.BuildingNo",
    type: "text",
    placeholder: "Building No",
    required: true,
    label: "Building No",
  },
  {
    id: "verificationDetails.businessAddress.landmark",
    type: "text",
    placeholder: "Landmark",
    required: false,
    label: "Landmark",
  },

  {
    id: "verificationDetails.businessAddress.country",
    type: "select",
    placeholder: "Country",
    required: true,
    label: "Country",
  },
  {
    id: "verificationDetails.businessAddress.state",
    type: "select",
    placeholder: "State",
    required: true,
    label: "State",
  },
  {
    id: "verificationDetails.businessAddress.city",
    type: "text",
    placeholder: "City",
    required: true,
    label: "City",
  },
  {
    id: "verificationDetails.businessAddress.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: true,
    label: "Postal Code",
  },
];

export const operatorLoginFields: FormField[] = [
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    label: "Email",
    required: true,
  },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
    label: "Password",
    required: true,
  },
];

export const operatorProfileFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
    label: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
    label: "Email",
    readOnly: true,
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: true,
    label: "Mobile",
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
    required: false,
    label: "Image",
  },
  {
    id: "isPremium",
    type: "text",
    placeholder: "Premium",
    readOnly: true,
    required: false,
    label: "IsPremium",
  },
  {
    id: "referralCode",
    type: "text",
    placeholder: "Referral Code",
    readOnly: true,
    required: false,
    label: "Referral Code",
  },
  {
    id: "referredBy",
    type: "text",
    placeholder: "Referred By",
    readOnly: true,
    required: false,
    label: "Refered By",
  },
  {
    id: "verificationDetails.companyName",
    type: "text",
    placeholder: "Company Name",
    required: true,
    label: "Company Name",
  },
  {
    id: "verificationDetails.licenseNo",
    type: "text",
    placeholder: "License NO",
    required: true,
    label: "License No",
  },
  {
    id: "verificationDetails.businessAddress.buildingNo",
    type: "text",
    placeholder: "Building No",
    required: true,
    label: "Building No",
  },
  {
    id: "verificationDetails.businessAddress.landmark",
    type: "text",
    placeholder: "Landmark",
    required: false,
    label: "Landmark",
  },
  {
    id: "verificationDetails.businessAddress.country",
    type: "select",
    placeholder: "Country",
    required: true,
    label: "Country",
  },

  {
    id: "verificationDetails.businessAddress.state",
    type: "select",
    placeholder: "State",
    required: true,
    label: "State",
  },
  {
    id: "verificationDetails.businessAddress.city",
    type: "text",
    placeholder: "City",
    required: true,
    label: "City",
  },

  {
    id: "verificationDetails.businessAddress.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: true,
    label: "Postal Code",
  },
];

export const OperatorResetPasswordFields: FormField[] = [
  {
    id: "newPassword",
    type: "password",
    placeholder: "Enter new password",
    label: "New Password",
    required: true,
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm password",
    label: "Confirm Password",
    required: true,
  },
];

export const createPackageFields: FormField[] = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter Name",
    required: true,
  },
  {
    id: "amount",
    label: "Amount",
    type: "number",
    placeholder: "Enter Amount",
    required: true,
  },
  {
    id: "destinations",
    label: "Destinations",
    type: "select",
    placeholder: "Select destinations",
    multiple: true,
    required: true,
  },
  {
    id: "duration.day",
    label: "Number of days",
    type: "number",
    placeholder: "Enter number of days",
    required: true,
  },
  {
    id: "duration.night",
    label: "Number of nights",
    type: "number",
    placeholder: "Enter number of nights",
    required: true,
  },
  {
    id: "specifications",
    label: "Specifications",
    type: "text",
    placeholder: "Enter specifications",
    required: false,
  },

  { id: "startDate", label: "Start Date", type: "date", required: true },
  { id: "remark", label: "Remark", type: "text", required: false },
  { id: "discount", label: "Discount (%)", type: "number", required: false },
  {
    id: "availableSlots",
    label: "Available Slots",
    type: "text",
    placeholder: "Enter slots",
    required: true,
  },
  {
    id: "images",
    label: "Upload Images",
    type: "file",
    multiple: true,
    required: true,
  },

  {
    id: "category",
    label: "Package Category",
    type: "select",
    placeholder: "Select Category",
    required: true,
  },
];

export const adminLoginFields: FormField[] = [
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    label: "Email",
    required: true,
  },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
    label: "Password",
    required: true,
  },
];

export const adminProfileFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
    label: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
    label: "Email",
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: false,
    label: "Mobile",
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
    required: false,
    label: "Image",
  },
  {
    id: "address.houseNo",
    type: "text",
    placeholder: "House NO",
    required: false,
    label: "House No",
  },
  {
    id: "address.country",
    type: "select",
    placeholder: "Country",
    required: false,
    label: "Country",
  },
  {
    id: "address.state",
    type: "select",
    placeholder: "State",
    required: false,
    label: "State",
  },
  {
    id: "address.city",
    type: "text",
    placeholder: "City",
    required: false,
    label: "City",
  },

  {
    id: "address.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: false,
    label: "Postal Code",
  },
];

export const adminUpdateUserFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
    label: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    disabled: true,
    required: true,
    label: "Email",
  },

  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: false,
    label: "Mobile",
  },
  {
    id: "coinsEarned",
    type: "text",
    placeholder: "Coins Earned",
    required: false,
    label: "Coins Earned",
  },
  {
    id: "referralCode",
    type: "text",
    placeholder: "Referral Code",
    required: false,
    label: "Referral Code",
  },
  {
    id: "referredBy",
    type: "text",
    placeholder: "Referred By",
    required: false,
    label: "Referred By",
  },

  {
    id: "address.houseNo",
    type: "text",
    placeholder: "House No",
    required: false,
    label: "House No",
  },
  {
    id: "address.landmark",
    type: "text",
    placeholder: "Landmark",
    required: false,
    label: "Landmark",
  },

  {
    id: "address.country",
    type: "select",
    placeholder: "Country",
    required: false,
    label: "Country",
  },
  {
    id: "address.state",
    type: "select",
    placeholder: "State",
    required: false,
    label: "State",
  },
  {
    id: "address.city",
    type: "text",
    placeholder: "City",
    required: false,
    label: "City",
  },

  {
    id: "address.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: false,
    label: "Postal Code",
  },

  {
    id: "isPremium",
    type: "select",
    label: "Is Premium",
    options: [
      {
        label: "True",
        value: "true",
      },
      {
        label: "False",
        value: "false",
      },
    ],
    required: false,
  },
  {
    id: "isEmailVerified",
    type: "select",
    label: "Is Email Verified",
    options: [
      {
        label: "True",
        value: "true",
      },
      {
        label: "False",
        value: "false",
      },
    ],
    required: false,
  },
];

export const adminUpdateOperatorFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
    label: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    disabled: true,
    required: true,
    label: "Email",
  },

  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: true,
    label: "Mobile",
  },

  {
    id: "verificationDetails.companyName",
    type: "text",
    placeholder: "Company Name",
    required: true,
    label: "Company Name",
  },
  {
    id: "verificationDetails.licenseNo",
    type: "text",
    placeholder: "License No",
    required: true,
    label: "License No",
  },
  {
    id: "verificationDetails.businessAddress.buildingNo",
    type: "text",
    placeholder: "Building No",
    required: true,
    label: "Building No",
  },
  {
    id: "verificationDetails.businessAddress.landmark",
    type: "text",
    placeholder: "Landmark",
    required: false,
    label: "Landmark",
  },

  {
    id: "verificationDetails.businessAddress.country",
    type: "select",
    placeholder: "Country",
    required: true,
    label: "Country",
  },
  {
    id: "verificationDetails.businessAddress.state",
    type: "select",
    placeholder: "State",
    required: true,
    label: "State",
  },
  {
    id: "verificationDetails.businessAddress.city",
    type: "text",
    placeholder: "City",
    required: true,
    label: "City",
  },

  {
    id: "verificationDetails.businessAddress.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: true,
    label: "Postal Code",
  },
  {
    id: "isVerified",
    type: "select",
    label: "Is Verified",
    options: [
      {
        label: "True",
        value: "true",
      },
      {
        label: "False",
        value: "false",
      },
    ],
    required: false,
  },
  {
    id: "isPremium",
    type: "select",
    label: "Is Premium",
    options: [
      {
        label: "True",
        value: "true",
      },
      {
        label: "False",
        value: "false",
      },
    ],
    required: false,
  },
  {
    id: "isEmailVerified",
    type: "select",
    label: "Is Email Verified",
    options: [
      {
        label: "True",
        value: "true",
      },
      {
        label: "False",
        value: "false",
      },
    ],
    required: false,
  },
];

export const createDestinationFields: FormField[] = [
  {
    id: "name",
    type: "text",
    label: "Destination Name",
    placeholder: "Enter destination name",
    required: true,
  },
  {
    id: "latitude",
    type: "number",
    label: "Latitude",
    placeholder: "Enter latitude",
    required: true,
  },
  {
    id: "longitude",
    type: "number",
    label: "Longitude",
    placeholder: "Enter longitude",
    required: true,
  },
  {
    id: "images",
    type: "file",
    label: "Upload Images",
    multiple: true,
    required: true,
  },
];

export const createPackageCategoryFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Enter Name",
    label: "Name",
    required: true,
  },

  {
    id: "description",
    type: "textarea",
    placeholder: "Enter Description",
    label: "Description",
    required: false,
  },
];

export const reviewFields = [
  {
    id: "travelerType",
    label: "Who did you travel with?",
    type: "select",
    required: true,
    options: [
      { label: "Couple", value: "Couple" },
      { label: "Solo", value: "Solo" },
      { label: "Family", value: "Family" },
      { label: "Friends", value: "Friends" },
    ],
  },
  {
    id: "comment",
    label: "Your review",
    type: "textarea",
    placeholder: "What made this package special?",
    required: true,
  },
  {
    id: "images",
    label: "Add photos",
    type: "file",
    multiple: true,
    required: false,
  },
];

export const getCouponFields = (formData: Record<string, any>): FormField[] => {
  const isBankOffer = formData?.type === "BANK";
  const baseFields = [
    {
      id: "code",
      label: "Coupon Code",
      type: "text",
      placeholder: "Enter coupon code",
      required: true,
    },
    {
      id: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter coupon title",
      required: true,
    },
    {
      id: "description",
      label: "Description",
      type: "textarea",

      required: true,
    },
    {
      id: "type",
      label: "Coupon Type",
      type: "select",

      required: true,
      options: [
        { label: "General Promo", value: "GENERAL" },
        { label: "Bank Offer", value: "BANK" },
      ],
    },
    {
      id: "discountType",
      label: "Discount Type",
      type: "select",

      required: true,
      options: [
        { label: "Percentage(%)", value: "PERCENTAGE" },
        { label: "Flat Amount(Rs)", value: "FLAT" },
      ],
    },
    {
      id: "discountValue",
      label: "Discount Value",
      type: "number",
      required: true,
    },
    {
      id: "maxDiscountAmount",
      label: "Max Discount Amount",
      type: "number",
      required: true,
    },
    {
      id: "minBookingAmount",
      label: "Min Booking Amount",
      type: "number",
      required: false,
    },
  ];
  if (isBankOffer) {
    baseFields.push(
      {
        id: "bankName",
        label: "Bank Name (For Bank Offers)",
        type: "text",
        required: false,
      },
      {
        id: "allowedBins",
        label: "Allowed Bins (Comma Seperated)",
        type: "text",
        required: false,
      },
    );
  }
  baseFields.push(
    {
      id: "validTill",
      label: "Valid Till Date",
      type: "date",
      required: true,
    },
    {
      id: "isActive",
      label: "Active Status",
      type: "checkbox",
      required: false,
    },
  );
  return baseFields;
};
