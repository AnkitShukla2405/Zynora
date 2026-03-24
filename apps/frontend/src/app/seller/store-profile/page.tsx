"use client";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";


type SellerResponse = {
  getSellerResponse: {
    gstin: string;
    pan: string;
    businessName: string;
    natureOfBusiness: string;
    gstStatus: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    pickupContactName: string;
    pickupPhone: string;
    returnAddressSame: boolean;
    returnAddress: string;
    returnCity: string;
    returnState: string;
    returnPincode: string;
    accountNumber: string;
    ifsc: string;
    settlementCycle: string;
    bankDocument: string;
    storeLogo: string;
    storeDisplayName: string;
    supportEmail: string;
    storeDescription: string;
  };
};

const GET_SELLER_INFO = gql`
  query GetSellerInfo {
    getSellerResponse {
      gstin
      pan
      businessName
      natureOfBusiness
      gstStatus
      address
      city
      state
      pincode
      pickupContactName
      pickupPhone
      returnAddressSame
      returnAddress
      returnCity
      returnState
      returnPincode
      accountNumber
      ifsc
      settlementCycle
      bankDocument
      storeLogo
      storeDisplayName
      supportEmail
      storeDescription
    }
  }
`;

export const GET_SELLER_NAME = gql`
  query GetSellerNameForUi {
    getSellerNameForUi {
      name
      image
    }
  }
`;

export default function StoreProfilePage() {
  const { data, loading, error } = useQuery<SellerResponse>(GET_SELLER_INFO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Store Profile</h2>
          <p className="text-sm text-muted-foreground">
            View your registered business details.
          </p>
        </div>
        <Button className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Identity Card */}
      <Card className="border shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${data?.getSellerResponse.storeLogo}`}
              alt={data?.getSellerResponse.businessName || "Store Logo"}
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {data?.getSellerResponse.businessName}
                </h3>
                <Badge variant="success" className="gap-1 pl-1 pr-2">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {data?.getSellerResponse.city},{" "}
                  {data?.getSellerResponse.state}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />{" "}
                  {data?.getSellerResponse.supportEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />{" "}
                  {data?.getSellerResponse.pickupPhone}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Legal Name</span>
              <span className="text-gray-900 font-medium text-right">
                {data?.getSellerResponse.businessName}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">GSTIN</span>
              <span className="text-gray-900 font-medium text-right">
                {data?.getSellerResponse.gstin}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">PAN</span>
              <span className="text-gray-900 font-medium text-right">
                {data?.getSellerResponse.pan}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Registration Date</span>
              <span className="text-gray-900 font-medium text-right">
                15 Aug 2023
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              Bank Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Account Holder</span>
              <span className="text-gray-900 font-medium text-right">
                {data?.getSellerResponse.businessName}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Bank Name</span>
              <span className="text-gray-900 font-medium text-right">
                HDFC Bank
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Account Number</span>
              <span className="text-gray-900 font-medium text-right">
                {data?.getSellerResponse.accountNumber}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">IFSC Code</span>
              <span className="text-gray-900 font-medium text-right">
                {data?.getSellerResponse.ifsc}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
