import { useReducer, useCallback } from "react";
import { Coupon } from "../../types";
import useLocalStorage from "../utils/hooks/useLocalStorage";
import couponService from "../services/coupon";
import couponModel from "../models/coupon";

type CouponState = {
  selectedCoupon: Coupon | null;
  coupons: Coupon[];
};

type CouponAction =
  | { type: "APPLY_COUPON"; payload: { coupon: Coupon; cartTotal: number } }
  | { type: "ADD_COUPON"; payload: Coupon }
  | { type: "DELETE_COUPON"; payload: string }
  | { type: "CLEAR_SELECTED_COUPON" };

function couponReducer(state: CouponState, action: CouponAction): CouponState {
  switch (action.type) {
    case "APPLY_COUPON": {
      const validation = couponService.apply({
        coupon: action.payload.coupon,
        cartTotal: action.payload.cartTotal,
      });

      if (validation.isValid) {
        return { ...state, selectedCoupon: action.payload.coupon };
      }
      return state;
    }

    case "ADD_COUPON": {
      const result = couponService.addCoupon({
        coupons: state.coupons,
        newCoupon: action.payload,
      });

      if (result.status === "success") {
        return { ...state, coupons: result.value };
      }
      return state;
    }

    case "DELETE_COUPON": {
      const result = couponService.deleteCoupon({
        coupons: state.coupons,
        couponCode: action.payload,
      });

      if (result.status === "success") {
        const newSelectedCoupon =
          state.selectedCoupon?.code === action.payload
            ? null
            : state.selectedCoupon;

        return {
          ...state,
          coupons: result.value,
          selectedCoupon: newSelectedCoupon,
        };
      }
      return state;
    }

    case "CLEAR_SELECTED_COUPON": {
      return { ...state, selectedCoupon: null };
    }

    default:
      return state;
  }
}

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

export function useCoupon() {
  const [storedSelectedCoupon, setStoredSelectedCoupon] =
    useLocalStorage<Coupon | null>("selectedCoupon", null);
  const [storedCoupons, setStoredCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const [state, dispatch] = useReducer(couponReducer, {
    selectedCoupon: storedSelectedCoupon,
    coupons: storedCoupons,
  });

  const syncWithLocalStorage = useCallback(
    (newSelectedCoupon: Coupon | null, newCoupons: Coupon[]) => {
      setStoredSelectedCoupon(newSelectedCoupon);
      setStoredCoupons(newCoupons);
    },
    [setStoredSelectedCoupon, setStoredCoupons]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon, cartTotal: number) => {
      const validation = couponService.apply({
        coupon,
        cartTotal,
      });

      if (validation.isValid) {
        dispatch({ type: "APPLY_COUPON", payload: { coupon, cartTotal } });
        syncWithLocalStorage(state.selectedCoupon, state.coupons);
      }

      return validation;
    },
    [state.selectedCoupon, state.coupons, syncWithLocalStorage]
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const result = couponService.addCoupon({
        coupons: state.coupons,
        newCoupon,
      });

      if (result.status === "success") {
        dispatch({ type: "ADD_COUPON", payload: newCoupon });
        syncWithLocalStorage(state.selectedCoupon, result.value);
      }

      return result;
    },
    [state.coupons, state.selectedCoupon, syncWithLocalStorage]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      const result = couponService.deleteCoupon({
        coupons: state.coupons,
        couponCode,
      });

      if (result.status === "success") {
        dispatch({ type: "DELETE_COUPON", payload: couponCode });
        syncWithLocalStorage(state.selectedCoupon, result.value);
      }

      return result;
    },
    [state.coupons, state.selectedCoupon, syncWithLocalStorage]
  );

  const validateCoupon = useCallback(
    (discountType: "amount" | "percentage", discountValue: number) => {
      return couponService.validateDiscountRange({
        discountType,
        discountValue,
      });
    },
    []
  );

  const formatCouponCode = useCallback((code: string) => {
    return couponModel.formatCouponCode(code);
  }, []);

  const initializeCoupon = useCallback(() => {
    return couponModel.initialize();
  }, []);

  const clearSelectedCoupon = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTED_COUPON" });
    syncWithLocalStorage(null, state.coupons);
  }, [state.coupons, syncWithLocalStorage]);

  return {
    selectedCoupon: state.selectedCoupon,
    coupons: state.coupons,
    applyCoupon,
    addCoupon,
    deleteCoupon,
    validateCoupon,
    formatCouponCode,
    initializeCoupon,
    clearSelectedCoupon,
  };
}
