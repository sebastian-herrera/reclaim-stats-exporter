## 1. Toast Notification Module

- [x] 1.1 Create `lib/toast.ts` with `showToast(message, type)` function
- [x] 1.2 Style toast as fixed element in bottom-right, above the Generate button
- [x] 1.3 Add success variant (green background) and error variant (red background)
- [x] 1.4 Implement 3-second auto-dismiss with fade-out transition

## 2. Button Success/Error State

- [x] 2.1 Add `setSuccess(count: number)` method to `create-generate-button.ts` that changes button to green and shows event count
- [x] 2.2 Add `setError()` method that changes button to red and shows "Error"
- [x] 2.3 Implement 2-second auto-revert to default state after success/error
- [x] 2.4 Ensure disabled/loading states are not overwritten by success/error revert

## 3. Route Indicator

- [x] 3.1 Create a small text label element positioned above the Generate button
- [x] 3.2 Add `setRoute(route: string | null)` method to update the label text
- [x] 3.3 Style label with muted text color and small font size
- [x] 3.4 Update `content.ts` to call `setRoute` on location change and initial load

## 4. Integration

- [x] 4.1 Call `setSuccess(result.count)` after successful extraction in `content.ts`
- [x] 4.2 Call `setError()` in the catch block in `content.ts`
- [x] 4.3 Call `showToast()` with success message and event count after extraction
- [x] 4.4 Call `showToast()` with error message in the catch block
