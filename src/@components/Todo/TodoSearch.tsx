"use client";
import Search from "@/@components/ui/Search";

type Props = {
  value: string;
  onChange: (v: string) => void;
};
export default function TodoSearch({ value, onChange }: Props) {
  return (
    <Search
      placeholder="Search"
      value={value}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      className="min-w-[220px]"
    />
  );
}
