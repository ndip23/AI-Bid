import React from 'react';

interface BidoraLogoProps {
  variant?: 'light' | 'dark' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export const BidoraLogo: React.FC<BidoraLogoProps> = ({
  variant = 'light',
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  const iconSizeMap = {
    sm: 28,
    md: 36,
    lg: 48,
  };

  const textClassMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* Brand Icon using extracted artwork image */}
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src="/logo-icon.jpg"
          alt="Bidora Logo"
          className="rounded-xl object-contain shadow-sm border border-slate-200/60 bg-white"
          style={{ width: iconSizeMap[size], height: iconSizeMap[size] }}
        />
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-baseline tracking-tight font-black font-sans">
            <span className={`${textClassMap[size]} ${isDark ? 'text-white' : 'text-slate-900'}`}>
              BIDORA
            </span>
          </div>
          {showTagline && (
            <span className={`text-[10px] font-bold tracking-wider uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Discover • Qualify • Bid • Win
            </span>
          )}
        </div>
      )}
    </div>
  );
};
