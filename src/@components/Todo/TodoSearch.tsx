"use client";
type Props = {
  value: string;
  onChange: (v: string) => void;
};
export default function TodoSearch({ value, onChange }: Props) {
  return (
    <input
      className="input"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
