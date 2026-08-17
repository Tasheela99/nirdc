import React from "react";
import { Box, Card, CardContent, Typography, Grid, Chip, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface InvestmentProposalProps {
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
    <Typography component="div" variant="body1" sx={{ fontWeight: 500, color: "#1f2937", lineHeight: 1.5 }}>
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

const BoolChip = ({ value, yesLabel = "Yes", noLabel = "No" }: { value: boolean; yesLabel?: string; noLabel?: string }) => (
  <Chip
    label={value ? yesLabel : noLabel}
    size="small"
    sx={{
      bgcolor: value ? "#d1fae5" : "#f3f4f6",
      color: value ? "#059669" : "#9ca3af",
      fontWeight: 600,
      fontSize: "0.7rem",
    }}
  />
);

const InvestmentProposalView: React.FC<InvestmentProposalProps> = ({ data }) => {
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
              INVESTMENT PROPOSAL
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {data.investmentObjectives?.substring(0, 80) || "Investment Proposal"}
              {data.investmentObjectives?.length > 80 ? "..." : ""}
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

      {/* ─── Investment Details ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<TrendingUpIcon sx={{ color: "#003893" }} />} title="Investment Details" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoField label="Objectives" value={
                <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px" }}>
                  {data.investmentObjectives}
                </Typography>
              } />
              <InfoField label="Market Demand" value={data.marketDemand} />
              <Grid container spacing={2}>
                <Grid item xs={6}><InfoField label="Total Project Investment" value={data.totalProjectInvestment?.toLocaleString()} /></Grid>
                <Grid item xs={6}><InfoField label="Expected ROI" value={data.expectedROI} /></Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#003893", mb: 1.5 }}>Significance</Typography>
                <InfoField label="Social Impact" value={data.significance?.socialImpact} />
                <InfoField label="Environmental Impact" value={data.significance?.environmentalImpact} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <InfoField label="Export Potential" value={<BoolChip value={data.significance?.exportPotential} />} />
                  </Grid>
                  <Grid item xs={6}>
                    <InfoField label="Import Substitution" value={<BoolChip value={data.significance?.importSubstitution} />} />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#003893", mb: 1.5 }}>Existing Resources</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}><InfoField label="Local" value={<BoolChip value={data.existingResources?.local} />} /></Grid>
                  <Grid item xs={6}><InfoField label="International" value={<BoolChip value={data.existingResources?.international} />} /></Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Government Assistance ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<AccountBalanceIcon sx={{ color: "#003893" }} />} title="Government Assistance Required" />
          <Grid container spacing={2}>
            {[
              { label: "Regulatory", value: data.requiredAssistanceFromGovernment?.regulatory },
              { label: "Land", value: data.requiredAssistanceFromGovernment?.land },
              { label: "Infrastructure", value: data.requiredAssistanceFromGovernment?.infrastructure },
              { label: "Partnerships", value: data.requiredAssistanceFromGovernment?.partnerships },
              { label: "Intellectual Property", value: data.requiredAssistanceFromGovernment?.ip },
              { label: "Technical Assistance", value: data.requiredAssistanceFromGovernment?.technicalAssistance },
              { label: "Funds", value: data.requiredAssistanceFromGovernment?.funds },
            ].map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item.label}>
                <Box sx={{ p: 1.5, bgcolor: item.value ? "#d1fae5" : "#f9fafb", borderRadius: "8px", textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                    {item.label}
                  </Typography>
                  <Box mt={0.5}><BoolChip value={item.value} /></Box>
                </Box>
              </Grid>
            ))}
            {data.requiredAssistanceFromGovernment?.other && (
              <Grid item xs={12}>
                <InfoField label="Other Requirements" value={data.requiredAssistanceFromGovernment.other} />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Risk & Documents ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<WarningAmberIcon sx={{ color: "#003893" }} />} title="Risk & Documents" />
          <InfoField label="Risk & Assumptions" value={
            <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px" }}>
              {data.riskAndAssumptions}
            </Typography>
          } />
          <Box mt={2}>
            <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem", display: "block", mb: 1 }}>
              Documents
            </Typography>
            {Array.isArray(data.documents) && data.documents.length > 0 ? (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {data.documents.map((doc: string, idx: number) => (
                  <Chip
                    key={idx}
                    icon={<InsertDriveFileIcon sx={{ fontSize: 16 }} />}
                    label={`Document ${idx + 1}`}
                    component="a"
                    href={doc}
                    target="_blank"
                    clickable
                    variant="outlined"
                    sx={{ borderColor: "#003893", color: "#003893", fontWeight: 500 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No documents available.</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InvestmentProposalView;
