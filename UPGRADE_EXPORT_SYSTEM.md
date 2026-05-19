# MISSION: Upgrade Universal Export System (Excel, CSV, PDF)

## Context
The current export functionality in DrishtiVision CRM is shallow. It only exports basic table strings and filters out crucial relational data, IDs, and complex metadata. We need a "Thorough Export" system that provides professional, auditor-grade reports.

## Objective
Refactor the export system to support full data points, nested relations, and time-based reports (1m, 3m, 6m, 1y).

---

## Task 1: Refactor `ExportButton.tsx`
**Location:** `client/src/components/ui/ExportButton.tsx`

**Instructions:**
1. **Time-Range Selection:** Add a sub-menu or toggle in the export dropdown to select the report duration:
   - "Current View" (Filtered data)
   - "Last 30 Days"
   - "Last 90 Days"
   - "Last 6 Months"
   - "Financial Year (YTD)"
2. **Dynamic Data Mapping:** Implement a `dataMapper` function that:
   - Flattens nested objects (e.g., `client.name` becomes a "Client" column).
   - Formats dates consistently.
   - Converts boolean values to "Yes/No".
3. **Column Inclusion:** STOP filtering out fields with "id" or "Id" if they are necessary for reference. Ensure technical specs (Width/Height) are always included for Sites.

---

## Task 2: Enhance `export.ts` Library
**Location:** `client/src/lib/export.ts`

**Instructions:**
1. **Landscape PDF Support:** Update `exportToPDF` to automatically use `orientation: 'landscape'` if the number of columns exceeds 6.
2. **Report Branding:**
   - Add the organization name (from `organizations` table or context) to the header.
   - Add a "Summary Footer" to PDF/Excel (e.g., Total Amount, Total Sites, Total Clients).
3. **Excel Formatting:** Use `xlsx` to create proper headers with bold styling and auto-width columns.

---

## Task 3: Data Integrity Audit (per tab)

### Sites Tab:
Include: Site Name, Location, State, Facing, Type, Dimensions (Width x Height), Area (SqFt), Rate, Ownership, Vendor Name, Status, and Lease Dates.

### Invoices Tab:
Include: Invoice Number, Client Name, GSTIN, Date, Due Date, Subtotal, CGST, SGST, IGST, Total, Status, and Payment Reference.

### Payments & Ledger Tab:
Include: Date, Entity Name, Reference Number (Inv/PO), Payment Mode, Bank/Cheque Details, Amount, and Settlement Status.

---

## Task 4: Implementation in Pages
Update the following pages to pass the **full raw data** to the `ExportButton`, not just the current filtered table state:
- `client/src/pages/Sites.tsx`
- `client/src/pages/Invoices.tsx`
- `client/src/pages/Payments.tsx`
- `client/src/pages/Clients.tsx`

## Validation
- Export a "6 Month Site Performance Report" as a PDF.
- Verify that the PDF shows full dimensions and vendor details.
- Export a "1 Year Revenue Ledger" as Excel.
- Verify that the Excel sheet includes GST columns and Client GSTINs.
