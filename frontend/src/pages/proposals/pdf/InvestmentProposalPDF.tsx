import React from 'react';
import { isEmptyData, resetIdx, DocHeader, Footer, Section, Row, YesNo, getUserName, formatDate } from './pdfTheme';

const InvestmentProposalPDFPage: React.FC<{ data: any }> = ({ data }) => {
  if (isEmptyData(data)) return null;
  resetIdx();

  const userName = getUserName(data);

  return (
    <>
      <DocHeader
        type="Investment Proposal"
        title={data.investmentObjectives?.substring(0, 100) || 'Investment Proposal'}
        appId={data.applicationId}
        date={formatDate(data.updatedAt || data.createdAt)}
      />

      <Section title="Applicant Information" />
      <Row label="Name" value={userName} />
      <Row label="Email" value={data.userId?.email} />
      <Row label="Mobile" value={data.userId?.mobile} />
      <Row label="Department" value={data.department} />

      <Section title="Investment Details" />
      <Row label="Investment Objectives" value={data.investmentObjectives} />
      <Row label="Market Demand" value={data.marketDemand} />
      <Row label="Total Project Investment" value={data.totalProjectInvestment} />
      <Row label="Expected ROI" value={data.expectedROI} />

      <Section title="Significance" />
      <Row label="Social Impact" value={data.significance?.socialImpact} />
      <Row label="Environmental Impact" value={data.significance?.environmentalImpact} />
      <Row label="Economic Impact" value={data.significance?.economicImpact} />
      <YesNo label="Export Potential" flag={data.significance?.exportPotential} />
      <YesNo label="Import Substitution" flag={data.significance?.importSubstitution} />

      <Section title="Existing Resources" />
      <YesNo label="Local Resources" flag={data.existingResources?.local} />
      <YesNo label="International Resources" flag={data.existingResources?.international} />

      <Section title="Government Assistance Required" />
      <YesNo label="Funds" flag={data.requiredAssistanceFromGovernment?.funds} />
      <YesNo label="Regulatory" flag={data.requiredAssistanceFromGovernment?.regulatory} />
      <YesNo label="Land" flag={data.requiredAssistanceFromGovernment?.land} />
      <YesNo label="Infrastructure" flag={data.requiredAssistanceFromGovernment?.infrastructure} />
      <YesNo label="Technical Assistance" flag={data.requiredAssistanceFromGovernment?.technicalAssistance} />
      <YesNo label="Partnerships" flag={data.requiredAssistanceFromGovernment?.partnerships} />
      <YesNo label="IP" flag={data.requiredAssistanceFromGovernment?.ip} />
      <Row label="Other" value={data.requiredAssistanceFromGovernment?.other} />

      <Section title="Risk & Assumptions" />
      <Row label="Risk & Assumptions" value={data.riskAndAssumptions} />

      <Footer />
    </>
  );
};

export default InvestmentProposalPDFPage;
