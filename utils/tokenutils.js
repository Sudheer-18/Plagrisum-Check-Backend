const CORE_KEYWORDS = new Set([
  "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "return",
  "true", "false", "null", "void", "class", "struct", "public", "private", "protected",
  "static", "final", "const", "new", "try", "catch", "finally", "throw", "throws",
  "def", "lambda", "function", "var", "let", "import", "package", "module"
]);

function clean(code) {
  return code
    .replace(/\/\/.*|#.*|\/\*[^]*?\*\//g, '')
    .replace(/^\s*(import|using|#include).*$|^\s*from\s+\w+\s+import.*$/gm, '')
    .replace(/^\s*print\(.*$|^\s*console\.log\(.*$/gm, '');
}

function tokenize(code) {
  return code.toLowerCase().match(/\w+/g) || [];
}

function extractIdentifiers(code) {
  const tokens = tokenize(clean(code));
  return new Set(tokens.filter(t => !CORE_KEYWORDS.has(t) && isNaN(t)));
}

function identifierSimilarity(c1, c2) {
  const ids1 = extractIdentifiers(c1);
  const ids2 = extractIdentifiers(c2);
  const intersection = new Set([...ids1].filter(x => ids2.has(x))).size;
  const union = new Set([...ids1, ...ids2]).size;
  return union === 0 ? 1 : intersection / union;
}

function normaliseTokens(code) {
  const tokens = tokenize(clean(code));
  return tokens.map(t => (!CORE_KEYWORDS.has(t) && /^[a-z]/i.test(t)) ? 'id' : t);
}

module.exports = {
  identifierSimilarity,
  normaliseTokens
};