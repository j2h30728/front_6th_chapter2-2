import { CartIcon } from "../components/icons";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface HeaderProps {
  isAdmin: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalItemCount: number;
  onToggleAdmin: () => void;
}

export default function Header({
  isAdmin,
  searchTerm,
  setSearchTerm,
  totalItemCount,
  onToggleAdmin,
}: HeaderProps) {
  return (
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
