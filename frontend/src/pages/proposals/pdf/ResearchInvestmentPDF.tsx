import React from 'react';
import { isEmptyData, resetIdx, DocHeader, Footer, Section, Row, YesNo, getUserName, formatDate } from './pdfTheme';

const ResearchInvestmentPDFPage: React.FC<{ data: any }> = ({ data }) => {
  if (isEmptyData(data)) return null;
  resetIdx();

  const userName = getUserName(data);

  return (
    <>
      <DocHeader
        type="Research Investment Proposal"
        title={data.projectTitle || 'Untitled'}
        appId={data.applicationId}
        date={formatDate(data.updatedAt || data.createdAt)}
      />

      <Section title="Applicant Information" />
      <Row label="Name" value={userName} />
      <Row label="Email" value={data.userId?.email} />
      <Row label="Mobile" value={data.userId?.mobile} />
      <Row label="Department" value={data.department} />

      <Section title="Project & Investment Details" />
      <Row label="Project Title" value={data.projectTitle} />
      <Row label="Investment Objectives" value={data.investmentObjectives} />
      <Row label="Market Demand" value={data.marketDemand} />

      <Section title="Research Details" />
      <Row label="Research Gaps" value={data.researchGaps} />
      <Row label="Research Objectives" value={data.researchObjectives} />
      <Row label="Research Plan" value={data.researchPlan} />
      <Row label="Research Location" value={data.researchPlace} />
      <Row label="TRL" value={data.trl} />
      <Row label="Publications" value={data.publications} />

      <Section title="Significance" />
      <Row label="Social Impact" value={data.significance?.socialImpact} />
      <Row label="Environmental Impact" value={data.significance?.environmentalImpact} />
      <Row label="Economic Impact" value={data.significance?.economicImpact} />

      <Section title="Intellectual Property" />
      <Row label="Patent Number" value={data.intellectualProperty?.patentNumber} />
      <Row label="Status" value={data.intellectualProperty?.status} />
      <Row label="Received Date" value={formatDate(data.intellectualProperty?.receivedDate)} />
      <Row label="Type" value={data.intellectualProperty?.localOrInternational} />

      <Section title="Budget & Investment" />
      <Row label="Currency Value" value={data.currencyValue} />
      <Row label="Project Cost" value={data.projectCost} />
      <Row label="Budget" value={data.budget} />
      <Row label="Expenditure" value={data.expenditure} />
      <Row label="Total Investment" value={data.totalInvestment} />
      <Row label="ROI" value={data.roi} />
      <Row label="Resources & Collaborations" value={data.resourcesCollaborations} />
      <Row label="Risk Assumptions" value={data.riskAssumptions} />

      <Section title="Government Assistance Required" />
      <YesNo label="Funds" flag={data.requiredAssistanceFromGovernment?.funds} />
      <YesNo label="Regulatory" flag={data.requiredAssistanceFromGovernment?.regulatory} />
      <YesNo label="Land" flag={data.requiredAssistanceFromGovernment?.land} />
      <YesNo label="Infrastructure" flag={data.requiredAssistanceFromGovernment?.infrastructure} />
      <YesNo label="Technical Assistance" flag={data.requiredAssistanceFromGovernment?.technicalAssistance} />
      <YesNo label="Partnerships" flag={data.requiredAssistanceFromGovernment?.partnerships} />
      <YesNo label="IP" flag={data.requiredAssistanceFromGovernment?.ip} />
      <Row label="Other" value={data.requiredAssistanceFromGovernment?.other} />

      <Footer />
    </>
  );
};

export default ResearchInvestmentPDFPage;
