import { useState, useCallback, useEffect } from "react";
import { Coupon, Product } from "../types";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { CartIcon, ShoppingBagIcon } from "./components/icons";
import ProductList from "./components/product/ProductList";
import CartList from "./components/cart/CartList";
import useNotification from "./utils/hooks/useNotification";
import NotificationToast from "./components/ui/NotificationToast";
import { useDebounce } from "./utils/hooks/useDebounce";
import { formatters } from "./utils/formatters";
import cartService from "./services/cart";
import { useCart } from "./hooks/useCart";
import { useCoupon } from "./hooks/useCoupon";
import { useProduct } from "./hooks/useProduct";
import AdminPage from "./pages/AdminPage";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const App = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    getStockStatus,
    validateProductPrice,
    validateProductStock,
  } = useProduct();

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    calculateItemTotal,
  } = useCart();

  const {
    selectedCoupon,
    coupons,
    applyCoupon,
    addCoupon,
    deleteCoupon,
    validateCoupon,
    formatCouponCode,
    initializeCoupon,
    clearSelectedCoupon,
  } = useCoupon();

  // 어드민
  const [isAdmin, setIsAdmin] = useState(false);

  // 알람 기능
  const notification = useNotification();

  // 검색어
  const [searchTerm, setSearchTerm] = useState("");

  // 디바운스된 검색어
  const debouncedSearchTerm = useDebounce(searchTerm);

  // [ui] 장바구니 총 상품 수 계산
  const [totalItemCount, setTotalItemCount] = useState(0);

  // [ui] 장바구니 상품 수량 업데이트
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // useLocalStorage 훅이 이미 로컬스토리지를 관리하므로 추가 useEffect는 제거

  // [cart] 장바구니 담기 로직
  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCart(product);
      if (result.status === "error") {
        notification.add(result.message, result.status);
        return;
      }
      notification.add("장바구니에 담았습니다", "success");
    },
    [addToCart, notification.add]
  );

  // [cart] 카트에서 상품을 제거
  const handleRemoveFromCart = useCallback(
    (productId: string) => {
      const result = removeFromCart(productId);
      if (result.status === "error") {
        notification.add(result.message, result.status);
        return;
      }
    },
    [removeFromCart, notification.add]
  );

  // [cart] 장바구니 수량 업데이트
  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantity(productId, newQuantity);
      if (result.status === "error") {
        notification.add(result.message, result.status);
        return;
      }
    },
    [updateQuantity, notification.add]
  );

  // [coupon] 쿠폰 적용하기
  const handleApplyCoupon = useCallback(
    (coupon: Coupon) => {
      // 현재 장바구니에 존재하는 할인후 전체 가격
      const currentTotal = cartService.calculateCartTotal({
        cart,
        selectedCoupon,
      }).totalAfterDiscount;

      // 쿠폰 적용
      const validation = applyCoupon(coupon, currentTotal);
      if (!validation.isValid) {
        notification.add(validation.message, "error");
        return;
      }

      notification.add("쿠폰이 적용되었습니다.", "success");
    },
    [cart, selectedCoupon, applyCoupon, notification.add]
  );

  // [order] 주문 완료 처리
  const handleCompleteOrder = useCallback(() => {
    const result = completeOrder();

    if (result.status === "success") {
      notification.add(result.message, result.status);
    } else {
      notification.add(result.message, result.status);
    }
  }, [completeOrder, notification.add]);

  // [product] 상품목록에 상품 추가하기
  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const result = addProduct(newProduct);
      notification.add(result.message, result.status);
    },
    [addProduct, notification.add]
  );

  // [product] 특정 상품 업데이트하기(수정)
  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const result = updateProduct(productId, updates);
      notification.add(result.message, result.status);
    },
    [updateProduct, notification.add]
  );

  // [product] 특정 상품 제거하기
  const handleDeleteProduct = useCallback(
    (productId: string) => {
      const result = deleteProduct(productId);
      notification.add(result.message, result.status);
    },
    [deleteProduct, notification.add]
  );

  // [coupon] 쿠폰 추가하기
  const handleAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const result = addCoupon(newCoupon);
      notification.add(result.message, result.status);
    },
    [addCoupon, notification.add]
  );

  // [coupon] 쿠폰 제거하기
  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      const result = deleteCoupon(couponCode);
      notification.add(result.message, result.status);
    },
    [deleteCoupon, notification.add]
  );

  // [cart] 장바구니 총액 계산
  const totals = cartService.calculateCartTotal({
    cart,
    selectedCoupon,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast
        notifications={notification.notifications}
        onRemove={notification.remove}
      />
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAdmin(!isAdmin)}
                variant={isAdmin ? "black" : "ghost"}
                size="small"
              >
                {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
              </Button>
              {!isAdmin && (
                <CartIcon
                  itemCount={totalItemCount}
                  className="w-6 h-6 text-gray-700"
                />
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            isAdmin={isAdmin}
            products={products}
            coupons={coupons}
            addProduct={handleAddProduct}
            updateProduct={handleUpdateProduct}
            deleteProduct={handleDeleteProduct}
            addCoupon={handleAddCoupon}
            deleteCoupon={handleDeleteCoupon}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* 상품 목록 */}
              <section>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    전체 상품
                  </h2>
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
              <div className="sticky top-24 space-y-4">
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <ShoppingBagIcon className="w-5 h-5 mr-2" size="small" />
                    장바구니
                  </h2>
                  <CartList
                    cart={cart}
                    removeFromCart={handleRemoveFromCart}
                    updateQuantity={handleUpdateQuantity}
                    calculateItemTotal={calculateItemTotal}
                  />
                </section>

                {cart.length > 0 && (
                  <>
                    <section className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                          쿠폰 할인
                        </h3>
                        <button className="text-xs text-blue-600 hover:underline">
                          쿠폰 등록
                        </button>
                      </div>
                      {coupons.length > 0 && (
                        <select
                          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                          value={selectedCoupon?.code || ""}
                          onChange={(e) => {
                            const coupon = coupons.find(
                              (c) => c.code === e.target.value
                            );
                            if (coupon) handleApplyCoupon(coupon);
                            else clearSelectedCoupon();
                          }}
                        >
                          <option value="">쿠폰 선택</option>
                          {coupons.map((coupon) => (
                            <option key={coupon.code} value={coupon.code}>
                              {coupon.name} (
                              {coupon.discountType === "amount"
                                ? `${formatters.price(
                                    coupon.discountValue,
                                    false
                                  )}`
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
                            {formatters.price(
                              totals.totalBeforeDiscount,
                              false
                            )}
                          </span>
                        </div>
                        {totals.totalBeforeDiscount -
                          totals.totalAfterDiscount >
                          0 && (
                          <div className="flex justify-between text-red-500">
                            <span>할인 금액</span>
                            <span>
                              -
                              {formatters.price(
                                totals.totalBeforeDiscount -
                                  totals.totalAfterDiscount,
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
                        onClick={handleCompleteOrder}
                        variant="yellow"
                        className="w-full mt-4"
                      >
                        {formatters.price(totals.totalAfterDiscount, false)}{" "}
                        결제하기
                      </Button>

                      <div className="mt-3 text-xs text-gray-500 text-center">
                        <p>* 실제 결제는 이루어지지 않습니다</p>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
