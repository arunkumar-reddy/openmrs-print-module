import React from 'react';
import { useTranslation } from 'react-i18next';
import { PrintData } from '../api/pdf-generator';
import styles from './PrintPreviewModal.module.css';

interface PrintPreviewModalProps {
  printData: PrintData;
  onPrint: (method: 'pdf' | 'browser') => void;
  onClose: () => void;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  printData,
  onPrint,
  onClose,
}) => {
  const [t] = useTranslation();

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{t('print-preview', 'Print Preview')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.patientInfo}>
            <h3>{t('patient-info', 'Patient Information')}</h3>
            <p><strong>{printData.patient?.display}</strong></p>
            <p>Gender: {printData.patient?.person?.gender}</p>
            <p>Age: {printData.patient?.person?.age}</p>
            <p>Birthdate: {printData.patient?.person?.birthdate}</p>
          </div>

          <div className={styles.section}>
            <h3>{t('visits', 'Visits')}</h3>
            <p>{printData.visits?.length || 0} visit(s) found</p>
            {printData.visits?.slice(0, 5).map((visit) => (
              <div key={visit.uuid} className={styles.item}>
                <strong>{visit.visitType?.display}</strong>
                <span>{new Date(visit.startDatetime).toLocaleDateString()}</span>
              </div>
            ))}
            {printData.visits?.length > 5 && (
              <p className={styles.more}>... and {printData.visits.length - 5} more</p>
            )}
          </div>

          <div className={styles.section}>
            <h3>{t('encounters', 'Encounters')}</h3>
            <p>{printData.encounters?.length || 0} encounter(s) found</p>
            {printData.encounters?.slice(0, 5).map((encounter) => (
              <div key={encounter.uuid} className={styles.item}>
                <strong>{encounter.encounterType?.display}</strong>
                <span>{new Date(encounter.encounterDatetime).toLocaleDateString()}</span>
              </div>
            ))}
            {printData.encounters?.length > 5 && (
              <p className={styles.more}>... and {printData.encounters.length - 5} more</p>
            )}
          </div>

          <div className={styles.section}>
            <h3>{t('medications', 'Medications')}</h3>
            <p>{printData.medications?.length || 0} active medication(s)</p>
            {printData.medications?.slice(0, 5).map((med) => (
              <div key={med.uuid} className={styles.item}>
                <strong>{med.drug?.display || med.display}</strong>
                <span>{med.dosageInstruction}</span>
              </div>
            ))}
            {printData.medications?.length > 5 && (
              <p className={styles.more}>... and {printData.medications.length - 5} more</p>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={() => onPrint('browser')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>
            {t('print-browser', 'Print (Browser)')}
          </button>
          <button className={styles.actionButton} onClick={() => onPrint('pdf')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
            {t('download-pdf', 'Download PDF')}
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            {t('cancel', 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
