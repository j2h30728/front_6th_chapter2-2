import { Coupon, ValidationResult } from "../../types";
import { VALIDATION_LIMITS } from "../utils/constants";
import { isValidNumericInput } from "../utils/validators";
import { parsers } from "../utils/parsers";

const couponModel = {
  create({ coupon, coupons }: { coupon: Coupon; coupons: Coupon[] }): Coupon[] {
    return [...coupons, coupon];
  },

  update({
    coupon,
    field,
    value,
  }: {
    coupon: Coupon;
    field: keyof Coupon;
    value: string;
  }): Coupon {
    return {
      ...coupon,
      [field]: value,
    };
  },

  initialize(): Coupon {
    return {
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
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
