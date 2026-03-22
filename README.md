# OpenMRS Print Module

A custom frontend module for OpenMRS 3.0 that provides print functionality for patient clinical data including visits, encounters, and medications.

## Features

- **Print Patient Summary**: Comprehensive printout of patient demographics, visits, encounters, and active medications
- **Print Visit Details**: Focus on a specific visit with its associated encounters and medications
- **Two Output Formats**:
  - **Browser Print**: Opens browser print dialog with styled HTML
  - **PDF Download**: Generates downloadable PDF using jsPDF

## Project Structure

```
openmrs-print-module/
├── src/
│   ├── api/
│   │   ├── api.ts              # OpenMRS REST API clients
│   │   └── pdf-generator.ts    # PDF generation utilities
│   ├── components/
│   │   ├── PrintButton.tsx     # Main print button component
│   │   ├── PrintButton.module.css
│   │   ├── PrintPreviewModal.tsx
│   │   └── PrintPreviewModal.module.css
│   ├── commands/
│   │   ├── print-patient-action.tsx
│   │   └── print-visit-action.tsx
│   └── index.ts                # Module entry point
├── package.json
├── tsconfig.json
├── openmrs-module.json         # OpenMRS extension manifest
└── README.md
```

## Installation

### Prerequisites

- Node.js 16+
- OpenMRS CLI (`npm install -g @openmrs/esm-patient-records-app`)
- Running OpenMRS 3.0 instance

### Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the module**:
   ```bash
   npm run build
   ```

3. **Add to OpenMRS spa-build-config.json**:
   Add the module path to your OpenMRS frontend configuration:
   ```json
   {
     "core": "@openmrs/esm-framework",
     "modules": [
       "@openmrs/print-module"
     ]
   }
   ```

4. **Run locally for development**:
   ```bash
   npm run start
   ```

## API Integration

### OpenMRS REST Endpoints Used

| Data | Endpoint |
|------|----------|
| Patient | `/openmrs/ws/rest/v1/patient/{uuid}?v=full` |
| Visits | `/openmrs/ws/rest/v1/visit?patient={uuid}&v=full` |
| Encounters | `/openmrs/ws/rest/v1/encounter?patient={uuid}&v=full` |
| Medications | `/openmrs/ws/rest/v1/drugorder?patient={uuid}&status=ACTIVE&v=full` |

## PDF Generation

Uses **jsPDF** and **html2canvas** libraries:

- **jsPDF**: Creates PDF documents with formatted text, tables, and styling
- **html2canvas**: Converts HTML elements to canvas for PDF rendering
- **Alternative**: Browser print via styled HTML with `@media print` CSS

## Customization

### Print Template

Edit `src/api/pdf-generator.ts` to modify:
- Header/footer content
- Section ordering
- Data formatting
- Styling

### Extension Points

Configure in `openmrs-module.json`:
- Add new extension slots
- Modify existing slot placements
- Add conditional rendering

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @openmrs/esm-framework | 5.12.0 | OpenMRS core |
| jsPDF | 2.5.1 | PDF generation |
| html2canvas | 1.4.1 | HTML to canvas |
| react | 18.2.0 | UI framework |

## License

MPL-2.0
