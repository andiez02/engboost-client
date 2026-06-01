import { useState, useCallback } from 'react';

const KEY = 'engboost_folder_tags';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(tags) {
  localStorage.setItem(KEY, JSON.stringify(tags));
}

export function useTagRegistry() {
  const [tags, setTags] = useState(() => load());

  const addTag = useCallback((name) => {
    const clean = name.trim().slice(0, 30);
    if (!clean) return;
    setTags(prev => {
      if (prev.includes(clean)) return prev;
      const next = [...prev, clean].sort();
      save(next);
      return next;
    });
  }, []);

  const removeTag = useCallback((name) => {
    setTags(prev => {
      const next = prev.filter(t => t !== name);
      save(next);
      return next;
    });
  }, []);

  const renameTag = useCallback((oldName, newName) => {
    const clean = newName.trim().slice(0, 30);
    if (!clean || clean === oldName) return;
    setTags(prev => {
      const next = prev.map(t => t === oldName ? clean : t).sort();
      save(next);
      return next;
    });
  }, []);

  return { tags, addTag, removeTag, renameTag };
}
