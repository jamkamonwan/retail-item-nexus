
# Fix Channel Badges on Non-Supplier Role Screens

## Problem Identified

The SubmissionView (reviewer/approver screen) is using the wrong property for channel badges:

| Component | Property Used | Correct Property |
|-----------|--------------|-----------------|
| FormField.tsx (Supplier) | `field.channelColumn` ✓ | `channelColumn` |
| SubmissionView.tsx (Reviewer) | `field.channel` ✗ | Should use `channelColumn` |

The `field.channel` property represents which sales channel the user selected (online/offline/both), while `field.channelColumn` represents the Excel specification's column classification for the field.

---

## Current Code in SubmissionView (Lines 399-403)

```typescript
{field.channel !== 'both' && (
  <Badge variant="secondary" className="text-[10px]">
    {field.channel === 'online' ? 'Online' : 'Offline'}
  </Badge>
)}
```

This shows plain text badges based on the wrong property.

---

## Solution

### Step 1: Import ChannelBadge Component

Extract `ChannelBadge` from FormField.tsx into a shared component, or import and reuse it in SubmissionView.tsx.

### Step 2: Update SubmissionView Badge Rendering

Replace the current channel badge logic with the proper `ChannelBadge` component using `field.channelColumn`:

```typescript
// Import
import { Globe, ShoppingCart } from 'lucide-react';

// In the field card section (around line 392-404)
{/* Channel Badge - Shows Online/All Channels indicator */}
{field.channelColumn === 'online' && (
  <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
    <Globe className="w-3 h-3 mr-1" />
    Online
  </Badge>
)}
{field.channelColumn === 'both' && (
  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
    <ShoppingCart className="w-3 h-3 mr-1" />
    All Channels
  </Badge>
)}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/npd/SubmissionView.tsx` | Replace `field.channel` with `field.channelColumn` and use styled badges with icons |

---

## Visual Result

Before:
```
[SUPPLIER] [Online]  ← Plain text, based on wrong property
```

After:
```
[SUPPLIER] [🌐 Online]  ← Styled badge with globe icon
[BUYER] [🛒 All Channels]  ← Styled badge with cart icon
```

---

## Summary

This is a simple fix to ensure consistency between the Supplier form view and the Reviewer/Approver view. Both will now display the same styled channel badges (🌐 Online, 🛒 All Channels) using the `channelColumn` property from the field definitions.
