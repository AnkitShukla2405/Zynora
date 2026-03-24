"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormValues } from "../schema";
import { ListPlus, Trash2, GripVertical, CheckCircle2 } from "lucide-react";

export const ProductHighlights = () => {
    const { register, control, formState: { errors } } = useFormContext<ProductFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "highlights",
    });

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Key Highlights</h2>
                        <p className="text-xs text-gray-500">Top features shown as bullet points</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ text: "" })}
                    disabled={fields.length >= 5}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                    <ListPlus className="w-4 h-4 mr-2" />
                    Add Highlight
                </Button>
            </div>

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3 group">
                        <div className="text-gray-300 cursor-move">
                            <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <Input
                                {...register(`highlights.${index}.text` as const)}
                                placeholder={`Highlight #${index + 1} (e.g. 100% Cotton)`}
                                className={errors.highlights?.[index]?.text ? "border-red-500" : ""}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {errors.highlights && (
                <p className="text-red-500 text-xs mt-3 bg-red-50 p-2 rounded-md inline-block">
                    {errors.highlights.root?.message || "Please check highlights"}
                </p>
            )}

            {fields.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg dashed border border-gray-200">
                    No highlights added. Add at least one.
                </div>
            )}
        </div>
    );
};
