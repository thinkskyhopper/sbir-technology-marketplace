
export interface CSVParseResult {
  headers: string[];
  rows: string[][];
  errors: string[];
}

// Detect delimiter by checking which one appears most frequently in the first line
const detectDelimiter = (text: string): string => {
  const firstLine = text.split(/\r?\n/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  
  return tabCount > commaCount ? '\t' : ',';
};

export const parseCSV = (csvText: string): CSVParseResult => {
  // Normalize line endings and detect delimiter
  const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const delimiter = detectDelimiter(normalizedText);
  const errors: string[] = [];
  
  console.log('🔍 Detected delimiter:', delimiter === '\t' ? 'TAB' : 'COMMA');
  
  // Parse the entire content respecting quoted fields that may contain newlines
  const { headers, rows } = parseDelimitedContent(normalizedText, delimiter);
  
  if (headers.length === 0) {
    return {
      headers: [],
      rows: [],
      errors: ['CSV file must contain at least a header row']
    };
  }

  if (rows.length === 0) {
    return {
      headers: headers.map(h => h.trim().toLowerCase()),
      rows: [],
      errors: ['CSV file must contain at least one data row']
    };
  }

  console.log(`📊 Parsed ${rows.length} rows with ${headers.length} expected columns`);
  
  // Pad rows to match header length and collect warnings
  const normalizedRows: string[][] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const paddedRow = [...row];
    
    // Pad missing columns with empty strings
    while (paddedRow.length < headers.length) {
      paddedRow.push('');
    }
    
    // Warn about extra columns but don't error
    if (row.length > headers.length) {
      errors.push(`Row ${i + 2}: Has ${row.length} columns, expected ${headers.length} (extra columns ignored)`);
      paddedRow.splice(headers.length); // Trim to expected length
    } else if (row.length < headers.length) {
      console.log(`⚠️ Row ${i + 2}: Padded ${headers.length - row.length} missing columns`);
    }
    
    normalizedRows.push(paddedRow);
  }

  return {
    headers: headers.map(h => h.trim().toLowerCase()),
    rows: normalizedRows,
    errors
  };
};

const parseDelimitedContent = (text: string, delimiter: string): { headers: string[], rows: string[][] } => {
  const result: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote within quoted field
        currentField += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      // Field separator outside of quotes
      currentRow.push(currentField.trim());
      currentField = '';
      i++;
    } else if (char === '\n' && !inQuotes) {
      // Row separator outside of quotes
      currentRow.push(currentField.trim());
      
      // Only add non-empty rows
      if (currentRow.some(field => field.length > 0)) {
        result.push(currentRow.map(cleanField));
      }
      
      currentRow = [];
      currentField = '';
      i++;
    } else {
      currentField += char;
      i++;
    }
  }

  // Add the last field and row if not empty
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      result.push(currentRow.map(cleanField));
    }
  }

  if (result.length === 0) {
    return { headers: [], rows: [] };
  }

  const [headers, ...rows] = result;
  return { headers, rows };
};

const cleanField = (field: string): string => {
  // Remove surrounding quotes if they exist
  let cleaned = field.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned;
};
