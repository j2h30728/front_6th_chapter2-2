import { useCallback } from "react";
import { Coupon, CartItem } from "../../types";
import cartService from "../services/cart";

export const useCouponActions = (
  currentCart: CartItem[],
  currentSelectedCoupon: Coupon | null,
  applyCouponFn: (
    coupon: Coupon,
    currentTotal: number
  ) => { isValid: boolean; message: string },
  addCouponFn: (newCoupon: Coupon) => {
    status: "error" | "success";
    message: string;
  },
  deleteCouponFn: (couponCode: string) => {
    status: "error" | "success";
    message: string;
  },
  notification: {
    add: (message: string, type?: "error" | "success" | "warning") => void;
  }
) => {
  const handleApplyCoupon = useCallback(
    (coupon: Coupon) => {
      // 현재 장바구니에 존재하는 할인후 전체 가격
      const currentTotal = cartService.calculateCartTotal({
        cart: currentCart,
        selectedCoupon: currentSelectedCoupon,
      }).totalAfterDiscount;

      // 쿠폰 적용
      const validation = applyCouponFn(coupon, currentTotal);
      if (!validation.isValid) {
        notification.add(validation.message, "error");
        return;
      }

      notification.add("쿠폰이 적용되었습니다.", "success");
    },
    [currentCart, currentSelectedCoupon, applyCouponFn, notification.add]
  );

  const handleAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const result = addCouponFn(newCoupon);
      notification.add(result.message, result.status);
    },
    [addCouponFn, notification.add]
  );

  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      const result = deleteCouponFn(couponCode);
      notification.add(result.message, result.status);
    },
    [deleteCouponFn, notification.add]
  );

  return {
    handleApplyCoupon,
    handleAddCoupon,
    handleDeleteCoupon,
  };
};
