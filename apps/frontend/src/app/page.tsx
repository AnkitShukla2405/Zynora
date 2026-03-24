"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowRight,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  TrendingUp,
  Percent,
  Check,
  Crown,
  Sparkles,
  Zap,
  Package,
  Bell,
  Play,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useApolloClient } from "@apollo/client/react";
import { GET_CART_DATA, GET_ME } from "@/components/Navbar";



interface ProductVariant {
  colorName: string;
  colorCode: string;
  size: string;
  sku: string;
  stock: number;
  variantImages?: {
    key: string
    order: number
  }[]
}


interface ProductModel {
  id: string;
  name: string;
  brand: string;
  slug: string;

  category: string;
  subCategory: string;
  productType: string;

  highlights: { text: string }[];
  specifications: { key: string; value: string }[];

  mrp: number;
  sellingPrice: number;
  discountPercentage: number;

  variants: ProductVariant[];

  deliveryTime: string;
  returnPolicy?: string;
  isReturnable: boolean;
  badge?: string;
  rating?: number;
  reviews?: number;
}

const GET_HOME_PAGE = gql`
query GetHomePage {
  getHomePage {

    flashDeals {
      id
      name
      brand
      slug
      sellingPrice
      mrp
      discountPercentage
      deliveryTime
      isReturnable
      variants {
        colorName
        colorCode
        size
        stock
        variantImages {
          key
          order
        }
      }
    }

    trendingProducts {
      id
      name
      brand
      slug
      category
      sellingPrice
      mrp
      discountPercentage
      deliveryTime
      isReturnable
      variants {
        colorName
        colorCode
        size
        stock
        variantImages {
          key
          order
        }
      }
    }

    electronics {
      id
      name
      brand
      category
      sellingPrice
      mrp
      discountPercentage
      deliveryTime
      isReturnable
      variants {
        colorName
        colorCode
        size
        stock
        variantImages {
          key
          order
        }
      }
    }
  }
}
`

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const TICKER = [
  "✦ Free delivery on orders above ₹499",
  "✦ New arrivals every day",
  "✦ Up to 70% off this week",
  "✦ 10-day hassle-free returns",
  "✦ EMI available on orders above ₹3,000",
  "✦ 100% authentic products guaranteed",
  "✦ 24/7 customer support",
];

const SLIDES = [
  {
    tag: "Mega Sale — Up to 70% Off",
    h1: ["Shop the", "Future,", "Today."],
    body: "Millions of products. Unbeatable prices. Lightning-fast delivery across India.",
    cta: "Explore Deals",
    link: "/search?category=electronics",
    ctaAlt: "New Arrivals",
    emoji: "🛍️",
    orb1: "rgba(136,8,8,0.65)",
    orb2: "rgba(220,38,38,0.25)",
    hl: "#f87171",
    bg: "linear-gradient(135deg,#0f0505 0%,#1f0808 45%,#0f0505 100%)",
  },
  {
    tag: "New Season — Just Arrived",
    h1: ["Style That", "Speaks", "For You."],
    body: "Discover the freshest fashion curated by India's top designers and brands.",
    cta: "Shop Fashion",
    link: "/search?category=fashion",
    ctaAlt: "View Lookbook",
    emoji: "👗",
    orb1: "rgba(109,8,136,0.55)",
    orb2: "rgba(168,85,247,0.22)",
    hl: "#d8b4fe",
    bg: "linear-gradient(135deg,#0d0512 0%,#1a0828 45%,#0d0512 100%)",
  },
  {
    tag: "Upgrade Your Space",
    h1: ["Homes That", "Feel Like", "Heaven."],
    body: "Premium home decor, appliances and kitchen essentials at prices you'll love.",
    cta: "Shop Home",
    link: "/search?category=home",
    ctaAlt: "View Collection",
    emoji: "🏡",
    orb1: "rgba(6,78,59,0.7)",
    orb2: "rgba(16,185,129,0.2)",
    hl: "#6ee7b7",
    bg: "linear-gradient(135deg,#030d09 0%,#071a10 45%,#030d09 100%)",
  },
];

const CATEGORIES = [
  { label: "Electronics", icon: "💻", bg: "#FEF2F2", color: "#880808" },
  { label: "Fashion", icon: "👗", bg: "#FDF2F8", color: "#be185d" },
  { label: "Home", icon: "🪴", bg: "#F0FDF4", color: "#15803d" },
  { label: "Beauty", icon: "✨", bg: "#FAF5FF", color: "#7e22ce" },
  { label: "Sports", icon: "⚽", bg: "#FFFBEB", color: "#b45309" },
  { label: "Books", icon: "📚", bg: "#EFF6FF", color: "#1d4ed8" },
  { label: "Grocery", icon: "🥦", bg: "#ECFDF5", color: "#047857" },
  { label: "Jewellery", icon: "💍", bg: "#FFFBEB", color: "#b45309" },
  { label: "Toys", icon: "🧸", bg: "#FFF1F2", color: "#be123c" },
  { label: "Auto", icon: "🚗", bg: "#F8FAFC", color: "#475569" },
];





const REVIEWS = [
  {
    name: "Shreya Kapoor",
    loc: "Bengaluru",
    rating: 5,
    avatar: "SK",
    text: "Zynora is hands-down the best shopping platform. Super fast delivery and quality exceeded my expectations.",
    color: "#880808",
  },
  {
    name: "Arjun Mehta",
    loc: "Mumbai",
    rating: 5,
    avatar: "AM",
    text: "Returned a product effortlessly within 3 days. The customer support team is incredibly responsive!",
    color: "#1d4ed8",
  },
  {
    name: "Priya Nair",
    loc: "Chennai",
    rating: 5,
    avatar: "PN",
    text: "The deals here are unreal. I got my dream Dyson at 30% off. Will definitely keep shopping here!",
    color: "#047857",
  },
];

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible"),
        ),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────
   TICKER
───────────────────────────────────────── */
function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="bg-[#880808] text-white text-[11px] font-semibold py-2.5 overflow-hidden relative">
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((item, i) => (
          <span key={i} className="mx-10 shrink-0 tracking-wide">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero() {
  const [cur, setCur] = useState(0);
  const s = SLIDES[cur];

  useEffect(() => {
    const t = setInterval(() => setCur((c) => (c + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, [cur]);

  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden noise"
      style={{ background: s.bg }}
    >
      {/* orbs */}
      <div
        className="absolute -top-40 -right-40 w-[650px] h-[650px] rounded-full blur-[130px] opacity-55 transition-all duration-1000"
        style={{ background: s.orb1 }}
      />
      <div
        className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full blur-[100px] opacity-30 transition-all duration-1000"
        style={{ background: s.orb2 }}
      />
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div key={`txt-${cur}`} className="animate-slide-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-7 border"
            style={{
              color: s.hl,
              borderColor: `${s.hl}40`,
              background: `${s.hl}14`,
            }}
          >
            <Sparkles size={11} /> {s.tag}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.04] tracking-tight text-white mb-6">
            {s.h1.map((line, i) => (
              <span
                key={i}
                className="block"
                style={i === 1 ? { color: s.hl } : {}}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-md mb-10">
            {s.body}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link href={s.link} >
            <button
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:scale-105 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg,#880808,#c53030)",
                boxShadow: "0 10px 40px rgba(136,8,8,0.45)",
              }}
            >
              {s.cta} <ArrowRight size={16} />
            </button>
            </Link>
            <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white/60 text-sm border border-white/10 hover:border-white/30 hover:text-white transition-all">
              {s.ctaAlt} <ChevronRight size={15} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            {[
              { v: "10M+", l: "Products" },
              { v: "2M+", l: "Customers" },
              { v: "50K+", l: "Sellers" },
            ].map((stat) => (
              <div key={stat.l}>
                <p className="text-2xl font-black text-white">{stat.v}</p>
                <p className="text-[11px] text-white/35 uppercase tracking-widest mt-0.5">
                  {stat.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Glass card */}
        <div
          key={`card-${cur}`}
          className="hidden md:flex justify-center animate-fade-in"
        >
          <div className="relative">
            <div className="absolute inset-0 -m-14 rounded-full border border-dashed border-white/10 animate-spin-slow" />
            <div className="glass rounded-3xl p-7 w-[300px] relative overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: `radial-gradient(circle at 60% 0%,${s.hl}25,transparent 60%)`,
                }}
              />
              <div className="relative animate-float text-center mb-5">
                <div className="text-8xl mb-3 drop-shadow-2xl">{s.emoji}</div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white/80 bg-white/10">
                  <Crown size={10} /> Today&apos;s Top Picks
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Laptop", emoji: "💻", price: 45000, mrp: 60000 },
                  { name: "Headphones", emoji: "🎧", price: 2500, mrp: 4000 },
                  { name: "Camera", emoji: "📷", price: 35000, mrp: 50000 }
                ].slice(0, 3).map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <span className="text-xl shrink-0">{p.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-white/50">
                        ₹{(p?.price ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      {Math.round((1 - p.price / p.mrp) * 100)}% off
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* badges */}
            <div className="absolute -top-4 -right-4 glass rounded-2xl px-3 py-2 flex items-center gap-2 animate-float-alt shadow-lg">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Truck size={12} className="text-white" />
              </div>
              <div>
                <p className="text-white text-[11px] font-bold leading-none">
                  Free Delivery
                </p>
                <p className="text-white/40 text-[9px] mt-0.5">On ₹499+</p>
              </div>
            </div>
            <div className="absolute -bottom-3 -left-4 glass rounded-2xl px-3 py-2 flex items-center gap-2 animate-float shadow-lg">
              <Percent size={14} className="text-amber-300 shrink-0" />
              <div>
                <p className="text-white text-[11px] font-bold leading-none">
                  Up to 70% OFF
                </p>
                <p className="text-white/40 text-[9px] mt-0.5">Today only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            className="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
            style={{
              width: i === cur ? "28px" : "7px",
              background: i === cur ? s.hl : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-7 right-8 z-10 glass rounded-full px-3 py-1">
        <span className="text-white text-xs font-bold">
          {String(cur + 1).padStart(2, "0")}
        </span>
        <span className="text-white/30 text-xs">
          {" "}
          / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   TRUST BAR
───────────────────────────────────────── */
function TrustBar() {
  const items = [
    {
      icon: <Truck size={19} />,
      title: "Free Delivery",
      sub: "On orders above ₹499",
      color: "#16a34a",
    },
    {
      icon: <RotateCcw size={19} />,
      title: "10-Day Returns",
      sub: "Hassle-free policy",
      color: "#2563eb",
    },
    {
      icon: <ShieldCheck size={19} />,
      title: "100% Authentic",
      sub: "Verified sellers only",
      color: "#880808",
    },
    {
      icon: <Headphones size={19} />,
      title: "24/7 Support",
      sub: "Always here for you",
      color: "#7e22ce",
    },
  ];
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-gray-100">
        {items.map((item) => (
          <div
            key={item.title}
            className="group flex items-center gap-3 px-5 first:pl-0 last:pr-0 py-2"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300"
              style={{ background: `${item.color}14`, color: item.color }}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */
function SectionHead({
  eyebrow,
  title,
  sub,
  cta,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  cta?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.15em] text-[#880808] mb-2">
          <span className="w-4 h-0.5 bg-[#880808] rounded-full" />
          {eyebrow}
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          {title}
        </h2>
        {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
      </div>
      {cta && (
        <button className="hidden md:flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#880808] transition-colors group">
          {cta}{" "}
          <ChevronRight
            size={15}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ p }: { p: ProductModel }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

const variants = p.variants ?? [];

console.log(
`${process.env.NEXT_PUBLIC_CDN_URL}/${p?.variants?.[0]?.variantImages?.[0]?.key}`
);
const firstImage =
  p.variants?.[0]?.variantImages?.[0]?.key
    ? `${process.env.NEXT_PUBLIC_CDN_URL}/${p.variants[0].variantImages[0].key}`
    : "/placeholder.png";

const uniqueColors = Array.from(new Set(variants.map(v => v.colorCode)));
const uniqueSizes = Array.from(new Set(variants.map(v => v.size)));

const totalStock = variants.reduce((acc, curr) => acc + curr.stock, 0);
  const isLowStock = totalStock > 0 && totalStock < 10;


  
  return (
    <div className="group flex flex-col relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover-lift cursor-pointer shadow-sm">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {p.badge && (
          <div className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-sm">
            {p.badge}
          </div>
        )}
        {p.isReturnable && (
          <div className="text-[9px] font-bold px-2 py-0.5 rounded-full text-blue-700 bg-blue-50 border border-blue-100 flex items-center gap-1 shadow-sm">
            <RotateCcw size={10} /> 14D Return
          </div>
        )}
      </div>

      <button onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform">
        <Heart size={14} className={liked ? "fill-rose-500 text-rose-500" : "text-gray-300"} />
      </button>

      {/* Image Area */}
      <Link href={`/product/${p.slug}/p/${p.id}`} className="aspect-square flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shrink-0 p-4 md:p-6">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 50%,${hoveredColor || uniqueColors[0] || '#880808'}20,transparent 70%)` }} />
        <img
          src={firstImage}
          alt={p.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </Link >

      {/* Content Area */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#880808] bg-red-50 px-2 py-0.5 rounded">{p.brand}</span>
          <span className="text-[10px] font-semibold text-gray-400">{p.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-[#880808] transition-colors">{p.name}</h3>

        {/* Variants: Colors and Sizes */}
        <div className="flex items-center justify-between mt-auto mb-3">
           <div className="flex gap-1.5">
             {uniqueColors.map(color => (
               <div key={color} 
                    onMouseEnter={() => setHoveredColor(color)}
                    onMouseLeave={() => setHoveredColor(null)}
                    className="w-4 h-4 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:scale-125 transition-transform" 
                    style={{ backgroundColor: color }} title="Color Variant" />
             ))}
           </div>
           {uniqueSizes.length > 0 && uniqueSizes[0] !== "One Size" && uniqueSizes[0] !== "Standard" && (
             <div className="flex gap-1">
               {uniqueSizes.slice(0, 3).map(size => (
                 <span key={size} className="text-[9px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                   {size}
                 </span>
               ))}
               {uniqueSizes.length > 3 && <span className="text-[9px] text-gray-400">+{uniqueSizes.length - 3}</span>}
             </div>
           )}
        </div>

        {/* Specs & Highlights */}
        <div className="mb-3 space-y-1">
          {(p.specifications ?? []).slice(0, 1).map(spec => (
            <p key={spec.key} className="text-[10px] text-gray-500 truncate"><span className="font-semibold text-gray-700">{spec.key}:</span> {spec.value}</p>
          ))}
          {(p.highlights ?? []).slice(0, 1).map((hl, i) => (
            <p key={i} className="text-[10px] text-gray-500 truncate flex items-center gap-1">
              <Check size={10} className="text-emerald-500 shrink-0" /> {hl.text}
            </p>
          ))}
        </div>

        {/* Rating & Delivery */}
        <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-700">{p.rating ?? 4.5}</span>
            <span className="text-[10px] text-gray-400">({((p.reviews ?? 0) / 1000).toFixed(1)}k)</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
             <Truck size={10} /> {(p.deliveryTime ?? "").split(" ")[0]} 
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-gray-900">₹{p.sellingPrice.toLocaleString()}</span>
              {p.discountPercentage > 0 && (
                <span className="text-[10px] font-bold text-white bg-rose-500 px-1.5 py-0.5 rounded shadow-sm">{p.discountPercentage}% OFF</span>
              )}
            </div>
            <span className="text-xs text-gray-400 line-through">₹{(p.mrp ?? 0).toLocaleString()}</span>
          </div>
          
          <button onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${added ? "bg-emerald-500 text-white" : "bg-gray-100 hover:bg-[#880808] text-gray-900 hover:text-white"}`}>
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>
        </div>

        {/* Stock Warning */}
        {isLowStock && (
           <p className="text-[9px] text-rose-500 font-bold mt-2 flex items-center gap-1">
             <AlertCircle size={10} /> Only {totalStock} left - Order soon
           </p>
        )}
        {totalStock === 0 && (
           <p className="text-[9px] text-gray-400 font-bold mt-2">Out of Stock in all variants</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FLASH CARD
───────────────────────────────────────── */
function FlashCard({ d }: { d: ProductModel & { timer: string } }) {
  const stockAvailable = d.variants.reduce((acc, curr) => acc + curr.stock, 0);
  const totalStockBase = 50; // Mock total capacity
  const stockPerc = Math.max(0, Math.min(100, (stockAvailable / totalStockBase) * 100));
  const firstImage =
  d.variants?.[0]?.variantImages?.[0]?.key
    ? `${process.env.NEXT_PUBLIC_CDN_URL}/${d.variants[0].variantImages[0].key}`
    : "/placeholder.png";
  
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-3 md:p-4 hover-lift cursor-pointer flex flex-col gap-2 md:gap-3 shadow-sm">
      <Link href={`/product/${d.slug}/p/${d.id}`} className="relative bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 rounded-xl aspect-[4/3] md:aspect-square flex items-center justify-center text-5xl overflow-hidden shrink-0 p-4">
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {Array.from(new Set(d.variants.map((v: any) => v.colorCode))).map(color => (
             <div key={color as string} className="w-2.5 h-2.5 rounded-full shadow-sm border border-white" style={{ backgroundColor: color as string }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
        <img
          src={firstImage}
          alt={d.name}
          className="w-full h-full object-contain mix-blend-multiply relative z-0 transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase text-[#880808] truncate mr-2">{d.brand}</span>
          <span className="text-[10px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded shadow-sm shrink-0 flex items-center gap-1">⏱ {d.timer}</span>
        </div>
        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug mb-1.5">{d.name}</p>
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="font-black text-gray-900">₹{d.sellingPrice.toLocaleString()}</span>
          <span className="text-xs text-gray-400 line-through">₹{d.mrp.toLocaleString()}</span>
        </div>
        
        {/* Deal Progress / Stock Bar */}
        <div className="mt-auto">
          <div className="flex justify-between text-[9px] mb-1">
            <span className="font-bold text-rose-500">Available: {stockAvailable}</span>
            <span className="text-gray-400">{d.discountPercentage}% Claimed</span>
          </div>
          <div className="rounded-full overflow-hidden bg-gray-100 h-1.5">
            <div className="h-full rounded-full bg-gradient-to-r from-[#880808] to-rose-400 transition-all" style={{ width: `${100 - d.discountPercentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Home() {
  const client = useApolloClient()
  useReveal();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    client.refetchQueries({
      include: [GET_CART_DATA, GET_ME]
    })
  }, [])

  const {data, loading} = useQuery(GET_HOME_PAGE, {
    fetchPolicy: "no-cache",
    context: {skipAuth: true},
  })

  return (
    <div className="min-h-screen bg-[#F7F7F9]">
      {/* ── TICKER ── */}
      <Ticker />

      {/* ── HERO ── */}
      <Hero />

      {/* ── TRUST BAR ── */}
      <TrustBar />

      {/* ── CATEGORIES ── */}
      <section className="reveal max-w-7xl mx-auto px-6 py-16">
        <SectionHead
          eyebrow="Explore"
          title="Shop by Category"
          sub="Everything you need, in one place"
        />
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/search?category=${cat.label.toLowerCase()}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 border border-transparent hover:border-gray-100 transition-all duration-300 cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
                style={{ background: cat.bg }}
              >
                {cat.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BENTO COLLECTION GRID ── */}
      <section className="reveal max-w-7xl mx-auto px-6 pb-16">
        <SectionHead
          eyebrow="Featured"
          title="Curated Collections"
          sub="Handpicked by our style editors"
          cta="All Collections"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[420px]">
          {/* Hero card */}
          <div
            className="sm:col-span-2 md:row-span-2 bento noise cursor-pointer group min-h-[280px] md:min-h-0"
            style={{
              background:
                "linear-gradient(135deg,#3d0000 0%,#880808 55%,#b91c1c 100%)",
            }}
          >
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full blur-3xl bg-white/5" />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <span className="text-5xl block mb-3 drop-shadow-xl group-hover:scale-105 transition-transform duration-500">
                💻
              </span>
              <h3 className="text-white font-black text-2xl mb-1">
                Exclusive Tech
              </h3>
              <p className="text-white/50 text-sm mb-4">
                Premium electronics, handpicked
              </p>
              <Link href={"search?category=electronics"}>
              <button className="flex items-center gap-2 text-white text-sm font-bold group/btn">
                Shop Now{" "}
                <ArrowRight
                  size={14}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
              </Link>
            </div>
          </div>
          {/* Fashion */}
          <div
            className="bento noise cursor-pointer group min-h-[160px] md:min-h-0"
            style={{
              background: "linear-gradient(135deg,#4c1d95 0%,#7c3aed 100%)",
            }}
          >
            <Link href={"search?category=fashion"} className="block">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-3xl block mb-1.5 group-hover:scale-110 transition-transform duration-300">
                🧣
              </span>
              <h3 className="text-white font-bold text-sm">Designer Fashion</h3>
              <p className="text-white/45 text-[11px] mt-0.5">Curated styles</p>
            </div>
            </Link>
          </div>

          {/* Home */}
          <div
            className="bento noise cursor-pointer group min-h-[160px] md:min-h-0"
            style={{
              background: "linear-gradient(135deg,#064e3b 0%,#059669 100%)",
            }}
          >
            <Link href={"search?category=home"} className="block">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-3xl block mb-1.5 group-hover:scale-110 transition-transform duration-300">
                🪑
              </span>
              <h3 className="text-white font-bold text-sm">Home Luxe</h3>
              <p className="text-white/45 text-[11px] mt-0.5">
                Transform your space
              </p>
            </div>
            </Link>
          </div>
          {/* Beauty */}
          <div
            className="bento noise cursor-pointer group min-h-[160px] md:min-h-0"
            style={{
              background: "linear-gradient(135deg,#701a75 0%,#ec4899 100%)",
            }}
          >

            <Link href={"search?category=beauty"} className="block">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-3xl block mb-1.5 group-hover:scale-110 transition-transform duration-300">
                🌸
              </span>
              <h3 className="text-white font-bold text-sm">
                Beauty & Self-Care
              </h3>
              <p className="text-white/45 text-[11px] mt-0.5">
                Glow up with top brands
              </p>
            </div>
            </Link>
          </div>
          {/* Sports */}
          <div
            className="bento noise cursor-pointer group min-h-[160px] md:min-h-0"
            style={{
              background: "linear-gradient(135deg,#78350f 0%,#d97706 100%)",
            }}
          >

            <Link href={"search?category=toys"} className="block">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-3xl block mb-1.5 group-hover:scale-110 transition-transform duration-300">
                🏋️
              </span>
              <h3 className="text-white font-bold text-sm">Sports & Fitness</h3>
              <p className="text-white/45 text-[11px] mt-0.5">
                Gear up for the season
              </p>
            </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FLASH DEALS ── */}
      <section className="section-reveal bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead eyebrow="Limited Time" title="Flash Deals" sub="Refreshes every hour — fast stock depletion!" cta="All Deals" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {(data as any)?.getHomePage?.flashDeals?.map((d: any) => <FlashCard key={d.id} d={d} />)}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ROW ── */}
      <section className="reveal max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-5">
        {/* Wide sale */}
        <div
          className="md:col-span-7 relative rounded-3xl overflow-hidden noise cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg,#0f0505 0%,#3d0000 60%,#0f0505 100%)",
            minHeight: "220px",
          }}
        >
          <div className="absolute -right-10 -top-10 w-60 h-60 bg-[#880808]/15 rounded-full blur-3xl" />
          <div className="relative p-8 h-full flex flex-col justify-between">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full text-white/80 text-xs font-bold px-3 py-1.5 w-fit">
              <Percent size={11} /> Exclusive Offer
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-1">
                Up to <span className="text-gradient-gold">70% OFF</span>
              </h2>
              <p className="text-white/35 text-sm mb-5">
                Electronics · Fashion · Home · Beauty
              </p>
              <Link href={"search?category=toys"} className="block">
              <button className="inline-flex items-center gap-2 bg-white text-[#880808] font-bold text-sm px-6 py-3 rounded-2xl hover:scale-105 transition-transform shadow-lg">
                Shop the Sale <ArrowRight size={14} />
              </button>
              </Link>
            </div>
          </div>
        </div>
        {/* Two stacked */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <div
            className="relative rounded-2xl overflow-hidden flex-1 noise cursor-pointer min-h-[160px] md:min-h-0"
            style={{
              background: "linear-gradient(135deg,#1e1b4b 0%,#4338ca 100%)",
            }}
          >
            <div className="p-6 h-full flex items-center justify-between">
              <Link href={"search?category=fashion"} className="block">
              <div>
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">
                  New Season
                </p>
                <h3 className="text-white font-black text-xl leading-tight mb-3">
                  Fashion
                  <br />
                  Favourites
                </h3>
                <button className="text-white/60 hover:text-white text-xs font-bold flex items-center gap-1">
                  Explore <ChevronRight size={13} />
                </button>
              </div>
              </Link>
              <span className="text-6xl opacity-80">👗</span>
            </div>
          </div>
          <div
            className="relative rounded-2xl overflow-hidden flex-1 noise cursor-pointer min-h-[160px] md:min-h-0"
            style={{
              background: "linear-gradient(135deg,#064e3b 0%,#059669 100%)",
            }}
          >
            <div className="p-6 h-full flex items-center justify-between">
              <Link href={"/search?category=home"} className="block">
              <div>
                <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">
                  Bestsellers
                </p>
                <h3 className="text-white font-black text-xl leading-tight mb-3">
                  Home &<br />
                  Essentials
                </h3>
                <button className="text-white/60 hover:text-white text-xs font-bold flex items-center gap-1">
                  Shop Now <ChevronRight size={13} />
                </button>
              </div>
              </Link>
              <span className="text-6xl opacity-80">🪴</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING PRODUCTS ── */}
      <section className="reveal bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            eyebrow="Trending Now"
            title="What's Hot Right Now"
            sub="Products everyone is talking about"
            cta="View All Products"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {(data as any)?.getHomePage?.trendingProducts?.map((p: any) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER CTA ── */}
      <section className="reveal max-w-7xl mx-auto px-6 py-16">
        <div
          className="relative rounded-3xl overflow-hidden noise"
          style={{
            background:
              "linear-gradient(135deg,#09090b 0%,#18181b 50%,#09090b 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 70% 50%,rgba(136,8,8,0.22) 0%,transparent 70%)",
            }}
          />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/10 rounded-full text-white/45 text-xs font-bold uppercase tracking-widest px-4 py-2 mb-6">
                <Sparkles size={11} className="text-[#880808]" /> Zynora for
                Business
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                Grow Your Business
                <br />
                <span className="text-gradient-brand">With Zynora.</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-8">
                Reach 2M+ customers across India. Zero listing fees. Powerful
                seller dashboard. Start in under 10 minutes.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  {
                    icon: <Zap size={16} className="text-[#880808]" />,
                    label: "Quick Setup",
                    sub: "Under 10 min",
                  },
                  {
                    icon: <TrendingUp size={16} className="text-[#880808]" />,
                    label: "Analytics",
                    sub: "Real-time data",
                  },
                  {
                    icon: <ShieldCheck size={16} className="text-[#880808]" />,
                    label: "Payouts",
                    sub: "Every Sunday",
                  },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                      {f.icon}
                    </div>
                    <p className="text-white text-xs font-bold">{f.label}</p>
                    <p className="text-white/35 text-[11px]">{f.sub}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Link
                href={"/seller/auth/signin"}
                  className="flex items-center gap-2 bg-[#880808] hover:bg-[#6d0606] text-white font-bold px-7 py-3.5 rounded-2xl hover:scale-105 transition-all text-sm"
                  style={{ boxShadow: "0 8px 30px rgba(136,8,8,0.30)" }}
                >
                  Start Selling <ArrowRight size={15} />
                </Link>
                <button className="text-white/40 hover:text-white font-semibold text-sm transition-colors">
                  Learn More →
                </button>
              </div>
            </div>
            {/* Dashboard preview */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative glass rounded-3xl p-6 w-64">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-4 font-bold">
                  Seller Dashboard
                </p>
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Revenue",
                      value: "₹84,290",
                      change: "+12.4%",
                      up: true,
                    },
                    {
                      label: "Orders",
                      value: "1,432",
                      change: "+8.1%",
                      up: true,
                    },
                    {
                      label: "Return Rate",
                      value: "2.3%",
                      change: "-0.4%",
                      up: false,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <div>
                        <p className="text-white/30 text-[10px]">{row.label}</p>
                        <p className="text-white font-bold text-sm">
                          {row.value}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.up ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"}`}
                      >
                        {row.change}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-1 items-end h-14">
                  {[35, 60, 45, 80, 50, 95, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm origin-bottom"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 5 ? "#880808" : "rgba(255,255,255,0.10)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-white/25 text-[10px] mt-2 text-center">
                  Last 7 days revenue
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="reveal bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            eyebrow="Reviews"
            title="Loved by Millions"
            sub="Real customers. Real stories."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((t) => (
              <div
                key={t.name}
                className="relative bg-[#FAFAFA] hover:bg-white rounded-3xl p-7 border border-gray-100 hover:border-gray-200 hover:shadow-xl card-lift transition-all duration-300"
              >
                <div className="absolute top-5 right-6 text-6xl font-black text-gray-100 leading-none select-none">
                  "
                </div>
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 relative">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 shadow"
                    style={{
                      background: `linear-gradient(135deg,${t.color},${t.color}99)`,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.loc}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="reveal max-w-7xl mx-auto px-6 py-16">
        <div
          className="relative rounded-3xl overflow-hidden noise text-center py-16 px-6"
          style={{
            background: "linear-gradient(135deg,#fff5f5 0%,#fef2f2 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 70% at 50% 100%,rgba(136,8,8,0.07),transparent)",
            }}
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#880808] to-rose-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-red-200">
              <Bell size={22} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Exclusive Deals, Just for You
            </h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
              Subscribe and get early access to flash sales, new arrivals, and
              member-only discounts.
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-6 py-3 rounded-2xl text-sm animate-bounce-in">
                <Check size={16} /> You&apos;re subscribed! 🎉
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#880808]/20 focus:border-[#880808] transition-all shadow-sm"
                />
                <button
                  type="submit"
                  className="bg-[#880808] hover:bg-[#6d0606] text-white font-bold px-7 py-3.5 rounded-2xl flex items-center gap-2 justify-center hover:scale-105 transition-all whitespace-nowrap text-sm"
                  style={{ boxShadow: "0 6px 24px rgba(136,8,8,0.22)" }}
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            )}
            <p className="text-xs text-gray-400 mt-4">
              No spam. Unsubscribe anytime. 🤞
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080808] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#880808,#c53030)",
                }}
              >
                <span className="text-lg">🏪</span>
              </div>
              <span className="text-xl font-black tracking-tight">Zynora</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed mb-6">
              India&apos;s fastest-growing e-commerce marketplace, connecting
              buyers and sellers seamlessly.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: "𝕏", label: "Twitter" },
                { icon: "in", label: "LinkedIn" },
                { icon: "f", label: "Facebook" },
                { icon: "▶", label: "YouTube" },
              ].map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl border border-white/8 hover:border-[#880808] hover:bg-[#880808]/20 font-bold text-white/30 hover:text-white transition-all text-xs flex items-center justify-center"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>
          {/* Links */}
          {[
            {
              title: "Shop",
              links: [
                "Electronics",
                "Fashion",
                "Home & Living",
                "Beauty & Health",
                "Sports",
              ],
            },
            {
              title: "Sellers",
              links: [
                "Become a Seller",
                "Dashboard",
                "Policies",
                "Commission",
                "Support",
              ],
            },
            {
              title: "Support",
              links: [
                "Help Center",
                "Track Order",
                "Returns",
                "Report Issue",
                "Contact Us",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Press", "Blog", "Sustainability"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-white text-[11px] font-black uppercase tracking-widest mb-5">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/30 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div className="border-t border-white/5" />
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <p>© 2025 Zynora Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((l) => (
              <a
                key={l}
                href="#"
                className="hover:text-white/45 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span>Pay with</span>
            <div className="flex gap-1.5 text-base">
              {["💳", "📱", "🏦", "💰", "🔐"].map((icon, i) => (
                <span
                  key={i}
                  title={["Card", "UPI", "Net Banking", "COD", "EMI"][i]}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
