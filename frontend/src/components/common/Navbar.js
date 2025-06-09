import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { FaBars } from "react-icons/fa";

const Navbar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFlorist, setIsFlorist] = useState(false);
  const [businessId, setBusinessId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFloristStatus = async () => {
      if (!user) return;

      try {
        const token = user.access;

        // 내 꽃집 이름 가져오기
        const res1 = await fetch("https://blossompick.duckdns.org/api/v1/florist/housename/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res1.ok) return;
        const { housename } = await res1.json();
        if (!housename) return;

        setIsFlorist(true);

        // 전체 꽃집 목록 가져오기
        const res2 = await fetch("https://blossompick.duckdns.org/api/v1/florist/stores/");
        if (!res2.ok) return;
        const stores = await res2.json();

        // 내 가게 찾기
        const matchedStore = stores.find((store) => store.housename === housename);
        if (matchedStore) {
          setBusinessId(matchedStore.business_id);
        }
      } catch (err) {
        console.error("❌ florist 확인 실패:", err);
      }
    };

    checkFloristStatus();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar-root">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">BlossomPick</Link>

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

        {/* 로그인 상태 */}
        {user ? (
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="profile-button">
              <FiUser className="text-gray-700 text-xl" />
              <span className="text-gray-700">{user.name || user.email || "프로필"}</span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">개인정보 설정</Link>

                {!isFlorist && (
                  <Link to="/orderhistory" className="dropdown-item">주문 내역</Link>
                )}

                {isFlorist && (
                  <>
                    <Link to="/flowerhouse" className="dropdown-item">꽃집 정보 수정</Link>
                    <Link to="/flowerhouse/addflower" className="dropdown-item">꽃 재고 관리</Link>
                    {businessId && (
                      <Link to={`/flowerhouse/view/${businessId}`} className="dropdown-item">
                        내 꽃집 보기
                      </Link>
                    )}
                  </>
                )}

                <button onClick={handleLogout} className="logout-button">
                  <MdLogout className="inline-block mr-2" /> 로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">로그인/가입</Link>
        )}
      </div>

      {/* 모바일 메뉴 */}
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