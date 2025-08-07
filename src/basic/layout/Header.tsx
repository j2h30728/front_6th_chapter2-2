import { CartIcon } from "../components/icons";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";

import { CartItem } from "../../types";

interface HeaderProps {
  isAdmin: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cart: CartItem[];
  onToggleAdmin: () => void;
}

export default function Header({
  isAdmin,
  searchTerm,
  setSearchTerm,
  cart,
  onToggleAdmin,
}: HeaderProps) {
  // 장바구니 총 상품 수 계산
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 */}
            {!isAdmin && (
              <div className="ml-8 flex-1 max-w-md">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <Button
              onClick={onToggleAdmin}
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
  );
}
