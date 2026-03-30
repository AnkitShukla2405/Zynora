"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  Heart,
  Package,
  ShieldCheck,
  Star,
  ChevronRight,
  LogOut,
  Sparkles,
  Crown,
  Bell,
  Lock,
  Wallet,
  RotateCcw,
  Truck,
  Check,
  X,
  Plus,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export const GET_USER_INFO = gql`
  query GetUserInfo {
    getUserInfo {
      userData {
        name
        email
        memberSince
        totalOrders
      }
      userAddresses {
        id
        tag
        default
        line1
        line2
      }
    }
  }
`;

type DeleteAddressResponse = {
  addressDelete: {
    success: boolean;
    message: string;
  };
};

type GetUserInfoResponse = {
  getUserInfo: {
    userData: {
      name: string;
      email: string;
      memberSince: string;
      totalOrders: number;
    };
    userAddresses: Address[];
  };
};

type Address = {
  id: string;
  tag: string;
  default: boolean;
  line1: string;
  line2?: string;
};

const DELETE_ADDRESS = gql`
  mutation AddressDelete($id: ID!) {
    addressDelete(id: $id) {
      success
      message
    }
  }
`;





const WISHLIST_PREVIEW = [
  {
    name: "Sony WH-1000XM5",
    price: "₹24,999",
    emoji: "🎧",
    discount: "29% OFF",
  },
  {
    name: "MacBook Air M3",
    price: "₹99,900",
    emoji: "💻",
    discount: "13% OFF",
  },
  {
    name: "Nike Air Max 270",
    price: "₹7,495",
    emoji: "👟",
    discount: "42% OFF",
  },
];

const QUICK_LINKS = [
  {
    icon: <Package size={18} />,
    label: "My Orders",
    sub: "Track, return, or buy again",
    href: "/orders",
    color: "blue",
  },
  {
    icon: <Heart size={18} />,
    label: "Wishlist",
    sub: "3 items saved",
    href: "#",
    color: "rose",
  },
  {
    icon: <Wallet size={18} />,
    label: "Zynora Pay",
    sub: "Manage balance & UPI",
    href: "#",
    color: "emerald",
  },
  {
    icon: <RotateCcw size={18} />,
    label: "Returns",
    sub: "Active: 1 in progress",
    href: "#",
    color: "amber",
  },
];

const STATS = [
  {
    label: "Orders Placed",
    value: "38",
    icon: <Package size={16} />,
    color: "#880808",
  },
  {
    label: "Wishlist Items",
    value: "3",
    icon: <Heart size={16} />,
    color: "#be185d",
  },
];

/* ─── Sub-components ─────────────────────────────────────── */
function StatCard({ stat }: { stat: (typeof STATS)[0] }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
        style={{ background: `${stat.color}15`, color: stat.color }}
      >
        {stat.icon}
      </div>
      <p className="text-lg font-black text-gray-900">{stat.value}</p>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center leading-tight mt-0.5">
        {stat.label}
      </p>
    </div>
  );
}

function AddressCard({
  addr,
  onDelete,
}: {
  addr: Address;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${addr.default ? "border-[#880808]/20 bg-red-50/30" : "border-gray-100 bg-white"}`}
    >
      {addr.default && (
        <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider text-[#880808] bg-red-100 px-2 py-0.5 rounded-full">
          Default
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
          <MapPin size={16} className="text-[#880808]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 mb-0.5">{addr.tag}</p>
          <p className="text-xs text-gray-500 font-medium">{addr.line1}</p>
          <p className="text-xs text-gray-400">{addr.line2}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button className="flex items-center gap-1.5 text-xs font-bold text-[#880808] hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors">
          <Edit3 size={12} /> Edit
        </button>
        {!addr.default && (
          <button
            onClick={() => onDelete(addr.id)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            <X size={12} /> Remove
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ProfilePage() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "addresses" | "settings"
  >("overview");
  const [notifs, setNotifs] = useState({
    orders: true,
    deals: true,
    returns: false,
  });

  const [deleteAddressMutation] = useMutation<DeleteAddressResponse>(DELETE_ADDRESS, {
    refetchQueries: [{ query: GET_USER_INFO }],
});
  
  const { data, loading, error } = useQuery<GetUserInfoResponse>(GET_USER_INFO);
  if (loading) return <Loader />;

  async function deleteAddress(id: string) {
    const {data} = await deleteAddressMutation({
      variables: {id}
    })

     if (data?.addressDelete?.success) {
      toast.success(data?.addressDelete?.message)
     }else {
      toast.error(data?.addressDelete?.message || "Something went wrong,")
     }
  }

  const userData = data?.getUserInfo?.userData;
const userAddresses = data?.getUserInfo?.userAddresses || [];

  const tierColors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    Gold: {
      bg: "from-amber-400 to-yellow-300",
      text: "text-amber-900",
      border: "border-amber-200",
    },
    Silver: {
      bg: "from-gray-400 to-gray-300",
      text: "text-gray-800",
      border: "border-gray-200",
    },
    Platinum: {
      bg: "from-indigo-400 to-purple-400",
      text: "text-white",
      border: "border-indigo-200",
    },
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0505] via-[#1f0808] to-[#0f0505] noise pb-28">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
          style={{ background: "rgba(136,8,8,0.7)" }}
        />
        <div
          className="absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20"
          style={{ background: "rgba(220,38,38,0.4)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#880808] to-rose-500 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-red-900/40 border-4 border-white/5">
                <User width={48} height={48} />
              </div>
              <button className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-[#880808] hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                <Camera size={16} />
              </button>
              {/* Online dot */}
              <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#1f0808]" />
            </div>

            {/* Name & Tier */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {userData?.name}
              </h1>
              <p className="text-white/40 text-sm font-medium mt-0.5">
                Member since {userData?.memberSince} · {userData?.totalOrders} orders
              </p>
            </div>

            {/* Logout - top right */}
            <button className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats + Tabs ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-14 relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
  {
    label: "Orders Placed",
    value: userData?.totalOrders,
    icon: <Package size={16} />,
    color: "#880808",
  },
  {
    label: "Wishlist Items",
    value: "3",
    icon: <Heart size={16} />,
    color: "#be185d",
  },
].map((s) => (
            <StatCard key={s.label} stat={{
              ...s,
              value: String(s.value ?? 0),
            }} />
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 w-fit">
          {(["overview", "addresses", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${activeTab === tab ? "bg-[#880808] text-white shadow-md shadow-red-900/20" : "text-gray-500 hover:text-gray-800"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-3 gap-6 pb-16 animate-fade-in">
            {/* Left: Personal Info */}
            <div className="md:col-span-2 space-y-6">
              {/* Personal Details Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-black text-gray-900">
                    Personal Information
                  </h2>
                  <button
                    onClick={() =>
                      setEditingField(editingField ? null : "info")
                    }
                    className="flex items-center gap-1.5 text-xs font-bold text-[#880808] hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    {editingField === "info" ? (
                      <>
                        <Check size={12} /> Save
                      </>
                    ) : (
                      <>
                        <Edit3 size={12} /> Edit
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: <User size={16} />,
                      label: "Full Name",
                      value: userData?.name,
                      field: "name",
                    },
                    {
                      icon: <Mail size={16} />,
                      label: "Email Address",
                      value: userData?.email,
                      field: "email",
                    },
                  ].map((row) => (
                    <div key={row.field} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[#880808] shrink-0">
                        {row.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                          {row.label}
                        </p>
                        {editingField === "info" ? (
                          <input
                            defaultValue={row.value}
                            className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#880808] focus:ring-2 focus:ring-red-50 transition-all"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {row.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-black text-gray-900 mb-4">
                  Quick Access
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUICK_LINKS.map((link) => {
                    const colorMap: Record<string, string> = {
                      blue: "#1d4ed8",
                      rose: "#be185d",
                      emerald: "#059669",
                      amber: "#b45309",
                    };
                    const bgMap: Record<string, string> = {
                      blue: "#eff6ff",
                      rose: "#fff1f2",
                      emerald: "#ecfdf5",
                      amber: "#fffbeb",
                    };
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group cursor-pointer"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                          style={{
                            background: bgMap[link.color],
                            color: colorMap[link.color],
                          }}
                        >
                          {link.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 group-hover:text-[#880808] transition-colors">
                            {link.label}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {link.sub}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-gray-300 group-hover:text-[#880808] group-hover:translate-x-1 transition-all shrink-0"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">

              {/* Wishlist Preview */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-gray-900">Wishlist</h3>
                  <button className="text-[11px] font-bold text-[#880808] hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {WISHLIST_PREVIEW.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate group-hover:text-[#880808] transition-colors">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-gray-900">
                            {item.price}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            {item.discount}
                          </span>
                        </div>
                      </div>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                        <Heart size={14} className="text-rose-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl border border-[#880808]/20 text-[#880808] text-xs font-bold hover:bg-red-50 transition-colors">
                  Add More to Wishlist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Addresses Tab ── */}
        {activeTab === "addresses" && (
          <div className="pb-16 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 font-medium">
                {userAddresses.length} saved address
                {userAddresses.length !== 1 ? "es" : ""}
              </p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#880808] text-white text-xs font-bold hover:bg-[#6d0606] transition-colors shadow-md shadow-red-900/20 hover:scale-105 active:scale-95">
                <Plus size={14} /> Add Address
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {data?.getUserInfo?.userAddresses?.map((addr) => (
                <AddressCard
                  key={addr.id}
                  addr={addr}
                  onDelete={deleteAddress}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === "settings" && (
          <div className="pb-16 space-y-6 animate-fade-in">
            {/* Notifications */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Bell size={18} className="text-[#880808]" />
                <h2 className="text-base font-black text-gray-900">
                  Notification Preferences
                </h2>
              </div>
              {[
                {
                  key: "orders" as const,
                  label: "Order Updates",
                  sub: "Shipping, delivery, and cancellations",
                },
                {
                  key: "deals" as const,
                  label: "Deals & Offers",
                  sub: "Flash sales, coupons, and exclusive deals",
                },
                {
                  key: "returns" as const,
                  label: "Return Status",
                  sub: "Updates on your return requests",
                },
              ].map((n) => (
                <div
                  key={n.key}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-800">{n.label}</p>
                    <p className="text-xs text-gray-400">{n.sub}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))
                    }
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notifs[n.key] ? "bg-[#880808]" : "bg-gray-200"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${notifs[n.key] ? "left-7" : "left-1"}`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Security */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Lock size={18} className="text-[#880808]" />
                <h2 className="text-base font-black text-gray-900">Security</h2>
              </div>
              {[
                { label: "Change Password", sub: "Last changed 3 months ago" },
                {
                  label: "Two-Factor Authentication",
                  sub: "Add an extra layer of security",
                },
                { label: "Login Activity", sub: "See all active sessions" },
              ].map((row) => (
                <button
                  key={row.label}
                  className="w-full flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 group text-left"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-[#880808] transition-colors">
                      {row.label}
                    </p>
                    <p className="text-xs text-gray-400">{row.sub}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-[#880808] group-hover:translate-x-1 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6">
              <h2 className="text-base font-black text-red-600 mb-4">
                Danger Zone
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-red-100 hover:bg-red-50 transition-colors group text-left">
                  <div>
                    <p className="text-sm font-bold text-red-600">
                      Delete Account
                    </p>
                    <p className="text-xs text-gray-400">
                      Permanently remove your account and all data
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-red-300 group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </button>
              </div>
            </div>

            {/* Logout */}
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors hover:shadow-md hover:shadow-red-50">
              <LogOut size={18} /> Sign Out of Zynora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
