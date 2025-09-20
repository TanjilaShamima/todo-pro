"use client";
type Props = {
  value: string;
  onChange: (v: string) => void;
};
export default function TodoSearch({ value, onChange }: Props) {
  return (
    <input
      className="input border border-black/10 dark:border-white/10 bg-white/90 dark:bg-white/5 text-black dark:text-white px-3 py-2 rounded"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
