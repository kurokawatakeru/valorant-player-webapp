import React, { memo } from 'react';
import { Trophy } from 'lucide-react';

const PageLoadingFallback: React.FC = memo(() => {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#FF0040] border-4 border-[#FFFF00] shadow-[8px_8px_0_0_#000] flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-[#FF0040] border-2 border-[#000] animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-[#00FFFF] border-2 border-[#000] animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-[#FFFF00] border-2 border-[#000] animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="font-pixel text-xs text-[#00FFFF] mt-4 animate-pulse">LOADING...</p>
      </div>
    </div>
  );
});

PageLoadingFallback.displayName = 'PageLoadingFallback';

export default PageLoadingFallback;
