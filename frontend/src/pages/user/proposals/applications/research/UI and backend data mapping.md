# Research Proposal Application – UI & Backend Data Mapping Report

## 1. Overview

This report reviews the integration between the Research Proposal Application frontend and backend, focusing on:
- Data binding and parameter mapping in the UI
- Alignment with backend expectations
- Issues found and recommendations for improvement

---

## 2. Data Binding & Parameter Mapping

### 2.1. Economic Impact Fields
- **Frontend:** Uses both boolean flags (`exportPotential`, `importSubstitution`) and a string field (`economicImpactType`).
- **Backend:** Only one should be used for submission.
- **Recommendation:** Clarify with backend which field to use and remove duplicates.

### 2.2. File Uploads
- **Frontend:** Uses `FileList` for `supportingDocuments` and `certifications`.
- **Backend:** Expects files in `req.files` (via `multipart/form-data`).
- **Recommendation:** Use `FormData` and append files correctly before submission.

### 2.3. Technology Readiness Level
- **Frontend:** Stores as a string like `"TRL 1"`.
- **Backend:** May expect just the number (e.g., `1`).
- **Recommendation:** Confirm expected format and convert if needed.

### 2.4. Parameter Naming
- **Recommendation:** Ensure all field names match exactly between frontend and backend. Use consistent casing.

---

## 3. Validation
- **Frontend:** Validates required fields and correct structure.
- **Backend:** Should validate all required fields and file presence.

---

## 4. Action Items
- [ ] Clarify and align economic impact fields for backend compatibility.
- [ ] Ensure file upload handling matches backend requirements.
- [ ] Confirm and align technology readiness level format.
- [ ] Audit all parameter names for consistency with backend API.

---

## 5. References
- UI: Research proposal form components, form data hooks
- Backend: Research proposal application controller/schema

---

**Prepared by:** GitHub Copilot  
**Date:** July 23, 2025
