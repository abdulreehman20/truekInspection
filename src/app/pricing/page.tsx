"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const pricing = [
  {
    id: "10201",
    plan: "Our Plan",
    displayPrice: "$49",
    price: "49.00",
    features: [
      "1 Vehicle Report",
      "Vehicle Specification",
      "DMV Title History",
      "Safety Recall Status",
      "Online Listing History",
      "Junk & Salvage Information",
      "Accident Information",
    ],
  },
];

export default function PricingPage() {
  const [vin, setVin] = useState("");

  // 👇 AUTOMATICALLY GET VIN FROM PREVIOUS STEP
  useEffect(() => {
    const storedVin = localStorage.getItem("temp_vin");
    if (storedVin) {
      setVin(storedVin);
    }
  }, []);

  return (
    <main className="max-w-[1920px] mx-auto relative overflow-hidden">
      <Navbar />

      <div className="mt-10 max-w-6xl mx-auto px-4 py-10">
        <div className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Complete Your Booking</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Confirm your plan below to receive the report for VIN:{" "}
                <span className="font-bold text-custom_red">
                  {vin || "Loading..."}
                </span>
              </p>
            </div>

            <div className="grid max-w-xl mx-auto">
              {pricing.map((plan) => (
                <div
                  key={plan.id}
                  className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
                >
                  <div className="absolute inset-x-0 top-0 h-2 bg-custom_red rounded-t-2xl" />
                  <div className="relative">
                    <h3 className="text-custom_red text-xl font-semibold mb-1">
                      {plan.plan}
                    </h3>
                    <div className="mb-8">
                      <p className="text-gray-600 text-sm">PRICE</p>
                      <p className="text-4xl font-bold text-custom_red">
                        {plan.displayPrice}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <span className="text-custom_red mr-2">✔️</span>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Add a shadcn Button with nextjs Link component here which can redirect us to paddle website */}
                    <Button>
                      <Link
                        href={`https://www.paddle.com/billing/checkout`}
                        target="_blank"
                      >
                        Buy Now
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}
