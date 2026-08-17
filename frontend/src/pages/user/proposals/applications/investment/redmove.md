# Research Investment Application – UI Data Binding & Parameter Mapping Report

## 1. Overview

This report reviews the implementation of the Research Investment Application UI, focusing on:
- How form data is bound to UI components
- Whether parameter names and structures match the expected Research Investment Application data model
- Issues found and recommendations for improvement

---

## 2. Data Binding Review

### 2.1. Form Data Structure

The form uses a central `formData` object, managed by the `useInvestmentFormData` hook. The initial structure is defined in `getInitialInvestmentFormData`.

**Key fields include:**
- `projectTitle`
- `investmentObjectives`
- `marketDemand`
- `requiredAssistanceFromGovernment` (object with booleans for each assistance type)
- `researchGaps`, `researchObjectives`, `researchPlan`
- `currencyValue`, `projectCost`, `expenditure`, `budget`, `milestone_budget`
- `significance` (object: `economicImpactType`, `other`, `socialImpact`, `environmentalImpact`)
- `intellectualProperty` (object: `status`, `patentNumber`, `receivedDate`, `localOrInternational`)
- `trl`, `publications`
- `totalInvestment`, `roi`, `resourcesCollaborations`, `riskAssumptions`
- `certificationsDocuments`, `extraCertificationsDocuments` (FileList/null)

### 2.2. UI Component Bindings

Each section component receives `formData` and either `handleChange` or `setFormData` as props. Inputs are bound to `formData` fields by `name`.

#### Example: `InvestmentBasicInfoSection`
- Binds `projectTitle`, `investmentObjectives`, `marketDemand` to input fields.
- Uses `handleChange` for updates.

#### Example: `RequiredAssistanceSection`
- Renders radio buttons for each assistance type.
- Updates `formData.requiredAssistanceFromGovernment` with the selected value.

#### Example: `FundingSection`
- Only renders if `formData.requiredAssistanceFromGovernment.funds` is true.
- Binds funding-related fields (`researchGaps`, `researchObjectives`, etc.) to inputs.

#### Example: `InvestmentFileUploadSection`
- Handles file uploads for `certificationsDocuments` and `extraCertificationsDocuments`.
- Uses `setFormData` to update FileList fields.

---

## 3. Parameter Mapping Issues

### 3.1. Parameter Name Mismatches

- **Required Assistance:**  
  - UI uses a single radio group (`requiredAssistanceFromGovernment`) with string values, but the data model expects an object with booleans for each type (e.g., `funds: boolean`, `regulatory: boolean`, etc.).
  - This causes a mismatch: only one type can be selected in the UI, but the backend expects multiple booleans.

- **Funding Section:**  
  - `milestone_budget` is present in the UI and form data, but not referenced in validation or summary.
  - `projectCost`, `expenditure`, and `budget` are stored as strings, but validation expects numbers.

- **File Uploads:**  
  - File fields are handled as `FileList` or `null`, which is correct for the UI, but may need conversion before backend submission.

### 3.2. Validation Logic

- `validateInvestmentFormData` expects `requiredAssistanceFromGovernment.funds` to be a boolean, but the UI only allows a single string value.
- Intellectual property fields are validated only if `status !== "None"`, which matches the UI logic.

---

## 4. Recommendations

### 4.1. Align Required Assistance Data Structure

**Current UI:**
```tsx
<input
  type="radio"
  name="requiredAssistanceFromGovernment"
  value={option.name}
  checked={formData.requiredAssistanceFromGovernment === option.name}
  onChange={...}
/>
```
**Expected Data Model:**
```ts
requiredAssistanceFromGovernment: {
  funds: boolean,
  regulatory: boolean,
  land: boolean,
  infrastructure: boolean,
  technicalAssistance: boolean,
  partnerships: boolean,
  ip: boolean,
  other: string,
}
```
**Recommendation:**  
Change the UI to use checkboxes for each assistance type, updating the corresponding boolean in the object.

---

### 4.2. Ensure Numeric Fields Are Numbers

- Convert `projectCost`, `expenditure`, `budget` to numbers before validation/submission.
- Update validation to handle string-to-number conversion or enforce numeric input in the UI.

---

### 4.3. File Upload Handling

- Ensure files are converted to the format expected by the backend (e.g., base64, FormData) before submission.

---

### 4.4. Consistent Parameter Naming

- Ensure all parameter names in the UI, form data, and backend API match exactly.
- Use camelCase or snake_case consistently as per backend requirements.

---

## 5. Summary Table

| UI Field Name                      | Data Model Field Name                | Type      | Issue?         |
|-------------------------------------|--------------------------------------|-----------|----------------|
| projectTitle                        | projectTitle                         | string    | No             |
| investmentObjectives                | investmentObjectives                 | string    | No             |
| marketDemand                        | marketDemand                         | string    | No             |
| requiredAssistanceFromGovernment    | requiredAssistanceFromGovernment     | object    | **Yes** (see 4.1) |
| researchGaps                        | researchGaps                         | string    | No             |
| researchObjectives                  | researchObjectives                   | string    | No             |
| researchPlan                        | researchPlan                         | string    | No             |
| currencyValue                       | currencyValue                        | string    | No             |
| projectCost                         | projectCost                          | string    | **Yes** (should be number) |
| expenditure                         | expenditure                          | string    | **Yes** (should be number) |
| budget                              | budget                               | string    | **Yes** (should be number) |
| milestone_budget                    | milestone_budget                     | string    | Not validated  |
| researchPlace                       | researchPlace                        | string    | No             |
| significance                        | significance                         | object    | No             |
| intellectualProperty                | intellectualProperty                 | object    | No             |
| trl                                 | trl                                  | string    | No             |
| publications                        | publications                         | string    | No             |
| totalInvestment                     | totalInvestment                      | string    | No             |
| roi                                 | roi                                  | string    | No             |
| resourcesCollaborations             | resourcesCollaborations              | string    | No             |
| riskAssumptions                     | riskAssumptions                      | string    | No             |
| certificationsDocuments             | certificationsDocuments              | FileList  | No             |
| extraCertificationsDocuments        | extraCertificationsDocuments         | FileList  | No             |

---

## 6. Action Items

1. **Update Required Assistance UI** to use checkboxes and bind to boolean fields.
2. **Enforce numeric input** for cost/expenditure/budget fields and convert to numbers.
3. **Review file upload handling** for backend compatibility.
4. **Audit all parameter names** for consistency with backend API.

---

## 7. References

- InvestmentFormUtils.ts
- useInvestmentFormData.ts
- InvestmentFormTypes.ts
- All UI Section Components

---

**Prepared by:** GitHub Copilot  
**Date:** July 23, 2025