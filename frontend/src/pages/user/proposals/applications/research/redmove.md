# Research Proposal Application – UI Data Binding & Parameter Mapping Report

## 1. Overview

This report reviews the Research Proposal Application UI implementation, focusing on:
- How form data is bound to UI components
- Whether parameter names and structures match the expected Research Proposal Application data model
- Issues found and recommendations for improvement

---

## 2. Data Binding Review

### 2.1. Form Data Structure

The form uses a central `formData` object, managed by the [`useFormData`](research-hooks/useFormData.ts) hook. The initial structure is defined in [`getInitialFormData`](research-utils/FormUtils.ts).

**Key fields include:**
- `title`
- `department`
- `researchGaps`
- `objectives`
- `significance` (object: `economicImpactType`, `exportPotential`, `importSubstitution`, `other`, `socialImpact`, `environmentalImpact`)
- `marketDemand`
- `innovation`
- `intellectualProperty` (object: `status`, `patentNumber`, `receivedDate`, `localOrInternational`)
- `technologyReadinessLevel`
- `publications`
- `researchPlan`
- `supportingDocuments`, `certifications` (FileList/null)
- `currency`, `currencyValue`, `expenditure`, `budget`, `milestone_budget`
- `research_place`
- `resources`

### 2.2. UI Component Bindings

Each section component receives `formData` and either `handleChange` or `setFormData` as props. Inputs are bound to `formData` fields by `name`.

#### Example Bindings:
- **Text fields:**  
  `<input name="title" value={formData.title} onChange={handleChange} />`
- **Nested fields:**  
  `<input name="significance.economicImpactType" value={formData.significance.economicImpactType} onChange={handleChange} />`
- **File uploads:**  
  `<input type="file" name="supportingDocuments" onChange={...} />`

---

## 3. Parameter Mapping Issues

### 3.1. Parameter Name Mismatches

- **Economic Impact:**  
  The UI uses both boolean flags (`exportPotential`, `importSubstitution`) and a string field (`economicImpactType`). The backend may expect only one representation.
- **File Uploads:**  
  `supportingDocuments` and `certifications` are handled as `FileList` in the UI, which may need conversion before backend submission.
- **Technology Readiness Level:**  
  The value is stored as a string like `"TRL 1"`, but the backend may expect just the number.

### 3.2. Validation Logic

- [`validateFormData`](research-utils/FormUtils.ts) checks for all required fields and ensures correct structure.
- Intellectual property fields are validated only if `status !== "None"`.

---

## 4. Recommendations

### 4.1. Align Economic Impact Data

- Confirm whether to use boolean flags or the string field for backend.
- Remove unused or duplicate fields.

### 4.2. Ensure File Upload Compatibility

- Convert `supportingDocuments` and `certifications` to the format expected by the backend (e.g., FormData or base64) before submission.

### 4.3. Consistent Parameter Naming

- Ensure all parameter names in the UI, form data, and backend API match exactly.
- Use consistent casing as per backend requirements.

---

## 5. Summary Table

| UI Field Name                      | Data Model Field Name                | Type      | Issue?         |
|-------------------------------------|--------------------------------------|-----------|----------------|
| title                              | title                                | string    | No             |
| department                         | department                           | string    | No             |
| researchGaps                       | researchGaps                         | string    | No             |
| objectives                         | objectives                           | string    | No             |
| significance                       | significance                         | object    | See above      |
| marketDemand                       | marketDemand                         | string    | No             |
| innovation                         | innovation                           | string    | No             |
| intellectualProperty               | intellectualProperty                 | object    | No             |
| technologyReadinessLevel           | technologyReadinessLevel             | string    | Format         |
| publications                       | publications                         | string    | No             |
| researchPlan                       | researchPlan                         | string    | No             |
| supportingDocuments                | supportingDocuments                  | FileList  | Needs conversion for backend |
| certifications                     | certifications                       | FileList  | Needs conversion for backend |
| currency                           | currency                             | string    | No             |
| currencyValue                      | currencyValue                        | string    | No             |
| expenditure                        | expenditure                          | string    | No             |
| budget                             | budget                               | string    | No             |
| milestone_budget                   | milestone_budget                     | string    | No             |
| research_place                     | research_place                       | string    | No             |
| resources                          | resources                            | string    | No             |

---

## 6. Action Items

1. **Clarify and align economic impact fields** for backend compatibility.
2. **Ensure file upload handling** matches backend requirements.
3. **Audit all parameter names** for consistency with backend API.

---

**Prepared by:** GitHub Copilot  
**Date:** July 23, 2023