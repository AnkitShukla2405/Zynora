import React, { useState } from "react";
import { Plus, Home, Briefcase, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect } from "react";

type Address = {
  id: string;
  name: string;
  mobile: string;
  type: "HOME" | "WORK";
  addressLine: string;
  cityStateZip: string;
};

type SaveUserAddressResponse = {
  saveUserAddress: {
    success: boolean;
    message: string;
  };
};

type GetSavedAddressesResponse = {
  getSavedAdresses: Address[];
};

const SAVE_USER_ADDRESS = gql`
  mutation SaveUserAddress($data: UserAddressInput!) {
    saveUserAddress(data: $data) {
      success
      message
    }
  }
`;

const ADRESSES = gql`
query GetSavedAddresses{
  getSavedAdresses{
    id
    name
    mobile
    type
    addressLine
    cityStateZip
  }
}
`



type AddressFormValues = {
  name: string;
  mobile: string;
  pincode: string;
  city: string;
  address1: string;
  address2?: string;
  state: string;
  country: string;
  type: "HOME" | "WORK";
};


type Props = {
    onSelectAddressId: (data: string) => void
}

export const AddressSection = ({onSelectAddressId}: Props) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: {
      country: "India",
      type: "HOME",
    },
  });


  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saveUserAddresses] = useMutation<SaveUserAddressResponse>(SAVE_USER_ADDRESS, {
    refetchQueries: [{query: ADRESSES}]
  });
  const {data, loading, error} = useQuery<GetSavedAddressesResponse>(ADRESSES)

  const addresses = data?.getSavedAdresses ?? [];

  const onSubmit = async (data: AddressFormValues) => {
    console.log("ADDRESS PAYLOAD", data);

    const result = await saveUserAddresses({
      variables: {
        data,
      },
    });

    if (result?.data?.saveUserAddress?.success) {
      console.log(result?.data.saveUserAddress?.message);
      setIsAddingNew(false);
      reset();
    } else {
      console.log(result?.data?.saveUserAddress?.message);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Delivery Address
        </h2>
      </div>

      {!isAddingNew ? (
        <div className="space-y-4">
          <RadioGroup
            value={selectedAddressId}
            onValueChange={(value) => {
              onSelectAddressId(value);
              setSelectedAddressId(value)
            }}
            className="grid grid-cols-1 gap-4"
          >
            {addresses.map((address) => (
              <Label
                key={address.id}
                htmlFor={address.id}
                className={cn(
                  "relative flex cursor-pointer rounded-xl border p-4 transition-all hover:border-primary/50",
                  selectedAddressId === address.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-gray-200 bg-white",
                )}
              >
                <div className="flex w-full items-start gap-3">
                  <RadioGroupItem
                    value={address.id}
                    id={address.id}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {address.name}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                            address.type === "HOME"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-purple-50 text-purple-700",
                          )}
                        >
                          {address.type}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-gray-500 hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {address.addressLine}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.cityStateZip}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {address.mobile}
                    </p>

                    {selectedAddressId === address.id && (
                      <div className="pt-2 animate-in fade-in zoom-in-95 duration-200">
                        <Button size="sm" className="w-full sm:w-auto">
                          Deliver Here
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>

          <Button
            variant="outline"
            className="w-full justify-start text-primary hover:text-primary hover:bg-primary/5 border-dashed border-primary/20 h-12"
            onClick={() => setIsAddingNew(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    placeholder="+91 98765 43210"
                    {...register("mobile", {
                      required: "Mobile number required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Invalid mobile number",
                      },
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="122001"
                    maxLength={6}
                    {...register("pincode", {
                      required: "Pincode is required",
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Gurugram"
                    {...register("city", { required: "City is required" })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address1">
                  Address Line 1 (House No, Building, Street)
                </Label>
                <Input
                  id="address1"
                  placeholder="Flat 101, Palm Grove"
                  {...register("address1", {
                    required: "Address  is required",
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2">
                  Address Line 2 (Road, Area, Landmark)
                </Label>
                <Input
                  id="address2"
                  placeholder="Near Cyber Hub"
                  {...register("address2")}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="Haryana"
                    {...register("state", { required: "State is required" })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value="India"
                    readOnly
                    className="bg-gray-50"
                    {...register("country", {
                      required: "Country is required",
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" value="HOME" {...register("type")} />
                    <Home className="w-4 h-4" /> Home
                  </label>

                  <label className="flex items-center gap-2">
                    <input type="radio" value="WORK" {...register("type")} />
                    <Briefcase className="w-4 h-4" /> Work
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">Save Address</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddingNew(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
