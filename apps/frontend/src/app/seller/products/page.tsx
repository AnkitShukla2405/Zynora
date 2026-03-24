"use client";
import Link from "next/link";
import { Plus, MoreHorizontal, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "@/components/ui/ProductActions";
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
import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import Loader from "@/components/Loader";




type Product = {
  id: string;
  image?: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived";
  lowStockThreshold: number;
};

type GetProductInfoResponse = {
  getProductInfo: {
    data: Product[];
    totalCount: number;
    currentPage: number;
  };
};

type GetProductInfoVariables = {
  page: number;
  limit: number;
};

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const limit = 10;
  const GET_PRODUCT_INFO_OF_SELLER = gql`
    query GetProductInfoOfSeller($page: Int!, $limit: Int!) {
      getProductInfo(page: $page, limit: $limit) {
        data{
        id
        image
        productName
        category
        price
        stock
        status
        lowStockThreshold
        }
        totalCount
        currentPage
      }
    }
  `;

  const { data, loading, error } = useQuery<GetProductInfoResponse, GetProductInfoVariables>(GET_PRODUCT_INFO_OF_SELLER, {
    variables: {page, limit}
  });

  if (loading) {
  return <Loader />;
}


if (!data) return null;
// Handle Next

const handleNext = () => {
  setPage((prev) => prev+1)
}

// Handle Previous

const handlePrevious = () => {
  setPage((prev) => Math.max(prev - 1,  1))
}

const totalCount = data?.getProductInfo.totalCount ?? 0
const currentPage = data?.getProductInfo.currentPage ?? 1

const start = (currentPage -1) * limit + 1;
const end = Math.min(start + limit - 1, totalCount);


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          {/* Breadcrumb or subtitle could go here */}
          <p className="text-sm text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-white">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search Bar (Optional but good for table pages) */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          className="w-full pl-10 h-10 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Products Table */}
      <Card className="border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.getProductInfo.data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${product.image}`}
                        alt={product.productName}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs">
                        N/A
                     </div>
                     )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {product.productName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.id}
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-medium">{`₹ ${product.price}`}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock < product.lowStockThreshold
                          ? "text-red-600 font-medium"
                          : product.stock === product.lowStockThreshold
                          ? "text-amber-600 font-medium"
                          : "text-gray-600"
                      }
                    >
                      {product.stock === 0 
                      ? "Out Of Stock"
                      :product.stock <= product.lowStockThreshold
                      ? "Low Stock"
                      : "In Stock"
                    }
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active"
                        ? "success"
                        : "secondary"
                      }
                    >
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ProductActions
                      product={{
                        id: product.id,
                        name: product.productName,
                        status: product.status
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>Showing {start}-{end} of {totalCount} products</div>
        <div className="flex gap-2">
          <Button onClick={() => handlePrevious()} variant="outline" size="sm" disabled= {page === 1}>
            Previous
          </Button>
          <Button onClick={() => handleNext()} variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
