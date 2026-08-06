export interface ICalculateBookingPriceDTO {
  packageId: string;
  addedActivityIds: string[];
  removedActivityIds: string[];
  generalCouponCode?: string;
  bankCouponCode?: string;
  cardBin?: string;
}
