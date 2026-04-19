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
  pickerStyle?: boolean;
}

export default function Dropdown({ items, selectedId, onSelect, placeholder = '-- select --', searchable = true, manualOption, onManual, pickerStyle = false }: DropdownProps) {
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

  const borderColor = pickerStyle ? '#ec4899' : '#ccc';
  const bg = pickerStyle ? '#0a0a0a' : 'white';
  const bgHover = pickerStyle ? '#ec4899' : '#f5f5f5';
  const bgSelected = pickerStyle ? '#ec4899' : '#e5e7eb';
  const textColor = pickerStyle ? '#ffffff' : 'black';

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: 5, minWidth: 150, background: bg, color: textColor }}
      >
        {showManual ? manualOption.label : selected?.label || placeholder} ▾
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, background: bg, border: `1px solid ${borderColor}`, borderRadius: 5, minWidth: 200, maxHeight: 200, overflowY: 'auto', zIndex: 100 }}>
          {searchable && (
            <div style={{ padding: 8 }}>
              <input
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '4px 8px', marginBottom: 8, background: '#1a1a1a', color: 'white', border: '1px solid #ec4899' }}
              />
            </div>
          )}
          {manualOption && (
            <div
              onClick={() => { onManual?.(); setOpen(false); setSearch(''); }}
              style={{ padding: '8px 12px', cursor: 'pointer', background: selectedId === manualOption.id ? bgSelected : bg, color: textColor }}
              onMouseEnter={e => e.currentTarget.style.background = bgHover}
              onMouseLeave={e => e.currentTarget.style.background = selectedId === manualOption.id ? bgSelected : bg}
            >
              {manualOption.label}
            </div>
          )}
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => { onSelect(item); setOpen(false); setSearch(''); }}
              style={{ padding: '8px 12px', cursor: 'pointer', background: item.id === selectedId ? bgSelected : bg, color: textColor }}
              onMouseEnter={e => e.currentTarget.style.background = bgHover}
              onMouseLeave={e => e.currentTarget.style.background = item.id === selectedId ? bgSelected : bg}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}