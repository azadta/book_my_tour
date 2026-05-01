import type { FormField } from "../interfaces/interfaces";

export interface Option {
  label: string;
  value: string;
}

 export  const userLoginfields = [
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
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: false,
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
    required: false,
  },
  {
    id: "address.houseNo",
    type: "text",
    placeholder: "House NO",
    required: false,
  },
  {
    id: "address.city",
    type: "text",
    placeholder: "City",
    required: false,
  },
  {
    id: "address.state",
    type: "text",
    placeholder: "State",
    required: false,
  },
  {
    id: "address.country",
    type: "text",
    placeholder: "Country",
    required: false,
  },
  {
    id: "address.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: false,
  },
  {
    id: "coinsEarned",
    type: "text",
    placeholder: "Coins Earned",
    readOnly: true,
    required: false,
  },
  {
    id: "isPremium",
    type: "text",
    placeholder: "Premium",
    readOnly: true,
    required: false,
  },
  {
    id: "referralCode",
    type: "text",
    placeholder: "Referral Code",
    readOnly: true,
    required: false,
  },
  {
    id: "referredBy",
    type: "text",
    placeholder: "Referred By",
    readOnly: true,
    required: false,
  },
];

export const userRegisterfields: FormField[] = [
  { id: "name", type: "text", placeholder: "Name", required: true },
  { id: "email", type: "email", placeholder: "Email", required: true },
  { id: "password", type: "password", placeholder: "Password", required: true },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
    required: true,
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
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
  },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
    required: true,
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
    required: true,
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: true,
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
  },
  {
    id: "verificationDetails.businessAddress.BuildingNo",
    type: "text",
    placeholder: "Building No",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.landmark",
    type: "text",
    placeholder: "Landmark",
    required: false,
  },
  {
    id: "verificationDetails.businessAddress.city",
    type: "text",
    placeholder: "City",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.state",
    type: "text",
    placeholder: "State",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.country",
    type: "text",
    placeholder: "Country",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: true,
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
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: true,
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
    required: false,
  },
  {
    id: "isPremium",
    type: "text",
    placeholder: "Premium",
    readOnly: true,
    required: false,
  },
  {
    id: "referralCode",
    type: "text",
    placeholder: "Referral Code",
    readOnly: true,
    required: false,
  },
  {
    id: "referredBy",
    type: "text",
    placeholder: "Referred By",
    readOnly: true,
    required: false,
  },
  {
    id: "verificationDetails.companyName",
    type: "text",
    placeholder: "Company Name",
    required: true,
  },
  {
    id: "verificationDetails.licenseNo",
    type: "text",
    placeholder: "License NO",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.buildingNo",
    type: "text",
    placeholder: "Building No",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.landmark",
    type: "text",
    placeholder: "Landmark",
    required: false,
  },
  {
    id: "verificationDetails.businessAddress.city",
    type: "text",
    placeholder: "City",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.state",
    type: "text",
    placeholder: "State",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.country",
    type: "text",
    placeholder: "Country",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: true,
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
  { id: "expiryDate", label: "Expiry Date", type: "date", required: false },
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
    id: "isCustomizable",
    label: "Customizable",
    type: "checkbox",
    required: false,
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
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: false,
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
    required: false,
  },
  {
    id: "address.houseNo",
    type: "text",
    placeholder: "House NO",
    required: false,
  },
  {
    id: "address.city",
    type: "text",
    placeholder: "City",
    required: false,
  },
  {
    id: "address.state",
    type: "text",
    placeholder: "State",
    required: false,
  },
  {
    id: "address.country",
    type: "text",
    placeholder: "Country",
    required: false,
  },
  {
    id: "address.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: false,
  },
];

export const adminUpdateUserFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    disabled: true,
    required: true,
  },

  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: false,
  },
  {
    id: "coinsEarned",
    type: "text",
    placeholder: "Coins Earned",
    required: false,
  },
  {
    id: "referralCode",
    type: "text",
    placeholder: "Referral Code",
    required: false,
  },
  {
    id: "referredBy",
    type: "text",
    placeholder: "Referred By",
    required: false,
  },

  {
    id: "address.houseNo",
    type: "text",
    placeholder: "House No",
    required: false,
  },
  {
    id: "address.landmark",
    type: "text",
    placeholder: "Landmark",
    required: false,
  },
  {
    id: "address.city",
    type: "text",
    placeholder: "City",
    required: false,
  },
  {
    id: "address.state",
    type: "text",
    placeholder: "State",
    required: false,
  },
  {
    id: "address.country",
    type: "text",
    placeholder: "Country",
    required: false,
  },
  {
    id: "address.postalCode",
    type: "text",
    placeholder: "Postal Code",
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

export const adminUpdateOperatorFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
    required: true,
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
    disabled: true,
    required: true,
  },

  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
    required: true,
  },

  {
    id: "verificationDetails.companyName",
    type: "text",
    placeholder: "Company Name",
    required: true,
  },
  {
    id: "verificationDetails.licenseNo",
    type: "text",
    placeholder: "License No",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.BuildingNo",
    type: "text",
    placeholder: "Building No",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.landmark",
    type: "text",
    placeholder: "Landmark",
    required: false,
  },
  {
    id: "verificationDetails.businessAddress.city",
    type: "text",
    placeholder: "City",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.state",
    type: "text",
    placeholder: "State",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.country",
    type: "text",
    placeholder: "Country",
    required: true,
  },
  {
    id: "verificationDetails.businessAddress.postalCode",
    type: "text",
    placeholder: "Postal Code",
    required: true,
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
