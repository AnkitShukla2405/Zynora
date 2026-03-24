"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Star,
  ShoppingCart,
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Download,
  MessageCircle,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Loader from "@/components/Loader";

type GetOrdersResponse = {
  getUserOrders: Order[];
};

type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

interface OrderItem {
  name: string;
  brand: string;
  image: string;
  qty: number;
  size?: string;
  color?: string;
  price: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  date: string;
  estimatedDelivery?: string;
  deliveredOn?: string;
  address: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  trackingId?: string;
}

type Address = {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

const GET_ORDERS = gql`
  query GetOrders {
    getUserOrders {
      id
      status
      date
      total
      paymentMethod
      trackingId
      address
      estimatedDelivery
      deliveredOn
      items {
        name
        brand
        image
        qty
        price
        size
        color
      }
    }
  }
`;

const STATUS_CFG: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
    step: number;
  }
> = {
  processing: {
    label: "Processing",
    icon: <Clock size={12} />,
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    step: 1,
  },
  shipped: {
    label: "Shipped",
    icon: <Truck size={12} />,
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    step: 2,
  },
  delivered: {
    label: "Delivered",
    icon: <CheckCircle size={12} />,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    step: 3,
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle size={12} />,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
    step: 0,
  },
  returned: {
    label: "Returned",
    icon: <RotateCcw size={12} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    step: 0,
  },
};

const TRACK_STEPS = [
  { label: "Order Placed", icon: <ShoppingCart size={13} />, step: 1 },
  { label: "Shipped", icon: <Truck size={13} />, step: 2 },
  { label: "Out for Delivery", icon: <MapPin size={13} />, step: 2.5 },
  { label: "Delivered", icon: <CheckCircle size={13} />, step: 3 },
];

function TrackBar({ status }: { status: OrderStatus }) {
  if (status === "cancelled" || status === "returned") return null;
  const cur = STATUS_CFG[status].step;
  return (
    <div className="flex items-center mt-4 overflow-x-auto pb-1">
      {TRACK_STEPS.map((s, i) => {
        const done = cur >= s.step;
        const active = Math.floor(cur) === Math.floor(s.step) && cur < 3;
        return (
          <div key={s.label} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${done ? "bg-[#880808] text-white shadow-md shadow-red-900/20" : "bg-gray-100 text-gray-400"} ${active ? "ring-4 ring-red-100 animate-pulse" : ""}`}
              >
                {s.icon}
              </div>
              <p
                className={`text-[9px] font-bold uppercase tracking-wide text-center whitespace-nowrap max-w-[60px] leading-tight ${done ? "text-gray-700" : "text-gray-300"}`}
              >
                {s.label}
              </p>
            </div>
            {i < TRACK_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded-full ${done && cur > s.step ? "bg-[#880808]" : "bg-gray-100"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [rated, setRated] = useState(0);
  const cfg = STATUS_CFG[order.status];
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1" style={{ background: cfg.color }} />
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
              Order ID
            </p>
            <p className="text-sm font-black text-gray-900 font-mono">
              {order.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border"
              style={{
                color: cfg.color,
                background: cfg.bg,
                borderColor: cfg.border,
              }}
            >
              {cfg.icon} {cfg.label}
            </span>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition-colors"
            >
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {order.items.slice(0, 3).map((it, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-xl bg-gray-50 border-2 border-white flex items-center justify-center text-2xl shadow-sm"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${it.image}`}
                  alt={it.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 line-clamp-1">
              {order.items[0].name}
              {order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}
            </p>
            <p className="text-xs text-gray-400">
              {order.date} · {order.paymentMethod}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-gray-400 font-medium">Total</p>
            <p className="text-base font-black text-gray-900">
              ₹{order.total.toLocaleString()}
            </p>
          </div>
        </div>
        {order.status === "shipped" && order.estimatedDelivery && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
            <Truck size={14} className="text-blue-600 shrink-0" />
            <p className="text-xs font-semibold text-blue-700">
              Expected by{" "}
              <span className="font-black">{order.estimatedDelivery}</span>
            </p>
            {order.trackingId && (
              <span className="ml-auto text-[10px] font-bold text-blue-500 font-mono">
                {order.trackingId}
              </span>
            )}
          </div>
        )}
        {order.status === "delivered" && order.deliveredOn && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
            <CheckCircle size={14} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-700">
              Delivered on{" "}
              <span className="font-black">{order.deliveredOn}</span>
            </p>
          </div>
        )}
        {order.status === "processing" && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
            <Clock size={14} className="text-amber-600 shrink-0" />
            <p className="text-xs font-semibold text-amber-700">
              Estimated dispatch by{" "}
              <span className="font-black">{order.estimatedDelivery}</span>
            </p>
          </div>
        )}
        <TrackBar status={order.status} />
      </div>

      {open && (
        <div className="border-t border-gray-50 px-5 pb-5 pt-4 space-y-4 animate-fade-in">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
              Items
            </p>
            <div className="space-y-3">
              {order.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border-2 border-white flex items-center justify-center shadow-sm overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}/${it.image}`}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wide text-[#880808]">
                      {it.brand}
                    </p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {it.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] text-gray-400 font-medium">
                      {it.color && <span>{it.color}</span>}
                      {it.size && (
                        <>
                          <span>·</span>
                          <span>Size {it.size}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>Qty {it.qty}</span>
                    </div>
                  </div>
                  <p className="text-sm font-black text-gray-900">
                    ₹{it.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#880808] mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">
                  Delivery Address
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {order.address}
                </p>
              </div>
            </div>
          </div>
          {order.status === "delivered" && (
            <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/50">
              <p className="text-sm font-bold text-gray-800 mb-3">
                Rate your experience
              </p>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRated(s)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      size={24}
                      className={
                        s <= rated
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
                {rated > 0 && (
                  <span className="ml-2 text-xs font-bold text-amber-600">
                    Thanks!
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {order.status === "delivered" && (
              <>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#880808] text-white text-xs font-bold hover:bg-[#6d0606] transition-colors shadow-md shadow-red-900/20">
                  <ShoppingCart size={13} /> Buy Again
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors">
                  <RotateCcw size={13} /> Return
                </button>
              </>
            )}
            {order.status === "shipped" && (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                <Truck size={13} /> Track Shipment
              </button>
            )}
            {order.status === "processing" && (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors">
                <XCircle size={13} /> Cancel Order
              </button>
            )}
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors">
              <Download size={13} /> Invoice
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors">
              <MessageCircle size={13} /> Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery<GetOrdersResponse>(GET_ORDERS);

  console.log("ORDERS DATA", data);
  console.log("ORDERS ERROR", error);

  if (loading) return <Loader />;

  if (error) return <p>Error loading orders</p>;

const ORDERS = (data?.getUserOrders || []).map(o => ({
  ...o,
  status: o.status.toLowerCase() as OrderStatus
}));

  const TABS: { key: OrderStatus | "all"; label: string }[] = [
    { key: "all", label: "All Orders" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
    { key: "returned", label: "Returned" },
  ];

  const filtered = ORDERS.filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const matchSearch =
      !search.trim() ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.brand.toLowerCase().includes(search.toLowerCase()),
      );
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <section className="relative bg-gradient-to-br from-[#0f0505] via-[#1f0808] to-[#0f0505] noise py-12 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-25"
          style={{ background: "rgba(136,8,8,0.8)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
              <Package size={20} className="text-red-300" />
            </div>
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                Account
              </p>
              <h1 className="text-2xl font-black text-white">My Orders</h1>
            </div>
          </div>
          <p className="text-white/35 text-sm ml-[52px]">
            {ORDERS.length} total orders · ₹
            {ORDERS.reduce((a, o) => a + o.total, 0).toLocaleString()} spent
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, product, or brand..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#880808] focus:ring-4 focus:ring-red-50 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-gray-300 hover:shadow-md transition-all shrink-0">
            <Filter size={15} /> Filters
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 mb-6">
          {TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? ORDERS.length
                : ORDERS.filter((o) => o.status === tab.key).length;
            if (count === 0 && tab.key !== "all") return null;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-[#880808] text-white shadow-md" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-800"}`}
              >
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-black text-gray-800 mb-2">
              No orders found
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {search
                ? `No results for "${search}"`
                : "You haven't placed any orders yet."}
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#880808] text-white text-sm font-bold hover:bg-[#6d0606] transition-colors shadow-lg shadow-red-900/20"
            >
              Start Shopping <ArrowRight size={15} />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-8 flex items-center justify-between p-5 rounded-3xl bg-gradient-to-br from-[#0f0505] to-[#1f0808] noise overflow-hidden relative">
            <div
              className="absolute -top-8 right-0 w-48 h-48 rounded-full blur-3xl opacity-20"
              style={{ background: "rgba(136,8,8,0.8)" }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-red-300" />
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Zynora Assurance
                </p>
              </div>
              <p className="text-white font-bold text-sm">
                Need help with an order?
              </p>
              <p className="text-white/40 text-xs">
                Our support team is available 24/7
              </p>
            </div>
            <a
              href="/support"
              className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#880808] text-white text-xs font-bold hover:bg-[#6d0606] transition-colors shadow-lg shrink-0"
            >
              Get Help <ArrowRight size={13} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
