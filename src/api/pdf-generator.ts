import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PrintData {
  patient: any;
  visits: any[];
  encounters: any[];
  medications: any[];
  generatedAt: string;
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private yPos: number;

  constructor() {
    this.doc = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 15;
    this.yPos = this.margin;
  }

  private addPage(): void {
    this.doc.addPage();
    this.yPos = this.margin;
  }

  private addHeader(): void {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.text('OpenMRS Clinical Summary', this.pageWidth / 2, this.yPos, { align: 'center' });
    this.yPos += 5;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString();
    this.doc.text(`Generated: ${currentDate}`, this.pageWidth - this.margin, this.yPos, { align: 'right' });
    this.yPos += 10;
    
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.yPos, this.pageWidth - this.margin, this.yPos);
    this.yPos += 10;
  }

  private addPatientInfo(patient: any): void {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.text('Patient Information', this.margin, this.yPos);
    this.yPos += 5;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    
    const lines = [
      `Name: ${patient.display || 'N/A'}`,
      `ID: ${patient.uuid}`,
      `Gender: ${patient.person?.gender || 'N/A'}`,
      `Age: ${patient.person?.age || 'N/A'}`,
      `Birthdate: ${patient.person?.birthdate || 'N/A'}`,
    ];
    
    if (patient.person?.addresses?.length > 0) {
      const address = patient.person.addresses[0];
      lines.push(`Address: ${address.address1 || ''}, ${address.cityVillage || ''}`);
    }
    
    lines.forEach(line => {
      this.doc.text(line, this.margin, this.yPos);
      this.yPos += 5;
    });
    
    this.yPos += 5;
  }

  private addSectionTitle(title: string): void {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(0, 0, 128);
    this.doc.text(title, this.margin, this.yPos);
    this.yPos += 3;
    
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, this.yPos - 1, this.pageWidth - this.margin, this.yPos - 1);
    this.yPos += 5;
    
    this.doc.setTextColor(0, 0, 0);
  }

  private addVisits(visits: any[]): void {
    if (!visits || visits.length === 0) {
      this.addSectionTitle('Visits');
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('No visits recorded', this.margin, this.yPos);
      this.yPos += 10;
      return;
    }

    this.addSectionTitle('Visits');
    this.doc.setFont('helvetica', 'normal');
    
    visits.forEach((visit, index) => {
      if (this.yPos > this.pageHeight - this.margin - 30) {
        this.addPage();
        this.addHeader();
      }
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`Visit ${index + 1}`, this.margin, this.yPos);
      this.yPos += 5;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      
      const visitLines = [
        `Type: ${visit.visitType?.display || 'N/A'}`,
        `Date: ${new Date(visit.startDatetime).toLocaleString()}`,
        `Location: ${visit.location?.display || 'N/A'}`,
      ];
      
      if (visit.stopDatetime) {
        visitLines.push(`End: ${new Date(visit.stopDatetime).toLocaleString()}`);
      }
      
      visitLines.forEach(line => {
        this.doc.text(line, this.margin + 5, this.yPos);
        this.yPos += 4;
      });
      
      this.yPos += 5;
    });
  }

  private addEncounters(encounters: any[]): void {
    if (!encounters || encounters.length === 0) {
      this.addSectionTitle('Encounters');
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('No encounters recorded', this.margin, this.yPos);
      this.yPos += 10;
      return;
    }

    this.addSectionTitle('Encounters');
    this.doc.setFont('helvetica', 'normal');
    
    encounters.forEach((encounter, index) => {
      if (this.yPos > this.pageHeight - this.margin - 30) {
        this.addPage();
        this.addHeader();
      }
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`Encounter ${index + 1}`, this.margin, this.yPos);
      this.yPos += 5;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      
      const encounterLines = [
        `Type: ${encounter.encounterType?.display || 'N/A'}`,
        `Date: ${new Date(encounter.encounterDatetime).toLocaleString()}`,
      ];
      
      encounterLines.forEach(line => {
        this.doc.text(line, this.margin + 5, this.yPos);
        this.yPos += 4;
      });
      
      if (encounter.obs && encounter.obs.length > 0) {
        this.yPos += 3;
        this.doc.setFontSize(8);
        this.doc.text('Observations:', this.margin + 5, this.yPos);
        this.yPos += 5;
        
        encounter.obs.slice(0, 10).forEach((obs: any) => {
          if (this.yPos > this.pageHeight - this.margin - 20) {
            this.addPage();
            this.addHeader();
          }
          const obsText = `- ${obs.concept?.display}: ${this.formatValue(obs.value)}`;
          const splitText = this.doc.splitTextToSize(obsText, this.pageWidth - this.margin - 10);
          this.doc.text(splitText, this.margin + 8, this.yPos);
          this.yPos += (splitText.length * 4) + 2;
        });
        
        if (encounter.obs.length > 10) {
          this.doc.setFont('helvetica', 'italic');
          this.doc.text(`... and ${encounter.obs.length - 10} more observations`, this.margin + 5, this.yPos);
          this.yPos += 5;
        }
        this.doc.setFontSize(9);
      }
      
      this.yPos += 5;
    });
  }

  private addMedications(medications: any[]): void {
    if (!medications || medications.length === 0) {
      this.addSectionTitle('Medications');
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('No medications prescribed', this.margin, this.yPos);
      this.yPos += 10;
      return;
    }

    this.addSectionTitle('Medications');
    this.doc.setFont('helvetica', 'normal');
    
    medications.forEach((med, index) => {
      if (this.yPos > this.pageHeight - this.margin - 30) {
        this.addPage();
        this.addHeader();
      }
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`Medication ${index + 1}`, this.margin, this.yPos);
      this.yPos += 5;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      
      const medLines = [
        `Drug: ${med.drug?.display || med.display || 'N/A'}`,
        `Dosage: ${med.dosageInstruction || 'N/A'}`,
        `Frequency: ${med.frequency || 'N/A'}`,
        `Duration: ${med.duration ? `${med.duration} ${med.durationUnits}` : 'N/A'}`,
        `Route: ${med.route || 'N/A'}`,
        `Started: ${new Date(med.dateActivated).toLocaleDateString()}`,
      ];
      
      if (med.discontinuationDate) {
        medLines.push(`Stopped: ${new Date(med.discontinuationDate).toLocaleDateString()}`);
      }
      
      if (med.orderer) {
        medLines.push(`Prescriber: ${med.orderer.display}`);
      }
      
      medLines.forEach(line => {
        this.doc.text(line, this.margin + 5, this.yPos);
        this.yPos += 4;
      });
      
      this.yPos += 5;
    });
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object' && value.display) return value.display;
    return String(value);
  }

  private addFooter(): void {
    const pageCount = (this.doc as any).internal.pages?.length || 1;
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(
        `Page ${i} of ${pageCount} - OpenMRS Print Module`,
        this.pageWidth / 2,
        this.pageHeight - this.margin,
        { align: 'center' }
      );
    }
  }

  public generatePDF(printData: PrintData): jsPDF {
    this.addHeader();
    this.addPatientInfo(printData.patient);
    this.addVisits(printData.visits);
    this.addEncounters(printData.encounters);
    this.addMedications(printData.medications);
    this.addFooter();
    
    return this.doc;
  }

  public savePDF(filename: string = 'openmrs-summary.pdf'): void {
    this.doc.save(filename);
  }
}

export async function generatePrintableHTML(printData: PrintData): Promise<string> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>OpenMRS Clinical Summary</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .patient-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #003366; font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
        .item { margin-bottom: 15px; padding: 10px; background: #fafafa; }
        .item-title { font-weight: bold; color: #333; }
        .item-detail { font-size: 14px; color: #666; margin-left: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f0f0f0; }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>OpenMRS Clinical Summary</h1>
        <p>Generated: ${printData.generatedAt}</p>
      </div>
      
      <div class="patient-info">
        <h3>Patient Information</h3>
        <table>
          <tr><td><strong>Name:</strong></td><td>${printData.patient?.display || 'N/A'}</td></tr>
          <tr><td><strong>Gender:</strong></td><td>${printData.patient?.person?.gender || 'N/A'}</td></tr>
          <tr><td><strong>Age:</strong></td><td>${printData.patient?.person?.age || 'N/A'}</td></tr>
          <tr><td><strong>Birthdate:</strong></td><td>${printData.patient?.person?.birthdate || 'N/A'}</td></tr>
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">Visits</div>
        ${printData.visits?.length ? printData.visits.map(v => `
          <div class="item">
            <div class="item-title">${v.visitType?.display || 'Visit'}</div>
            <div class="item-detail">
              ${new Date(v.startDatetime).toLocaleString()} - ${v.location?.display || 'N/A'}
            </div>
          </div>
        `).join('') : '<p>No visits recorded</p>'}
      </div>
      
      <div class="section">
        <div class="section-title">Encounters</div>
        ${printData.encounters?.length ? printData.encounters.map(e => `
          <div class="item">
            <div class="item-title">${e.encounterType?.display || 'Encounter'}</div>
            <div class="item-detail">
              ${new Date(e.encounterDatetime).toLocaleString()}
            </div>
            ${e.obs?.length ? `<div class="item-detail"><em>${e.obs.length} observations recorded</em></div>` : ''}
          </div>
        `).join('') : '<p>No encounters recorded</p>'}
      </div>
      
      <div class="section">
        <div class="section-title">Medications</div>
        ${printData.medications?.length ? printData.medications.map(m => `
          <div class="item">
            <div class="item-title">${m.drug?.display || m.display || 'Medication'}</div>
            <div class="item-detail">
              ${m.dosageInstruction || ''} | ${m.frequency || ''} | ${m.route || ''}
            </div>
            <div class="item-detail">
              Started: ${new Date(m.dateActivated).toLocaleDateString()}
              ${m.orderer ? ` | Prescriber: ${m.orderer.display}` : ''}
            </div>
          </div>
        `).join('') : '<p>No medications prescribed</p>'}
      </div>
    </body>
    </html>
  `;
  
  return html;
}

export async function printViaBrowser(printData: PrintData): Promise<void> {
  const html = await generatePrintableHTML(printData);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}
