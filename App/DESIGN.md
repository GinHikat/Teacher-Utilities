# 🌙 Moon Shadow Bazaar — Design System Specification

Welcome to the official Design System specification for **Moon Shadow Bazaar** (inspired by Luminance), the mystical nocturnal theme powering the **Teacher Utilities** application.

---

## 🎨 Design Philosophy & Visual Roots

**Moon Shadow Bazaar** brings the atmosphere of a moonlit nocturnal marketplace and candlelit apothecary ledger to modern web utility engineering:
1. **Mystical Nocturnal Palette**: Deep midnight obsidian base (`#070a12`), dark eclipse navy panels (`#0a0e1a`), and moonlit slate cards (`#111625`).
2. **Candlelit Gold & Moonbeam Highlights**: Luminous gold (`#d4af37`, `#e5c158`), warm candle flame amber (`#e69138`), and silver-cyan moonbeam mist (`#8e9aaf`, `#7b9acc`).
3. **Apothecary Ledger Panes**: Fine gold/brass rules (`border-amber-500/20`), elegant display serif headings, crisp ledger badges, and glowing ambient lantern highlights.

---

## 🖌️ Color Palette System

| Token Name | Hex Code | HSL / RGB | Purpose & Aesthetic Role |
| :--- | :--- | :--- | :--- |
| **`bazaar-midnight`** | `#070a12` | `hsl(225, 33%, 5%)` | Base canvas background |
| **`bazaar-panel`** | `#0a0e1a` | `hsl(225, 33%, 7%)` | Sub-surface container background |
| **`bazaar-card`** | `#111625` | `hsl(223, 37%, 11%)` | Ledger card background |
| **`bazaar-gold`** | `#d4af37` | `hsl(46, 65%, 52%)` | Primary brand accent & CTAs |
| **`bazaar-gold-light`** | `#e5c158` | `hsl(44, 73%, 62%)` | Hover states & radiant highlights |
| **`bazaar-amber`** | `#e69138` | `hsl(31, 80%, 56%)` | Candlelit secondary accent |
| **`bazaar-moonlight`**| `#7b9acc` | `hsl(217, 45%, 64%)` | Moon mist glow & active borders |
| **`bazaar-silver`** | `#8e9aaf` | `hsl(217, 18%, 62%)` | Subtitles & fine ledger rules |

---

## 🏢 Layer Elevation & Moonlit Depth

```
[ Plane 4: Moonlit Dialogs & Modals ] ---- (z-index: 100 | blur: 24px | border: gold/30)
       ↓
[ Plane 3: Nocturnal Navigation Header ] - (z-index: 50  | blur: 16px | border: gold/20)
       ↓
[ Plane 2: Ledger Feature Cards ] -------- (z-index: 10  | blur: 12px | border: white/10)
       ↓
[ Plane 1: Atmosphere & Lantern Orbs ] --- (z-index: 1   | blur: 100px| moon/lantern glow)
       ↓
[ Canvas: Deep Midnight Sky ] ------------ (z-index: 0   | #070a12)
```

---

## 🔤 Typography & Headings

- **Display & Headings**: Elegant serif/sans typography with high contrast white text and warm gold subtitles (`.bazaar-title`).
- **Body & Metrics**: Inter / System UI with clear hierarchy and font-mono metrics.

---

## 🧩 Component Specifications

### 1. Moon Shadow Ledger Card (`.bazaar-card`)
- Background: `rgba(17, 22, 37, 0.75)`
- Backdrop Filter: `blur(20px)`
- Border: `1px solid rgba(212, 175, 55, 0.18)`
- Corner Radius: `1.25rem` (`20px`)

### 2. Candlelit Gold Primary Button (`.btn-bazaar-gold`)
- Background: `linear-gradient(135deg, #d4af37 0%, #c59b27 100%)`
- Color: `#070a12` (high-contrast dark text)
- Hover State: `linear-gradient(135deg, #e5c158 0%, #d4af37 100%)`, shadow `0 0 25px rgba(212, 175, 55, 0.4)`

### 3. Ghost Moonlight Button (`.btn-bazaar-ghost`)
- Background: `rgba(255, 255, 255, 0.04)`
- Border: `1px solid rgba(212, 175, 55, 0.25)`
- Color: `#f3e5ab`
- Hover: `bg-amber-500/10 border-amber-400/50`
