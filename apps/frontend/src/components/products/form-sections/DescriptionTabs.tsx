"use client";

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductFormValues } from "../schema";
import { FileText, Plus, Trash2 } from "lucide-react";

export const DescriptionTabs = () => {
    const [activeTab, setActiveTab] = useState<"description" | "specifications" | "care">("description");
    const { register, control, formState: { errors } } = useFormContext<ProductFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "specifications",
    });

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                    <FileText className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
                    <p className="text-xs text-gray-500">Detailed info management</p>
                </div>
            </div>

            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab("description")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'description' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Description
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("specifications")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'specifications' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Specifications
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("care")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'care' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Care & Info
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">

                {/* Description Tab */}
                {activeTab === "description" && (
                    <div className="space-y-4">
                        <textarea
                            {...register("description")}
                            className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Write a detailed product description here..."
                        />
                        <p className="text-xs text-gray-400">Supported: Rich Text (Coming soon), currently Markdown friendly.</p>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                )}

                {/* Specifications Tab */}
                {activeTab === "specifications" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700">Tech Specs</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ key: "", value: "" })}
                            >
                                <Plus className="w-3 h-3 mr-2" />
                                Add Spec
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-3">
                                    <Input
                                        {...register(`specifications.${index}.key` as const)}
                                        placeholder="Feature (e.g. Material)"
                                        className="flex-1"
                                    />
                                    <Input
                                        {...register(`specifications.${index}.value` as const)}
                                        placeholder="Value (e.g. 100% Wool)"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {fields.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">No specifications added yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Care Tab (Static Placeholder for demo as not in prompt core requirements but in tabs list) */}
                {activeTab === "care" && (
                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p>Care instructions and additional info fields would go here.</p>
                        <p className="text-xs mt-2">Currently using generic description field.</p>
                    </div>
                )}

            </div>
        </div>
    );
};
