
export interface CSVParseResult {
  headers: string[];
  rows: string[][];
  errors: string[];
}

export const parseCSV = (csvText: string): CSVParseResult => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const errors: string[] = [];
  
  if (lines.length < 2) {
    return {
      headers: [],
      rows: [],
      errors: ['CSV file must contain at least a header row and one data row']
    };
  }

  // Parse header row
  const headers = parseCSVRow(lines[0]);
  const rows: string[][] = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const rowData = parseCSVRow(lines[i]);
    
    if (rowData.length !== headers.length) {
      errors.push(`Row ${i + 1}: Expected ${headers.length} columns, got ${rowData.length}`);
    }
    
    rows.push(rowData);
  }

  return {
    headers: headers.map(h => h.trim().toLowerCase()),
    rows,
    errors
  };
};

const parseCSVRow = (row: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < row.length) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote within quoted field
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator outside of quotes
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(current.trim());

  // Remove surrounding quotes from fields if they exist
  return result.map(field => {
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.slice(1, -1);
    }
    return field;
  });
};
