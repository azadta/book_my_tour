export interface WishlistPackageResponseDTO {
  _id: string;
  name: string;
  amount: number;
  discount?:number;
  duration?: { day: number; night: number };
  images: string[];
  category?: string;
  destinations?: any[];
  isCustomizable: boolean;
  availableSlots: string;
}

export interface WishlistGroupResponseDTO {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  shareToken?: string;
  packages: WishlistPackageResponseDTO[];
  notes: WishlistNoteResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ShareLinkResponseDTO {
  shareToken: string;
}

export interface WishlistNoteResponseDTO {
  _id: string;
  text: string;
  createdAt: string;
}


