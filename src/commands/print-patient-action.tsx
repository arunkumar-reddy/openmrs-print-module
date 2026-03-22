import React from 'react';
import PrintButton from '../components/PrintButton';

declare global {
  interface Window {
    __openmrsPatientContext?: {
      patientUuid: string;
    };
  }
}

const PrintPatientAction: React.FC = () => {
  const patientUuid = window.__openmrsPatientContext?.patientUuid;

  if (!patientUuid) {
    return null;
  }

  return <PrintButton patientUuid={patientUuid} />;
};

export default PrintPatientAction;
