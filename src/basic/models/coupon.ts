import { Coupon, ValidationResult } from "../../types";
import { VALIDATION_LIMITS } from "../utils/contants";
import { isValidNumericInput } from "../utils/validators";

const couponModel = {
  validateDiscountRange({
    discountType,
    discountValue,
  }: Pick<Coupon, "discountType" | "discountValue">): ValidationResult {
    if (discountType === "percentage") {
      if (discountValue > VALIDATION_LIMITS.DISCOUNT.MAX_PERCENTAGE) {
        return {
          isValid: false,
          message: "할인율은 100%를 초과할 수 없습니다",
          value: VALIDATION_LIMITS.DISCOUNT.MAX_PERCENTAGE,
        };
      }
      if (discountValue < 0) {
        return {
          isValid: false,
          message: "할인율은 0% 미만일 수 없습니다",
          value: VALIDATION_LIMITS.DISCOUNT.MIN_VALUE,
        };
      }
    } else {
      if (discountValue > VALIDATION_LIMITS.DISCOUNT.MAX_AMOUNT) {
        return {
          isValid: false,
          message: "할인 금액은 100,000원을 초과할 수 없습니다",
          value: VALIDATION_LIMITS.DISCOUNT.MAX_AMOUNT,
        };
      }
      if (discountValue < 0) {
        return {
          isValid: false,
          message: "할인 금액은 0원 미만일 수 없습니다",
          value: VALIDATION_LIMITS.DISCOUNT.MIN_VALUE,
        };
      }
    }

    return {
      isValid: true,
      value: discountValue,
      message: "",
    };
  },

  validateDiscountValue(discountValue: string): ValidationResult {
    if (discountValue === "") {
      return {
        isValid: true,
        value: VALIDATION_LIMITS.DISCOUNT.MIN_VALUE,
        message: "",
      };
    }

    if (!isValidNumericInput(discountValue)) {
      return {
        isValid: false,
        value: VALIDATION_LIMITS.DISCOUNT.MIN_VALUE,
        message: "숫자만 입력 가능합니다",
      };
    }

    return { isValid: true, value: parseInt(discountValue), message: "" };
  },

  apply({ coupon, cartTotal }: { coupon: Coupon; cartTotal: number }): {
    isValid: boolean;
    message: string;
  } {
    if (
      cartTotal < VALIDATION_LIMITS.CART.MIN_TOTAL_FOR_PERCENTAGE_COUPON &&
      coupon.discountType === "percentage"
    ) {
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
