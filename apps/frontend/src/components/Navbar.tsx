"use client";

import {
  Store,
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  Heart,
  LogOut,
  Package,
  UserStar,
  Headset,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MonitorSmartphone,
  Shirt,
  Home,
  Flame,
  LogInIcon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { GET_USER_INFO } from "@/app/profile/page";

type GetUserInfoResponse = {
  getUserInfo: {
    userData: {
      name: string;
      email: string;
    };
  };
};


type SearchSuggestion = {
  text: string;
  type: string;
};

type SearchQueryResponse = {
  searchSuggestions: SearchSuggestion[];
};

type RecentSearch = {
  text: string;
  type: string;
};

type RecentSearchesResponse = {
  recentSearches: RecentSearch[];
};

type LogoutResponse = {
  logout: {
    success: boolean;
    message: string;
  };
};

type GetCartDataResponse = {
  getCartData: {
    cartLength: number;
  };
};

const RECENT_SEARCHES = gql`
  query RecentSearches {
    recentSearches {
      text
      type
    }
  }
`;

type GetMeResponse = {
  isUserExists: {
    isUserExist: boolean;
  };
};

export const GET_ME = gql`
  query GetMe {
    isUserExists {
      isUserExist
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

const SEARCH_QUERY = gql`
  query SearchQuery($query: String!) {
    searchSuggestions(query: $query) {
      text
      type
    }
  }
`;

export const GET_CART_DATA = gql`
  query GetCartData {
    getCartData {
      cartLength
    }
  }
`;

const MAIN_NAV_LINKS = [
  {
    name: "New Arrivals",
    href: "/search?category=electronics",
    highlight: true,
  },
  { name: "Electronics", href: "/search?category=electronics" },
  { name: "Fashion", href: "/search?category=fashion" },
  { name: "Home & Beauty", href: "/search?category=home" },
];

const NAV_LINKS = [
  { name: "Electronics", href: "/search?category=electronics" },
  { name: "Trending Fashion", href: "/search?category=fashion" },
  { name: "Sneaker", href: "/search?category=fashion" },
  { name: "Home Decor", href: "/search?category=home" },
  { name: "Beauty Deals", href: "/search?category=beauty" },
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();
  const client = useApolloClient()

  const [
    fetchRecentSearches,
    { data: recentSearchData, loading: recentSearchLoading },
  ] = useLazyQuery<RecentSearchesResponse>(RECENT_SEARCHES, {
    fetchPolicy: "no-cache",
  });

  const { data: getData } = useQuery<GetMeResponse>(GET_ME, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, loading } = useQuery<SearchQueryResponse>(SEARCH_QUERY, {
    variables: { query: debouncedQuery },
    skip: !isSearchOpen || debouncedQuery.trim().length < 2,
    fetchPolicy: "no-cache",
    context: { skipAuth: true },
  });

  const { data: cartData, loading: cartLoading } = useQuery<GetCartDataResponse>(GET_CART_DATA, {
    fetchPolicy: "network-only",
    context: { skipAuth: true },
  });

    const { data: userData, loading: userLoading, error } = useQuery<GetUserInfoResponse>(GET_USER_INFO, {
      context: { skipAuth: true },
    });

  const [logout] = useMutation<LogoutResponse>(LOGOUT);

  const cart = cartData?.getCartData?.cartLength;

  const handLogout = async () => {
    try {
      const res = await logout();

      if (res?.data?.logout?.success) {
        await client.clearStore();
         await signOut({ redirect: false });
        window.location.href = "/signup";
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    if (!debouncedQuery.trim() && isSearchOpen) {
      fetchRecentSearches();
    }
  }, [debouncedQuery, isSearchOpen]);

  // Ref for handling clicks outside search to close it
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchClick = (text: string) => {
    router.push(`/search?q=${encodeURIComponent(text)}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] h-16 md:h-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* --- LEFT: Brand Logo & Mobile Menu Toggle --- */}
          <div
            className={`flex items-center gap-3 ${isSearchOpen ? "hidden md:flex" : "flex"}`}
          >
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl text-gray-700 hover:bg-red-50 hover:text-[#880808] transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link href={"/"}>
              <div className="flex items-center gap-2 cursor-pointer group shrink-0">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-2 lg:p-2.5 rounded-xl group-hover:shadow-md group-hover:shadow-red-900/10 hover:scale-105 transition-all duration-300">
                  <Store size={22} className="text-[#880808] drop-shadow-sm" />
                </div>
                <span className="text-xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#880808] to-[#ce2121] tracking-tight hover:opacity-80 transition-opacity">
                  Zynora Ecommerce
                </span>
              </div>
            </Link>
          </div>

          {/* --- CENTER: Desktop Nav Links --- */}
          {!isSearchOpen && (
            <nav className="hidden md:flex items-center gap-1 xl:gap-2 mx-auto animate-in fade-in duration-500">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 lg:px-4 py-2.5 rounded-full text-xs lg:text-sm font-bold transition-all duration-300 hover:bg-red-50 hover:text-[#880808] group flex items-center gap-1.5 ${link.highlight ? "text-[#880808]" : "text-gray-600"}`}
                >
                  {link.highlight && (
                    <Sparkles size={14} className="group-hover:animate-pulse" />
                  )}
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* --- RIGHT: Actions & Search --- */}
          <div
            className={`flex items-center justify-end ${isSearchOpen ? "w-full" : "flex-none gap-1 sm:gap-2"}`}
          >
            {/* Search Component (Expands full width on mobile if open) */}
            <div
              ref={searchRef}
              className={`flex items-center transition-all duration-300 ease-spring ${isSearchOpen ? "w-full scale-100 opacity-100" : "w-auto"}`}
            >
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 sm:p-2.5 rounded-full hover:bg-red-50 transition-all group lg:mr-2 hover:scale-110 active:scale-95"
                >
                  <Search
                    size={22}
                    className="text-gray-600 group-hover:text-[#880808]"
                  />
                </button>
              ) : (
                <div className="relative w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative flex items-center group">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                          setIsSearchOpen(false);
                        }
                      }}
                      placeholder="Search for products, brands and more..."
                      className="w-full pl-12 pr-12 py-3 lg:py-3.5 bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl focus:outline-none focus:border-[#880808] focus:ring-4 focus:ring-red-50 text-gray-800 placeholder-gray-400 transition-all font-semibold text-sm lg:text-base group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                    />
                    <Search
                      size={20}
                      className="absolute left-4 text-[#880808]"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="absolute right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Enhanced Search Dropdown UI (Pure UI) */}
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border border-gray-100/50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                    <div className="p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                      {/* Recent & Trending Tags */}
                      <div className="flex flex-col md:flex-row gap-8 mb-8">
                        {/* Recent Searches */}
                        {debouncedQuery.trim().length === 0 ? (
                          <>
                            <div className="flex-1">
                              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Clock
                                  size={14}
                                  className="text-[#880808] opacity-70"
                                />{" "}
                                Recent Searches
                              </h3>
                              <ul className="space-y-1.5">
                                {recentSearchData?.recentSearches?.map(
                                  (term) => (
                                    <li key={`${term.text}-${term.type}`}>
                                      <button
                                        onClick={() =>
                                          handleSearchClick(term.text)
                                        }
                                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-red-50/80 text-gray-600 hover:text-[#880808] group transition-all duration-300"
                                      >
                                        <span className="text-sm font-semibold">
                                          {term.text}
                                        </span>
                                        <X
                                          size={14}
                                          className="opacity-0 group-hover:opacity-100 hover:text-red-500 hover:rotate-90 transition-all duration-300"
                                        />
                                      </button>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"></h3>
                              <ul className="space-y-1.5">
                                {data?.searchSuggestions?.map((term) => (
                                  <li key={`${term.text}-${term.type}`}>
                                    <button
                                      onClick={() =>
                                        handleSearchClick(term.text)
                                      }
                                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-red-50/80 text-gray-600 hover:text-[#880808] group transition-all duration-300"
                                    >
                                      <span className="text-sm font-semibold">
                                        {term.text}
                                      </span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}

                        {/* Trending Tags */}
                        <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <TrendingUp
                              size={14}
                              className="text-[#880808] opacity-70"
                            />{" "}
                            Trending Now
                          </h3>
                          <div className="flex flex-wrap gap-2.5">
                            {NAV_LINKS.map((tag) => (
                              <Link
                                href={tag.href}
                                key={tag.name}
                                className="px-4 py-2 bg-gradient-to-br from-gray-50 to-white hover:from-[#880808] hover:to-[#ce2121] text-gray-600 hover:text-white border border-gray-200 hover:border-transparent rounded-full text-xs font-bold cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                              >
                                {tag.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* View All Details */}
                      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <button className="text-sm font-black text-[#880808] hover:text-white bg-transparent hover:bg-[#880808] border-2 border-transparent hover:border-[#880808] rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto mx-auto px-8 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20 group">
                          View all results{" "}
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Actions (Hidden on mobile when search is open) */}
            <div
              className={`items-center gap-1 lg:gap-2 ${isSearchOpen ? "hidden" : "flex"}`}
            >
              {/* Login Dropdown */}
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setIsLoginOpen(true)}
                onMouseLeave={() => setIsLoginOpen(false)}
              >
                <div className="p-2 lg:px-4 lg:py-2.5 rounded-full hover:bg-gray-100 cursor-pointer group transition-all duration-300 flex items-center gap-2">
                  <User
                    size={22}
                    className="text-gray-700 group-hover:text-[#880808]"
                  />
                </div>

                {/* Login Menu Hover */}
                {getData?.isUserExists?.isUserExist ? (
                  <div
                    className={`absolute right-0 top-full w-64 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100/50 overflow-hidden transform transition-all duration-300 origin-top-right z-50 ${isLoginOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"}`}
                  >
                    <div className="p-5 bg-gradient-to-br from-red-50 to-white border-b border-gray-100">
                      <p className="text-base font-black text-gray-900">
                        Welcome {userData?.getUserInfo?.userData?.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 mt-1">
                        Access your account & orders
                      </p>
                    </div>

                    <ul className="p-2 space-y-1">
                      {[
                        {
                          icon: <User size={16} />,
                          href: "/profile",
                          label: "My Profile",
                        },
                        {
                          icon: <Package size={16} />,
                          href: "/orders",
                          label: "Orders",
                        },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="px-4 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-[#880808] transition-colors"
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <div className="h-px bg-gray-100 my-2 mx-2" />
                      <li
                        onClick={handLogout}
                        className="px-4 py-2.5 rounded-xl hover:bg-red-50 cursor-pointer flex items-center gap-3 text-sm font-bold text-red-600 transition-colors group"
                      >
                        <LogOut
                          size={16}
                          className="group-hover:-translate-x-1 transition-transform"
                        />{" "}
                        Logout
                      </li>
                    </ul>
                  </div>
                ): (
                  <div
                    className={`absolute right-0 top-full w-64 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100/50 overflow-hidden transform transition-all duration-300 origin-top-right z-50 ${isLoginOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"}`}
                  >
                    <div className="p-5 bg-gradient-to-br from-red-50 to-white border-b border-gray-100">
                      <p className="text-base font-black text-gray-900">
                        Welcome to Zynora Ecommerce!
                      </p>
                      <p className="text-xs font-medium text-gray-500 mt-1">
                        Sign in to access your account, orders & wishlist
                      </p>
                    </div>

                    <ul className="p-2 space-y-1">
                      <Link
                      href={"/signup"}
                        onClick={handLogout}
                        className="px-4 py-2.5 rounded-xl hover:bg-red-50 cursor-pointer flex items-center gap-3 text-sm font-bold text-red-600 transition-colors group"
                      >
                        <LogInIcon
                          size={16}
                          className="group-hover:-translate-x-1 transition-transform"
                        />{" "}
                        Login
                      </Link>
                    </ul>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <Link
                href={"/cart"}
                className="relative p-2 lg:px-4 lg:py-2.5 rounded-full hover:bg-red-50 cursor-pointer group transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <div className="relative">
                  <ShoppingCart
                    size={22}
                    className="text-gray-700 group-hover:text-[#880808]"
                  />
                  <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 min-w-[18px] flex items-center justify-center bg-[#880808] text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                    {cart}
                  </span>
                </div>
                <span className="hidden lg:block font-bold text-sm text-gray-700 group-hover:text-[#880808]">
                  Cart
                </span>
              </Link>

              {/* Ellipsis/More Options Menu (Desktop Only) */}
              <div
                className="relative hidden md:block ml-1"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="p-2.5 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300">
                  <Menu
                    size={22}
                    className="text-gray-700 hover:text-[#880808]"
                  />
                </div>
                <div
                  className={`absolute right-0 top-full w-56 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100/50 overflow-hidden transform transition-all duration-300 origin-top-right z-50 ${isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"}`}
                >
                  <ul className="p-2 space-y-1">
                    <Link href={"/seller"}  className="px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:shadow-inner cursor-pointer flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-[#880808] transition-all">
                      <UserStar size={16} className="text-amber-500" /> Become a
                      Seller
                    </Link>
                    <Link href={"/support"} className="px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:shadow-inner cursor-pointer flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-[#880808] transition-all">
                      <Headset size={16} className="text-blue-500" /> Help
                      Center
                    </Link>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE SLIDING DRAWER MENU --- */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-xl">
              <Store size={20} className="text-[#880808]" />
            </div>
            <span className="text-xl font-black text-[#880808] tracking-tight">
              <Link href={"/"}>Zynora Ecommerce</Link>
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* User Section */}
          <div className="p-5 border-b border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#880808] to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                U
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">
                  Welcome, {userData?.getUserInfo?.userData?.name}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {userData?.getUserInfo?.userData?.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 text-gray-600 font-semibold text-xs border border-gray-100">
                <Package size={18} /> Orders
              </button>
              <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 text-gray-600 font-semibold text-xs border border-gray-100">
                <Heart size={18} /> Wishlist
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3">
            <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Categories
            </p>
            <ul className="space-y-1">
              {[
                {
                  name: "Electronics",
                  href: "/search?category=electronics",
                  icon: <MonitorSmartphone size={18} />,
                },
                {
                  name: "Fashion",
                  href: "/search?category=fashion",
                  icon: <Shirt size={18} />,
                },
                {
                  name: "Home & Beauty",
                  href: "/search?category=home",
                  icon: <Home size={18} />,
                },
                {
                  name: "New Arrivals",
                  ref: "/search?category=electronics",
                  icon: <Sparkles size={18} className="text-[#880808]" />,
                  highlight: true,
                  href: "",
                },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-red-50 transition-colors group ${item.highlight ? "text-[#880808] font-bold bg-red-50/50" : "text-gray-700 font-semibold"}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-[#880808] group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3">
            <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              More
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href={"/seller"}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  <UserStar size={18} className="text-amber-500" /> Become a
                  Seller
                </Link>
              </li>
              <li>
                <Link
                  href={"/support"}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Headset size={18} className="text-blue-500" /> Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 mt-auto">
          {userData?.getUserInfo?.userData.name && userData?.getUserInfo?.userData?.email ? (
            <button
            onClick={handLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-red-600 font-bold bg-white border border-red-100 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
          ): <button
            onClick={() => router.push("/signup")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-red-600 font-bold bg-white border border-red-100 hover:bg-red-50 transition-colors"
          >
            <LogInIcon size={18} /> Logout
          </button>}
        </div>
      </div>
    </>
  );
}
