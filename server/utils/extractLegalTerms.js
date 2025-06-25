export const extractLegalTerms = (text) => {
  const legalTermsSet = new Set();

  const patterns = [
    /\b(?:Section|Sec\.?)\s+\d+[A-Za-z]?\s+(?:of|under)?\s*(?:the\s+)?(Indian\s+Penal\s+Code|IPC|CrPC|Murder|Code\s+of\s+Criminal\s+Procedure|Protection\s+of\s+Children\s+from\s+Sexual\s+Offences\s+Act|POCSO\s+Act)/gi,
    /\bArticle\s+\d+[A-Za-z]?/gi,
    /\b(?:Indian\s+Penal\s+Code|Code\s+of\s+Criminal\s+Procedure|Protection\s+of\s+Children\s+from\s+Sexual\s+Offences\s+Act|POCSO\s+Act|Constitution\s+of\s+India)\b/gi,
  ];

  const actYearPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+Act)\s+(\d{4})\b/g;

  const normalizedText = text.replace(/\n/g, " ").replace(/\s+/g, " ");

  const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  for (const pattern of patterns) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const cleaned = match
          .replace(/\s+/g, " ")
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .trim();
        if (cleaned.length > 5) {
          legalTermsSet.add(toTitleCase(cleaned));
        }
      });
    }
  }

  let match;
  while ((match = actYearPattern.exec(normalizedText)) !== null) {
    const act = `${match[1]} ${match[2]}`.replace(/\s+/g, " ").trim();
    legalTermsSet.add(toTitleCase(act));
  }

  return Array.from(legalTermsSet);
};
