import React from "react";
import { Button } from "@mui/material";
import PrinterIcon from "@mui/icons-material/Print";

interface ProposalPdfDownloadProps {
  allProposals?: Array<{ type: string; data: any }>;
}

const ProposalPdfDownload: React.FC<ProposalPdfDownloadProps> = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button 
      variant="contained" 
      onClick={handlePrint}
      startIcon={<PrinterIcon />}
      className="no-print"
      sx={{ 
        mb: 2, 
        float: "right", 
        background: '#002E78', 
        color: '#fff',
        fontWeight: 600,
        borderRadius: '8px',
        textTransform: 'none',
        px: 3,
        '&:hover': { background: '#001C4A' }
      }}
    >
      Print / Save PDF
    </Button>
  );
};

export default ProposalPdfDownload;
