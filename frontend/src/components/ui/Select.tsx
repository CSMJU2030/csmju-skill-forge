'use client';

import { Listbox } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react-dom';

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

// A fully custom listbox, deliberately replacing the native <select> (native
// selects mostly ignore our CSS, which is what made the career-path picker
// look broken originally).
//
// The options panel is rendered through a React Portal straight into
// <body>, positioned with floating-ui — NOT inside whatever card this Select
// happens to sit in. Without this, a Select nested inside a container that
// has `overflow-hidden` (e.g. the dashboard's dark hero card, which needs
// overflow-hidden to clip its decorative background circles) gets its
// dropdown panel silently clipped/cut off by that same ancestor, which is
// what caused it to look like it "jumped out of frame".
export function Select({
  value,
  onChange,
  options,
  placeholder = 'เลือก...',
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const selected = options.find((o) => o.value === value);
  const isDisabled = disabled || options.length === 0;

  // Portals need `document`, which doesn't exist during server rendering —
  // only render the portal once mounted on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${Math.max(rects.reference.width, 240)}px`,
            maxHeight: `${Math.min(availableHeight, 256)}px`,
          });
        },
      }),
    ],
  });

  return (
    <Listbox value={value} onChange={onChange} disabled={isDisabled}>
      <Listbox.Button
        ref={refs.setReference}
        className={`font-body text-sm w-full flex items-center justify-between gap-2 rounded-module border px-4 py-2.5 text-left transition-colors ${
          isDisabled
            ? 'bg-tertiary border-secondary text-neutral/40 cursor-not-allowed'
            : 'bg-white border-secondary text-neutral hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40'
        }`}
      >
        <span className="truncate">
          {options.length === 0 ? 'ยังไม่มีข้อมูล' : selected?.label ?? placeholder}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-neutral/40" aria-hidden="true" />
      </Listbox.Button>

      {mounted &&
        createPortal(
          <Listbox.Options
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-50 overflow-auto rounded-module bg-white border border-secondary py-1.5 shadow-lg focus:outline-none"
          >
            {options.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className={({ active }) =>
                  `font-body text-sm cursor-pointer select-none px-4 py-2.5 flex items-start justify-between gap-2 ${
                    active ? 'bg-secondary text-primary' : 'text-neutral'
                  }`
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <span>
                      <span className="block">{opt.label}</span>
                      {opt.hint && <span className="block text-xs text-neutral/50 mt-0.5">{opt.hint}</span>}
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>,
          document.body,
        )}
    </Listbox>
  );
}
