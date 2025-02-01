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
}

const InputField = ({ label, value, onChange, placeholder, min = 0, max = 100 }: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? null : Number(val));
        }}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full"
      />
    </div>
  );
};

export default InputField;