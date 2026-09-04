export interface ICategoryResponseDTO {
  _id: string;
  name: string;
  description?: string;
  createdAt: string | Date;
}

export interface ICategorySummaryDTO {
  _id: string;
  name: string;
}
