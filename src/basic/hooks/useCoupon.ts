import { useCallback } from "react";
import { Coupon } from "../../types";
import useLocalStorage from "../utils/hooks/useLocalStorage";

export function useCoupon() {
  const [selectedCoupon, setSelectedCoupon] = useLocalStorage<Coupon | null>(
    "selectedCoupon",
    null
  );

  const updateSelectedCoupon = useCallback(
    (coupon: Coupon | null) => {
      setSelectedCoupon(coupon);
    },
    [setSelectedCoupon]
  );

  return {
    selectedCoupon,
    setSelectedCoupon: updateSelectedCoupon,
  };
}
