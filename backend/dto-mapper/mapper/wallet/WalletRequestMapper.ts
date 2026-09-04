import {
  CreateTopupOrderRequestDTO,
  verifyTopupPaymentRequestDTO,
} from "../../dto/wallet/walletRequestDTO";

export class WalletRequestMapper {
  static toCreateTopupOrderReqDTO(body: any): CreateTopupOrderRequestDTO {
    return {
      amount: Number(body.amount),
    };
  }
  static toVerifyTopupPaymentReqDTO(body: any): verifyTopupPaymentRequestDTO {
    return {
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
    };
  }
}
