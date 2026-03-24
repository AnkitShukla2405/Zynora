"use client"
import React from "react";
import { Search, Filter, Download, Eye, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader";



type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    city: string;
    state: string;
  };
  productSummary: string;
  totalQuantity: number;
  total: number;
  currency: string;
  paymentStatus: string;
  status: string;
};

type OrdersResponse = {
  orders: {
    orders: Order[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
};

const GET_ORDERS = gql`
  query GetOrders($filter: OrderFilterInput) {
    orders(filter: $filter) {
      orders {
        id
        orderNumber
        createdAt
        customer {
          name
          city
          state
        }
        productSummary
        totalQuantity
        total
        currency
        paymentStatus
        status
      }
      totalCount
      currentPage
      totalPages
    }
  }
`;





export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    search: searchQuery,
    page: 1,
    limit: 10,
    status: "ALL",
  });

  const [getOrders, { data, loading, error }] = useLazyQuery<OrdersResponse>(GET_ORDERS);

  useEffect(() => {
  const timer = setTimeout(() => {
    setFilter((prev) => ({
      ...prev,
      search: searchQuery,
      page: 1,
    }));
  }, 600);

  return () => clearTimeout(timer);
}, [searchQuery]);


useEffect(() => {
  getOrders({
    variables: { filter },
  });
}, [filter]);



  if(error) console.log(error)

  if (loading) return <Loader/>;

  const orders = data?.orders?.orders || [];
  const totalPages = data?.orders?.totalPages ?? 1;

  console.log(orders)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your customer orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-white">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search by Order Number..."
            className="w-full pl-10 h-10 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Filter Tabs matching Schema orderStatus */}
        <div className="flex bg-gray-100 p-1 rounded-md overflow-x-auto hide-scrollbar">
          <button onClick={() => setFilter((prev) => ({
            ...prev,
            status: "ALL"
          }))} className={`px-4 py-1.5 text-sm font-medium  whitespace-nowrap ${
            filter.status === "ALL"
            ? "bg-white shadow-sm rounded-md text-gray-900"
            : "text-gray-500 hover:text-gray-900"
          }`}>
            All
          </button>
          <button onClick={() => setFilter((prev) => ({
            ...prev,
            status: "PLACED"
          }))} className={`px-4 py-1.5 text-sm font-medium  whitespace-nowrap ${
            filter.status === "PLACED"
            ? "bg-white shadow-sm rounded-md text-gray-900"
            : "text-gray-500 hover:text-gray-900"
          }`}>
            Placed
          </button>
          <button onClick={() => setFilter((prev) => ({
            ...prev,
            status: "PROCESSING"
          }))} className={`px-4 py-1.5 text-sm font-medium  whitespace-nowrap ${
            filter.status === "PROCESSING"
            ? "bg-white shadow-sm rounded-md text-gray-900"
            : "text-gray-500 hover:text-gray-900"
          }`}>
            Processing
          </button>
          <button onClick={() => setFilter((prev) => ({
            ...prev,
            status: "SHIPPED"
          }))} className={`px-4 py-1.5 text-sm font-medium  whitespace-nowrap ${
            filter.status === "SHIPPED"
            ? "bg-white shadow-sm rounded-md text-gray-900"
            : "text-gray-500 hover:text-gray-900"
          }`}>
            Shipped
          </button>
          <button onClick={() => setFilter((prev) => ({
            ...prev,
            status: "DELIVERED"
          }))} className={`px-4 py-1.5 text-sm font-medium  whitespace-nowrap ${
            filter.status === "DELIVERED"
            ? "bg-white shadow-sm rounded-md text-gray-900"
            : "text-gray-500 hover:text-gray-900"
          }`}>
            Delivered
          </button>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-gray-900">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {order.customer.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.customer.city},{" "}
                        {order.customer.state}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={order.productSummary}
                  >
                    {order.productSummary}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.totalQuantity}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {order.total}
                  </TableCell>

                  {/* Payment Status Badge */}
                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === "paid"
                          ? "success"
                          : order.paymentStatus === "failed"
                            ? "destructive"
                            : "warning"
                      }
                      className="capitalize flex w-fit items-center gap-1"
                    >
                      {order.paymentStatus === "paid" && (
                        <CreditCard className="w-3 h-3" />
                      )}
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>

                  {/* Order Status Badge */}
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "DELIVERED"
                          ? "success"
                          : order.status === "CANCELLED" ||
                              order.status === "RETURNED"
                            ? "destructive"
                            : order.status === "SHIPPED"
                              ? "default"
                              : order.status === "PROCESSING"
                                ? "default"
                                : "secondary"
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-primary hover:text-primary/80"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Footer Pagination */}
      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
        <Button  onClick={() => setFilter((prev) => ({
            ...prev,
            page: prev.page - 1,
        }))} variant="outline" size="sm" disabled={filter.page === 1}>
          Previous
        </Button>
        <Button onClick={() => setFilter((prev) => ({
            ...prev,
            page: prev.page+1
        }))} variant="outline" size="sm" disabled={filter.page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
