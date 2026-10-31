import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotifications } from '../context/NotificationContext';
import { FiHeart, FiMenu, FiSearch, FiShoppingCart, FiX } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

export default function Navbar() {
  const { user } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart?.length ?? 0;
  const wishlistCount = wishlist?.length ?? 0;
  const currentTab = searchParams.get('tab');
  const firstName = user?.name?.split(' ')[0] || 'Reader';
  const initials = firstName.slice(0, 1).toUpperCase();

  const isExplore = location.pathname === '/explore' && !currentTab;
  const isFreeShelf = location.pathname === '/explore' && currentTab === 'free';
  const isSell = location.pathname.startsWith('/seller');
  const isCommunity = location.pathname === '/' && location.hash === '#community';

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const handleKeyDown = event => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="site-navbar-shell">
      <nav className="site-navbar" aria-label="Main navigation">
        <Link to="/home" className="site-brand" onClick={closeMenu} aria-label="BookCycle home">
          <span className="site-brand-mark"><img src="/images/bookcycle-logo.png" alt="BookCycle logo" /></span>
          <span>BookCycle</span>
        </Link>

        <div id="site-navigation" className={`site-nav-links${isMenuOpen ? ' is-open' : ''}`}>
          <Link to="/explore" className={isExplore ? 'active' : ''} onClick={closeMenu}>Explore</Link>
          <Link to="/explore?tab=free" className={isFreeShelf ? 'active' : ''} onClick={closeMenu}>Free Shelf</Link>
          <Link to="/seller" className={isSell ? 'active' : ''} onClick={closeMenu}>Sell</Link>
          <Link to="/#community" className={isCommunity ? 'active' : ''} onClick={closeMenu}>Community</Link>
        </div>

        <div className="site-nav-actions">
          <Link to="/explore" className="site-icon-link site-search-link" aria-label="Search books" title="Search books" onClick={closeMenu}>
            <FiSearch aria-hidden="true" />
          </Link>
          <Link to="/wishlist" className="site-icon-link" aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`} title="Wishlist" onClick={closeMenu}>
            <FiHeart aria-hidden="true" />
            {wishlistCount > 0 && <span className="site-count site-count-wishlist">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="site-icon-link" aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`} title="Cart" onClick={closeMenu}>
            <FiShoppingCart aria-hidden="true" />
            {cartCount > 0 && <span className="site-count site-count-cart">{cartCount}</span>}
          </Link>
          {user && (
            <Link to="/dashboard" className="site-icon-link site-dashboard-link" aria-label={`Dashboard${unreadCount ? `, ${unreadCount} unread notifications` : ''}`} title="Dashboard" onClick={closeMenu}>
              <MdDashboard aria-hidden="true" />
              {unreadCount > 0 && <span className="site-count site-count-alert">{unreadCount}</span>}
            </Link>
          )}
          {user && (
            <span className="site-user-greeting">
              <span className="site-user-avatar" aria-hidden="true">{initials}</span>
              <span>Hi, {firstName}</span>
            </span>
          )}
          <Link to={user ? '/logout' : '/login'} className="site-nav-cta" onClick={closeMenu}>
            {user ? 'Logout' : 'Login'}
          </Link>
          <button
            type="button"
            className="site-menu-toggle"
            onClick={() => setIsMenuOpen(open => !open)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="site-navigation"
          >
            {isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </div>
  );
}
