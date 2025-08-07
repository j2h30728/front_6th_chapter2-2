import { atom } from "jotai";
import { Coupon } from "../../types";
import cartService from "../services/cart";
import couponService from "../services/coupon";
import { cartAtom } from "./cartAtom";
import { couponsAtom, selectedCouponAtom } from "./couponAtom";
import { notificationActionsAtom } from "./notificationAtom";

type CouponAction =
  | { type: "APPLY_COUPON"; payload: Coupon }
  | { type: "ADD_COUPON"; payload: Coupon }
  | { type: "DELETE_COUPON"; payload: string }
  | { type: "CLEAR_SELECTED_COUPON" };

export const couponActionsAtom = atom(
  (get) => ({
    coupons: get(couponsAtom),
    selectedCoupon: get(selectedCouponAtom),
  }),
  (get, set, action: CouponAction) => {
    const cart = get(cartAtom);
    const selectedCoupon = get(selectedCouponAtom);

    switch (action.type) {
      case "APPLY_COUPON": {
        const currentTotal = cartService.calculateCartTotal({
          cart,
          selectedCoupon,
        }).totalAfterDiscount;

        const validation = couponService.apply({
          coupon: action.payload,
          cartTotal: currentTotal,
        });

        if (!validation.isValid) {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: validation.message, type: "error" },
          });
          return;
        }

        set(selectedCouponAtom, action.payload);
        set(notificationActionsAtom, {
          type: "ADD",
          payload: { message: "쿠폰이 적용되었습니다.", type: "success" },
        });
        break;
      }

      case "ADD_COUPON": {
        const result = couponService.addCoupon({
          coupons: get(couponsAtom),
          newCoupon: action.payload,
        });

        if (result.status === "success") {
          set(couponsAtom, result.value);
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        } else {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        }
        break;
      }

      case "DELETE_COUPON": {
        const result = couponService.deleteCoupon({
          coupons: get(couponsAtom),
          couponCode: action.payload,
        });

        if (result.status === "success") {
          set(couponsAtom, result.value);
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        } else {
          set(notificationActionsAtom, {
            type: "ADD",
            payload: { message: result.message, type: result.status },
          });
        }
        break;
      }

      case "CLEAR_SELECTED_COUPON": {
        set(selectedCouponAtom, null);
        break;
      }
    }
  }
);
