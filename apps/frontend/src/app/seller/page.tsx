"use client"
import {
  Package,
  ShoppingCart,
  AlertCircle,
  Activity,
  Plus,
  ArrowRight,
  ClipboardList
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Loader from "@/components/Loader";
import UnauthorizedSeller from "@/components/unauthorizedSeller/Unauthorized";

type MetricsResponse = {
  getProductMetrics: {
    success: boolean;
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    pendingOrders: number;
  };
};

  const GET_METRICS_DATA = gql`
  query GetMetricsData {
    getProductMetrics {
      success
      totalProducts
      activeProducts
      outOfStock
      pendingOrders
    }
  }
  `



export default function DashboardHome() {

 
  const {data, loading, error} = useQuery<MetricsResponse>(GET_METRICS_DATA)


if (loading) {
  return <Loader />
}

  if (!data) return <UnauthorizedSeller redirectLink={"/sellerRegistration"} />; 


  const {
    totalProducts,
    activeProducts,
    outOfStock,
    pendingOrders
  } = data.getProductMetrics



  

  const metrics = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Active Products",
      value: activeProducts,
      icon: Activity,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: ShoppingCart,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <div className="text-3xl font-bold mt-2 text-gray-900">{metric.value}</div>
              </div>
              <div className={`p-3 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/seller/products/new">
            <Button className="gap-2 h-11 px-6">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>

          <Link href="/seller/orders">
            <Button variant="outline" className="gap-2 h-11 px-6 bg-white">
              <ShoppingCart className="w-4 h-4" />
              View Pending Orders
            </Button>
          </Link>

          <Link href="/inventory">
            <Button variant="outline" className="gap-2 h-11 px-6 bg-white">
              <ClipboardList className="w-4 h-4" />
              Update Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section (Optional but good for emptiness) */}
      <div className="pt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground py-8 text-center italic">
              No recent activity to display.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
