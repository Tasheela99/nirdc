# 🔍 Data Exchange Testing Guide

## 📋 How to Check if Data is Being Exchanged Properly

### 1. **Real-Time Console Monitoring**
Open your browser console (F12 → Console) and look for these logs when you submit the form:

```
=== FORM DATA DEBUG ===
Complete Form Data: { ... }
Research Place: University of Peradeniya
Resources: Battery and super capacity lab...
Social Impact: This project will not only bring...
Economic Impact Type: exportPotential
======================

=== FORM DATA TO SEND ===
research_place: University of Peradeniya
resources: Battery and super capacity lab...
socialImpact: This project will not only bring...
economicImpactType: exportPotential
========================

🚀 Starting API request...

=== API RESPONSE DEBUG ===
⏱️ Request Duration: 1234.56ms
📥 Response Status: true
📝 Response Message: Success
📊 Full Response: { ... }
=========================
```

### 2. **Network Tab Inspection**
1. Open F12 → Network tab
2. Fill out the form and submit
3. Look for a POST request to `/research-proposal-questionnaire/create`
4. Click on the request to see:
   - **Request Headers**: Content-Type should be multipart/form-data
   - **Request Payload**: Should contain all your form fields
   - **Response**: Backend's response data

### 3. **Form Summary Debug Tool**
The yellow debug section at the bottom of the form shows:
- ✅ Green = Field is present and filled
- ❌ Red = Field is missing or empty
- 🔍 Test button to verify data structure

### 4. **Common Issues to Check**

#### **Missing Fields in Request:**
- Check if fields show ❌ in the debug summary
- Verify console logs show the field values
- Ensure nested objects (significance) are properly flattened

#### **API Response Issues:**
- `Response Status: false` = Backend rejected the data
- Network errors = Connection or server issues
- Empty response = Backend processing problems

#### **Backend Processing Issues:**
- Data is sent but not stored correctly
- PDF generation doesn't include certain fields
- Database schema doesn't match frontend fields

### 5. **Testing Checklist**

#### **Before Submitting:**
- [ ] Fill all required fields including:
  - [ ] Research Location (Q10)
  - [ ] Existing Resources (Q11)
  - [ ] Select Export Potential (Q4a)
  - [ ] Fill Social Impact (Q4b)
- [ ] Check debug summary shows all ✅ green
- [ ] Open browser console (F12)
- [ ] Open Network tab

#### **During Submission:**
- [ ] Watch console logs in real-time
- [ ] Monitor Network tab for API request
- [ ] Note request duration and response

#### **After Submission:**
- [ ] Check API response status
- [ ] Verify all fields were sent in request payload
- [ ] Test PDF download to see if fields appear
- [ ] Report any missing fields with console logs

### 6. **Troubleshooting Steps**

#### **If Fields Are Missing from PDF:**
1. **Check Frontend:** Do console logs show the field data?
2. **Check API Request:** Does Network tab show field in payload?
3. **Check Backend:** Is the API response successful?
4. **Check PDF Generation:** Contact backend team with field names

#### **If Data Not Sending:**
1. **Validation Issues:** Check for validation errors
2. **Network Issues:** Check for connection errors
3. **CORS Issues:** Check browser console for CORS errors
4. **File Upload Issues:** Check if files are too large

### 7. **Enhanced Debugging (Optional)**

To use the enhanced debugging API (for developers):

```typescript
// Replace in ResearchProposalApplicationScreen.tsx
import enhancedQuestionnaireApi from "../../../../api/EnhancedQuestionnaireApi.ts";

// Then replace the API call:
const response = await enhancedQuestionnaireApi.ResearchProposalApplicationCreate(formDataToSend);
```

This provides even more detailed logging and analysis.

---

## 📞 **Getting Help**

If you find issues:
1. **Copy console logs** (all the debug output)
2. **Take screenshots** of the debug summary
3. **Note which fields** are missing from PDF
4. **Share Network tab** request/response data
5. **Contact the development team** with this information

The debug tools will help pinpoint exactly where in the data flow the issue occurs! 🎯
