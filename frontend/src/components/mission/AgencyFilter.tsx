"use client";

interface AgencyFilterProps {
  selectedAgency: string;
  onSelect: (agency: string) => void;
}

export function AgencyFilter({ selectedAgency, onSelect }: AgencyFilterProps) {
  const agencies = [
    { id: "ALL", name: "All Agencies", badge: "PORTFOLIO" },
    { id: "NASA", name: "NASA", badge: "USA" },
    { id: "ISRO", name: "ISRO", badge: "INDIA" },
    { id: "ESA", name: "ESA", badge: "EUROPE" },
    { id: "SpaceX", name: "SpaceX", badge: "COMMERCIAL" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {agencies.map((a) => {
        const isSelected = selectedAgency === a.id;
        return (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              isSelected
                ? "btn-gradient-primary text-white"
                : "glass-button text-slate-300 hover:text-white"
            }`}
          >
            <span>{a.name}</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/30 border border-white/10 opacity-80">
              {a.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
