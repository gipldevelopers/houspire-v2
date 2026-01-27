// app/not-found/page.js
"use client"
import Link from 'next/link';
import { Home, Search, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative w-screen h-screen bg-[#042939] text-white overflow-hidden">
      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-white to-[#e48b53] bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#e48b53] rounded-full animate-ping"></div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-3 bg-[#e48b53] hover:bg-[#d17a45] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-3 border-2 border-white/30 hover:border-[#e48b53] text-white hover:text-[#e48b53] font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go Back
            </button>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 pt-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Lost in Space</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div>Page Under Construction</div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e48b53]/20 to-transparent"></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #e48b53 2px, transparent 0),
                              radial-gradient(circle at 75% 75%, #e48b53 1px, transparent 0)`,
            backgroundSize: '50px 50px, 30px 30px',
            backgroundPosition: '0 0, 25px 25px'
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating dot 1 */}
        <div 
          className="absolute w-3 h-3 bg-[#e48b53] rounded-full animate-float"
          style={{ top: '20%', left: '15%' }}
        ></div>
        
        {/* Floating dot 2 */}
        <div 
          className="absolute w-2 h-2 bg-white rounded-full animate-float-delay-1"
          style={{ top: '60%', left: '80%' }}
        ></div>
        
        {/* Floating dot 3 */}
        <div 
          className="absolute w-4 h-4 bg-[#e48b53] rounded-full animate-float-delay-2"
          style={{ top: '80%', left: '20%' }}
        ></div>
        
        {/* Floating dot 4 */}
        <div 
          className="absolute w-1 h-1 bg-white rounded-full animate-float-delay-3"
          style={{ top: '40%', left: '90%' }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay-1 {
          animation: float 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-delay-2 {
          animation: float 5s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-delay-3 {
          animation: float 8s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}