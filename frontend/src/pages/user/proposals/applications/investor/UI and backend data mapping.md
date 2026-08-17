# Investor Application – UI & Backend Data Mapping Report

## 1. Overview

This report reviews the integration between the Investor Application frontend and backend, focusing on:
- Data binding and parameter mapping in the UI
- Alignment with backend expectations
- Issues found and recommendations for improvement

---

## 2. Data Binding & Parameter Mapping

### 2.1. Economic Impact Fields
- **Frontend:** Uses both a top-level `economicImpact` object and a `significance.economicImpactType` field.
- **Backend:** Only one should be used for submission.
- **Recommendation:** Clarify with backend which field to use and remove duplicates.

### 2.2. File Uploads
- **Frontend:** Uses `FileList` for `documents`.
- **Backend:** Expects files in `req.files` (via `multipart/form-data`).
- **Recommendation:** Use `FormData` and append files correctly before submission.

### 2.3. Parameter Naming
- **Recommendation:** Ensure all field names match exactly between frontend and backend. Use consistent casing.

---

## 3. Validation
- **Frontend:** Validates required fields, at least one resource and one government assistance option, and file upload.
- **Backend:** Should validate all required fields and file presence.

---

## 4. Action Items
- [ ] Clarify and align economic impact fields for backend compatibility.
- [ ] Ensure file upload handling matches backend requirements.
- [ ] Audit all parameter names for consistency with backend API.

---

## 5. References
- UI: Investor form components, form data hooks
- Backend: Investor application controller/schema

---

**Prepared by:** GitHub Copilot  
**Date:** July 23, 2025
