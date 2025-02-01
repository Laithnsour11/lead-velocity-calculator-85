import React from "react";
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
}

const InputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  min = 0, 
  max, 
  isPercentage = false 
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
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
        className="w-full"
      />
    </div>
  );
};

export default InputField;