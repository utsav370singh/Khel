import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import CreateTournamentForm from "../sports/CreateTournamentForm";

function Navbar({ isLoggedIn, handleLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateTournament = () => {
    if (isLoggedIn) {
      setShowForm(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-[length:400%_400%] animate-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <AnimatedLogo />
            </Link>
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-baseline space-x-20">
                <NavLink href="/Cricket">CRICKET</NavLink>
                <NavLink href="/Football">FOOTBALL</NavLink>
                <NavLink href="/Kabaddi">KABADDI</NavLink>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <button
                className="px-4 py-2 rounded-md text-sm font-medium bg-white text-purple-600 hover:bg-purple-100"
                onClick={handleCreateTournament}
              >
                CREATE TOURNAMENT
              </button>

              <div className="ml-14">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-600"
                  >
                    LOGOUT
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-600"
                  >
                    LOGIN
                  </button>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-purple-700"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <MobileNavLink href="/Cricket">CRICKET</MobileNavLink>
                <MobileNavLink href="/Football">FOOTBALL</MobileNavLink>
                <MobileNavLink href="/Kabaddi">KABADDI</MobileNavLink>
              </div>
              <div className="pt-4 pb-3 border-t border-white/10">
                <div className="flex items-center px-5">
                  <button
                    className="w-full px-4 py-2 rounded-md bg-white text-purple-600 hover:bg-purple-100"
                    onClick={handleCreateTournament}
                  >
                    CREATE TOURNAMENT
                  </button>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-white hover:bg-purple-700 px-3 py-2 rounded-md text-base"
                    >
                      Logout
                    </button>
                  ) : (
                    <MobileNavLink href="/Login">Login</MobileNavLink>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Render Create Tournament Form here */}
      <CreateTournamentForm showForm={showForm} setShowForm={setShowForm} />
    </>
  );
}

function AnimatedLogo() {
  return (
    <motion.div
      className="flex-shrink-0 text-white font-bold text-2xl"
      initial={{ scale: 1.5 }}
      animate={{ scale: [1.5, 2, 1.5] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <img src="/images/logo1.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
    </motion.div>
  );
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="relative text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:text-purple-200 group"
    >
      {children}
    </a>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <a
      href={href}
      className="block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
    >
      {children}
    </a>
  );
}

export default Navbar;
