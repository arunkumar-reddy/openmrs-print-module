import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getPatient, 
  getVisits, 
  getEncounters, 
  getMedications,
} from '../api/api';
import { PDFGenerator, printViaBrowser, PrintData } from '../api/pdf-generator';
import PrintPreviewModal from './PrintPreviewModal';
import styles from './PrintButton.module.css';

interface PrintButtonProps {
  patientUuid: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({ patientUuid }) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [printData, setPrintData] = useState<PrintData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [patient, visits, encounters, medications] = await Promise.all([
        getPatient(patientUuid),
        getVisits(patientUuid),
        getEncounters(patientUuid),
        getMedications(patientUuid),
      ]);

      const data: PrintData = {
        patient,
        visits: visits.slice(0, 20),
        encounters: encounters.slice(0, 30),
        medications: medications.slice(0, 30),
        generatedAt: new Date().toLocaleString(),
      };

      setPrintData(data);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient data');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async (method: 'pdf' | 'browser') => {
    if (!printData) return;
    
    if (method === 'pdf') {
      const generator = new PDFGenerator();
      generator.generatePDF(printData);
      generator.savePDF(`Patient-Summary-${patientUuid}.pdf`);
    } else {
      await printViaBrowser(printData);
    }
    
    setShowPreview(false);
  };

  const handleClose = () => {
    setShowPreview(false);
  };

  return (
    <>
      <button
        className={styles.printButton}
        onClick={fetchData}
        disabled={loading}
        title={t('print-patient-summary', 'Print Patient Summary')}
      >
        {loading ? (
          <span className={styles.spinner}></span>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>
            <span>{t('print', 'Print')}</span>
          </>
        )}
      </button>

      {error && (
        <div className={styles.error}>
          {t('error-fetching-data', 'Error fetching data:')} {error}
        </div>
      )}

      {showPreview && printData && (
        <PrintPreviewModal
          printData={printData}
          onPrint={handlePrint}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default PrintButton;
