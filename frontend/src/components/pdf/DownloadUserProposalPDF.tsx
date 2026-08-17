// import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { UserProposalPDF, ProposalType, InvestmentProposal, ResearchProposal, ResearchInvestmentProposal } from './UserProposalPDF';

export async function downloadUserProposalPDF(
  proposal: InvestmentProposal | ResearchProposal | ResearchInvestmentProposal,
  type: ProposalType
) {
  const blob = await pdf(<UserProposalPDF proposal={proposal} type={type} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-proposal-${proposal.applicationId || 'report'}.pdf`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
