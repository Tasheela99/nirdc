import React from "react";
import { Box, Card, CardContent, Typography, Grid, Chip, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";

interface ResearchInvestmentProps {
  data: any;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
  UNDER_REVIEW: { label: "Under Review", color: "#3b82f6", bg: "#dbeafe" },
  APPROVED: { label: "Approved", color: "#10b981", bg: "#d1fae5" },
  REJECTED: { label: "Rejected", color: "#ef4444", bg: "#fee2e2" },
};

const InfoField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem", display: "block", mb: 0.3 }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 500, color: "#1f2937", lineHeight: 1.5 }}>
      {value || "N/A"}
    </Typography>
  </Box>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, borderLeft: "4px solid #003893", pl: 2, py: 0.5 }}>
    {icon}
    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", fontSize: "1.05rem" }}>{title}</Typography>
  </Box>
);

const BoolChip = ({ value }: { value: boolean }) => (
  <Chip
    label={value ? "Yes" : "No"}
    size="small"
    sx={{ bgcolor: value ? "#d1fae5" : "#f3f4f6", color: value ? "#059669" : "#9ca3af", fontWeight: 600, fontSize: "0.7rem" }}
  />
);

const ResearchInvestmentView: React.FC<ResearchInvestmentProps> = ({ data }) => {
  if (!data) return null;
  const status = statusConfig[data.applicationStatus] || statusConfig.PENDING;

  return (
    <Box>
      {/* ─── Branded Header ─── */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #001d4a 0%, #003893 100%)",
          borderRadius: "12px",
          p: 3,
          mb: 3,
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: "#93c5fd", letterSpacing: 1.5, fontSize: "0.7rem" }}>
              RESEARCH INVESTMENT PROPOSAL
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {data.projectTitle || "Research Investment Proposal"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#93c5fd", mt: 0.5 }}>
              Application ID: {data.applicationId}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Chip
              label={status.label}
              sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: "0.8rem", border: `1px solid ${status.color}40`, height: 32 }}
            />
            <Typography variant="caption" display="block" sx={{ color: "#93c5fd", mt: 1 }}>
              Updated: {new Date(data.updatedAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ─── Applicant Info ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<PersonIcon sx={{ color: "#003893" }} />} title="Applicant Information" />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}><InfoField label="Name" value={data.userId?.userName} /></Grid>
            <Grid item xs={12} sm={6} md={3}><InfoField label="Email" value={data.userId?.email} /></Grid>
            <Grid item xs={12} sm={6} md={3}><InfoField label="Mobile" value={data.userId?.mobile} /></Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoField label="Department" value={
                <Chip label={data.department} size="small" sx={{ bgcolor: "rgba(0,56,147,0.08)", color: "#003893", fontWeight: 600, fontSize: "0.75rem" }} />
              } />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Project & Investment Details ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<TrendingUpIcon sx={{ color: "#003893" }} />} title="Project & Investment Details" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoField label="Project Title" value={data.projectTitle} />
              <InfoField label="Investment Objectives" value={
                <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px" }}>
                  {data.investmentObjectives}
                </Typography>
              } />
              <InfoField label="Market Demand" value={data.marketDemand} />
              <InfoField label="Research Gaps" value={
                <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px" }}>
                  {data.researchGaps}
                </Typography>
              } />
              <InfoField label="Research Objectives" value={data.researchObjectives} />
              <InfoField label="Research Plan" value={
                <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px" }}>
                  {data.researchPlan}
                </Typography>
              } />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#003893", mb: 1.5 }}>Significance</Typography>
                <InfoField label="Social Impact" value={data.significance?.socialImpact} />
                <InfoField label="Environmental Impact" value={data.significance?.environmentalImpact} />
                <Grid container spacing={1}>
                  <Grid item xs={6}><InfoField label="Export Potential" value={<BoolChip value={data.significance?.exportPotential} />} /></Grid>
                  <Grid item xs={6}><InfoField label="Import Substitution" value={<BoolChip value={data.significance?.importSubstitution} />} /></Grid>
                </Grid>
              </Box>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#003893", mb: 1 }}>Intellectual Property</Typography>
                <InfoField label="Status" value={data.intellectualProperty?.status} />
              </Box>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#003893", mb: 1 }}>Technology Readiness Level</Typography>
                <Chip label={`TRL ${data.trl || "N/A"}`} sx={{ bgcolor: "#dbeafe", color: "#1d4ed8", fontWeight: 700 }} />
              </Box>
              <InfoField label="Publications" value={data.publications} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Budget & Investment ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<AttachMoneyIcon sx={{ color: "#003893" }} />} title="Budget & Investment" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}><InfoField label="Currency Value" value={data.currencyValue?.toLocaleString()} /></Grid>
                  <Grid item xs={6}><InfoField label="Project Cost" value={data.projectCost?.toLocaleString()} /></Grid>
                  <Grid item xs={6}><InfoField label="Expenditure" value={data.expenditure?.toLocaleString()} /></Grid>
                  <Grid item xs={6}><InfoField label="Budget" value={data.budget?.toLocaleString()} /></Grid>
                  <Grid item xs={6}><InfoField label="Total Investment" value={data.totalInvestment?.toLocaleString()} /></Grid>
                  <Grid item xs={6}><InfoField label="ROI" value={data.roi} /></Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoField label="Research Place" value={data.researchPlace} />
              <InfoField label="Resources & Collaborations" value={
                <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px" }}>
                  {data.resourcesCollaborations}
                </Typography>
              } />
              <InfoField label="Risk Assumptions" value={
                <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px" }}>
                  {data.riskAssumptions}
                </Typography>
              } />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Government Assistance & Documents ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<AccountBalanceIcon sx={{ color: "#003893" }} />} title="Government Assistance & Documents" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {[
                  { label: "Regulatory", value: data.requiredAssistanceFromGovernment?.regulatory },
                  { label: "Land", value: data.requiredAssistanceFromGovernment?.land },
                  { label: "Infrastructure", value: data.requiredAssistanceFromGovernment?.infrastructure },
                  { label: "Partnerships", value: data.requiredAssistanceFromGovernment?.partnerships },
                  { label: "IP", value: data.requiredAssistanceFromGovernment?.ip },
                  { label: "Technical", value: data.requiredAssistanceFromGovernment?.technicalAssistance },
                  { label: "Funds", value: data.requiredAssistanceFromGovernment?.funds },
                ].map((item) => (
                  <Grid item xs={6} sm={4} key={item.label}>
                    <Box sx={{ p: 1.5, bgcolor: item.value ? "#d1fae5" : "#f9fafb", borderRadius: "8px", textAlign: "center" }}>
                      <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                        {item.label}
                      </Typography>
                      <Box mt={0.5}><BoolChip value={item.value} /></Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {data.requiredAssistanceFromGovernment?.other && (
                <Box mt={2}><InfoField label="Other" value={data.requiredAssistanceFromGovernment.other} /></Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem", display: "block", mb: 1 }}>
                  Certifications Documents
                </Typography>
                {Array.isArray(data.certificationsDocuments) && data.certificationsDocuments.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {data.certificationsDocuments.map((doc: string, idx: number) => (
                      <Chip key={idx} icon={<InsertDriveFileIcon sx={{ fontSize: 16 }} />} label={`Certification ${idx + 1}`} component="a" href={doc} target="_blank" clickable variant="outlined" sx={{ borderColor: "#003893", color: "#003893", fontWeight: 500 }} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No certifications available.</Typography>
                )}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem", display: "block", mb: 1 }}>
                  Extra Certifications
                </Typography>
                {Array.isArray(data.extraCertificationsDocuments) && data.extraCertificationsDocuments.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {data.extraCertificationsDocuments.map((doc: string, idx: number) => (
                      <Chip key={idx} icon={<DownloadIcon sx={{ fontSize: 16 }} />} label={`Extra Cert ${idx + 1}`} component="a" href={doc} target="_blank" clickable variant="outlined" sx={{ borderColor: "#10b981", color: "#10b981", fontWeight: 500 }} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No extra certifications available.</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResearchInvestmentView;
