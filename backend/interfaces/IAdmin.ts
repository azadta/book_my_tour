interface Address {
  houseNo?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  mobile?: string;
  address?: Address;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IAdminResponse=Omit<IAdmin,'password'>