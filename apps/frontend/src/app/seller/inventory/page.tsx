"use client"
import {
    Search,
    Filter,
    AlertTriangle,
    RefreshCw
} from "lucide-react";
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
import { useQuery } from "@apollo/client/react";

type InventoryItem = {
  sku: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
  stockStatus: string;
};

type GetInventoryResponseType = {
  getProductInventoryResponse: {
    data: InventoryItem[];
  };
};

const GET_INVEENTORY_RESPONSE = gql`
query GetInventoryResponse($page: Int!, $limit: Int!) {
    getProductInventoryResponse(page: $page, limit: $limit) {
        data{
            sku
            name
            category
            stockLevel
            reorderLevel
            stockStatus
        }
    }
}
`


export default function InventoryPage() {
    const page = 1
    const limit = 10
    const {data, loading, error} = useQuery<GetInventoryResponseType>(GET_INVEENTORY_RESPONSE, {
        variables: {page, limit}
    })

    if (loading) {
  return <p>Loading products...</p>;
}

if (error) {
  return <p className="text-red-500">{error.message}</p>;
}
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
                    <p className="text-sm text-muted-foreground">Monitor stock levels and reorder alerts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <RefreshCw className="w-4 h-4" />
                        Sync Stock
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by Product or SKU..."
                        className="w-full pl-10 h-10 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <Button variant="outline" size="icon" className="bg-white">
                    <Filter className="w-4 h-4" />
                </Button>
                <div className="text-sm text-muted-foreground ml-auto">
                    Showing all items
                </div>
            </div>

            <Card className="border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Reorder Level</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.getProductInventoryResponse.data.map((item) => (
                                <TableRow key={item.sku}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{item.sku}</TableCell>
                                    <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={item.stockLevel < item.reorderLevel ? "text-red-600 font-bold" : "text-gray-900"}>
                                                {item.stockLevel}
                                            </span>
                                            {item.stockLevel < item.reorderLevel && (
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{item.reorderLevel}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.stockStatus === "In Stock" ? "success" :
                                                item.stockStatus === "Out of Stock" ? "destructive" :
                                                    "warning"
                                        }>
                                            {item.stockStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                                            Update
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
