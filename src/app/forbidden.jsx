// app/403/page.js
"use client"
import Link from 'next/link';
import { Home, Shield, Lock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="relative w-screen h-screen bg-[#042939] text-white overflow-hidden">
      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          {/* 403 Number with Shield Icon */}
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-white to-[#e48b53] bg-clip-text text-transparent">
              403
            </h1>
            <div className="absolute -top-2 -right-2">
              <Shield className="w-12 h-12 text-[#e48b53] animate-pulse" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Lock className="w-8 h-8 text-[#e48b53]" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Access Denied
              </h2>
              <AlertTriangle className="w-8 h-8 text-[#e48b53]" />
            </div>
            <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
              You don&apos;t have permission to access this resource. Please check your credentials.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-3 bg-[#e48b53] hover:bg-[#d17a45] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-3 border-2 border-white/30 hover:border-[#e48b53] text-white hover:text-[#e48b53] font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform rotate-180" />
              Go Back
            </button>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 pt-8">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Restricted Access</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div>Authorization Required</div>
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

      {/* Security Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {/* Shield Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 49%, #e48b53 50%, transparent 51%),
              linear-gradient(-45deg, transparent 49%, #e48b53 50%, transparent 51%)
            `,
            backgroundSize: '80px 80px',
          }}
        ></div>
      </div>

      {/* Floating Security Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Shield 1 */}
        <div 
          className="absolute w-12 h-14 bg-[#e48b53]/10 rounded-lg border border-[#e48b53]/30 animate-float"
          style={{ top: '20%', left: '15%' }}
        >
          <div className="w-8 h-8 bg-[#e48b53]/20 rounded-full mx-auto mt-2 border border-[#e48b53]/30"></div>
        </div>
        
        {/* Floating Lock 1 */}
        <div 
          className="absolute w-8 h-8 bg-white/10 rounded-lg border border-white/20 animate-float-delay-1"
          style={{ top: '60%', left: '80%' }}
        >
          <div className="w-4 h-3 bg-[#e48b53] rounded-sm mx-auto mt-1"></div>
        </div>
        
        {/* Floating Shield 2 */}
        <div 
          className="absolute w-10 h-12 bg-[#e48b53]/10 rounded-lg border border-[#e48b53]/30 animate-float-delay-2"
          style={{ top: '80%', left: '20%' }}
        >
          <div className="w-2 h-4 bg-[#e48b53]/40 mx-auto mt-3"></div>
        </div>
        
        {/* Floating Lock 2 */}
        <div 
          className="absolute w-6 h-6 bg-white/10 rounded border border-white/20 animate-float-delay-3"
          style={{ top: '40%', left: '90%' }}
        >
          <div className="w-1 h-1 bg-[#e48b53] rounded-full mx-auto mt-1"></div>
        </div>

        {/* Security Barrier Lines */}
        <div 
          className="absolute w-32 h-1 bg-[#e48b53]/30 animate-pulse"
          style={{ top: '30%', left: '5%', transform: 'rotate(45deg)' }}
        ></div>
        <div 
          className="absolute w-32 h-1 bg-[#e48b53]/30 animate-pulse"
          style={{ top: '30%', right: '5%', transform: 'rotate(-45deg)' }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(5deg);
          }
          66% {
            transform: translateY(-8px) rotate(-5deg);
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