import { useState, useEffect } from 'react';

export const useScrollSpy = (ids: string[], offset = 100): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsString = ids.join(',');

  useEffect(() => {
    const idList = idsString.split(',').filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${offset}px 0px -70% 0px`,
      }
    );

    idList.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [idsString, offset]);

  return activeId;
};
