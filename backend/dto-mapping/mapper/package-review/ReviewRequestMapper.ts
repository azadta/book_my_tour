import {
  CreateReviewRequestDTO,
  UpdateReviewRequestDTO,
} from "../../dto/package-review/packageReviewRequestDTO";

export class ReviewRequestMapper {
  static toCreateReviewReqDTO(
    body: any,
    packageId: string,
    userId: string,
  ): CreateReviewRequestDTO {
    return {
      packageId,
      userId,
      rating: Number(body.rating) || 0,
      ...(body.categoryRatings && {
        categoryRatings: {
          guide: Number(body.categoryRatings.guide ?? 5),
          value: Number(body.categoryRatings.value ?? 5),
          itinerary: Number(body.categoryRatings.itinerary ?? 5),
          transport: Number(body.categoryRatings.transport ?? 5),
        },
      }),

      comment: body.comment || "",
      images: Array.isArray(body.images) ? body.images : [],
      travelerType: body.travelerType || "Couple",
    };
  }

  static toUpdateReviewReqDTO(body: any): UpdateReviewRequestDTO {
    const payload: UpdateReviewRequestDTO = {};
    if (body.rating !== undefined) {
      payload.rating = Number(body.rating) || 0;
    }
    if (body.comment !== undefined) {
      payload.comment = body.comment;
    }
    if (body.images !== undefined && Array.isArray(body.images)) {
      payload.images = body.images;
    }
    if (body.travelerType !== undefined) {
      payload.travelerType = body.travelerType;
    }
    if (body.categoryRatings) {
      payload.categoryRatings = {
        guide: Number(body.categoryRatings.guide ?? 5),
        value: Number(body.categoryRatings.value ?? 5),
        itinerary: Number(body.categoryRatings.itinerary ?? 5),
        transport: Number(body.categoryRatings.transport ?? 5),
      };
    }
    return payload;
  }
}
