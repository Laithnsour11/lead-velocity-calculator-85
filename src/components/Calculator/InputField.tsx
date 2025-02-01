import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  isPercentage?: boolean;
  icon?: ReactNode;
}

const InputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  min = 0, 
  max, 
  isPercentage = false,
  icon
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        {label}
      </Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "") {
            onChange(null);
          } else {
            const numVal = Number(val);
            if (isPercentage && numVal > 100) {
              onChange(100);
            } else {
              onChange(numVal);
            }
          }
        }}
        placeholder={placeholder}
        min={min}
        max={isPercentage ? 100 : max}
        className="w-full bg-white/80 backdrop-blur-sm border-gray-200 focus:border-primary/50 focus:ring-primary/50"
      />
    </div>
  );
};

export default InputField;