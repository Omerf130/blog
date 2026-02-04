# 🎨 Design System - Minimalistic Legal Blog

A professional, minimalistic design system based on slate and blue colors.

## 🎯 Design Philosophy

- **Minimalistic**: Clean, uncluttered interfaces
- **Professional**: Suitable for legal services
- **Consistent**: Same colors and spacing throughout
- **Accessible**: High contrast, readable text
- **Modern**: Contemporary, trustworthy look

---

## 🎨 Color Palette

### Primary Slate (Headers, Navigation, Dark UI)

```scss
--slate-900: #0f172a  // Darkest
--slate-800: #1e293b  // ⭐ Your favorite! (Top bar)
--slate-700: #334155  // Headers, important text
--slate-600: #475569  // Secondary text
--slate-500: #64748b  // Muted text
--slate-400: #94a3b8  // Disabled text
--slate-300: #cbd5e1  // Light borders
--slate-200: #e2e8f0  // Borders
--slate-100: #f1f5f9  // Light backgrounds
--slate-50:  #f8fafc  // Lightest backgrounds
```

**Usage:**
- Navigation bars: `--slate-800` → `--slate-700` gradient
- Headers: `--slate-800`
- Body text: `--slate-600`
- Muted text: `--slate-500`
- Backgrounds: `--slate-50`, `--slate-100`

---

### Accent Blue (CTAs, Links, Primary Actions)

```scss
--blue-700: #1d4ed8  // Hover state
--blue-600: #2563eb  // ⭐ Primary accent
--blue-500: #3b82f6  // Lighter variant
--blue-400: #60a5fa  // Disabled state
--blue-100: #dbeafe  // Light background
--blue-50:  #eff6ff  // Lightest background
```

**Usage:**
- Primary buttons
- Links
- Important CTAs
- Active states
- Focus indicators

---

### Success Green

```scss
--green-600: #16a34a  // Primary success
--green-500: #22c55e  // Lighter variant
--green-100: #dcfce7  // Background
--green-50:  #f0fdf4  // Light background
```

**Usage:**
- Success messages
- Confirmation buttons
- Published status
- Positive indicators

---

### Warning Orange

```scss
--orange-600: #ea580c  // Primary warning
--orange-500: #f97316  // Lighter variant
--orange-100: #ffedd5  // Background
--orange-50:  #fff7ed  // Light background
```

**Usage:**
- Warning messages
- Pending states
- Draft status
- Caution indicators

---

### Error Red

```scss
--red-600: #dc2626  // Primary error
--red-500: #ef4444  // Lighter variant
--red-100: #fee2e2  // Background
--red-50:  #fef2f2  // Light background
```

**Usage:**
- Error messages
- Destructive actions (delete)
- Validation errors
- Negative indicators

---

## 📐 Spacing Scale

Based on 8px grid system:

```scss
--spacing-xs:  0.25rem  // 4px  - Tight spacing
--spacing-sm:  0.5rem   // 8px  - Small gaps
--spacing-md:  1rem     // 16px - Default spacing
--spacing-lg:  1.5rem   // 24px - Section gaps
--spacing-xl:  2rem     // 32px - Large gaps
--spacing-2xl: 3rem     // 48px - Section padding
--spacing-3xl: 4rem     // 64px - Hero padding
```

---

## 🔲 Border Radius

```scss
--radius-sm:   0.375rem  // 6px  - Buttons, inputs
--radius-md:   0.5rem    // 8px  - Cards
--radius-lg:   0.75rem   // 12px - Large cards
--radius-xl:   1rem      // 16px - Modals
--radius-full: 9999px    // Fully rounded pills
```

---

## 🌑 Shadows

Subtle, minimalistic shadows:

```scss
--shadow-xs: Minimal hover effect
--shadow-sm: Small cards
--shadow-md: Default cards
--shadow-lg: Elevated panels
--shadow-xl: Modals, popovers
```

---

## 🎭 Gradients

```scss
// Primary gradient (your favorite!)
background: linear-gradient(135deg, #1e293b 0%, #334155 100%);

// Accent gradient
background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);

// Light gradient
background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
```

---

## 📱 Component Examples

### Hero Section
```scss
background: var(--gradient-accent);
color: white;
padding: var(--spacing-3xl) var(--spacing-xl);
```

### Navigation Bar
```scss
background: var(--gradient-primary);
color: white;
border-bottom: 3px solid var(--blue-600);
```

### Card
```scss
background: white;
border: 1px solid var(--color-border);
border-radius: var(--radius-md);
box-shadow: var(--shadow-sm);
padding: var(--spacing-lg);
```

### Button (Primary)
```scss
background: var(--color-accent);
color: white;
border-radius: var(--radius-sm);
padding: 0.75rem 1.5rem;
transition: var(--transition-base);

&:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

### Button (Secondary)
```scss
background: white;
color: var(--color-text);
border: 2px solid var(--color-border);
border-radius: var(--radius-sm);

&:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-accent);
  color: var(--color-accent);
}
```

---

## ✅ Usage Guidelines

### DO ✅

- Use slate colors for professional, trustworthy elements
- Use blue for all primary actions and CTAs
- Maintain consistent spacing (8px grid)
- Use subtle shadows
- Keep borders light and minimal
- Use semantic color tokens (not raw colors)

### DON'T ❌

- Mix too many bright colors
- Use heavy, dark shadows
- Create cluttered interfaces
- Use inconsistent spacing
- Override semantic colors without reason

---

## 🎯 Semantic Tokens

Instead of using raw colors, use semantic tokens:

```scss
// ✅ Good
background: var(--color-accent);
color: var(--color-text);
border: 1px solid var(--color-border);

// ❌ Avoid
background: #2563eb;
color: #1e293b;
border: 1px solid #e2e8f0;
```

---

## 📊 Status Colors

```scss
// Success
.success {
  background: var(--color-success-bg);
  color: var(--color-success);
  border: 1px solid var(--color-success-border);
}

// Warning
.warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
  border: 1px solid var(--color-warning-border);
}

// Error
.error {
  background: var(--color-error-bg);
  color: var(--color-error);
  border: 1px solid var(--color-error-border);
}

// Info
.info {
  background: var(--color-info-bg);
  color: var(--color-info);
  border: 1px solid var(--color-info-border);
}
```

---

## 🌟 Typography Scale

```scss
// Headers
h1: 2.5rem (40px) - Page titles
h2: 2rem (32px) - Section titles
h3: 1.5rem (24px) - Subsection titles
h4: 1.25rem (20px) - Card titles

// Body
body: 1rem (16px) - Default text
small: 0.875rem (14px) - Helper text
```

---

## 🎨 Quick Reference

**Navigation:** `--gradient-primary` (slate-800 → slate-700)
**CTA Buttons:** `--color-accent` (blue-600)
**Body Text:** `--color-text` (slate-800)
**Muted Text:** `--color-text-muted` (slate-500)
**Backgrounds:** `--color-bg-secondary` (slate-50)
**Borders:** `--color-border` (slate-200)
**Cards:** White bg + `--shadow-sm` + `--radius-md`

---

**Remember**: Consistency is key! Use these variables throughout the app for a cohesive, professional look. 🎯

