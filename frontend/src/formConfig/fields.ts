export interface FormField {
  id: string;
  type: string;
  placeholder?: string;
  label?: string;
  options?: { label: string; value: string }[];
  multiple?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  optionsEndPoint?: string;
}

export interface Option {
  label: string;
  value: string;
}

export const userFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
  },
  {
    id: "address.houseNo",
    type: "text",
    placeholder: "House NO",
  },
  {
    id: "address.city",
    type: "text",
    placeholder: "City",
  },
  {
    id: "address.state",
    type: "text",
    placeholder: "State",
  },
  {
    id: "address.country",
    type: "text",
    placeholder: "Country",
  },
  {
    id: "address.postalCode",
    type: "text",
    placeholder: "Postal Code",
  },
  {
    id: "coinsEarned",
    type: "text",
    placeholder: "Coins Earned",
    readOnly: true,
  },
  {
    id: "isPremium",
    type: "text",
    placeholder: "Premium",
    readOnly: true,
  },
  {
    id: "referralCode",
    type: "text",
    placeholder: "Referral Code",
    readOnly: true,
  },
  {
    id: "referredBy",
    type: "text",
    placeholder: "Referred By",
    readOnly: true,
  },
];

export const userRegisterfields = [
  { id: "name", type: "text", placeholder: "Name" },
  { id: "email", type: "email", placeholder: "Email" },
  { id: "password", type: "password", placeholder: "Password" },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
  },
];

export const userResetPasswordfields = [
  {
    id: "newPassword",
    type: "password",
    placeholder: "Enter new password",
    label: "New Password",
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm new password",
    label: "Confirm Password",
  },
];

export const resetAuthenticatedPasswordFields = [
  {
    id: "oldPassword",
    type: "password",
    placeholder: "Enter old  password",
    label: "Old Password",
  },
  {
    id: "newPassword",
    type: "password",
    placeholder: "Enter new  password",
    label: "New Password",
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm password",
    label: "Confirm Password",
  },
];

export const operatorRegisterFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
  },
  { id: "confirmPassword", type: "password", placeholder: "Confirm Password" },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
  },

  {
    id: "verificationDetails.companyName",
    type: "text",
    placeholder: "Company Name",
  },
  {
    id: "verificationDetails.licenseNo",
    type: "text",
    placeholder: "License No",
  },
  {
    id: "verificationDetails.businessAddress.BuildingNo",
    type: "text",
    placeholder: "Building No",
  },
  {
    id: "verificationDetails.businessAddress.landmark",
    type: "text",
    placeholder: "Landmark",
  },
  {
    id: "verificationDetails.businessAddress.city",
    type: "text",
    placeholder: "City",
  },
  {
    id: "verificationDetails.businessAddress.state",
    type: "text",
    placeholder: "State",
  },
  {
    id: "verificationDetails.businessAddress.country",
    type: "text",
    placeholder: "Country",
  },
  {
    id: "verificationDetails.businessAddress.postalCode",
    type: "text",
    placeholder: "Postal Code",
  },
];

export const operatorLoginFields: FormField[] = [
  { id: "email", type: "email", placeholder: "Email", label: "Email" },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
    label: "Password",
  },
];

export const operatorProfileFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
  },
  {
    id: "isPremium",
    type: "text",
    placeholder: "Premium",
    readOnly: true,
  },
  {
    id: "referralCode",
    type: "text",
    placeholder: "Referral Code",
    readOnly: true,
  },
  {
    id: "referredBy",
    type: "text",
    placeholder: "Referred By",
    readOnly: true,
  },
  {
    id: "verificationDetails.companyName",
    type: "text",
    placeholder: "Company Name",
  },
  {
    id: "verificationDetails.licenseNo",
    type: "text",
    placeholder: "License NO",
  },
  {
    id: "verificationDetails.businessAddress.buildingNo",
    type: "text",
    placeholder: "Building No",
  },
  {
    id: "verificationDetails.businessAddress.landmark",
    type: "text",
    placeholder: "Landmark",
  },
  {
    id: "verificationDetails.businessAddress.city",
    type: "text",
    placeholder: "City",
  },
  {
    id: "verificationDetails.businessAddress.state",
    type: "text",
    placeholder: "State",
  },
  {
    id: "verificationDetails.businessAddress.country",
    type: "text",
    placeholder: "Country",
  },
  {
    id: "verificationDetails.businessAddress.postalCode",
    type: "text",
    placeholder: "Postal Code",
  },
];

export const OperatorResetPasswordFields: FormField[] = [
  {
    id: "newPassword",
    type: "password",
    placeholder: "Enter new password",
    label: "New Password",
  },
  {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm password",
    label: "Confirm Password",
  },
];

export const createPackageFields: FormField[] = [
  { id: "name", label: "Name", type: "text", placeholder: "Enter Name" },
  {
    id: "amount",
    label: "Amount",
    type: "number",
    placeholder: "Enter Amount",
  },
  {
    id: "destinations",
    label: "Destinations",
    type: "select",
    placeholder: "Select destinations",
    multiple: true,
  },
  {
    id: "specifications",
    label: "Specifications",
    type: "text",
    placeholder: "Enter specifications",
  },
  { id: "expiryDate", label: "Expiry Date", type: "date" },
  { id: "remark", label: "Remark", type: "text" },
  { id: "discount", label: "Discount (%)", type: "number" },
  {
    id: "availableSlots",
    label: "Available Slots",
    type: "text",
    placeholder: "Enter slots",
  },
  { id: "images", label: "Upload Images", type: "file", multiple: true },
  { id: "isCustomizable", label: "Customizable", type: "checkbox" },
  {
    id: "category",
    label: "Package Category",
    type: "select",
    placeholder: "Select Category",
  },
];

export const adminLoginFields: FormField[] = [
  { id: "email", type: "email", placeholder: "Email", label: "Email" },
  {
    id: "password",
    type: "password",
    placeholder: "Password",
    label: "Password",
  },
];

export const adminProfileFields: FormField[] = [
  {
    id: "name",
    type: "text",
    placeholder: "Name",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    id: "mobile",
    type: "text",
    placeholder: "Mobile No",
  },
  {
    id: "image",
    type: "file",
    placeholder: "Profile Image",
  },
  {
    id: "address.houseNo",
    type: "text",
    placeholder: "House NO",
  },
  {
    id: "address.city",
    type: "text",
    placeholder: "City",
  },
  {
    id: "address.state",
    type: "text",
    placeholder: "State",
  },
  {
    id: "address.country",
    type: "text",
    placeholder: "Country",
  },
  {
    id: "address.postalCode",
    type: "text",
    placeholder: "Postal Code",
  },
];
