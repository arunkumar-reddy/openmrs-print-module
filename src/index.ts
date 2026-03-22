import { defineConfig } from '@openmrs/esm-framework';

const configDefinition = {
  print: {
    enabled: true,
    showVisitPrint: true,
    showEncounterPrint: true,
    showMedicationPrint: true,
  },
};

export const config = defineConfig(configDefinition, 'print-module');

export function bootstrap(app: any, props: any) {
  return Promise.resolve();
}

export function mount(app: any, props: any) {
  return Promise.resolve();
}

export function unmount(app: any, props: any) {
  return Promise.resolve();
}
