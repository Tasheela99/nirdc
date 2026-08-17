import React from "react";
import { Box, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";

interface PdfResearchProposalProps {
  data: any;
}

const PdfResearchProposalLayout: React.FC<PdfResearchProposalProps> = ({ data }) => {
  if (!data) return null;
  
  return (
    <Box 
      sx={{ 
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm 15mm',
        backgroundColor: 'red',
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        lineHeight: 1.3,
        color: '#000',
        boxSizing: 'border-box',
        '& *': {
          fontSize: 'inherit !important',
          lineHeight: 'inherit !important',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3, borderBottom: '2px solid #333', pb: 2 }}>
        <Typography variant="h4" sx={{ fontSize: '18px !important', fontWeight: 'bold', color: '#333' }}>
          RESEARCH PROPOSAL
        </Typography>
        <Typography variant="subtitle1" sx={{ fontSize: '12px !important', color: '#666', mt: 1 }}>
          Application ID: {data.applicationId}
        </Typography>
      </Box>

      {/* Applicant Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '12px !important', fontWeight: 'bold', mb: 1, color: '#333' }}>
          APPLICANT INFORMATION
        </Typography>
        <TableContainer>
          <Table size="small" sx={{ '& td': { border: '1px solid #ddd', padding: '4px 8px' } }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '30%' }}>Name</TableCell>
                <TableCell>{data.userId?.userName || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                <TableCell>{data.userId?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Mobile</TableCell>
                <TableCell>{data.userId?.mobile}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Department</TableCell>
                <TableCell>{data.department}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Updated</TableCell>
                <TableCell>{new Date(data.updatedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Research Details */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '12px !important', fontWeight: 'bold', mb: 1, color: '#333' }}>
          RESEARCH DETAILS
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
            Title:
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '10px !important', mb: 1, fontStyle: 'italic' }}>
            {data.title}
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Research Gaps:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1, textAlign: 'justify' }}>
              {data.researchGaps}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Objectives:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1, textAlign: 'justify' }}>
              {data.objectives}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Innovation:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1, textAlign: 'justify' }}>
              {data.innovation}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Market Demand:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1, textAlign: 'justify' }}>
              {data.marketDemand}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Significance:
            </Typography>
            <Box sx={{ fontSize: '9px !important', mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '9px !important' }}>
                • Social Impact: {data.significance?.socialImpact}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '9px !important' }}>
                • Environmental Impact: {data.significance?.environmentalImpact}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '9px !important' }}>
                • Export Potential: {data.significance?.exportPotential ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '9px !important' }}>
                • Import Substitution: {data.significance?.importSubstitution ? "Yes" : "No"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Technical Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '12px !important', fontWeight: 'bold', mb: 1, color: '#333' }}>
          TECHNICAL INFORMATION
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Technology Readiness Level:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1 }}>
              {data.technologyReadinessLevel}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Research Location:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1 }}>
              {data.researchLocation}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Intellectual Property:
            </Typography>
            <Box sx={{ fontSize: '9px !important', mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '9px !important' }}>
                • Patent: {data.intellectualProperty?.patentNumber || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '9px !important' }}>
                • Status: {data.intellectualProperty?.status || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '9px !important' }}>
                • Type: {data.intellectualProperty?.localOrInternational || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Research Plan */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '12px !important', fontWeight: 'bold', mb: 1, color: '#333' }}>
          RESEARCH PLAN & RESOURCES
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Research Plan:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1, textAlign: 'justify' }}>
              {data.researchPlan}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Publications:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1, textAlign: 'justify' }}>
              {data.publications}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Resources:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1, textAlign: 'justify' }}>
              {data.resources}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Budget Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '12px !important', fontWeight: 'bold', mb: 1, color: '#333' }}>
          BUDGET INFORMATION
        </Typography>
        
        <TableContainer>
          <Table size="small" sx={{ '& td': { border: '1px solid #ddd', padding: '4px 8px' } }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '30%' }}>Currency</TableCell>
                <TableCell>{data.currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Currency Value</TableCell>
                <TableCell>{data.currencyValue}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Total Budget</TableCell>
                <TableCell>{data.budget}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Expenditure</TableCell>
                <TableCell>{data.expenditure}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Milestone Budget</TableCell>
                <TableCell>{data.milestone_budget}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Documents */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '12px !important', fontWeight: 'bold', mb: 1, color: '#333' }}>
          SUPPORTING DOCUMENTS
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Supporting Documents:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1 }}>
              {Array.isArray(data.supportingDocuments) && data.supportingDocuments.length > 0 
                ? `${data.supportingDocuments.length} document(s) attached` 
                : "No supporting documents"}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontSize: '10px !important', fontWeight: 'bold', mb: 0.5 }}>
              Certifications:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '9px !important', mb: 1 }}>
              {Array.isArray(data.certifications) && data.certifications.length > 0 
                ? `${data.certifications.length} certification(s) attached` 
                : "No certifications"}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #ddd', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: '8px !important', color: '#666' }}>
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default PdfResearchProposalLayout;
