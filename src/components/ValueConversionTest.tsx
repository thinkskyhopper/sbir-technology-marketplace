import React from 'react';

/**
 * Test component to validate value conversion logic
 * This component can be temporarily added to test the conversion pipeline
 */
const ValueConversionTest = () => {
  const testValues = [120000, 1200, 12000000];
  
  const formatUSDValue = (value: string): string => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (!numericValue || numericValue === '.') return '';
    const number = parseFloat(numericValue);
    if (isNaN(number)) return numericValue;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const parseUSDValue = (formattedValue: string): number => {
    const numericValue = formattedValue.replace(/[^0-9.]/g, '');
    const number = parseFloat(numericValue);
    return isNaN(number) ? 0 : number;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 bg-background border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Value Conversion Test</h3>
      <div className="space-y-4">
        {testValues.map((testValue) => {
          const formatted = formatUSDValue(testValue.toString());
          const parsed = parseUSDValue(formatted);
          const toCents = Math.round(parsed * 100);
          const fromCents = toCents / 100;
          const finalDisplay = formatCurrency(fromCents);
          
          return (
            <div key={testValue} className="p-3 bg-muted rounded border space-y-1">
              <div><strong>Input:</strong> {testValue}</div>
              <div><strong>Formatted:</strong> {formatted}</div>
              <div><strong>Parsed:</strong> {parsed}</div>
              <div><strong>To Cents:</strong> {toCents}</div>
              <div><strong>From Cents:</strong> {fromCents}</div>
              <div><strong>Final Display:</strong> {finalDisplay}</div>
              <div className={`font-semibold ${parsed === testValue ? 'text-green-600' : 'text-red-600'}`}>
                {parsed === testValue ? '✅ Conversion OK' : '❌ Conversion Issue'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Expected behavior:</strong> Input 120000 → Display $120,000<br/>
          <strong>User reported issue:</strong> Input 12000000 needed → Display $120,000
        </p>
      </div>
    </div>
  );
};

export default ValueConversionTest;