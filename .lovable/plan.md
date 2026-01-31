
# Auto-Save Draft on First Step Completion

## Overview
When a user completes the Basic Information step and clicks "Next", the system will automatically create a draft submission in the database and save the basic information. This enables progressive saving as users move through the form.

## What This Means For You
- Your data will be saved automatically when you move past the first step
- No risk of losing work if you close the browser mid-form
- Draft submissions will appear in your dashboard
- You can continue editing from where you left off

---

## Technical Details

### Changes to NPDForm Component (`src/components/npd/NPDForm.tsx`)

**1. Add state to track the current submission:**
- Add `currentSubmissionId` state to store the ID after draft creation
- Add `isSaving` state for loading feedback during saves

**2. Modify `handleNext` function:**
- On step 0 (Basic Information) completion:
  - Create a new draft submission using `createSubmission()`
  - Store the returned submission ID for subsequent updates
  - Show success toast: "Draft created"
- On subsequent steps:
  - Update the existing submission's `form_data` using `updateFormData()`
  - Show success toast: "Progress saved"

**3. Add `updateFormData` from useSubmissions hook:**
- Import and use the existing `updateFormData` function
- This function already handles filtering File objects and updating the database

**4. Update the Save Draft button:**
- Make it functional by calling `updateFormData` with current submission ID
- Disable if no submission has been created yet

### Changes to useSubmissions Hook (`src/hooks/useSubmissions.ts`)

**Minor adjustment needed:**
- Ensure `updateFormData` properly handles updating all fields including product names

### Flow Diagram

```
Step 1: Basic Information
    |
    v
[Next Button Clicked]
    |
    v
Validate Section → If Invalid → Show Error
    |
    v (Valid)
Create Draft Submission in Database
    |
    v
Store Submission ID in Component State
    |
    v
Navigate to Step 2
    |
    v
[Subsequent Next Clicks]
    |
    v
Update Existing Submission with New Form Data
```

### Database Operations

| Action | Database Call | Status |
|--------|--------------|--------|
| First "Next" (Basic Info) | INSERT into `npd_submissions` | `draft` |
| Subsequent "Next" | UPDATE `form_data` on existing record | `draft` |
| Final "Submit" | UPDATE `status` to `pending_buyer` | `pending_buyer` |

### UI Changes
- "Next" button will show brief loading state during save
- Toast notifications for draft creation and progress saves
- "Save Draft" button becomes functional for manual saves

### Files to Modify
1. `src/components/npd/NPDForm.tsx` - Main form logic changes
2. `src/hooks/useSubmissions.ts` - Minor enhancement to update function (if needed)

