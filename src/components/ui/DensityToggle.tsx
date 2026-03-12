export type Density = 'compact' | 'default' | 'comfortable';

interface DensityToggleProps {
  density: Density;
  onChange: (density: Density) => void;
}

const options: { value: Density; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
];

export function DensityToggle({ density, onChange }: DensityToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 p-0.5 shadow-sm">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            density === value
              ? 'bg-[#7626c6] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
