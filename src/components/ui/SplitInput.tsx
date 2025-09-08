// src/components/ui/SplitInput.tsx
import React from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function SplitInput({ label, value, onChange }: Props) {
  return (
    <div className="wallet-split-item">
      <label>{label}:</label>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      /> €
    </div>
  );
}