import { Coupon } from "../../types";
import { formatters } from "./formatters";

export const couponUtils = {
  /**
   * 쿠폰 표시 텍스트 생성
   */
  getDisplayText(coupon: Coupon): string {
    const discountText =
      coupon.discountType === "amount"
        ? `${formatters.price(coupon.discountValue, false)}`
        : `${coupon.discountValue}%`;

    return `${coupon.name} (${discountText})`;
  },

  /**
   * 할인 금액 계산
   */
  getDiscountAmount(
    totalBeforeDiscount: number,
    totalAfterDiscount: number
  ): number {
    return totalBeforeDiscount - totalAfterDiscount;
  },

  /**
   * 할인 적용 여부 확인
   */
  hasDiscount(
    totalBeforeDiscount: number,
    totalAfterDiscount: number
  ): boolean {
    return totalBeforeDiscount > totalAfterDiscount;
  },
};
