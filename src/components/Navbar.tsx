"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  logoSrc?: string;
}

export default function Navbar({ logoSrc = "/next.svg" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "NEWS", href: "/news" },
    { label: "OFFERS", href: "#" },
    { label: "SHOP", href: "/shop" },
    { label: "BRANDS", href: "#" },
  ];

  return (
    <nav className="w-full">
      {/* Top bar */}
      <div className="bg-dark-900 text-light-100 px-4 py-2 text-center">
        &quot;NETRIX&quot; New Sharq Aljazeera Exclusive Brand!
      </div>

      {/* Main navbar */}
      <div className=" text-dark-blue">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo and Menu - Float Left */}
            <div className="flex items-center gap-8 flex-1">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <div>
                  <Image
                    src="/logo.webp"
                    alt="Sharq Aljazeera Logo"
                    width={170}
                    height={150}
                    className="rounded-md w-auto h-auto"
                    priority // ensures logo loads instantly
                  />
                  <div className="text-dark-700 text-[12px]">
                    Cummunication & Internet
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation Links - Next to Logo */}
              <div className="hidden lg:flex items-center gap-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const isHome = link.label === "HOME";
                  const shouldStyleActive = isActive && !isHome;

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`transition-colors ${
                        shouldStyleActive
                          ? "text-orange text-[18px] font-medium"
                          : "text-[16px] text-site-blue hover:text-orange"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Icons and Actions - Desktop Only */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search */}
              <button className="p-2 rounded-lg hover:bg-slate-100 hover:scale-110 transition-all duration-200 group">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-site-blue group-hover:text-dark-blue transition-colors"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              {/* User Profile */}
              <button className="p-2 rounded-lg hover:bg-slate-100 hover:scale-110 transition-all duration-200 group">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-site-blue group-hover:text-dark-blue transition-colors"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              {/* Wishlist */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 hover:scale-110 transition-all duration-200 group">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-site-blue group-hover:text-dark-blue group-hover:fill-dark-blue transition-all"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="absolute top-0 right-0 bg-site-blue text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold shadow-md">
                  0
                </span>
              </button>

              {/* Cart */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 hover:scale-110 transition-all duration-200 group">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-site-blue group-hover:text-dark-blue transition-colors"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="absolute top-0 right-0 bg-site-blue text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold shadow-md">
                  0
                </span>
              </button>
            </div>

            {/* Mobile Menu Button Container */}
            <div className="lg:hidden flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="p-2 rounded-lg hover:bg-slate-100 hover:scale-110 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-600"
                >
                  {isMobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-light-300 pt-4">
              <div className="flex flex-col gap-3">
                {/* Navigation Links */}
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const isHome = link.label === "HOME";
                  const shouldStyleActive = isActive && !isHome;

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`transition-colors ${
                        shouldStyleActive
                          ? "text-orange text-[18px] font-medium"
                          : "text-[16px] text-dark-900 hover:text-orange"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Mobile Icon Menu Items */}
                <div className="mt-4 pt-4 border-t border-light-300">
                  {/* Search */}
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-100 transition-all duration-200 group">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-site-blue group-hover:text-dark-blue transition-colors"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <span className="text-dark-900 font-medium">Search</span>
                  </button>

                  {/* Profile */}
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-100 transition-all duration-200 group">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-site-blue group-hover:text-dark-blue transition-colors"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-dark-900 font-medium">Profile</span>
                  </button>

                  {/* Wishlist */}
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-100 transition-all duration-200 group">
                    <div className="relative">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-site-blue group-hover:text-dark-blue group-hover:fill-dark-blue transition-all"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-gradient-to-br from-site-blue to-dark-blue text-white text-[8px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-semibold shadow-md">
                        0
                      </span>
                    </div>
                    <span className="text-dark-900 font-medium">Wishlist</span>
                  </button>

                  {/* Cart */}
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-100 transition-all duration-200 group">
                    <div className="relative">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-site-blue group-hover:text-sky-blue-600 transition-colors"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-gradient-to-br from-site-blue to-dark-blue text-white text-[8px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-semibold shadow-md">
                        0
                      </span>
                    </div>
                    <span className="text-dark-900 font-medium">Cart</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
