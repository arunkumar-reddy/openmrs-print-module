import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export interface Visit {
  uuid: string;
  display: string;
  startDatetime: string;
  stopDatetime: string;
  patient: {
    uuid: string;
    display: string;
  };
  visitType: {
    uuid: string;
    display: string;
  };
  location: {
    uuid: string;
    display: string;
  };
  encounters?: Encounter[];
}

export interface Encounter {
  uuid: string;
  display: string;
  encounterDatetime: string;
  encounterType: {
    uuid: string;
    display: string;
  };
  patient: {
    uuid: string;
    display: string;
  };
  visit?: {
    uuid: string;
    display: string;
  };
  obs?: Obs[];
  orders?: Order[];
}

export interface Obs {
  uuid: string;
  concept: {
    uuid: string;
    display: string;
  };
  value: any;
  obsDatetime: string;
}

export interface Order {
  uuid: string;
  type: string;
  orderType: {
    uuid: string;
    display: string;
  };
  drug?: {
    uuid: string;
    display: string;
    strength: string;
  };
  dosageInstruction: string;
  frequency: string;
  duration: string;
  durationUnits: string;
  numRefills: number;
  quantity: number;
  quantityUnits: {
    uuid: string;
    display: string;
  };
  route: string;
  orderer: {
    uuid: string;
    display: string;
  };
  dateActivated: string;
  discontinuationDate?: string;
  urgency: string;
  patient: {
    uuid: string;
    display: string;
  };
}

export interface Patient {
  uuid: string;
  display: string;
  person: {
    uuid: string;
    display: string;
    gender: string;
    age: number;
    birthdate: string;
    addresses: Array<{
      address1: string;
      cityVillage: string;
      country: string;
      postalCode: string;
    }>;
  };
}

export async function getPatient(patientUuid: string): Promise<Patient> {
  const url = `${restBaseUrl}/patient?q=${patientUuid}&v=full`;
  const response = await openmrsFetch(url);
  return response.data.results?.[0];
}

export async function getVisits(patientUuid: string): Promise<Visit[]> {
  const url = `${restBaseUrl}/visit?patient=${patientUuid}&v=full&includeInactive=true`;
  const response = await openmrsFetch(url);
  return response.data.results || [];
}

export async function getEncounters(
  patientUuid: string,
  visitUuid?: string
): Promise<Encounter[]> {
  let url = `${restBaseUrl}/encounter?patient=${patientUuid}&v=full`;
  if (visitUuid) {
    url += `&visit=${visitUuid}`;
  }
  const response = await openmrsFetch(url);
  return response.data.results || [];
}

export async function getMedications(patientUuid: string): Promise<Order[]> {
  const url = `${restBaseUrl}/order?patient=${patientUuid}&v=full`;
  const response = await openmrsFetch(url);
  return response.data.results?.filter((o: Order) => o.type === 'drugorder') || [];
}
