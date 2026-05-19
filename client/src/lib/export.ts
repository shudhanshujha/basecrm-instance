import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ExportOptions {
  headers: string[];
  data: any[][];
  filename: string;
  title: string;
  orgName?: string;
  summary?: Record<string, string | number>;
}

export const exportToCSV = ({ headers, data, filename, title, orgName = 'DRISHTIVISION CRM', summary }: ExportOptions) => {
  let csvContent = `"${orgName}"\n"${title}"\n"Generated on: ${new Date().toLocaleString()}"\n\n`;
  
  // Create object array for PapaParse from headers and data
  const objData = data.map(row => {
    const obj: any = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  csvContent += Papa.unparse(objData);

  if (summary) {
    csvContent += `\n\n"REPORT SUMMARY"\n`;
    Object.entries(summary).forEach(([k, v]) => {
      csvContent += `"${k}","${v}"\n`;
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.setAttribute('download', `${filename.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = ({ headers, data, filename, title, orgName = 'DRISHTIVISION CRM', summary }: ExportOptions) => {
  const aoaData: any[][] = [
    [orgName],
    [title],
    [`Generated on: ${new Date().toLocaleString()}`],
    [],
    headers,
    ...data
  ];

  if (summary) {
    aoaData.push([]);
    aoaData.push(['REPORT SUMMARY']);
    Object.entries(summary).forEach(([k, v]) => {
      aoaData.push([k, v]);
    });
  }

  const worksheet = XLSX.utils.aoa_to_sheet(aoaData);
  
  // Set header styles (bolding title and column headers)
  worksheet['A1'].s = { font: { bold: true, sz: 14 } };
  worksheet['A2'].s = { font: { bold: true, sz: 12 } };
  
  // Bold column headers (Row 5 - index 4)
  for (let C = 0; C < headers.length; ++C) {
    const address = XLSX.utils.encode_cell({ c: C, r: 4 });
    if (worksheet[address]) {
      worksheet[address].s = { font: { bold: true } };
    }
  }

  if (summary) {
    const summaryHeaderRow = aoaData.length - Object.keys(summary).length - 1;
    const address = XLSX.utils.encode_cell({ c: 0, r: summaryHeaderRow });
    if (worksheet[address]) {
      worksheet[address].s = { font: { bold: true } };
    }
  }

  // Auto-width estimation
  const objectMaxLength: number[] = headers.map(h => h.length);
  data.forEach(row => {
    row.forEach((val, i) => {
      const columnValue = val ? val.toString() : '';
      objectMaxLength[i] = Math.max(objectMaxLength[i] || 0, columnValue.length);
    });
  });
  worksheet['!cols'] = objectMaxLength.map(w => ({ width: w + 2 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  XLSX.writeFile(workbook, `${filename.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.xlsx`);
};

export const exportToPDF = ({ headers, data, filename, title, orgName = 'DRISHTIVISION CRM', summary }: ExportOptions) => {
  const orientation = headers.length > 6 ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Branding
  doc.setFontSize(16);
  doc.setTextColor(249, 115, 22); // Accent Orange
  doc.text(orgName, 14, 15);
  
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text(title, 14, 25);
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
  
  (doc as any).autoTable({
    head: [headers],
    body: data,
    startY: 38,
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { top: 38 },
  });

  if (summary) {
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORT SUMMARY', 14, finalY + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let offset = 18;
    Object.entries(summary).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, finalY + offset);
      offset += 6;
    });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  doc.save(`${filename.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.pdf`);
};
