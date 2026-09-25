import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  variant: 'yellow' | 'green' | 'red';
  icon: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  buttonText,
  onClick,
  variant,
  icon,
}) => {
  const styles = {
    yellow: {
      cardBg: 'bg-[#FFFBEB]', // soft warm yellow tint
      accentColor: '#FFE135',
      btnBg: 'bg-[#FFE135] text-black hover:bg-yellow-300',
      iconBg: 'bg-[#FFE135] text-black',
      doodleColor: '#F59E0B',
    },
    green: {
      cardBg: 'bg-[#F0FDF4]', // soft green tint
      accentColor: '#22C55E',
      btnBg: 'bg-[#22C55E] text-white hover:bg-emerald-600',
      iconBg: 'bg-[#22C55E] text-white',
      doodleColor: '#16A34A',
    },
    red: {
      cardBg: 'bg-[#FEF2F2]', // soft red/pink tint
      accentColor: '#EF4444',
      btnBg: 'bg-[#EF4444] text-white hover:bg-rose-600',
      iconBg: 'bg-[#EF4444] text-white',
      doodleColor: '#DC2626',
    },
  }[variant];

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border-3 border-black p-6 sm:p-7 shadow-[5px_5px_0px_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] ${styles.cardBg}`}
    >
      {/* Comic Accent Marks (Top Right ///) */}
      <div className="absolute top-5 right-5 select-none font-black text-lg opacity-80" style={{ color: styles.doodleColor }}>
        ///
      </div>

      <div>
        {/* Illustrated Icon Container */}
        <div className={`mb-5 inline-flex h-13 w-13 items-center justify-center rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] ${styles.iconBg}`}>
          {icon}
        </div>

        {/* Title */}
        <h3 className="font-comic text-2xl font-bold tracking-tight text-black">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-sm leading-relaxed text-slate-700 font-medium">
          {description}
        </p>
      </div>

      {/* Comic Action Button */}
      <div className="mt-6 pt-2">
        <button
          onClick={onClick}
          className={`inline-flex items-center gap-2 rounded-xl border-2 border-black px-5 py-2.5 font-comic text-sm font-bold shadow-[3px_3px_0px_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${styles.btnBg}`}
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
