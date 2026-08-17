import React from 'react';
import { isEmptyData, resetIdx, DocHeader, Footer, Section, Row, YesNo, getUserName, formatDate, formatCurrency } from './pdfTheme';

const ResearchProposalPDFPage: React.FC<{ data: any }> = ({ data }) => {
  if (isEmptyData(data)) return null;
  resetIdx();

  const userName = getUserName(data);
  const currency = data.currency || '';

  return (
    <>
      <DocHeader
        type="Research Proposal"
        title={data.title || 'Untitled'}
        appId={data.applicationId}
        date={formatDate(data.updatedAt || data.createdAt)}
      />

      <Section title="Applicant Information" />
      <Row label="Name" value={userName} />
      <Row label="Email" value={data.userId?.email} />
      <Row label="Mobile" value={data.userId?.mobile} />
      <Row label="Department" value={data.department} />

      <Section title="Proposal Details" />
      <Row label="Title" value={data.title} />
      <Row label="Research Gaps" value={data.researchGaps} />
      <Row label="Objectives" value={data.objectives} />
      <Row label="Market Demand" value={data.marketDemand} />
      <Row label="Innovation" value={data.innovation} />

      <Section title="Significance" />
      <Row label="Social Impact" value={data.significance?.socialImpact} />
      <Row label="Environmental Impact" value={data.significance?.environmentalImpact} />
      <Row label="Economic Impact" value={data.significance?.economicImpact} />

      <Section title="Intellectual Property" />
      <Row label="Patent Number" value={data.intellectualProperty?.patentNumber} />
      <Row label="Status" value={data.intellectualProperty?.status} />
      <Row label="Received Date" value={formatDate(data.intellectualProperty?.receivedDate)} />
      <Row label="Type" value={data.intellectualProperty?.localOrInternational} />
      <Row label="Technology Readiness Level" value={data.technologyReadinessLevel} />

      <Section title="Research Plan & Resources" />
      <Row label="Publications" value={data.publications} />
      <Row label="Research Plan" value={data.researchPlan} />
      <Row label="Research Location" value={data.research_place} />
      <Row label="Resources" value={data.resources} />
      <Row label="Existing Resources" value={data.existingResources} />

      <Section title="Budget & Financials" />
      <Row label="Currency" value={currency} />
      <Row label="Currency Value" value={formatCurrency(currency, data.currencyValue)} />
      <Row label="Budget" value={formatCurrency(currency, data.budget)} />
      <Row label="Expenditure" value={formatCurrency(currency, data.expenditure)} />
      <Row label="Milestone Budget" value={data.milestone_budget} />

      {data.requiredAssistanceFromGovernment && (
        <>
          <Section title="Government Assistance Required" />
          <YesNo label="Funds" flag={data.requiredAssistanceFromGovernment?.funds} />
          <YesNo label="Regulatory" flag={data.requiredAssistanceFromGovernment?.regulatory} />
          <YesNo label="Land" flag={data.requiredAssistanceFromGovernment?.land} />
          <YesNo label="Infrastructure" flag={data.requiredAssistanceFromGovernment?.infrastructure} />
          <YesNo label="Technical Assistance" flag={data.requiredAssistanceFromGovernment?.technicalAssistance} />
          <YesNo label="Partnerships" flag={data.requiredAssistanceFromGovernment?.partnerships} />
          <YesNo label="IP" flag={data.requiredAssistanceFromGovernment?.ip} />
          <Row label="Other" value={data.requiredAssistanceFromGovernment?.other} />
        </>
      )}

      <Footer />
    </>
  );
};

export default ResearchProposalPDFPage;
