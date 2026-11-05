import React from 'react';
import { Check } from 'lucide-react';

interface OrderTrackingProps {
  status: 'Confirmed' | 'Dispatched' | 'Active Rental' | 'Returned';
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ status }) => {
  const steps = [
    { id: 'Confirmed', label: 'Processing' },
    { id: 'Dispatched', label: 'Shipped' },
    { id: 'Active Rental', label: 'Out for Delivery' },
    { id: 'Returned', label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === status);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                index <= currentStepIndex
                  ? 'bg-[#4D0E13] border-[#4D0E13] text-white'
                  : 'bg-white border-[#C8A49F] text-[#C8A49F]'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="w-3 h-3" />
              ) : (
                <span className="text-[10px] font-bold">{index + 1}</span>
              )}
            </div>
            <span
              className={`text-[9px] mt-1 font-semibold ${
                index <= currentStepIndex ? 'text-[#4D0E13]' : 'text-[#5e5460]'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1 bg-[#C8A49F]/30 rounded-full">
        <div
          className="absolute top-0 left-0 h-1 bg-[#4D0E13] rounded-full transition-all duration-500"
          style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
