# biscuit-cipher

**Encryption scheme that uses Anzac biscuits as key material (joke only).** Offline, $0, no secrets.

Deck prompt: *Encryption scheme that uses Anzac biscuits as key material (joke only).*

## How to run

```bash
npm run biscuit-cipher -- "pass the tin"
npm run biscuit-cipher -- --key "oat tin" "picnic note"
npm run biscuit-cipher -- --decode "BC{abc}·ᚨ-oat"
# or
node products/biscuit-cipher/cli.mjs
```

No message args → defaults to `pass the tin`, `oat murmur`, `golden syrup hush`, `Anzac picnic note`.

Flags: `--key <hint>`, `--decode <text>`, `-h` / `--help`

## What it does

- Sanitizes messages (default `golden syrup murmur`) and key hints (default `Anzac crumb`)
- Picks biscuit layers, crumb runes, tin seals, and baking advice (soft-hash deterministic)
- Prints a joke "ciphertext" garble with `BC-XXXX` message ids
- `--decode` runs theatre recovery — **not** real decryption

## Limits / warnings

**JOKE ONLY — NOT real encryption.** Not cryptography. Not secure. Never protects secrets. Never stores keys. Never opens network. Ciphertext exists only in stdout. Do not use for anything that matters.
