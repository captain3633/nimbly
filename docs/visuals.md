# Nimbly Visual System

Nimbly should feel calm, human, and trustworthy.
No neon. No finance bro vibes. No shame.

## Critical Constraints

**MUST follow these rules:**
1. All UI must support both light and dark mode
2. Do not introduce new colors unless absolutely necessary
3. Savvy UI accents use primary Sage (`#5F7D73`)
4. Deal highlights use Accent Amber (`#D9A441`)
5. Avoid harsh reds and neon colors
6. Use the defined palette below - no exceptions

## Brand colors

These define Nimbly and stay consistent across light and dark mode.

| Token | Name | Hex | Use |
|---|---|---|---|
| `--nimbly-primary` | Sage | `#5F7D73` | Primary actions, Savvy moments, links |
| `--nimbly-accent` | Amber | `#D9A441` | Deals, clearances, "worth noticing" moments only |

Usage rules:
- Sage is the default highlight color
- Amber is rare and meaningful - if everything is amber, nothing is
- Savvy always uses Sage, never Amber
- No other accent colors allowed

## Light mode palette

| Role | Hex | Notes |
|---|---|---|
| Background | `#FAFAF7` | Warm off-white |
| Card | `#FFFFFF` | Clean reading surface |
| Subtle surface | `#F1F2EE` | Sections and lists |
| Primary text | `#2E2E2E` | Soft charcoal |
| Secondary text | `#5C5C5C` | Supporting copy |
| Muted text | `#8A8A8A` | Metadata |
| Border | `#E2E3DF` | Quiet separation |

## Dark mode palette

Dark mode should be soft, not pitch black.

| Role | Hex | Notes |
|---|---|---|
| Background | `#0F1513` | Deep green-black |
| Card | `#1C2421` | Calm elevation |
| Subtle surface | `#161D1A` | Lists and containers |
| Primary text | `#EDEFEA` | Warm off-white |
| Secondary text | `#C7CBC4` | Body copy |
| Muted text | `#9AA09A` | Metadata |
| Border | `#2A332F` | Gentle structure |

## States

| State | Light | Dark | Rule |
|---|---|---|---|
| Success | `#5F7D73` | `#7FA89C` | Same family as Sage |
| Deal / Warning | `#D9A441` | `#E6BC63` | Use sparingly |
| Error | `#B5533C` | `#D07A63` | Muted, never loud |

**State rules:**
- Success states use Sage family colors
- Never use bright red for errors - use muted `#B5533C` / `#D07A63`
- Warning/deal states use Amber sparingly

## Component guidelines

- Prefer whitespace over borders
- Use radius 12 to 16px on cards and sheets
- Avoid heavy shadows - use subtle elevation only
- Keep one primary action per screen
- Empty states must feel intentional and helpful
- Buttons: Primary uses Sage, secondary uses subtle surface
- Links: Always Sage, never blue

## Savvy visual rules

Savvy should feel calm and observant.
- Use Sage for all Savvy UI accents
- Use Amber only when highlighting a deal or clearance
- Savvy copy should remain short, clear, and non-judgmental
- Savvy icon/avatar uses Sage tones

## Implementation checklist

When building UI components:
- [ ] Supports both light and dark mode
- [ ] Uses only defined palette colors
- [ ] Sage for Savvy, Amber for deals
- [ ] No harsh reds or neon colors
- [ ] Follows component guidelines above
