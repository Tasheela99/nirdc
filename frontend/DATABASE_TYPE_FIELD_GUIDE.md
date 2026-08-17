# Database Type Field Implementation Guide

## 🎯 Overview
මේ guide එක proposal database එකේ `proposalType` field එක add කරන්න පුළුවන් විදිය explain කරනවා.

---

## 📊 Current Situation

### **Frontend එකෙන් Type එක ගන්නේ කොහොමද:**

```typescript
// ProposalDetails.tsx - Line 202
const location = useLocation();
const {proposalType = "research-proposal"} = location.state || {};
```

**Problem:**
- Navigation state එකෙන් type එක එනවා
- Database එකේ type field එකක් නැති proposals වලට type එක detect කරන්න බැරි
- URL එකෙන් directly access කරද්දී type එක නැති වෙනවා

---

## ✅ Solution: Database එකේ Type Field එක Add කරන්න

### **Option 1: MongoDB Schema Update (Recommended)**

#### **Step 1: Backend Schema එකේ Type Field Add කරන්න**

```javascript
// Backend - Proposal Schema (models/Proposal.js or similar)

const proposalSchema = new Schema({
    // Existing fields
    applicationId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft'
    },
    
    // ⭐ NEW: Add proposalType field
    proposalType: {
        type: String,
        enum: ['investment', 'research-investment', 'research-proposal'],
        default: 'research-proposal',
        required: true,
        index: true  // For better query performance
    },
    
    // ... rest of the fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Index for faster queries
proposalSchema.index({ proposalType: 1, status: 1 });

module.exports = mongoose.model('Proposal', proposalSchema);
```

#### **Step 2: Existing Proposals Update කරන්න**

```javascript
// Backend - Migration Script (scripts/updateProposalTypes.js)

const mongoose = require('mongoose');
const Proposal = require('./models/Proposal');

async function updateProposalTypes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('Starting proposal type update...');
        
        // Get all proposals without type
        const proposals = await Proposal.find({ 
            $or: [
                { proposalType: { $exists: false } },
                { proposalType: null },
                { proposalType: '' }
            ]
        });
        
        console.log(`Found ${proposals.length} proposals to update`);
        
        for (const proposal of proposals) {
            let type = 'research-proposal'; // default
            
            // Detect type based on existing fields
            if (proposal.investmentObjectives || proposal.totalProjectInvestment) {
                type = 'investment';
            } else if (proposal.researchObjectives && proposal.projectCost) {
                type = 'research-investment';
            }
            
            // Update proposal
            await Proposal.findByIdAndUpdate(proposal._id, {
                proposalType: type
            });
            
            console.log(`Updated proposal ${proposal.applicationId} to type: ${type}`);
        }
        
        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

updateProposalTypes();
```

**Run Migration:**
```bash
# Backend folder එකේ
node scripts/updateProposalTypes.js
```

#### **Step 3: API එකෙන් Type Return කරන්න**

```javascript
// Backend - Proposal Routes (routes/proposals.js)

// Get proposal by ID
router.get('/proposals/:id', async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id)
            .populate('userId');
        
        if (!proposal) {
            return res.status(404).json({
                status: false,
                message: 'Proposal not found'
            });
        }
        
        res.json({
            status: true,
            data: {
                ...proposal.toObject(),
                proposalType: proposal.proposalType  // ⭐ Include type
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

// Create new proposal - ensure type is saved
router.post('/proposals', async (req, res) => {
    try {
        const proposalData = {
            ...req.body,
            proposalType: req.body.proposalType || 'research-proposal'  // ⭐ Save type
        };
        
        const proposal = new Proposal(proposalData);
        await proposal.save();
        
        res.status(201).json({
            status: true,
            data: proposal
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
});
```

---

### **Option 2: MongoDB Direct Update (Quick Fix)**

Database එකේ directly update කරන්න:

```javascript
// MongoDB Shell හෝ Compass එකෙන්

// All proposals එකට default type set කරන්න
db.proposals.updateMany(
    { proposalType: { $exists: false } },
    { $set: { proposalType: "research-proposal" } }
);

// Investment proposals identify කරලා update කරන්න
db.proposals.updateMany(
    { 
        investmentObjectives: { $exists: true },
        proposalType: { $exists: false }
    },
    { $set: { proposalType: "investment" } }
);

// Research-Investment proposals update කරන්න
db.proposals.updateMany(
    { 
        researchObjectives: { $exists: true },
        projectCost: { $exists: true },
        proposalType: { $exists: false }
    },
    { $set: { proposalType: "research-investment" } }
);
```

---

## 🔍 Frontend Auto-Detection (Already Implemented)

Frontend එකේ දැනටමත් auto-detection logic එක implement කරලා තියෙනවා:

```typescript
// ProposalDetails.tsx - detectProposalType function

const detectProposalType = (data: any): string => {
    if (!data) return "research-proposal";
    
    // Check database type field first
    if (data.proposalType) {
        return data.proposalType;
    }
    
    // Fallback: detect by data structure
    if (data.investmentObjectives || data.totalProjectInvestment) {
        return "investment";
    }
    
    if (data.researchObjectives || data.projectCost) {
        return "research-investment";
    }
    
    return "research-proposal";
};
```

---

## 📝 Database Field Values

```javascript
{
    proposalType: "investment" | "research-investment" | "research-proposal"
}
```

### **Field Descriptions:**

| Type | Value | Description |
|------|-------|-------------|
| Investment | `"investment"` | Investment proposals (totalProjectInvestment, expectedROI) |
| Research Investment | `"research-investment"` | Combined research + investment (researchObjectives, projectCost) |
| Research Proposal | `"research-proposal"` | Pure research proposals (default) |

---

## 🚀 Benefits

✅ **Database එකේ type තියෙනවා නම්:**
- Direct access වලටත් type එක available
- Query optimization (indexed field)
- Better data consistency
- Delete operation වලට වඩා reliable

✅ **Frontend Auto-Detection:**
- Type නැති proposals එකටත් work කරනවා (backward compatibility)
- Multiple detection strategies use කරනවා
- Fallback mechanism තියෙනවා

---

## 🧪 Testing

### **Test 1: Database Field Usage**
```javascript
// If database has proposalType field
GET /api/proposals/:id
Response: {
    status: true,
    data: {
        proposalType: "investment",  // ← From database
        // ... other fields
    }
}
```

### **Test 2: Auto-Detection Fallback**
```javascript
// If database doesn't have proposalType field
// Frontend automatically detects based on:
// - investmentObjectives → "investment"
// - researchObjectives + projectCost → "research-investment"
// - default → "research-proposal"
```

---

## 📋 Implementation Checklist

- [ ] Update MongoDB schema (add `proposalType` field)
- [ ] Run migration script (update existing proposals)
- [ ] Update API responses (include `proposalType`)
- [ ] Update proposal creation API (save `proposalType`)
- [ ] Test with different proposal types
- [ ] Test delete functionality
- [ ] Verify frontend auto-detection works as fallback

---

## 💡 Notes

1. **Frontend දැනටමත් ready** - Auto-detection logic implement කරලා තියෙනවා
2. **Backend update කරන්න ඕනෑ** - Database schema සහ API responses
3. **Backward compatible** - Type නැති proposals එකටත් work කරනවා
4. **No breaking changes** - Existing functionality affect වෙන්නේ නැහැ

---

## 🎯 Summary

**Type එක ගන්නේ කොහොමද (Priority order):**

1. 🥇 **Database Field** - `response.data.proposalType` (if available)
2. 🥈 **Navigation State** - `location.state.proposalType` (if navigated with state)
3. 🥉 **Auto-Detection** - Field-based detection (fallback)
4. 🏅 **Default** - `"research-proposal"` (last resort)

Database එකේ `proposalType` field එක add කරන එක **best solution** එක!
