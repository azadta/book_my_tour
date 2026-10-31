import {
  CreateTopupOrderInput,
  CreateTopupOrderRequestDTO,
  verifyTopupPaymentInput,
  verifyTopupPaymentRequestDTO,
} from "../../dto/wallet/walletRequestDTO";

export class WalletRequestMapper {
  static toCreateTopupOrderReqDTO(
    body: CreateTopupOrderInput,
  ): CreateTopupOrderRequestDTO {
    return {
      amount: Number(body.amount),
    };
  }
  static toVerifyTopupPaymentReqDTO(
    body: verifyTopupPaymentInput,
  ): verifyTopupPaymentRequestDTO {
    return {
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
    };
  }
}
