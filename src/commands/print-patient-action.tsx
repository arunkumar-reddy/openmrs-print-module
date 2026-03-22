import React from 'react';
import { getGlobalSpace } from '@openmrs/esm-framework';
import PrintButton from './components/PrintButton';

declare global {
  interface Window {
    __openmrsPatientContext?: {
      patientUuid: string;
    };
  }
}

const PrintPatientAction: React.FC = () => {
  const patientContext = getGlobalSpace('patient');
  const patientUuid = patientContext?.patientUuid;

  if (!patientUuid) {
    return null;
  }

  return <PrintButton patientUuid={patientUuid} />;
};

export default PrintPatientAction;
