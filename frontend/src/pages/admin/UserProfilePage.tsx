import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Calendar,
} from "lucide-react";
import proposalApi from "../../api/ProposalApi";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  mobile: string;
  designation: string;
  institution: string;
  country: string;
  role: string;
  activeState: boolean;
  isVerified: boolean;
  isEmailVerified: boolean;
  lastLoginTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

const roleBadge: Record<string, { bg: string; color: string; label: string }> = {
  SUPER_ADMIN: { bg: "#fef2f2", color: "#dc2626", label: "Super Admin" },
  ADMIN: { bg: "#eff6ff", color: "#2563eb", label: "Admin" },
  DIRECTOR: { bg: "#f0fdf4", color: "#16a34a", label: "Director" },
  USER: { bg: "#faf5ff", color: "#7c3aed", label: "Contributor" },
};

const UserProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const user = (location.state as any)?.user as UserData | undefined;

  const [proposals, setProposals] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!id) return;
      try {
        const res = (await proposalApi.getUserProposals(id)) as any;
        if (res?.status && res.data) {
          const d = res.data;
          const all = [
            ...(d.investorApplications || []).map((p: any) => ({ ...p, _type: "investment" })),
            ...(d.researchProposals || []).map((p: any) => ({ ...p, _type: "research-proposal" })),
            ...(d.researchInvestments || []).map((p: any) => ({ ...p, _type: "research-investment" })),
          ];
          // Sort by newest first
          all.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setProposals(all);
        }
      } catch {
        // User may not have proposals
      } finally {
        setLoadingProposals(false);
      }
    };
    fetchProposals();
  }, [id]);

  if (!user) {
    return (
      <Box className="flex flex-col items-center justify-center py-20 gap-4">
        <Typography variant="h6" color="text.secondary">User data not available</Typography>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-4 py-2 rounded-lg bg-[#003893] text-white text-sm font-medium hover:bg-[#002d7a] transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </Box>
    );
  }

  const role = roleBadge[user.role] || roleBadge.USER;
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  const infoFields = [
    { icon: <User size={16} />, label: "First Name", value: user.firstName },
    { icon: <User size={16} />, label: "Last Name", value: user.lastName },
    { icon: <Briefcase size={16} />, label: "Designation", value: user.designation },
    { icon: <Building2 size={16} />, label: "Institution", value: user.institution },
    { icon: <Phone size={16} />, label: "Mobile", value: user.mobile },
    { icon: <Mail size={16} />, label: "Email", value: user.email },
    { icon: <Globe size={16} />, label: "Country", value: user.country },
    { icon: <Shield size={16} />, label: "Role", value: role.label },
    {
      icon: user.activeState ? <CheckCircle size={16} /> : <XCircle size={16} />,
      label: "Account Status",
      value: user.activeState ? "Active" : "Inactive",
      chipColor: user.activeState ? "#16a34a" : "#dc2626",
    },
    {
      icon: user.isEmailVerified ? <CheckCircle size={16} /> : <XCircle size={16} />,
      label: "Email Verified",
      value: user.isEmailVerified ? "Verified" : "Not Verified",
      chipColor: user.isEmailVerified ? "#16a34a" : "#f59e0b",
    },
    {
      icon: <Calendar size={16} />,
      label: "Registered",
      value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A",
    },
    {
      icon: <Clock size={16} />,
      label: "Last Login",
      value: user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never",
    },
  ];

  const getProposalType = (p: any): { label: string; color: string; routeType: string } => {
    if (p._type === "investment") return { label: "Investment", color: "#2563eb", routeType: "investment" };
    if (p._type === "research-investment") return { label: "Research Investment", color: "#7c3aed", routeType: "research-investment" };
    return { label: "Research Proposal", color: "#16a34a", routeType: "research-proposal" };
  };

  const getStatusChip = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      PENDING: { bg: "#fef3c7", color: "#92400e" },
      APPROVED: { bg: "#d1fae5", color: "#065f46" },
      REJECTED: { bg: "#fee2e2", color: "#991b1b" },
    };
    const s = map[status?.toUpperCase()] || map.PENDING;
    return <Chip label={status || "Pending"} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: "0.7rem", height: 24 }} />;
  };

  return (
    <Box>
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mb-4 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* ─── Header Banner ─── */}
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
        <Box display="flex" alignItems="center" gap={3}>
          {/* Avatar */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "16px",
              bgcolor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </Box>
          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: "#93c5fd", letterSpacing: 1.5, fontSize: "0.7rem" }}>
              USER PROFILE
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.3, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: "#93c5fd", mt: 0.3 }}>
              {user.email}
            </Typography>
          </Box>
          {/* Role badge */}
          <Box textAlign="right" flexShrink={0}>
            <Chip
              label={role.label}
              sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontSize: "0.8rem", height: 32, border: "1px solid rgba(255,255,255,0.25)" }}
            />
            <Typography variant="caption" display="block" sx={{ color: "#93c5fd", mt: 1 }}>
              @{user.userName}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ─── User Information ─── */}
      <Card elevation={0} sx={{ mb: 3, border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2.5}>
            <Box sx={{ width: 4, height: 24, bgcolor: "#003893", borderRadius: 2 }} />
            <User size={20} color="#003893" />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937" }}>
              User Information
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {infoFields.map((field, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <Box sx={{ p: 1.5, borderRadius: "8px", border: "1px solid #f3f4f6", bgcolor: "#fafbfc", height: "100%" }}>
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <Box sx={{ color: "#6b7280" }}>{field.icon}</Box>
                    <Typography variant="caption" sx={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.65rem" }}>
                      {field.label}
                    </Typography>
                  </Box>
                  {field.chipColor ? (
                    <Chip
                      label={field.value}
                      size="small"
                      sx={{ bgcolor: field.chipColor + "15", color: field.chipColor, fontWeight: 600, fontSize: "0.75rem", height: 24, mt: 0.3 }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937", fontSize: "0.85rem" }}>
                      {field.value || "N/A"}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* ─── User's Proposals ─── */}
      <Card elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: "12px" }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2.5}>
            <Box sx={{ width: 4, height: 24, bgcolor: "#003893", borderRadius: 2 }} />
            <FileText size={20} color="#003893" />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937" }}>
              Submitted Proposals
            </Typography>
            <Chip label={proposals.length} size="small" sx={{ ml: 1, bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: "0.75rem", height: 22 }} />
          </Box>

          {loadingProposals ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={28} sx={{ color: "#003893" }} />
            </Box>
          ) : proposals.length === 0 ? (
            <Box textAlign="center" py={4}>
              <FileText size={40} className="mx-auto mb-2 text-gray-300" />
              <Typography variant="body2" color="text.secondary">
                No proposals submitted yet
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Application ID', 'Title', 'Type', 'Status', 'Date', 'View'].map((col) => (
                      <TableCell key={col} sx={{
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: '#4B5563',
                          backgroundColor: '#F9FAFB',
                          borderBottom: '2px solid #E5E7EB',
                          py: 1.5,
                      }}>
                          {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {proposals.map((proposal, idx) => {
                    const pType = getProposalType(proposal);
                    const title = proposal.title || proposal.projectTitle || proposal.investmentObjectives?.substring(0, 60) || "Untitled";
                    const appId = proposal.applicationId || proposal._id?.substring(0, 10);
                    const date = proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

                    return (
                      <TableRow
                        key={proposal._id || idx}
                        sx={{
                          backgroundColor: "white",
                        }}
                      >
                        <TableCell sx={{ py: 1.5, fontSize: "0.8rem", fontFamily: "monospace", color: "#6b7280" }}>{appId}</TableCell>
                        <TableCell sx={{ py: 1.5, fontWeight: 500, color: "#1f2937", fontSize: "0.85rem", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {title}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip label={pType.label} size="small" sx={{ bgcolor: pType.color + "15", color: pType.color, fontWeight: 600, fontSize: "0.7rem", height: 22 }} />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>{getStatusChip(proposal.status)}</TableCell>
                        <TableCell sx={{ py: 1.5, fontSize: "0.8rem", color: "#6b7280" }}>{date}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Tooltip title="View Proposal">
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigate(`/admin/proposal-details/${proposal._id}`, {
                                  state: { proposalType: pType.routeType },
                                });
                              }}
                              sx={{ color: "#003893", "&:hover": { bgcolor: "#eff6ff" } }}
                            >
                              <Eye size={16} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfileScreen;
