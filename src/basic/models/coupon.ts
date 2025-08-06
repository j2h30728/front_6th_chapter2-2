import { Coupon } from "../../types";

const couponModel = {
  validateDiscountValue({
    discountType,
    discountValue,
  }: Pick<Coupon, "discountType" | "discountValue">): {
    isValid: boolean;
    message: string;
    value: number;
  } {
    if (discountType === "percentage") {
      if (discountValue > 100) {
        return {
          isValid: false,
          message: "할인율은 100%를 초과할 수 없습니다",
          value: 100,
        };
      }
      if (discountValue < 0) {
        return {
          isValid: false,
          message: "할인율은 0% 미만일 수 없습니다",
          value: 0,
        };
      }
    } else {
      if (discountValue > 100000) {
        return {
          isValid: false,
          message: "할인 금액은 100,000원을 초과할 수 없습니다",
          value: 100000,
        };
      }
      if (discountValue < 0) {
        return {
          isValid: false,
          message: "할인 금액은 0원 미만일 수 없습니다",
          value: 0,
        };
      }
    }

    return {
      isValid: true,
      value: discountValue,
      message: "",
    };
  },

  applyCoupon({ coupon, cartTotal }: { coupon: Coupon; cartTotal: number }): {
    isValid: boolean;
    message: string;
  } {
    if (cartTotal < 10000 && coupon.discountType === "percentage") {
      return {
        isValid: false,
        message: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
      };
    }
    return {
      isValid: true,
      message: "",
    };
  },

  isDuplicateCode({
    code,
    coupons,
  }: {
    code: string;
    coupons: Coupon[];
  }): Boolean {
    return coupons.some((coupon) => coupon.code === code);
  },

  formatCouponCode(counCode: string): string {
    return counCode.toUpperCase().replace(/\s/g, "");
  },
};

export default couponModel;
