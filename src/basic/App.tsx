import { Product } from "../types";
import useNotification from "./utils/hooks/useNotification";
import NotificationToast from "./components/ui/NotificationToast";
import { useCart } from "./hooks/useCart";
import { useCoupon } from "./hooks/useCoupon";
import { useProduct } from "./hooks/useProduct";
import { useAdminMode } from "./hooks/useAdminMode";
import { useSearch } from "./hooks/useSearch";
import { useCartActions } from "./hooks/useCartActions";
import { useProductActions } from "./hooks/useProductActions";
import { useCouponActions } from "./hooks/useCouponActions";
import { useOrderActions } from "./hooks/useOrderActions";
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

    clearSelectedCoupon,
  } = useCoupon();

  // 어드민 모드 관리
  const { isAdmin, toggleAdmin } = useAdminMode();

  // 알람 기능
  const notification = useNotification();

  // 검색어 관리
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();

  // 액션 훅들
  const { handleAddToCart, handleRemoveFromCart, handleUpdateQuantity } =
    useCartActions(addToCart, removeFromCart, updateQuantity, notification);
  const { handleAddProduct, handleUpdateProduct, handleDeleteProduct } =
    useProductActions(addProduct, updateProduct, deleteProduct, notification);
  const { handleApplyCoupon, handleAddCoupon, handleDeleteCoupon } =
    useCouponActions(
      cart,
      selectedCoupon,
      applyCoupon,
      addCoupon,
      deleteCoupon,
      notification
    );
  const { handleCompleteOrder } = useOrderActions(completeOrder, notification);

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
        cart={cart}
        onToggleAdmin={toggleAdmin}
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
            notification={notification}
          />
        ) : (
          <CartPage
            products={products}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            searchTerm={searchTerm}
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
