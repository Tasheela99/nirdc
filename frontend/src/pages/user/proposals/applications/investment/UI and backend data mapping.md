# Research Investment Application – UI & Backend Data Mapping Report

## 1. Overview

This report reviews the integration between the Research Investment Application frontend and backend, focusing on:
- Data binding and parameter mapping in the UI
- Alignment with backend expectations
- Issues found and recommendations for improvement

---

## 2. Data Binding & Parameter Mapping

### 2.1. Required Assistance Field
- **Frontend:** Uses a single radio value for `requiredAssistanceFromGovernment`.
- **Backend:** Expects an object with booleans for each assistance type (e.g., `{ funds: true, regulatory: false, ... }`).
- **Issue:** Only one type can be selected in the UI, but backend expects multiple.
- **Recommendation:** Change UI to use checkboxes for each type and submit as an object.

### 2.2. Numeric Fields
- **Fields:** `projectCost`, `expenditure`, `budget`
- **Frontend:** Stored as strings.
- **Backend:** Expects numbers and validates with `isNaN(Number(f.value))`.
- **Issue:** String values may cause validation errors.
- **Recommendation:** Convert to numbers before submission.

### 2.3. File Uploads
- **Frontend:** Uses `FileList` for file fields.
- **Backend:** Expects files in `req.files` (via `multipart/form-data`).
- **Recommendation:** Use `FormData` and append files correctly.

### 2.4. Parameter Naming
- **Recommendation:** Ensure all field names match exactly between frontend and backend. Use consistent casing.

---

## 3. Validation
- **Frontend:** Add validation for required numeric fields before submission.
- **Backend:** Already validates and returns clear errors for missing/invalid numeric fields.

---

## 4. Action Items
- [ ] Update required assistance UI to use checkboxes and submit as an object.
- [ ] Convert numeric fields to numbers before sending to backend.
- [ ] Ensure file uploads use `FormData` and files are appended correctly.
- [ ] Double-check all parameter names for consistency.
- [ ] Add frontend validation for required numeric fields.

---

## 5. References
- UI: Investment form components, form data hooks
- Backend: `ResearchInvestmentApplicationController.js`, `ResearchInvestmentApplicationSchema.js`

---

**Prepared by:** GitHub Copilot  
**Date:** July 23, 2025
