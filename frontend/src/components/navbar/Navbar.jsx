import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import useAdmin from "../../hooks/useAdmin";
import LogoutButton from "../sidebar/LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthContext();

  const [admin] = useAdmin(authUser); // useAdmin hook

  return (
    <div className="navbar glass-morphism sticky top-0 z-50 px-6 py-3 border-b-2 border-blood-red/30">
      <div className="flex-1">
        <Link to="/" className="text-3xl font-orbitron font-bold text-white hover:text-crimson-glow transition-all duration-300 crimson-glow-text">
          ANIME 471!!
        </Link>
      </div>
      <div className="flex-none gap-6 items-center">
        <div className="hidden md:flex gap-4">
          <Link to="/store" className="font-orbitron text-sm text-gray-300 hover:text-crimson-glow transition-colors">Store</Link>
          <Link to="/store/cart" className="font-orbitron text-sm text-gray-300 hover:text-crimson-glow transition-colors">Cart</Link>
          <Link to="/store/wishlist" className="font-orbitron text-sm text-gray-300 hover:text-crimson-glow transition-colors">Wishlist</Link>
          {admin && (
            <Link to="/dashboard" className="font-orbitron text-sm text-crimson-glow hover:text-white transition-colors">Dashboard</Link>
          )}
        </div>

        <div className="relative group">
          <input
            type="text"
            placeholder="SEARCH ANIME..."
            className="bg-deep-black/60 border border-blood-red/50 text-xs font-orbitron px-4 py-2 rounded-none focus:outline-none focus:border-crimson-glow transition-all w-32 md:w-48 placeholder:text-gray-600"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-crimson-glow transition-all duration-300 group-hover:w-full"></div>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="p-0.5 rounded-full border-2 border-blood-red hover:border-crimson-glow transition-all animate-glow-pulse"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                alt="User Profile"
                src={authUser.profilePic?.includes("avatar.iran.liara.run") ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser.username}` : authUser.profilePic}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-4 z-[1] p-3 shadow-2xl menu menu-sm dropdown-content bg-dark-charcoal border border-blood-red/30 rounded-none w-56 font-inter"
          >
            <li className="mb-2 pb-2 border-b border-blood-red/20">
              <p className="text-crimson-glow font-orbitron text-[10px] tracking-widest uppercase">Logged in as</p>
              <span className="text-white font-bold">{authUser.fullName}</span>
            </li>
            <li><Link to="/chat" className="hover:text-crimson-glow transition-colors py-2">MESSAGES</Link></li>
            <li><Link to="/store" className="hover:text-crimson-glow transition-colors py-2">BROWSE STORE</Link></li>
            <li className="mt-2 pt-2 border-t border-blood-red/20">
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
