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
