import { AArrowDown } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-start">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Button
      </button>

      <div className="p-2 border rounded-lg bg-gray-100 text-gray-700">
        <AArrowDown className="w-6 h-6" />
      </div>
    </div>
  );
}
