const { normaliseTokens } = require('./tokenutils');
const CRC32 = require('crc-32');

const BASE = 1_000_003;
const MOD = (1n << 61n) - 1n;

function crc32(str) {
  return CRC32.str(str) >>> 0;
}

function modAdd(a, b, m) {
  return (a + b) % m;
}
function modSub(a, b, m) {
  return (a - b + m) % m;
}
function modMul(a, b, m) {
  return (a * b) % m;
}
function modPow(base, exp, m) {
  let res = 1n;
  let b = BigInt(base);
  while (exp > 0) {
    if (exp % 2 === 1) res = modMul(res, b, m);
    b = modMul(b, b, m);
    exp = Math.floor(exp / 2);
  }
  return res;
}

function kgramHashes(tokens, k) {
  const vals = tokens.map(t => crc32(t));
  const out = [];
  let hash = 0;
  const power = Math.pow(BASE, k - 1);
  for (let i = 0; i <= vals.length - k; i++) {
    if (i === 0) {
      for (let j = 0; j < k; j++) {
        hash = hash * BASE + vals[j];
      }
    } else {
      hash = (hash - vals[i - 1] * power) * BASE + vals[i + k - 1];
    }
    out.push(hash >>> 0);
  }
  return out;
}

function winnow(hashes, window) {
  if (window >= hashes.length) return new Set(hashes);
  const fp = new Set();
  let min = Infinity;
  let pos = -1;
  for (let i = 0; i <= hashes.length - window; i++) {
    if (pos < i) {
      min = Infinity;
      for (let j = 0; j < window; j++) {
        if (hashes[i + j] < min) {
          min = hashes[i + j];
          pos = i + j;
        }
      }
      fp.add(min);
    } else {
      const newVal = hashes[i + window - 1];
      if (newVal <= min) {
        min = newVal;
        pos = i + window - 1;
        fp.add(min);
      }
    }
  }
  return fp;
}

function logicSimilarity(c1, c2, k, window) {
  const norm1 = normaliseTokens(c1);
  const norm2 = normaliseTokens(c2);

  if (norm1.length < 200 || norm2.length < 200) window = 1;

  const fp1 = winnow(kgramHashes(norm1, k), window);
  const fp2 = winnow(kgramHashes(norm2, k), window);

  const intersection = [...fp1].filter(x => fp2.has(x)).length;
  const union = new Set([...fp1, ...fp2]).size;
  return union === 0 ? 1 : intersection / union;
}

module.exports = {
  logicSimilarity
};
