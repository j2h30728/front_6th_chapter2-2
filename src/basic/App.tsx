import { useState, useCallback, useEffect } from "react";
import { Coupon, Product } from "../types";
import useNotification from "./utils/hooks/useNotification";
import NotificationToast from "./components/ui/NotificationToast";
import { useDebounce } from "./utils/hooks/useDebounce";
import cartService from "./services/cart";
import { useCart } from "./hooks/useCart";
import { useCoupon } from "./hooks/useCoupon";
import { useProduct } from "./hooks/useProduct";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import Header from "./layout/Header";

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
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalItemCount={totalItemCount}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

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
          <CartPage
            products={products}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            totals={totals}
            debouncedSearchTerm={debouncedSearchTerm}
            addToCart={handleAddToCart}
            removeFromCart={handleRemoveFromCart}
            updateQuantity={handleUpdateQuantity}
            calculateItemTotal={calculateItemTotal}
            applyCoupon={handleApplyCoupon}
            clearSelectedCoupon={clearSelectedCoupon}
            completeOrder={handleCompleteOrder}
            searchProduct={searchProduct}
            getStockStatus={getStockStatus}
          />
        )}
      </main>
    </div>
  );
};

export default App;
