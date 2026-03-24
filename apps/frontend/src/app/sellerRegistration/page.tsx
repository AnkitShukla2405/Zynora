"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  CheckCircle2,
  Upload,
  ChevronLeft,
  ChevronRight,
  Building2,
  Truck,
  Banknote,
  Store,
  ShieldCheck,
  X,
  FileText,
  Clock,
  Shield,
  Eye,
  EyeOff,
  ImageIcon,
  Mail,
  Phone,
  User,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  zynoraSellerOnboardingData,
  zynoraSellerOnboardingSchema,
} from "@/schemas/zynoraSellerOnboarding.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useLazyQuery } from "@apollo/client/react";
import toast from "react-hot-toast";

type SummaryCardProps = {
  title: string;
  icon: React.ReactNode;
  items: {
    label: string;
    value: string | undefined;
  }[];
};

type BaseProps = {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  error?: any;
  helpText?: string;
};

type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    type?: "text" | "email" | "password" | "number";
    options?: never;
  };

type SelectProps = BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    type: "select";
    options: { value: string; label: string }[];
  };

type InputBoxProps = InputProps | SelectProps;



type GstStatus = "not_verified" | "verifying" | "verified" | "failed";

type RegisterSellerResponse = {
  registerSeller: {
    success: boolean;
    message: string;
  };
};

type IsSellerExistsResponse = {
  isSellerExists: {
    isExists: boolean;
    message: string;
  };
};

type IsSellerExistsVariables = {
  data: {
    gstin: string;
    pan: string;
    storeDisplayName: string;
  };
};

type GetUploadUrlResponse = {
  getUploadUrl: {
    url: string;
    key: string;
  };
};

type GetUploadUrlVariables = {
  type: "CANCELLED_CHEQUE" | "LOGO";
  contentType: string;
  sellerId: string;
};

type GetIpResponse = {
  getIp: {
    success: boolean;
    message: string;
    ip: string;
  };
};

export default function ZynoraEnterpriseOnboarding() {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [gstVerificationStatus, setGstVerificationStatus] =
    useState<GstStatus>("not_verified");
  const [isVerifyingGST, setIsVerifyingGST] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<zynoraSellerOnboardingData>({
    resolver: zodResolver(zynoraSellerOnboardingSchema),
    defaultValues: {
      gstin: "",
      pan: "",
      businessName: "",
      businessType: undefined,
      natureOfBusiness: undefined,
      gstStatus: "active",
      address: "",
      city: "",
      state: "",
      pincode: "",
      pickupContactName: "",
      pickupPhone: "",
      returnAddressSame: true,
      returnAddress: "",
      returnCity: "",
      returnState: "",
      returnPincode: "",
      accountHolderName: "",
      accountNumber: "",
      ifsc: "",
      settlementCycle: "T+2",
      storeDisplayName: "",
      storeDescription: "",
      supportEmail: "",
    },
  });
  const watchGstin = watch("gstin");
  const watchReturnAddressSame = watch("returnAddressSame");
  const watchAddress = watch("address");
  const watchCity = watch("city");
  const watchState = watch("state");
  const watchPincode = watch("pincode");
  const watchAccountNumber = watch("accountNumber");
  const watchStoreDescription = watch("storeDescription");
  const [securityInfo, setSecurityInfo] = useState({
    ipAddress: "",
    deviceFingerprint: "fp_7a8b9c0d1e2f3g4h",
    lastUpdated: new Date().toISOString(),
    auditLog: [
      {
        action: "Form Started",
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
    ],
  });
  const steps = [
    { id: 1, label: "Business", icon: <Building2 size={18} /> },
    { id: 2, label: "Logistics", icon: <Truck size={18} /> },
    { id: 3, label: "Bank", icon: <Banknote size={18} /> },
    { id: 4, label: "Storefront", icon: <Store size={18} /> },
    { id: 5, label: "Review", icon: <ShieldCheck size={18} /> },
  ];
  // Auto-extract PAN from GSTIN
  useEffect(() => {
    if (watchGstin && watchGstin.length >= 12) {
      const extractedPAN = watchGstin.substring(2, 12);
      if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(extractedPAN)) {
        setValue("pan", extractedPAN);
      }
    }
  }, [watchGstin, setValue]);

  // Extract IP address

  const GET_IP = gql`
    query GetIp {
      getIp {
        success
        message
        ip
      }
    }
  `;

  const { data, loading, error } = useQuery<GetIpResponse>(GET_IP, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    setSecurityInfo((prev) => ({
      ...prev,
      ipAddress: data?.getIp?.ip ?? "",
    }));
  }, [data]);

  useEffect(() => {
    console.log("GET_IP response:", data);
  }, [data]);

  // Mock GST Verification
  const verifyGSTIN = async () => {
    if (!watchGstin || watchGstin.length !== 15) return;
    setIsVerifyingGST(true);
    setGstVerificationStatus("verifying");
    setTimeout(() => {
      const isValid =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          watchGstin,
        );
      if (isValid) {
        setGstVerificationStatus("verified");
        setValue("gstStatus", "active");
      } else {
        setGstVerificationStatus("failed");
      }
      setIsVerifyingGST(false);
    }, 2000);
  };
  // Sync return address
  useEffect(() => {
    if (watchReturnAddressSame) {
      setValue("returnAddress", watchAddress);
      setValue("returnCity", watchCity);
      setValue("returnState", watchState);
      setValue("returnPincode", watchPincode);
    }
  }, [
    watchReturnAddressSame,
    watchAddress,
    watchCity,
    watchState,
    watchPincode,
    setValue,
  ]);
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type = "document",
  ) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      type === "logo" ? setUploadedLogo(file) : setUploadedFile(file);
    }
  };
  const canProceed = () => {
    if (step === 1)
      return (
        watchGstin &&
        watch("pan") &&
        watch("businessName") &&
        watch("businessType") &&
        watch("natureOfBusiness") &&
        gstVerificationStatus === "verified"
      );
    if (step === 2)
      return (
        watchAddress &&
        watchCity &&
        watchState &&
        watchPincode &&
        watch("pickupContactName") &&
        watch("pickupPhone")
      );
    if (step === 3)
      return (
        watch("accountHolderName") &&
        watchAccountNumber &&
        watch("ifsc") &&
        uploadedFile
      );
    if (step === 4)
      return watch("storeDisplayName") && watch("supportEmail") && uploadedLogo;
    if (step === 5) return termsAccepted;
    return true;
  };

  const GET_UPLOAD_URL = gql`
    mutation GetUploadUrl(
      $type: UploadType!
      $contentType: String!
      $sellerId: String!
    ) {
      getUploadUrl(
        type: $type
        contentType: $contentType
        sellerId: $sellerId
      ) {
        url
        key
      }
    }
  `;

  const REGISTER_SELLER = gql`
    mutation RegisterSeller($data: SellerRegistrationInput!) {
      registerSeller(data: $data) {
        success
        message
      }
    }
  `;

  const IS_SELLER_EXISTS = gql`
    query IsSellerExists($data: IsSellerExistsInput!) {
      isSellerExists(data: $data) {
        isExists
        message
      }
    }
  `;

  const [checkSellerExists] = useLazyQuery<
    IsSellerExistsResponse,
    IsSellerExistsVariables
  >(IS_SELLER_EXISTS);

  async function uploadToS3(file: File, url: string) {
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
  }

  const [getUploadUrl] = useMutation<
    GetUploadUrlResponse,
    GetUploadUrlVariables
  >(GET_UPLOAD_URL);
  const [registerSeller] = useMutation<RegisterSellerResponse>(REGISTER_SELLER);

  const onSubmit = async (data: zynoraSellerOnboardingData) => {
    const { data: existsRes } = await checkSellerExists({
      variables: {
        data: {
          gstin: data.gstin,
          pan: data.pan,
          storeDisplayName: data.storeDisplayName,
        },
      },
    });

    if (existsRes?.isSellerExists?.isExists) {
      alert(existsRes.isSellerExists.message);
      return; // ⛔ STOP FLOW HERE
    }

    const sellerId = data.storeDisplayName;

    if (!uploadedFile || !uploadedLogo) {
      toast.error("Files are missing ❌");
      return;
    }

    try {
      const chequeRes = await getUploadUrl({
        variables: {
          type: "CANCELLED_CHEQUE",
          contentType: uploadedFile.type,
          sellerId,
        },
      });

      if (!chequeRes.data) {
        throw new Error("Failed to get upload URL");
      }

      const chequeUrl = chequeRes.data.getUploadUrl.url;
      const chequeKey = chequeRes.data.getUploadUrl.key;

      await uploadToS3(uploadedFile, chequeUrl);

      // 2️⃣ Logo upload URL
      const logoRes = await getUploadUrl({
        variables: {
          type: "LOGO",
          contentType: uploadedLogo.type,
          sellerId,
        },
      });

      if (!logoRes.data) {
        throw new Error("Failed to get logo upload URL");
      }

      const logoUrl = logoRes.data.getUploadUrl.url;
      const logoKey = logoRes.data.getUploadUrl.key;

      await uploadToS3(uploadedLogo, logoUrl);

      const res = await registerSeller({
        variables: {
          data: {
            ...data,
            bankDocument: chequeKey,
            storeLogo: logoKey,
          },
        },
      });

      if (res?.data?.registerSeller?.success) {
        toast.success(
          `Application Submitted Successfully! 🎉\n\nApplication ID: APP${Date.now()}`,
        );
      } else {
        toast.error(
          res?.data?.registerSeller?.message ?? "Something went wrong ❌",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    }
  };
  const getProgress = () => ((step - 1) / (steps.length - 1)) * 100;
  const maskAccountNumber = (acc?: string) =>
    acc && acc.length >= 4 ? "XXXX-" + acc.slice(-4) : acc;
  const getVerificationBadge = () => {
    const states = {
      not_verified: {
        label: "Not Verified",
        icon: <AlertCircle size={14} />,
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      },
      verifying: {
        label: "Verifying...",
        icon: <Loader2 size={14} className="animate-spin" />,
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      verified: {
        label: "Verified",
        icon: <CheckCircle size={14} />,
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
      failed: {
        label: "Verification Failed",
        icon: <XCircle size={14} />,
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      },
    };
    const state = states[gstVerificationStatus];
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${state.bg} ${state.text} border ${state.border}`}
      >
        {state.icon}
        {state.label}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 font-sans text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#722F37] to-[#9d4450] bg-clip-text text-transparent">
              Zynora Seller Central
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Enterprise Seller Onboarding Portal
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm">
              <ShieldCheck size={16} /> SSL Secured
            </div>
            <div className="text-[10px] text-black flex items-center gap-1">
              <Shield size={10} /> IP: {securityInfo.ipAddress}
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-500">
              Step {step} of {steps.length}
            </span>
            <span className="text-xs font-medium text-[#722F37]">
              {Math.round(getProgress())}% Complete
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#722F37] via-[#8d3840] to-[#722F37] rounded-full transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>
        {/* Stepper */}
        <div className="mb-8 bg-white p-5 rounded-3xl border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col md:flex-row items-center gap-2 min-w-fit">
                  <div
                    className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${step >= s.id ? "bg-gradient-to-br from-[#722F37] to-[#9d4450] text-white shadow-lg scale-110" : "bg-slate-100 text-slate-400"}`}
                  >
                    {step > s.id ? (
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                    ) : (
                      s.icon
                    )}
                    {step === s.id && (
                      <div className="absolute inset-0 rounded-full bg-[#722F37] animate-ping opacity-20" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${step >= s.id ? "text-slate-900" : "text-slate-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-[3px] mx-3 hidden md:block rounded-full transition-all duration-500 ${step > s.id ? "bg-gradient-to-r from-[#722F37] to-[#9d4450]" : "bg-slate-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.error("❌ FORM VALIDATION FAILED", errors);
          })}
        >
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Step 1: Business Identity */}
              {step === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        Business Identity
                      </h2>
                      <p className="text-sm text-slate-500">
                        Verify your business registration and compliance status
                      </p>
                    </div>
                    <div className="hidden md:block p-3 bg-purple-50 rounded-2xl">
                      <Building2 className="text-purple-600" size={28} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Controller
                        name="gstin"
                        control={control}
                        render={({ field }) => (
                          <InputBox
                            label="GSTIN Number"
                            placeholder="22AAAAA0000A1Z5"
                            error={errors.gstin}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                            maxLength={15}
                            icon={<Building2 size={18} />}
                            required
                          />
                        )}
                      />
                      <div className="flex items-center gap-3 mt-3">
                        {getVerificationBadge()}
                        {gstVerificationStatus === "not_verified" &&
                          watchGstin?.length === 15 && (
                            <button
                              type="button"
                              onClick={verifyGSTIN}
                              disabled={isVerifyingGST}
                              className="text-xs font-semibold text-[#722F37] hover:text-[#9d4450] underline disabled:opacity-50"
                            >
                              Verify GSTIN
                            </button>
                          )}
                      </div>
                    </div>
                    <Controller
                      name="pan"
                      control={control}
                      render={({ field }) => (
                        <InputBox
                          label="PAN Number"
                          error={errors.pan}
                          placeholder="Auto-filled from GST"
                          {...field}
                          disabled
                          icon={<FileText size={18} />}
                          required
                        />
                      )}
                    />
                    <Controller
                      name="businessType"
                      control={control}
                      render={({ field }) => (
                        <InputBox
                          label="Business Type"
                          error={errors.businessType}
                          type="select"
                          {...field}
                          options={[
                            { value: "", label: "Select Type" },
                            {
                              value: "proprietorship",
                              label: "Proprietorship",
                            },
                            { value: "llp", label: "LLP" },
                            { value: "pvt_ltd", label: "Private Limited" },
                            { value: "public_ltd", label: "Public Limited" },
                          ]}
                          required
                        />
                      )}
                    />
                    <div className="md:col-span-2">
                      <Controller
                        name="businessName"
                        control={control}
                        render={({ field }) => (
                          <InputBox
                            label="Legal Business Name"
                            error={errors.businessName}
                            placeholder="Your Registered Company Name"
                            {...field}
                            icon={<Store size={18} />}
                            required
                          />
                        )}
                      />
                    </div>
                    <Controller
                      name="natureOfBusiness"
                      control={control}
                      render={({ field }) => (
                        <InputBox
                          label="Nature of Business"
                          error={errors.natureOfBusiness}
                          type="select"
                          {...field}
                          options={[
                            { value: "", label: "Select Nature" },
                            { value: "manufacturer", label: "Manufacturer" },
                            {
                              value: "reseller",
                              label: "Reseller / Distributor",
                            },
                            { value: "d2c", label: "Direct to Consumer (D2C)" },
                            { value: "wholesaler", label: "Wholesaler" },
                          ]}
                          required
                        />
                      )}
                    />
                  </div>
                </div>
              )}
              {/* Step 2: Logistics */}
              {step === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        Logistics & Fulfillment
                      </h2>
                      <p className="text-sm text-slate-500">
                        Pickup and return address configuration
                      </p>
                    </div>
                    <div className="hidden md:block p-3 bg-blue-50 rounded-2xl">
                      <Truck className="text-blue-600" size={28} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" />
                        Pickup Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                          <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                              <InputBox
                                label="Full Address"
                                placeholder="Building, Street, Area"
                                error={errors.address}
                                {...field}
                                required
                              />
                            )}
                          />
                        </div>
                        <Controller
                          name="pincode"
                          control={control}
                          render={({ field }) => (
                            <InputBox
                              label="Pincode"
                              placeholder="110001"
                              error={errors.pincode}
                              {...field}
                              maxLength={6}
                              required
                            />
                          )}
                        />
                        <Controller
                          name="city"
                          control={control}
                          render={({ field }) => (
                            <InputBox
                              label="City"
                              placeholder="New Delhi"
                              error={errors.city}
                              {...field}
                              required
                            />
                          )}
                        />
                        <Controller
                          name="state"
                          control={control}
                          render={({ field }) => (
                            <InputBox
                              label="State"
                              placeholder="Delhi"
                              error={errors.state}
                              {...field}
                              required
                            />
                          )}
                        />
                        <Controller
                          name="pickupContactName"
                          control={control}
                          render={({ field }) => (
                            <InputBox
                              label="Contact Person Name"
                              placeholder="John Doe"
                              error={errors.pickupContactName}
                              {...field}
                              icon={<User size={18} />}
                              required
                            />
                          )}
                        />
                        <Controller
                          name="pickupPhone"
                          control={control}
                          render={({ field }) => (
                            <InputBox
                              label="Contact Phone"
                              placeholder="+91 98765 43210"
                              error={errors.pickupPhone}
                              {...field}
                              icon={<Phone size={18} />}
                              maxLength={15}
                              required
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Truck
                            size={16}
                            className="text-orange-600 transform rotate-180"
                          />
                          Return Address
                        </h3>
                        <Controller
                          name="returnAddressSame"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className="w-4 h-4 accent-[#722F37] rounded"
                              />
                              <span className="text-xs font-medium text-slate-600">
                                Same as pickup
                              </span>
                            </label>
                          )}
                        />
                      </div>
                      {!watchReturnAddressSame && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Controller
                              name="returnAddress"
                              control={control}
                              render={({ field }) => (
                                <InputBox
                                  label="Return Address"
                                  placeholder="Building, Street, Area"
                                  error={errors.returnAddress}
                                  {...field}
                                />
                              )}
                            />
                          </div>
                          <Controller
                            name="returnPincode"
                            control={control}
                            render={({ field }) => (
                              <InputBox
                                label="Pincode"
                                {...field}
                                error={errors.returnPincode}
                                maxLength={6}
                              />
                            )}
                          />
                          <Controller
                            name="returnCity"
                            control={control}
                            render={({ field }) => (
                              <InputBox
                                label="City"
                                error={errors.returnCity}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Step 3: Bank & Compliance */}
              {step === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        Bank & Compliance
                      </h2>
                      <p className="text-sm text-slate-500">
                        Payment settlement configuration
                      </p>
                    </div>
                    <div className="hidden md:block p-3 bg-green-50 rounded-2xl">
                      <Banknote className="text-green-600" size={28} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Controller
                        name="accountHolderName"
                        control={control}
                        render={({ field }) => (
                          <InputBox
                            label="Account Holder Name"
                            error={errors.accountHolderName}
                            placeholder="As per bank records"
                            {...field}
                            icon={<User size={18} />}
                            required
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        name="accountNumber"
                        control={control}
                        render={({ field }) => (
                          <InputBox
                            label="Account Number"
                            type={showAccountNumber ? "text" : "password"}
                            placeholder="Enter account number"
                            error={errors.accountNumber}
                            {...field}
                            icon={<Banknote size={18} />}
                            required
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                        className="mt-2 text-xs font-semibold text-[#722F37] hover:text-[#9d4450] flex items-center gap-1"
                      >
                        {showAccountNumber ? (
                          <>
                            <EyeOff size={14} /> Hide
                          </>
                        ) : (
                          <>
                            <Eye size={14} /> Show
                          </>
                        )}
                      </button>
                    </div>
                    <Controller
                      name="ifsc"
                      control={control}
                      render={({ field }) => (
                        <InputBox
                          label="IFSC Code"
                          placeholder="SBIN0001234"
                          error={errors.ifsc}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          maxLength={11}
                          required
                        />
                      )}
                    />
                    <div className="md:col-span-2">
                      <Controller
                        name="settlementCycle"
                        control={control}
                        render={({ field }) => (
                          <InputBox
                            label="Settlement Cycle"
                            {...field}
                            disabled
                            icon={<Clock size={18} />}
                            helpText="Payments will be settled 2 business days after order delivery"
                          />
                        )}
                      />
                    </div>
                    {watchAccountNumber && (
                      <div className="md:col-span-2 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield size={16} className="text-green-600" />
                          <span className="text-xs font-bold text-green-700">
                            Masked Preview
                          </span>
                        </div>
                        <p className="text-sm font-mono text-slate-700">
                          {maskAccountNumber(watchAccountNumber)}
                        </p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1 mb-3 block">
                        Cancelled Cheque or Bank Statement{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, "document")}
                      />
                      {!uploadedFile ? (
                        <label
                          htmlFor="fileUpload"
                          className="p-8 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-[#722F37] hover:bg-gradient-to-br hover:from-[#722F37]/5 hover:to-transparent transition-all cursor-pointer group"
                        >
                          <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-[#722F37]/10 transition-colors">
                            <Upload
                              className="text-slate-400 group-hover:text-[#722F37] transition-colors"
                              size={32}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                              Click to upload
                            </p>
                            <p className="text-xs text-slate-500">
                              PDF, JPG, PNG up to 2MB
                            </p>
                          </div>
                        </label>
                      ) : (
                        <div className="p-5 border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-50/50 rounded-3xl flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                              <FileText className="text-green-700" size={28} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {uploadedFile.name}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="p-2.5 hover:bg-red-100 rounded-xl transition-colors group"
                          >
                            <X
                              size={20}
                              className="text-red-600 group-hover:text-red-700"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                    <Shield size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        End-to-End Encryption Enabled
                      </p>
                      <p className="text-xs text-blue-700">
                        All sensitive data is encrypted using AES-256 before
                        transmission and storage.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 4: Storefront */}
              {step === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        Storefront Branding
                      </h2>
                      <p className="text-sm text-slate-500">
                        Create your public seller identity
                      </p>
                    </div>
                    <div className="hidden md:block p-3 bg-purple-50 rounded-2xl">
                      <Store className="text-purple-600" size={28} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Controller
                        name="storeDisplayName"
                        control={control}
                        render={({ field }) => (
                          <InputBox
                            label="Store Display Name"
                            placeholder="The name customers will see"
                            error={errors.storeDisplayName}
                            {...field}
                            icon={<Store size={18} />}
                            helpText="This will be displayed on your product listings"
                            required
                          />
                        )}
                      />
                    </div>
                    <Controller
                      name="supportEmail"
                      control={control}
                      render={({ field }) => (
                        <InputBox
                          label="Support Email"
                          type="email"
                          error={errors.supportEmail}
                          placeholder="support@yourstore.com"
                          {...field}
                          icon={<Mail size={18} />}
                          required
                        />
                      )}
                    />
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1 mb-3 block">
                        Store Logo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        id="logoUpload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo")}
                      />
                      {!uploadedLogo ? (
                        <label
                          htmlFor="logoUpload"
                          className="p-8 border-2 border-dashed border-purple-300 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-purple-500 hover:bg-purple-50/50 transition-all cursor-pointer group"
                        >
                          <div className="p-4 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
                            <ImageIcon className="text-purple-600" size={32} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                              Upload Store Logo
                            </p>
                            <p className="text-xs text-slate-500">
                              PNG, JPG - Square format recommended (500x500px)
                            </p>
                          </div>
                        </label>
                      ) : (
                        <div className="p-5 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-3xl flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center overflow-hidden">
                              <img
                                src={URL.createObjectURL(uploadedLogo)}
                                alt="Logo preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {uploadedLogo.name}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {(uploadedLogo.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUploadedLogo(null)}
                            className="p-2.5 hover:bg-red-100 rounded-xl transition-colors group"
                          >
                            <X
                              size={20}
                              className="text-red-600 group-hover:text-red-700"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Controller
                        name="storeDescription"
                        control={control}
                        render={({ field }) => (
                          <>
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1 mb-2 block">
                              Store Description (SEO)
                            </label>
                            <textarea
                              {...field}
                              placeholder="Describe your store and products for better search visibility..."
                              className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:border-[#722F37] focus:ring-4 focus:ring-[#722F37]/10 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium resize-none"
                              rows={4}
                              maxLength={500}
                            />
                            <p className="text-xs text-slate-400 mt-1 ml-1">
                              {watchStoreDescription?.length || 0}/500
                              characters
                            </p>
                          </>
                        )}
                      />
                    </div>
                  </div>
                  {uploadedLogo && watch("storeDisplayName") && (
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-200">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-4">
                        Store Preview
                      </h4>
                      <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                        <img
                          src={URL.createObjectURL(uploadedLogo)}
                          alt="Store logo"
                          className="w-16 h-16 rounded-lg object-cover border-2 border-purple-200"
                        />
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {watch("storeDisplayName")}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {watchStoreDescription?.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Step 5: Review */}
              {step === 5 && (
                <div className="text-center py-12 space-y-6 animate-fadeIn">
                  <div className="inline-flex p-5 bg-gradient-to-br from-green-100 to-green-50 text-green-600 rounded-3xl shadow-lg mb-4">
                    <CheckCircle2 size={48} strokeWidth={2} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                    Ready to Launch!
                  </h2>
                  <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Review your information below. Your application will be
                    verified within 24-48 hours.
                  </p>
                  <div className="max-w-3xl mx-auto space-y-4 text-left mt-10">
                    <SummaryCard
                      title="Business Identity"
                      icon={<Building2 size={20} className="text-purple-600" />}
                      items={[
                        { label: "GSTIN", value: watchGstin },
                        {
                          label: "Business Name",
                          value: watch("businessName"),
                        },
                        { label: "Type", value: watch("businessType") },
                        { label: "Nature", value: watch("natureOfBusiness") },
                      ]}
                    />
                    <SummaryCard
                      title="Logistics"
                      icon={<Truck size={20} className="text-blue-600" />}
                      items={[
                        {
                          label: "Pickup Address",
                          value: `${watchAddress}, ${watchCity}`,
                        },
                        {
                          label: "Contact",
                          value: `${watch("pickupContactName")} (${watch("pickupPhone")})`,
                        },
                        {
                          label: "Return Address",
                          value: watchReturnAddressSame
                            ? "Same as pickup"
                            : watch("returnAddress"),
                        },
                      ]}
                    />
                    <SummaryCard
                      title="Bank Details"
                      icon={<Banknote size={20} className="text-green-600" />}
                      items={[
                        {
                          label: "Account Holder",
                          value: watch("accountHolderName"),
                        },
                        {
                          label: "Account Number",
                          value: maskAccountNumber(watchAccountNumber),
                        },
                        { label: "IFSC", value: watch("ifsc") },
                        {
                          label: "Settlement",
                          value: watch("settlementCycle"),
                        },
                      ]}
                    />
                    <SummaryCard
                      title="Storefront"
                      icon={<Store size={20} className="text-purple-600" />}
                      items={[
                        {
                          label: "Store Name",
                          value: watch("storeDisplayName"),
                        },
                        {
                          label: "Support Email",
                          value: watch("supportEmail"),
                        },
                        { label: "Logo", value: uploadedLogo?.name || "—" },
                      ]}
                    />
                  </div>
                  <div className="max-w-3xl mx-auto mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={18} className="text-slate-600" />
                      <h4 className="text-sm font-bold text-slate-700">
                        Security & Audit Information
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">
                          Device Fingerprint:
                        </span>
                        <p className="font-mono text-slate-700 mt-1">
                          {securityInfo.deviceFingerprint}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Last Updated:</span>
                        <p className="text-slate-700 mt-1">
                          {new Date(securityInfo.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-md mx-auto pt-8">
                    <label className="flex items-start gap-4 text-sm text-left cursor-pointer group p-5 rounded-2xl hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-5 h-5 mt-0.5 accent-[#722F37] cursor-pointer rounded"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                      <span className="text-slate-700 leading-relaxed">
                        I confirm that all information is accurate and I agree
                        to the{" "}
                        <a
                          href="#"
                          className="text-[#722F37] font-semibold underline"
                        >
                          Seller Terms & Conditions
                        </a>
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between p-6 md:p-8 bg-gradient-to-r from-slate-50 to-slate-100/50 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 font-bold text-slate-600 hover:text-slate-900 disabled:opacity-0 transition-all hover:gap-3 rounded-xl hover:bg-white"
              >
                <ChevronLeft size={20} /> Back
              </button>
              <button
                type={step === 5 ? "submit" : "button"}
                onClick={() => step < 5 && setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-[#722F37] to-[#9d4450] text-white px-10 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-[#722F37]/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 5 ? "Submit Application" : "Continue"}
                {step < 5 && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </form>
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-slate-500">
            Need help?{" "}
            <a href="#" className="text-[#722F37] font-semibold underline">
              Contact Support
            </a>{" "}
            or call <span className="font-semibold">1800-XXX-XXXX</span>
          </p>
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-2">
            <Shield size={10} />
            All data encrypted with AES-256 • Session ID:{" "}
            {securityInfo.deviceFingerprint.substring(3, 15)}
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
function InputBox({
  label,
  icon,
  required,
  type = "text",
  error,
  helpText,
  ...props
}: InputBoxProps) {
  if (type === "select") {
    const { options, ...selectProps } = props as SelectProps;
    return (
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          {...(selectProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
          className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:border-[#722F37] focus:ring-4 focus:ring-[#722F37]/10 outline-none transition-all text-slate-900 font-medium disabled:bg-slate-50 disabled:cursor-not-allowed"
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {helpText && <p className="text-xs text-slate-500 ml-1">{helpText}</p>}
        {error && (
          <p className="text-xs text-red-600 ml-1 mt-1">{error.message}</p>
        )}
      </div>
    );
  }

  const {  ...inputProps } = props;
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:bg-white focus:border-[#722F37] focus:ring-4 focus:ring-[#722F37]/10 outline-none transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-500 text-slate-900 font-medium"
      />

      {helpText && <p className="text-xs text-slate-500 ml-1">{helpText}</p>}
      {error && (
        <p className="text-xs text-red-600 ml-1 mt-1">{error.message}</p>
      )}
    </div>
  );
}
function SummaryCard({ title, icon, items }: SummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-xl shadow-sm">{icon}</div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start text-sm gap-4"
          >
            <span className="text-slate-500 font-medium min-w-[120px]">
              {item.label}:
            </span>
            <span className="font-semibold text-slate-900 text-right break-words">
              {item.value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
