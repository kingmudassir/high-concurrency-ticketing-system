import { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureProps) {
  return (
    <div className="group relative p-8 rounded-3xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col items-start">
      {/* Icon Container */}
      <div className="mb-6 p-3 rounded-2xl bg-gray-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
        {title}
      </h3>
      
      <p className="text-gray-500 leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  );
}