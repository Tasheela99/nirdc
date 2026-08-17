# Investor Application – UI Data Binding & Parameter Mapping Report

## 1. Overview

This report reviews the Investor Application UI implementation, focusing on:
- How form data is bound to UI components
- Whether parameter names and structures match the expected Investor Application data model
- Issues found and recommendations for improvement

---

## 2. Data Binding Review

### 2.1. Form Data Structure

The form uses a central `formData` object, managed by the `useInvestorFormData` hook. The initial structure is defined in `getDefaultInvestorFormData`.

**Key fields include:**
- `investmentObjectives`
- `department`
- `marketDemand`
- `economicImpact` (object: `exportPotential`, `importSubstitution`, `other`)
- `socialImpact`
- `environmentalImpact`
- `totalInvestment`
- `expectedROI`
- `existingResources` (object: `local`, `international`)
- `requiredAssistance` (object: `regulatory`, `land`, `infrastructure`, `partnerships`, `ip`, `other`)
- `governmentAssistance` (object: `regulatoryApprovals`, `land`, `accessInfrastructure`, `technicalAssistance`, `industryPartnerships`, `ipPatentApplications`, `other`)
- `riskAssumptions`
- `documents` (FileList/null)
- `significance` (object: `economicImpactType`, `other`, `socialImpact`, `environmentalImpact`)

### 2.2. UI Component Bindings

Each section component receives `formData` and either `handleChange` or `setFormData` as props. Inputs are bound to `formData` fields by `name`.

#### Example: `InvestorBasicInfoSection`
- Binds `investmentObjectives`, `marketDemand` to textarea fields.
- Uses `handleChange` for updates.

#### Example: `InvestorSignificanceSection`
- Binds `significance.economicImpactType`, `significance.other`, `significance.socialImpact`, `significance.environmentalImpact` to radio/textarea fields.

#### Example: `InvestorAnalysisSection`
- Binds `totalInvestment`, `expectedROI` to textarea fields.

#### Example: `InvestorResourcesSection`
- Binds `existingResources.local`, `existingResources.international` to checkboxes.

#### Example: `InvestorGovernmentAssistanceSection`
- Binds each `governmentAssistance` field to checkboxes and text input for "other".
- Binds `riskAssumptions` to textarea.

#### Example: `InvestorFileUploadSection`
- Handles file uploads for `documents` using `setFormData`.

---

## 3. Parameter Mapping Issues

### 3.1. Parameter Name Mismatches

- **Economic Impact:**  
  - There is both a top-level `economicImpact` object and a `significance.economicImpactType` field. Ensure only one is used for backend submission.
- **Government Assistance:**  
  - UI and data model use matching keys, but backend mapping should be confirmed.
- **File Uploads:**  
  - `documents` is handled as `FileList` in the UI, which may need conversion before backend submission.

### 3.2. Validation Logic

- `validateInvestorFormData` checks for all required fields and ensures at least one resource and one government assistance option is selected.
- File upload is required.

---

## 4. Recommendations

### 4.1. Align Economic Impact Data

- Confirm whether to use `economicImpact` or `significance.economicImpactType` for backend.
- Remove unused or duplicate fields.

### 4.2. Ensure File Upload Compatibility

- Convert `documents` to the format expected by the backend (e.g., FormData or base64) before submission.

### 4.3. Consistent Parameter Naming

- Ensure all parameter names in the UI, form data, and backend API match exactly.
- Use consistent casing as per backend requirements.

---

## 5. Summary Table

| UI Field Name                      | Data Model Field Name                | Type      | Issue?         |
|-------------------------------------|--------------------------------------|-----------|----------------|
| investmentObjectives                | investmentObjectives                 | string    | No             |
| department                         | department                           | string    | No             |
| marketDemand                        | marketDemand                         | string    | No             |
| economicImpact                      | economicImpact                       | object    | Possible duplicate with significance |
| socialImpact                        | socialImpact                         | string    | No             |
| environmentalImpact                 | environmentalImpact                  | string    | No             |
| totalInvestment                     | totalInvestment                      | string    | No             |
| expectedROI                         | expectedROI                          | string    | No             |
| existingResources                   | existingResources                    | object    | No             |
| requiredAssistance                  | requiredAssistance                   | object    | No             |
| governmentAssistance                | governmentAssistance                 | object    | No             |
| riskAssumptions                     | riskAssumptions                      | string    | No             |
| documents                           | documents                            | FileList  | Needs conversion for backend |
| significance                        | significance                         | object    | See above      |

---

## 6. Action Items

1. **Clarify and align economic impact fields** for backend compatibility.
2. **Ensure file upload handling** matches backend requirements.
3. **Audit all parameter names** for consistency with backend API.

---

## 7. References

- InvestorFormUtils.ts
- useInvestorFormData.ts
- InvestorFormTypes.ts
- All UI Section Components

---

**Prepared by:** GitHub Copilot  
**Date:** July 23, 2025