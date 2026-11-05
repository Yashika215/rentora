import React, { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';

interface EditableTextProps {
  id: string;
  defaultText: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  isEditMode: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  defaultText,
  tag = 'span',
  className = '',
  isEditMode,
}) => {
  const [text, setText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`rentora_edit_${id}`);
      return saved !== null ? saved : defaultText;
    } catch {
      return defaultText;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(text);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`rentora_edit_${id}`);
      if (saved !== null) {
        setText(saved);
      }
    } catch {}
  }, [id]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setText(tempText);
    setIsEditing(false);
    try {
      localStorage.setItem(`rentora_edit_${id}`, tempText);
    } catch {}
  };

  const Component = tag as any;

  if (isEditMode) {
    if (isEditing) {
      return (
        <form onSubmit={handleSave} className="inline-block relative z-30" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            className="px-2 py-1 bg-white border-2 border-[#4D0E13] rounded text-sm text-[#2D1517] shadow-lg outline-none"
            autoFocus
            onBlur={() => handleSave()}
          />
        </form>
      );
    }

    return (
      <Component
        onClick={() => {
          setTempText(text);
          setIsEditing(true);
        }}
        className={`${className} cursor-pointer border-2 border-dashed border-[#4D0E13] bg-[#4D0E13]/5 hover:bg-[#4D0E13]/10 rounded px-1 transition-all relative group inline-block`}
        title="Tap to edit this text live"
      >
        {text}
        <span className="absolute -top-3 -right-2 bg-[#4D0E13] text-white rounded-full p-0.5 shadow-xs opacity-80 group-hover:opacity-100">
          <Edit3 className="w-2.5 h-2.5" />
        </span>
      </Component>
    );
  }

  return <Component className={className}>{text}</Component>;
};
