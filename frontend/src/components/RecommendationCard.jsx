import React from 'react';

export default function RecommendationCard({ title, value, icon, color }) {
  return (
    <div className={`p-6 rounded-xl bg-white border-l-4 ${color} shadow-sm hover:shadow-md transition`}>
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}