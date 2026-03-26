"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
];

interface SpecificationItem {
  key: string;
  value: string;
}


interface DescriptionSpecificationProps {
  description: string;
  specification: SpecificationItem[]
}

export function ProductTabs({
  description,
  specification,
}: DescriptionSpecificationProps) {
  const [activeTab, setActiveTab] = React.useState("description");

  

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-6">
        {activeTab === "description" && (
          <div className="prose prose-sm max-w-none text-gray-600 space-y-4 whitespace-pre-line">
            {description}
          </div>
        )}

        {activeTab === "specs" && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200 bg-white">
                {specification.map((v) => {
                  return (
                    <tr key={v.key} className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 w-1/3">
                        {v.key}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {v.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900">4.8</span>
                <div className="ml-2">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-500">Based on 128 reviews</p>
                </div>
              </div>
            </div>
            {/* Mock Review Item */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    JS
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    John Smith
                  </span>
                </div>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <div className="flex text-amber-400 text-xs mb-2">★★★★★</div>
              <p className="text-sm text-gray-600">
                Absolutely love this sweater! The quality is top-notch and it
                fits perfectly. Highly recommend to anyone looking for a
                wardrobe staple.
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    ED
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Emily Davis
                  </span>
                </div>
                <span className="text-xs text-gray-500">1 week ago</span>
              </div>
              <div className="flex text-amber-400 text-xs mb-2">★★★★☆</div>
              <p className="text-sm text-gray-600">
                Great material, but the sizing runs slightly small. I'd
                recommend sizing up.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
