import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { TemplateProps } from './types';

const accentColor = '#059669';
const lightBg = '#ECFDF5';

const styles = StyleSheet.create({
  page: { padding: '10mm', fontSize: 8, fontFamily: 'Helvetica', color: '#1F2937', backgroundColor: '#FFFFFF' },
  container: { flexDirection: 'column', width: '100%' },
  headerBar: { backgroundColor: accentColor, marginHorizontal: -20, paddingHorizontal: 20, paddingVertical: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  logoBox: { width: 60, height: 60, marginRight: 16 },
  logo: { width: 60, height: 60, objectFit: 'contain' },
  logoPlaceholder: { width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  headerText: { flex: 1 },
  companyName: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 2 },
  companyDetail: { fontSize: 7, color: 'rgba(255,255,255,0.8)', marginBottom: 1, lineHeight: 1.4 },
  invoiceBadge: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  invoiceBadgeText: { fontSize: 14, fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: 2 },
  infoGrid: { flexDirection: 'row', marginBottom: 16, backgroundColor: lightBg, borderRadius: 6, padding: 12 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 6, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  infoValue: { fontSize: 8, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  partiesSection: { flexDirection: 'row', marginBottom: 16, gap: 12 },
  partyCard: { flex: 1, border: '1pt solid #E5E7EB', borderRadius: 6, padding: 10 },
  partyTitle: { fontSize: 7, color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 4 },
  partyText: { fontSize: 7, color: '#374151', marginBottom: 1, lineHeight: 1.4 },
  partyName: { fontSize: 9, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  table: { flexDirection: 'column', marginBottom: 16, border: '1pt solid #E5E7EB', borderRadius: 6, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: accentColor, paddingVertical: 5, paddingHorizontal: 6 },
  tableHeaderText: { color: '#FFFFFF', fontSize: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB' },
  tableCell: { fontSize: 7, color: '#374151' },
  tableCellBold: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  tableCellRight: { fontSize: 7, color: '#374151', textAlign: 'right' },
  totalRow: { flexDirection: 'row', backgroundColor: lightBg, paddingVertical: 6, paddingHorizontal: 6 },
  totalCell: { fontSize: 8, fontWeight: 'bold', color: '#1F2937', textAlign: 'right' },
  summarySection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  summaryBox: { width: '50%', padding: 12, backgroundColor: lightBg, borderRadius: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, paddingVertical: 1 },
  summaryLabel: { fontSize: 7, color: '#6B7280' },
  summaryValue: { fontSize: 7, fontWeight: 'bold', color: '#1F2937' },
  summaryGrand: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, borderTopColor: accentColor, paddingTop: 4, marginTop: 4 },
  summaryGrandLabel: { fontSize: 9, fontWeight: 'bold', color: accentColor },
  summaryGrandValue: { fontSize: 9, fontWeight: 'bold', color: accentColor },
  wordsSection: { padding: 8, backgroundColor: '#F9FAFB', borderRadius: 4, marginBottom: 12, flexDirection: 'row' },
  wordsText: { fontSize: 7, fontStyle: 'italic', color: '#6B7280', flex: 1 },
  footer: { flexDirection: 'row', borderTop: '1pt solid #E5E7EB', paddingTop: 10 },
  footerCol: { flex: 1 },
  footerTitle: { fontSize: 7, color: accentColor, fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  footerText: { fontSize: 6, color: '#6B7280', marginBottom: 1, lineHeight: 1.4 },
  signArea: { alignItems: 'flex-end', justifyContent: 'flex-end' },
  signLine: { width: 100, borderTop: '1pt solid #374151', marginTop: 16, marginBottom: 3 },
  signLabel: { fontSize: 7, fontWeight: 'bold', color: '#1F2937', textTransform: 'uppercase' },
});

const colDefs = { desc: { w: '30%' }, hsn: { w: '8%' }, qty: { w: '8%' }, rate: { w: '12%' }, disc: { w: '10%' }, taxable: { w: '12%' }, tax: { w: '10%' }, total: { w: '10%' } };

const ProductCompany: React.FC<TemplateProps> = ({ invoiceData }) => {
  const phoneStr = Array.isArray(invoiceData.seller.phone) ? invoiceData.seller.phone.join(', ') : invoiceData.seller.phone;
  const showGst = invoiceData.gstConfig !== 'NONE';
  const totalTax = (invoiceData.cgstTotal || 0) + (invoiceData.sgstTotal || 0) + (invoiceData.igstTotal || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.headerBar}>
            <View style={styles.logoBox}>
              {invoiceData.seller.logoUrl ? (
                <Image src={invoiceData.seller.logoUrl} style={styles.logo} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoPlaceholderText}>{invoiceData.seller.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerText}>
              <Text style={styles.companyName}>{invoiceData.seller.name}</Text>
              <Text style={styles.companyDetail}>{invoiceData.seller.address}</Text>
              <Text style={styles.companyDetail}>Phone: {phoneStr} | Email: {invoiceData.seller.email}</Text>
              {invoiceData.seller.gstin && <Text style={styles.companyDetail}>GSTIN: {invoiceData.seller.gstin}</Text>}
            </View>
            <View style={styles.invoiceBadge}>
              <Text style={styles.invoiceBadgeText}>Invoice</Text>
              <Text style={{ fontSize: 7, color: accentColor, marginTop: 2, fontWeight: 'bold' }}>{invoiceData.invoiceNumber}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Invoice Date</Text>
              <Text style={styles.infoValue}>{invoiceData.invoiceDate}</Text>
              <Text style={styles.infoLabel}>Place of Supply</Text>
              <Text style={styles.infoValue}>{invoiceData.placeOfSupply}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Transport Mode</Text>
              <Text style={styles.infoValue}>{invoiceData.transportMode || 'N/A'}</Text>
              <Text style={styles.infoLabel}>Vehicle Number</Text>
              <Text style={styles.infoValue}>{invoiceData.vehicleNumber || 'N/A'}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Date of Supply</Text>
              <Text style={styles.infoValue}>{invoiceData.dateOfSupply}</Text>
              {invoiceData.seller.msmeRegNo && (
                <>
                  <Text style={styles.infoLabel}>MSME Reg No</Text>
                  <Text style={styles.infoValue}>{invoiceData.seller.msmeRegNo}</Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.partiesSection}>
            <View style={styles.partyCard}>
              <Text style={styles.partyTitle}>Buyer (Bill To)</Text>
              <Text style={styles.partyName}>{invoiceData.buyer.name || 'Customer'}</Text>
              <Text style={styles.partyText}>{invoiceData.buyer.address}</Text>
              {invoiceData.buyer.gstin && <Text style={styles.partyText}>GSTIN: {invoiceData.buyer.gstin}</Text>}
              <Text style={styles.partyText}>State: {invoiceData.buyer.state || '-'}</Text>
            </View>
            <View style={styles.partyCard}>
              <Text style={styles.partyTitle}>Seller (Ship From)</Text>
              <Text style={styles.partyName}>{invoiceData.seller.name}</Text>
              <Text style={styles.partyText}>{invoiceData.seller.address}</Text>
              {invoiceData.seller.gstin && <Text style={styles.partyText}>GSTIN: {invoiceData.seller.gstin}</Text>}
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: colDefs.desc.w }]}>Product</Text>
              <Text style={[styles.tableHeaderText, { width: colDefs.hsn.w, textAlign: 'center' }]}>HSN</Text>
              <Text style={[styles.tableHeaderText, { width: colDefs.qty.w, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.tableHeaderText, { width: colDefs.rate.w, textAlign: 'right' }]}>Rate</Text>
              <Text style={[styles.tableHeaderText, { width: colDefs.disc.w, textAlign: 'right' }]}>Disc</Text>
              <Text style={[styles.tableHeaderText, { width: colDefs.taxable.w, textAlign: 'right' }]}>Taxable</Text>
              {showGst && <Text style={[styles.tableHeaderText, { width: colDefs.tax.w, textAlign: 'right' }]}>Tax</Text>}
              <Text style={[styles.tableHeaderText, { width: colDefs.total.w, textAlign: 'right' }]}>Total</Text>
            </View>

            {invoiceData.items.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCellBold, { width: colDefs.desc.w }]}>{item.description}</Text>
                <Text style={[styles.tableCell, { width: colDefs.hsn.w, textAlign: 'center' }]}>{item.hsn || '-'}</Text>
                <Text style={[styles.tableCell, { width: colDefs.qty.w, textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={[styles.tableCell, { width: colDefs.rate.w, textAlign: 'right' }]}>${item.rate.toFixed(2)}</Text>
                <Text style={[styles.tableCell, { width: colDefs.disc.w, textAlign: 'right' }]}>${item.discount.toFixed(2)}</Text>
                <Text style={[styles.tableCell, { width: colDefs.taxable.w, textAlign: 'right' }]}>${item.taxableValue.toFixed(2)}</Text>
                {showGst && (
                  <Text style={[styles.tableCell, { width: colDefs.tax.w, textAlign: 'right' }]}>
                    ${((item.cgstAmount || 0) + (item.sgstAmount || 0) + (item.igstAmount || 0)).toFixed(2)}
                  </Text>
                )}
                <Text style={[styles.tableCellBold, { width: colDefs.total.w, textAlign: 'right' }]}>${item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summarySection}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal (Taxable)</Text>
                <Text style={styles.summaryValue}>${invoiceData.subtotal.toFixed(2)}</Text>
              </View>
              {showGst && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax ({invoiceData.gstConfig === 'INTRA' ? 'CGST+SGST' : 'IGST'})</Text>
                  <Text style={styles.summaryValue}>${totalTax.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.summaryGrand}>
                <Text style={styles.summaryGrandLabel}>Total Amount</Text>
                <Text style={styles.summaryGrandValue}>${invoiceData.grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.wordsSection}>
            <Text style={styles.wordsText}>Amount in Words: {invoiceData.grandTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerCol}>
              <Text style={styles.footerTitle}>Bank Details</Text>
              {invoiceData.seller.bank.name && (
                <>
                  <Text style={styles.footerText}>{invoiceData.seller.bank.name} - {invoiceData.seller.bank.branch}</Text>
                  <Text style={styles.footerText}>A/C: {invoiceData.seller.bank.accountNo}</Text>
                  <Text style={styles.footerText}>IFSC: {invoiceData.seller.bank.ifsc}</Text>
                </>
              )}
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerTitle}>Terms</Text>
              <Text style={styles.footerText}>Payment due within 15 days from invoice date</Text>
              <Text style={styles.footerText}>Goods once sold cannot be returned</Text>
            </View>
            <View style={[styles.footerCol, styles.signArea]}>
              <Text style={styles.signLine}></Text>
              <Text style={styles.signLabel}>Authorized Signatory</Text>
              <Text style={{ fontSize: 6, color: '#6B7280' }}>For {invoiceData.seller.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ProductCompany;
