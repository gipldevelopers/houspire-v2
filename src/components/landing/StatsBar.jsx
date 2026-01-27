'use client';

import { TrendingUp, Users, Clock, Award, Shield, Star } from 'lucide-react';

export const StatsBar = () => {
  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: '2,847+',
      label: 'Happy Homes',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      value: '₹87Cr+',
      label: 'Total Savings',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      value: '48-72h',
      label: 'Avg. Delivery',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: <Award className="w-5 h-5" />,
      value: '4.8★',
      label: 'Rating',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      value: '100%',
      label: 'Refund Policy',
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  return (
    <div className="py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bg} p-4 rounded-xl text-center transition-all hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex justify-center mb-2">
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};