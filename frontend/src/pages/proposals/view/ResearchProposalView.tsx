import React from "react";
import { Box, Card, CardContent, Typography, Grid, Chip, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import ScienceIcon from "@mui/icons-material/Science";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";

interface ResearchProposalProps {
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
    <Typography
      variant="caption"
      sx={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem", display: "block", mb: 0.3 }}
    >
      {label}
    </Typography>
    <Typography variant="body1" component="div" sx={{ fontWeight: 500, color: "#1f2937", lineHeight: 1.5 }}>
      {value || "N/A"}
    </Typography>
  </Box>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, borderLeft: "4px solid #003893", pl: 2, py: 0.5 }}>
    {icon}
    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", fontSize: "1.05rem" }}>
      {title}
    </Typography>
  </Box>
);

const ResearchProposalView: React.FC<ResearchProposalProps> = ({ data }) => {
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
              RESEARCH PROPOSAL
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {data.title || "Untitled Proposal"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#93c5fd", mt: 0.5 }}>
              Application ID: {data.applicationId}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Chip
              label={status.label}
              sx={{
                bgcolor: status.bg,
                color: status.color,
                fontWeight: 700,
                fontSize: "0.8rem",
                border: `1px solid ${status.color}40`,
                height: 32,
              }}
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
            <Grid item xs={12} sm={6} md={3}>
              <InfoField label="Name" value={data.userId?.userName} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoField label="Email" value={data.userId?.email} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoField label="Mobile" value={data.userId?.mobile} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoField label="Department" value={
                <Chip label={data.department} size="small" sx={{ bgcolor: "rgba(0,56,147,0.08)", color: "#003893", fontWeight: 600, fontSize: "0.75rem" }} />
              } />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Proposal Details ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<DescriptionIcon sx={{ color: "#003893" }} />} title="Proposal Details" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoField label="Title" value={data.title} />
              <InfoField label="Research Gaps" value={
                <Box sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px", fontSize: "0.875rem" }}>
                  {data.researchGaps}
                </Box>
              } />
              <InfoField label="Objectives" value={
                <Box sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px", fontSize: "0.875rem" }}>
                  {data.objectives}
                </Box>
              } />
              <InfoField label="Market Demand" value={data.marketDemand} />
              <InfoField label="Innovation" value={data.innovation} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#003893", mb: 1.5 }}>Significance</Typography>
                <InfoField label="Social Impact" value={data.significance?.socialImpact} />
                <InfoField label="Environmental Impact" value={data.significance?.environmentalImpact} />
                <InfoField label="Economic Impact" value={data.significance?.economicImpact} />
              </Box>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#003893", mb: 1.5 }}>Intellectual Property</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}><InfoField label="Patent Number" value={data.intellectualProperty?.patentNumber} /></Grid>
                  <Grid item xs={6}><InfoField label="Status" value={data.intellectualProperty?.status} /></Grid>
                  <Grid item xs={6}><InfoField label="Received Date" value={data.intellectualProperty?.receivedDate ? new Date(data.intellectualProperty.receivedDate).toLocaleDateString() : "N/A"} /></Grid>
                  <Grid item xs={6}><InfoField label="Type" value={data.intellectualProperty?.localOrInternational} /></Grid>
                </Grid>
              </Box>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#003893", mb: 1 }}>Technology Readiness Level</Typography>
                <Chip label={`TRL ${data.technologyReadinessLevel || "N/A"}`} sx={{ bgcolor: "#dbeafe", color: "#1d4ed8", fontWeight: 700 }} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Research Plan & Resources ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<ScienceIcon sx={{ color: "#003893" }} />} title="Research Plan & Resources" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoField label="Publications" value={
                <Box sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px", fontSize: "0.875rem" }}>
                  {data.publications}
                </Box>
              } />
              <InfoField label="Research Plan" value={
                <Box sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px", fontSize: "0.875rem" }}>
                  {data.researchPlan}
                </Box>
              } />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoField label="Research Location" value={data.research_place} />
              <InfoField label="Resources" value={
                <Box sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.7, bgcolor: "#f9fafb", p: 1.5, borderRadius: "8px", fontSize: "0.875rem" }}>
                  {data.resources}
                </Box>
              } />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Budget & Documents ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<AttachMoneyIcon sx={{ color: "#003893" }} />} title="Budget & Documents" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#f9fafb", borderRadius: "10px", p: 2.5 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}><InfoField label="Currency" value={data.currency} /></Grid>
                  <Grid item xs={6}><InfoField label="Currency Value" value={data.currencyValue?.toLocaleString()} /></Grid>
                  <Grid item xs={6}><InfoField label="Expenditure" value={data.expenditure?.toLocaleString()} /></Grid>
                  <Grid item xs={6}><InfoField label="Budget" value={data.budget?.toLocaleString()} /></Grid>
                  <Grid item xs={12}><InfoField label="Milestone Budget" value={data.milestone_budget} /></Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem", display: "block", mb: 1 }}>
                  Supporting Documents
                </Typography>
                {Array.isArray(data.supportingDocuments) && data.supportingDocuments.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {data.supportingDocuments.map((doc: string, idx: number) => (
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
                  <Typography variant="body2" color="text.secondary">No supporting documents available.</Typography>
                )}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.7rem", display: "block", mb: 1 }}>
                  Certifications
                </Typography>
                {Array.isArray(data.certifications) && data.certifications.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {data.certifications.map((doc: string, idx: number) => (
                      <Chip
                        key={idx}
                        icon={<DownloadIcon sx={{ fontSize: 16 }} />}
                        label={`Certification ${idx + 1}`}
                        component="a"
                        href={doc}
                        target="_blank"
                        clickable
                        variant="outlined"
                        sx={{ borderColor: "#10b981", color: "#10b981", fontWeight: 500 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No certifications available.</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResearchProposalView;
