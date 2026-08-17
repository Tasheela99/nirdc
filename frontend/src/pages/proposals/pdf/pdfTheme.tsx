import { StyleSheet as PDFStyleSheet, Text as PDFText, View as PDFView } from '@react-pdf/renderer';

// ─── Simple Government Document Theme ───
const NAVY = '#001d4a';
const BLUE = '#003893';
const GRAY_TEXT = '#555555';
const BLACK = '#1a1a1a';
const LIGHT_BG = '#f5f5f5';
const BORDER = '#cccccc';

export function isEmptyData(data: any) {
  if (!data) return true;
  if (typeof data === 'object' && Object.keys(data).length === 0) return true;
  return false;
}

export const styles = PDFStyleSheet.create({
  page: {
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 80,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: BLACK,
  },
  // Document header
  headerBar: {
    backgroundColor: NAVY,
    padding: 16,
    marginBottom: 24,
  },
  orgName: {
    fontSize: 8,
    color: '#aabbdd',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  docSubtitle: {
    fontSize: 9,
    color: '#aabbdd',
  },
  // Meta row (ID + Date side by side)
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: BLUE,
  },
  metaText: {
    fontSize: 8,
    color: GRAY_TEXT,
  },
  // Section divider
  sectionDivider: {
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: BLUE,
    letterSpacing: 0.5,
  },
  // Table row
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 20,
  },
  rowAlt: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 20,
    backgroundColor: LIGHT_BG,
  },
  label: {
    width: 160,
    fontSize: 8,
    color: GRAY_TEXT,
    paddingRight: 8,
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: BLACK,
    lineHeight: 1.6,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
  },
  footerText: {
    fontSize: 7,
    color: GRAY_TEXT,
  },
});

// ─── Helpers ───
let _idx = 0;
export const resetIdx = () => { _idx = 0; };

export const Row = ({ label, value }: { label: string; value: any }) => {
  _idx++;
  const v = value !== undefined && value !== null && value !== '' ? String(value) : 'N/A';
  return (
    <PDFView style={_idx % 2 === 0 ? styles.rowAlt : styles.row}>
      <PDFText style={styles.label}>{label}</PDFText>
      <PDFText style={styles.value}>{v}</PDFText>
    </PDFView>
  );
};

export const YesNo = ({ label, flag }: { label: string; flag: any }) => {
  _idx++;
  return (
    <PDFView style={_idx % 2 === 0 ? styles.rowAlt : styles.row}>
      <PDFText style={styles.label}>{label}</PDFText>
      <PDFText style={styles.value}>{flag ? 'Yes' : 'No'}</PDFText>
    </PDFView>
  );
};

export const Section = ({ title }: { title: string }) => (
  <PDFView style={styles.sectionDivider}>
    <PDFText style={styles.sectionLabel}>{title}</PDFText>
  </PDFView>
);

export const DocHeader = ({ type, title, appId, date }: { type: string; title: string; appId: string; date: string }) => (
  <>
    <PDFView style={styles.headerBar}>
      <PDFText style={styles.orgName}>NIRDC - National Initiative for R&D Commercialisation</PDFText>
      <PDFText style={styles.docTitle}>{type}</PDFText>
      <PDFText style={styles.docSubtitle}>{title}</PDFText>
    </PDFView>
    <PDFView style={styles.metaRow}>
      <PDFText style={styles.metaText}>Application ID: {appId || 'N/A'}</PDFText>
      <PDFText style={styles.metaText}>Date: {date}</PDFText>
    </PDFView>
  </>
);

export const Footer = () => (
  <PDFView style={styles.footer} fixed>
    <PDFText style={styles.footerText}>NIRDC - National Initiative for R&D Commercialisation</PDFText>
    <PDFText style={styles.footerText}>Generated: {new Date().toLocaleString()}</PDFText>
  </PDFView>
);

export const getUserName = (data: any) => {
  if (!data.userId) return 'N/A';
  if (typeof data.userId === 'object') {
    return data.userId.userName || `${data.userId.firstName || ''} ${data.userId.lastName || ''}`.trim() || 'N/A';
  }
  return String(data.userId);
};

export const formatDate = (d: any) => {
  if (!d) return 'N/A';
  try { return new Date(d).toLocaleDateString(); } catch { return 'N/A'; }
};

export const formatCurrency = (currency: string | undefined, amount: any) => {
  if (amount === undefined || amount === null || amount === '') return 'N/A';
  return `${currency || ''} ${amount}`.trim();
};
