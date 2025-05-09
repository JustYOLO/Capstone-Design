import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { FaBars } from "react-icons/fa";

const Navbar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // 전체 상태 리셋 (또는 App에서 user 상태 관리할 경우 setUser(null) 방식 추천)
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-3xl font-baemin text-pink-400 hover:bg-purple-100 transition">
          BlossomPick
        </Link>

        {/* 모바일 메뉴 토글 */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/dictionary" className="hover:text-blue-500 transition">꽃말 사전</Link>
          <Link to="/searchwhere" className="hover:text-blue-500 transition">꽃집 조회</Link>
          <Link to="/order" className="hover:text-blue-500 transition">꽃 주문</Link>
        </div>

        {/* 로그인 상태에 따라 UI 변경 */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              <FiUser className="text-gray-700 text-xl" />
              <span className="text-gray-700">{user.name || user.email || "프로필"}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">개인정보 설정</Link>
                <Link to="/voc" className="block px-4 py-2 hover:bg-gray-100">문의사항</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  <MdLogout className="inline-block mr-2" /> 로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            로그인/가입
          </Link>
        )}
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 text-gray-700 font-medium">
          <Link to="/dictionary" className="block hover:text-blue-500">꽃말 검색</Link>
          <Link to="/searchwhere" className="block hover:text-blue-500">꽃집 조회</Link>
          <Link to="/order" className="block hover:text-blue-500">꽃집 주문</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;