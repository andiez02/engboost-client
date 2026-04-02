export function hasValidSenses(card) {
  // Phase 3: check lexicalEntry first
  if (card?.lexicalEntry?.senses) {
    return Array.isArray(card.lexicalEntry.senses) && card.lexicalEntry.senses.length > 0;
  }
  return Array.isArray(card?.senses) && card.senses.length > 0;
}

export function getFlashcardViewModel(card) {
  if (!card) return null;

  // Phase 3 — Global Shared Dictionary Model (LexicalEntry nested in response)
  if (card?.lexicalEntry) {
    const entry = card.lexicalEntry;
    const primarySense = entry.senses?.[0] || {};
    return {
      headword: entry.headword || null,
      definition: primarySense.definition || null,
      translation: primarySense.translation || null,
      example: primarySense.examples?.[0]?.sentence || null,
      pos: entry.pos || null,
      senses: entry.senses || null,
      imageUrl: entry.imageUrl || entry.image_url || null,
    };
  }

  // Phase 2 — Local senses array (dual-write, no lexicalEntry yet)
  if (Array.isArray(card?.senses) && card.senses.length > 0) {
    const primarySense = card.senses[0];
    return {
      headword: card.english || card.headword || null,
      definition: primarySense.definition || null,
      translation: primarySense.translation || null,
      example: primarySense.examples?.[0]?.sentence || null,
      pos: card.pos || null,
      senses: card.senses,
      imageUrl: card.image_url || card.imageUrl || null,
    };
  }

  // Phase 1 — Legacy flat fields fallback
  const legacyFallbackPos = !/\s/.test(card?.object || '') ? card?.object : null;
  const legacyFallbackExample = /\s/.test(card?.object || '') ? card?.object : null;

  return {
    headword: card?.english || card?.headword || null,
    definition: card?.definition || null,
    translation: card?.vietnamese || null,
    example: card?.example || card?.example_sentence || legacyFallbackExample || '',
    pos: card?.pos || legacyFallbackPos || null,
    senses: null,
    imageUrl: card.image_url || card.imageUrl || null,
  };
}
