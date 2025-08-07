import { useAtom } from "jotai";
import { ProductWithUI } from "../App";
import ProductList from "../components/product/ProductList";
import Cart from "../components/cart/Cart";
import {
  productsAtom,
  cartAtom,
  couponsAtom,
  selectedCouponAtom,
  cartActionsAtom,
  completeOrderAtom,
  couponActionsAtom,
} from "../atoms";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import productService from "../services/product";
import cartService from "../services/cart";

export default function CartPage() {
  const [products] = useAtom(productsAtom);
  const [cart] = useAtom(cartAtom);
  const [coupons] = useAtom(couponsAtom);
  const [selectedCoupon] = useAtom(selectedCouponAtom);
  const { debouncedSearchTerm } = useDebouncedSearch();

  const [, cartActions] = useAtom(cartActionsAtom);
  const [, completeOrder] = useAtom(completeOrderAtom);
  const [, couponActions] = useAtom(couponActionsAtom);

  const handleAddToCart = (product: ProductWithUI) => {
    cartActions({ type: "ADD_TO_CART", payload: product });
  };

  const handleRemoveFromCart = (productId: string) => {
    cartActions({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    cartActions({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const handleApplyCoupon = (coupon: any) => {
    couponActions({ type: "APPLY_COUPON", payload: coupon });
  };

  const handleClearSelectedCoupon = () => {
    couponActions({ type: "CLEAR_SELECTED_COUPON" });
  };

  const handleCompleteOrder = () => {
    completeOrder();
  };

  const searchProduct = (searchTerm: string) => {
    return productService.searchProduct({
      products,
      searchTerm,
    });
  };

  const getStockStatus = (product: ProductWithUI, cart: any[]) => {
    return productService.getStockStatus({
      product,
      cart,
    });
  };

  const calculateItemTotal = (item: any, cart: any[]) => {
    return cartService.calculateItemTotal({ item, cart });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          <ProductList
            cart={cart}
            products={products}
            debouncedSearchTerm={debouncedSearchTerm}
            addToCart={handleAddToCart}
            searchProduct={searchProduct}
            getStockStatus={getStockStatus}
          />
        </section>
      </div>

      <div className="lg:col-span-1">
        {/* 장바구니 */}
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          removeFromCart={handleRemoveFromCart}
          updateQuantity={handleUpdateQuantity}
          calculateItemTotal={calculateItemTotal}
          applyCoupon={handleApplyCoupon}
          clearSelectedCoupon={handleClearSelectedCoupon}
          completeOrder={handleCompleteOrder}
        />
      </div>
    </div>
  );
}
