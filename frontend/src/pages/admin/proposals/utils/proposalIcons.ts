import React from 'react';
import {
    Assignment as AssignmentIcon,
    Science as ScienceIcon,
    AccountBalance as InvestmentIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
} from '@mui/icons-material';

export const getProposalIcon = (value: string): React.ReactElement => {
    switch (value) {
        case 'investment':
            return React.createElement(InvestmentIcon);
        case 'research-investment':
            return React.createElement(ScienceIcon);
        case 'research-proposal':
            return React.createElement(AssignmentIcon);
        case 'approved':
            return React.createElement(ApprovedIcon);
        case 'rejected':
            return React.createElement(RejectedIcon);
        default:
            return React.createElement(AssignmentIcon);
    }
};
