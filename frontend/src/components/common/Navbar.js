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
    window.location.reload();
  };

  return (
    <nav className="navbar-root">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BlossomPick
        </Link>

        {/* 모바일 메뉴 토글 */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* 데스크탑 메뉴 */}
        <div className="navbar-menu-desktop">
          <Link to="/dictionary" className="navbar-link">꽃말 사전</Link>
          <Link to="/searchwhere" className="navbar-link">꽃집 조회</Link>
          <Link to="/order" className="navbar-link">꽃 주문</Link>
        </div>

        {/* 로그인 상태에 따라 UI 변경 */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="profile-button"
            >
              <FiUser className="text-gray-700 text-xl" />
              <span className="text-gray-700">
                {user.name || user.email || "프로필"}
              </span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">개인정보 설정</Link>
                <Link to="/voc" className="dropdown-item">문의사항</Link>

                {user.isFlorist && (
                  <>
                    <Link to="/flowerhouse/edit" className="dropdown-item">꽃집 정보 수정</Link>
                    <Link to="/flowerhouse/addflower" className="dropdown-item">꽃집 주문 관리</Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  <MdLogout className="inline-block mr-2" /> 로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">
            로그인/가입
          </Link>
        )}
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="navbar-menu-mobile">
          <Link to="/dictionary" className="block hover:text-blue-500">꽃말 검색</Link>
          <Link to="/searchwhere" className="block hover:text-blue-500">꽃집 조회</Link>
          <Link to="/order" className="block hover:text-blue-500">꽃집 주문</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;