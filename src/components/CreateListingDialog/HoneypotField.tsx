
import React from 'react';

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

// Hidden field that should remain empty - bots often fill all fields
const HoneypotField = ({ value, onChange }: HoneypotFieldProps) => {
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      <label htmlFor="website">Website (leave blank):</label>
      <input
        id="website"
        name="website"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
};

export default HoneypotField;
