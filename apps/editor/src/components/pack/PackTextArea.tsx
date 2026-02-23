import React from 'react';

interface PackTextAreaProps {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  rows?: number;
}

export default function PackTextArea({ value, onChange, readOnly, rows = 16 }: PackTextAreaProps) {
  return (
    <textarea
      className="textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      rows={rows}
      spellCheck={false}
    />
  );
}
