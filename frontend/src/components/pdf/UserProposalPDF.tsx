import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// --- Types ---
export type ProposalType = 'investment' | 'research' | 'researchInvestment';
export interface UserId { firstName?: string; lastName?: string; }
export interface InvestmentProposal {
  userId?: UserId;
  department?: string;
  applicationId?: string;
  applicationStatus?: string;
  createdAt?: string;
  investmentObjectives?: string;
  marketDemand?: string;
  totalProjectInvestment?: string;
  expectedROI?: string;
  riskAndAssumptions?: string;
  [key: string]: any;
}
export interface ResearchProposal {
  userId?: UserId;
  department?: string;
  applicationId?: string;
  applicationStatus?: string;
  createdAt?: string;
  title?: string;
  objectives?: string;
  researchGaps?: string;
  marketDemand?: string;
  innovation?: string;
  budget?: string | number;
  research_place?: string;
  [key: string]: any;
}
export interface ResearchInvestmentProposal {
  userId?: UserId;
  department?: string;
  applicationId?: string;
  applicationStatus?: string;
  createdAt?: string;
  projectTitle?: string;
  investmentObjectives?: string;
  marketDemand?: string;
  budget?: string | number;
  researchPlace?: string;
  [key: string]: any;
}

// Table-like styles for the PDF
const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 16,
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
  },
  page: { padding: 24, fontSize: 11, fontFamily: 'Helvetica' },
  section: { marginBottom: 16 },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellLabel: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    padding: 6,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  },
  tableCellValue: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    padding: 6,
    textAlign: 'left',
    // wordBreak is not supported in @react-pdf/renderer
  },
});

// Helper to render a table row
const Row: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  <View style={styles.tableRow}>
    <Text style={styles.tableCellLabel}>{label}</Text>
    <Text style={styles.tableCellValue}>{value || '-'}</Text>
  </View>
);

// Main PDF component for a proposal (investment, research, or research investment)
export const UserProposalPDF: React.FC<{
  proposal: InvestmentProposal | ResearchProposal | ResearchInvestmentProposal;
  type: ProposalType;
}> = ({ proposal, type }) => {
  // Format date/time for footer
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.heading}>
          {type === 'investment' && 'Investment Proposal'}
          {type === 'research' && 'Research Proposal'}
          {type === 'researchInvestment' && 'Research Investment'}
        </Text>

        <View style={styles.section}>
          <View style={styles.table}>
            <Row label="Applicant" value={proposal.userId?.firstName + ' ' + proposal.userId?.lastName} />
            <Row label="Department" value={proposal.department} />
            <Row label="Application ID" value={proposal.applicationId} />
            {/* <Row label="Status" value={proposal.applicationStatus} /> */}
            <Row label="Created At" value={proposal.createdAt?.slice(0, 10)} />
          </View>
        </View>
        {/* Investment Proposal fields */}
        {type === 'investment' && (
          <View style={styles.section}>
            <View style={styles.table}>
              <Row label="Objectives" value={proposal.investmentObjectives} />
              <Row label="Market Demand" value={proposal.marketDemand} />
              <Row label="Total Investment" value={proposal.totalProjectInvestment} />
              <Row label="Expected ROI" value={proposal.expectedROI} />
              <Row label="Risk & Assumptions" value={proposal.riskAndAssumptions} />
              {/* Significance */}
              {proposal.significance && (
                <>
                  <Row label="Significance" value="" />
                  {proposal.significance.socialImpact && <Row label="Social Impact" value={proposal.significance.socialImpact} />}
                  {proposal.significance.environmentalImpact && <Row label="Environmental Impact" value={proposal.significance.environmentalImpact} />}
                  {proposal.significance.exportPotential !== undefined && <Row label="Export Potential" value={proposal.significance.exportPotential ? 'Yes' : 'No'} />}
                  {proposal.significance.importSubstitution !== undefined && <Row label="Import Substitution" value={proposal.significance.importSubstitution ? 'Yes' : 'No'} />}
                  {proposal.significance.other && <Row label="Other" value={proposal.significance.other} />}
                </>
              )}
              {/* Existing Resources */}
              {proposal.existingResources && (
                <>
                  <Row label="Existing Resources" value="" />
                  {proposal.existingResources.local !== undefined && <Row label="Local" value={proposal.existingResources.local ? 'Yes' : 'No'} />}
                  {proposal.existingResources.international !== undefined && <Row label="International" value={proposal.existingResources.international ? 'Yes' : 'No'} />}
                </>
              )}
              {/* Required Assistance From Government */}
              {proposal.requiredAssistanceFromGovernment && (
                <>
                  <Row label="Required Assistance From Government" value="" />
                  {Object.entries(proposal.requiredAssistanceFromGovernment)
                  .filter((entry) => {
                    const value = entry[1];
                    return typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number';
                  })
                    .map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <Row
                          key={key}
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          value={typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        />
                      );
                    })}
                </>
              )}
            </View>
          </View>
        )}

        {/* Research Proposal fields */}
        {type === 'research' && (
          <View style={styles.section}>
            <View style={styles.table}>
              <Row label="Title" value={proposal.title} />
              <Row label="Objectives" value={proposal.objectives} />
              <Row label="Research Gaps" value={proposal.researchGaps} />
              <Row label="Market Demand" value={proposal.marketDemand} />
              <Row label="Innovation" value={proposal.innovation} />
              <Row label="Research Place" value={proposal.research_place} />
              {/* Significance */}
              {proposal.significance && (
                <>
                  <Row label="Significance" value="" />
                  {proposal.significance.socialImpact && <Row label="Social Impact" value={proposal.significance.socialImpact} />}
                  {proposal.significance.environmentalImpact && <Row label="Environmental Impact" value={proposal.significance.environmentalImpact} />}
                  {proposal.significance.economicImpact && <Row label="Economic Impact" value={proposal.significance.economicImpact} />}
                  {proposal.significance.other && <Row label="Other" value={proposal.significance.other} />}
                </>
              )}
              {/* Intellectual Property */}
              {proposal.intellectualProperty && (
                <>
                  <Row label="Intellectual Property" value="" />
                  {proposal.intellectualProperty.patentNumber && <Row label="Patent Number" value={proposal.intellectualProperty.patentNumber} />}
                  {proposal.intellectualProperty.receivedDate && <Row label="Received Date" value={proposal.intellectualProperty.receivedDate} />}
                  {proposal.intellectualProperty.localOrInternational && <Row label="Local/International" value={proposal.intellectualProperty.localOrInternational} />}
                  {proposal.intellectualProperty.status && <Row label="Status" value={proposal.intellectualProperty.status} />}
                </>
              )}
              {/* Technology Readiness Level */}
              {proposal.technologyReadinessLevel && <Row label="Technology Readiness Level" value={proposal.technologyReadinessLevel} />}
              {/* Publications */}
              {proposal.publications && <Row label="Publications" value={proposal.publications} />}
              {/* Research Plan */}
              {proposal.researchPlan && <Row label="Research Plan" value={proposal.researchPlan} />}

              {/* Currency, Value, Expenditure, Milestone Budget, Resources */}
              {/* {proposal.currency && <Row label="Currency" value={proposal.currency} />} */}
              {proposal.budget !== undefined && proposal.budget !== null && <Row label="Budget" value={`${proposal.currency} ${proposal.budget}`.trim()} />}
              {proposal.currencyValue !== undefined && proposal.currencyValue !== null && <Row label="Currency Value" value={`${proposal.currency} ${proposal.currencyValue}`.trim()} />}
              {proposal.expenditure !== undefined && proposal.expenditure !== null && <Row label="Expenditure" value={`${proposal.currency} ${proposal.expenditure}`.trim()} />}
              {proposal.milestone_budget && <Row label="Milestone Budget" value={proposal.milestone_budget} />}
              {proposal.resources && <Row label="Resources" value={proposal.resources} />}
            </View>
          </View>
        )}

        {/* Research Investment fields */}
        {type === 'researchInvestment' && (
          <View style={styles.section}>
            <View style={styles.table}>
              <Row label="Project Title" value={proposal.projectTitle} />
              <Row label="Objectives" value={proposal.investmentObjectives} />
              <Row label="Market Demand" value={proposal.marketDemand} />
              <Row label="Budget" value={String(proposal.budget)} />
              <Row label="Research Place" value={proposal.researchPlace} />
              {/* Significance */}
              {proposal.significance && (
                <>
                  <Row label="Significance" value="" />
                  {proposal.significance.socialImpact && <Row label="Social Impact" value={proposal.significance.socialImpact} />}
                  {proposal.significance.environmentalImpact && <Row label="Environmental Impact" value={proposal.significance.environmentalImpact} />}
                  {proposal.significance.economicImpact && <Row label="Economic Impact" value={proposal.significance.economicImpact} />}
                  {proposal.significance.other && <Row label="Other" value={proposal.significance.other} />}
                </>
              )}
              {/* Intellectual Property */}
              {proposal.intellectualProperty && (
                <>
                  <Row label="Intellectual Property" value="" />
                  {proposal.intellectualProperty.patentNumber && <Row label="Patent Number" value={proposal.intellectualProperty.patentNumber} />}
                  {proposal.intellectualProperty.receivedDate && <Row label="Received Date" value={proposal.intellectualProperty.receivedDate} />}
                  {proposal.intellectualProperty.localOrInternational && <Row label="Local/International" value={proposal.intellectualProperty.localOrInternational} />}
                  {proposal.intellectualProperty.status && <Row label="Status" value={proposal.intellectualProperty.status} />}
                </>
              )}
              {/* TRL */}
              {proposal.trl && <Row label="TRL" value={proposal.trl} />}
              {/* Publications */}
              {proposal.publications && <Row label="Publications" value={proposal.publications} />}
              {/* Research Plan */}
              {proposal.researchPlan && <Row label="Research Plan" value={proposal.researchPlan} />}
              {/* Required Assistance From Government */}
              {proposal.requiredAssistanceFromGovernment && (
                <>
                  <Row label="Required Assistance From Government" value="" />
                  {Object.entries(proposal.requiredAssistanceFromGovernment)
                  .filter((entry) => {
                    const value = entry[1];
                    return typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number';
                  })
                    .map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <Row
                          key={key}
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          value={typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        />
                      );
                    })}
                </>
              )}
              {/* Total Investment, ROI, Project Cost, Expenditure, Budget, Resources Collaborations, Risk Assumptions */}
              {proposal.totalInvestment && <Row label="Total Investment" value={proposal.totalInvestment} />}
              {proposal.roi && <Row label="ROI" value={proposal.roi} />}

              {proposal.projectCost && <Row label="Project Cost" value={`${proposal.currencyValue} ${proposal.projectCost}`} />}
              {proposal.expenditure && <Row label="Expenditure" value={`${proposal.currencyValue} ${proposal.expenditure}`} />}
              {proposal.budget && <Row label="Budget" value={`${proposal.currencyValue} ${proposal.budget}`} />}
              {proposal.resourcesCollaborations && <Row label="Resources/Collaborations" value={proposal.resourcesCollaborations} />}
              {proposal.riskAssumptions && <Row label="Risk & Assumptions" value={proposal.riskAssumptions} />}
            </View>
          </View>
        )}
        {/* Add more fields/sections as needed */}
        {/* Footer */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Generated on NIRDC: ${formattedDate} | Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
