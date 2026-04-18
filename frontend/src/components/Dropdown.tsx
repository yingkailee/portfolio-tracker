import { useState, useEffect, useRef } from 'react';

interface DropdownItem {
  id: number | string;
  label: string;
}

interface DropdownProps {
  items: DropdownItem[];
  selectedId: number | string | null;
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  searchable?: boolean;
  manualOption?: { id: string; label: string };
  onManual?: () => void;
}

export default function Dropdown({ items, selectedId, onSelect, placeholder = '-- select --', searchable = true, manualOption, onManual }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );
  const selected = items.find(item => item.id === selectedId);
  const showManual = manualOption && selectedId === manualOption.id;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 5, minWidth: 150, background: 'white' }}
      >
        {showManual ? manualOption.label : selected?.label || placeholder} ▾
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #ccc', borderRadius: 5, minWidth: 200, maxHeight: 200, overflowY: 'auto', zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          {searchable && (
            <div style={{ padding: 8 }}>
              <input
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '4px 8px', marginBottom: 8 }}
              />
            </div>
          )}
          {manualOption && (
            <div
              onClick={() => { onManual?.(); setOpen(false); setSearch(''); }}
              style={{ padding: '8px 12px', cursor: 'pointer', background: selectedId === manualOption.id ? '#e5e7eb' : 'white' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.background = selectedId === manualOption.id ? '#e5e7eb' : 'white'}
            >
              {manualOption.label}
            </div>
          )}
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => { onSelect(item); setOpen(false); setSearch(''); }}
              style={{ padding: '8px 12px', cursor: 'pointer', background: item.id === selectedId ? '#e5e7eb' : 'white' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.background = item.id === selectedId ? '#e5e7eb' : 'white'}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}