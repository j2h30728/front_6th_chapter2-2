import { CartItem } from "../../../types";
import { Coupon } from "../../../types";
import CartList from "./CartList";
import { ShoppingBagIcon } from "../icons";
import Button from "../ui/Button";
import { formatters } from "../../utils/formatters";

interface CartProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  calculateItemTotal: (item: CartItem, cart: CartItem[]) => number;
  applyCoupon: (coupon: Coupon) => void;
  clearSelectedCoupon: () => void;
  completeOrder: () => void;
}

export default function Cart({
  cart,
  coupons,
  selectedCoupon,
  totals,
  removeFromCart,
  updateQuantity,
  calculateItemTotal,
  applyCoupon,
  clearSelectedCoupon,
  completeOrder,
}: CartProps) {
  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <ShoppingBagIcon className="w-5 h-5 mr-2" size="small" />
          장바구니
        </h2>
        <CartList
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          calculateItemTotal={calculateItemTotal}
        />
      </section>

      {cart.length > 0 && (
        <>
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
              <button className="text-xs text-blue-600 hover:underline">
                쿠폰 등록
              </button>
            </div>
            {coupons.length > 0 && (
              <select
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={selectedCoupon?.code || ""}
                onChange={(e) => {
                  const coupon = coupons.find((c) => c.code === e.target.value);
                  if (coupon) applyCoupon(coupon);
                  else clearSelectedCoupon();
                }}
              >
                <option value="">쿠폰 선택</option>
                {coupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.name} (
                    {coupon.discountType === "amount"
                      ? `${formatters.price(coupon.discountValue, false)}`
                      : `${coupon.discountValue}%`}
                    )
                  </option>
                ))}
              </select>
            )}
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">
                  {formatters.price(totals.totalBeforeDiscount, false)}
                </span>
              </div>
              {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>할인 금액</span>
                  <span>
                    -
                    {formatters.price(
                      totals.totalBeforeDiscount - totals.totalAfterDiscount,
                      false
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-semibold">결제 예정 금액</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatters.price(totals.totalAfterDiscount, false)}
                </span>
              </div>
            </div>

            <Button
              onClick={completeOrder}
              variant="yellow"
              className="w-full mt-4"
            >
              {formatters.price(totals.totalAfterDiscount, false)} 결제하기
            </Button>

            <div className="mt-3 text-xs text-gray-500 text-center">
              <p>* 실제 결제는 이루어지지 않습니다</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
