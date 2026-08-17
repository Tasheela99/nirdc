import { Card, CardContent, TextField, MenuItem, Fade } from "@mui/material";
import React from "react";

interface ProposalTypeOption {
  value: string;
  label: string;
}

interface ProposalControlPanelProps {
  proposalTypes: ProposalTypeOption[];
  selectedProposalType: ProposalTypeOption | null;
  onProposalTypeChange: (option: ProposalTypeOption | null) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departments: { value: string; label: string }[];
  selectedDepartment: any;
  onDepartmentChange: (option: any) => void;
  statusOptions: { value: string; label: string }[];
  selectedStatus: any;
  onStatusChange: (option: any) => void;
}

const ProposalControlPanel: React.FC<ProposalControlPanelProps> = ({
  proposalTypes,
  selectedProposalType,
  onProposalTypeChange,
  searchTerm,
  onSearchChange,
  departments,
  selectedDepartment,
  onDepartmentChange,
  statusOptions,
  selectedStatus,
  onStatusChange,
}) => (
  <Fade in={true} timeout={600}>
    <Card className="mb-3 shadow-sm compact-control-panel" style={{ borderRadius: '8px' }}>
      <CardContent style={{ padding: '12px 16px' }}>
        <div className="compact-filter-grid" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* Proposal Type Filter */}
          <TextField
            select
            label="Proposal Type"
            value={selectedProposalType?.value || ""}
            onChange={e => {
              const selected = proposalTypes.find(type => type.value === e.target.value) || null;
              onProposalTypeChange(selected);
            }}
            size="small"
            style={{ minWidth: 160 }}
          >
            {proposalTypes.map(type => (
              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
            ))}
          </TextField>
          {/* Search */}
          <TextField
            label="Search Proposal"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            style={{ minWidth: 400 }}
          />
          {/* Department Filter */}
          <TextField
            select
            label="Department"
            value={selectedDepartment?.value || ""}
            onChange={e => {
              const selected = departments.find(dep => dep.value === e.target.value);
              onDepartmentChange(selected);
            }}
            size="small"
            style={{ minWidth: 160 }}
          >
            {departments.map(dep => (
              <MenuItem key={dep.value} value={dep.value}>{dep.label}</MenuItem>
            ))}
          </TextField>
          {/* Status Filter */}
          <TextField
            select
            label="Status"
            value={selectedStatus?.value || ""}
            onChange={e => {
              const selected = statusOptions.find(opt => opt.value === e.target.value);
              onStatusChange(selected);
            }}
            size="small"
            style={{ minWidth: 140 }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </div>
      </CardContent>
    </Card>
  </Fade>
);

export default ProposalControlPanel;