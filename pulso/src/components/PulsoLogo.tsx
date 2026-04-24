// Heartbeat-wave icon in a green rounded square + wordmark

export function PulsoLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'w-6 h-6 rounded-md' : 'w-7 h-7 rounded-lg';
  const text = size === 'sm' ? 'text-base' : 'text-lg';
  return (
    <div className="flex items-center gap-2">
      <div className={`${box} bg-pulso flex items-center justify-center shrink-0`}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <polyline
            points="1,6 4,6 6,1 8.5,11 11,6 14,6 15.5,3.5 17,6"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <span className={`font-bold text-slate-900 ${text} tracking-tight`}>pulso</span>
    </div>
  );
}
