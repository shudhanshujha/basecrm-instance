# MISSION: Implement Pixel-Perfect Fiscal Invoice (A4 PDF)

## Context
We need to generate a formal GST Invoice that matches the user's provided sample image exactly. The invoice must be generated on the frontend using `@react-pdf/renderer` and must fit precisely on a single A4 sheet.

## Objective
Create a `FiscalInvoice` component and utility that fetches data from the Supabase schema and renders a high-fidelity PDF.

---

## 🎨 Visual Architecture (Matching Sample Image)

### 1. Header (Company Identity)
- **Top Row:** Left-aligned Logo (`/dvs_logo.jpg`), Center-aligned Company Name (**DRISHTI VISION SOLUTION**), Address, Contact, Email, and GSTIN.
- **Visual Style:** Bold headings, bordered container.

### 2. Metadata Section (Two-Column Grid)
- **Left Column:** Invoice No, Invoice Date, Reverse Charge (Y/N), State (Haryana), State Code (06), MSME REGISTRATION NO.
- **Right Column:** Transport Mode, Vehicle number, Date of Supply, Place of Supply.

### 3. Party Details (Two-Column Grid)
- **Box 1:** "Invoice to Party" (Bill to) -> Name, Address, GSTIN, State, Code.
- **Box 2:** "Ship to Party" (Ship to) -> Name, Address, GSTIN, State, Code.

### 4. The Line Items Table (Fixed Height)
- **Columns:** S.No, Product Description (with sub-description), HSN Code, Qty, Rate, Amount, Discount, Taxable Value, CGST (Rate/Amt), SGST (Rate/Amt), Total.
- **Note:** The table must have a fixed minimum height (e.g., 400pt) to maintain the "empty row" look of a standard invoice even with 1 item.

### 5. Totals & Word Conversion
- **Left Box:** "Total Invoice Amount in Words" -> Implement a `numberToWords` utility.
- **Right Box:** Vertical stack of Total Before Tax, CGST, SGST, Total Tax, and Total Amount After Tax.

### 6. Footer (Financials & Legal)
- **Bank Details:** Box containing Bank Name, Branch, Account No, and IFSC.
- **Authorisation:** Section for "Common Seal" and "Authorised Signatory" for **DRISHTI VISION SOLUTION**.

---

## 🛠️ Data Mapping (Supabase Schema)

| Visual Field | Database Source |
| :--- | :--- |
| **Invoice No** | `invoices.invoice_number` |
| **Invoice Date** | `invoices.invoice_date` |
| **Party Name** | `clients.name` |
| **Party GSTIN** | `clients.gstin` |
| **Product Desc** | `invoice_items.description` + `invoice_items.site_name` |
| **Rates/Tax** | `invoice_items.rate`, `invoices.cgst_amount`, etc. |
| **Bank Info** | `invoices.bank_details` (JSON) |

---

## 📋 Implementation Tasks

1. **Create `InvoiceGenerator.tsx`:** A component that takes an `invoiceId`, fetches the data (including client and items), and returns the PDF Document.
2. **Precision Styling:** 
   - Use `Inter` or `Helvetica` font.
   - Use thin black borders (`0.5pt`) for all grid boxes.
   - Set A4 dimensions with `padding: 20`.
3. **Handle Edge Cases:**
   - Multi-page support if items exceed the fixed table height.
   - IGST logic: If `client.state` != `Haryana`, hide CGST/SGST columns and show IGST.

## Validation
- The generated PDF must look exactly like the sample image `invoice_sample.png`.
- All mathematical sums (Taxable + GST) must be verified programmatically.
- The "Amount in Words" must be 100% accurate.
