import type { FormulaDetails } from '@open-dcp/equation-editor';

export type LocalizedFormulaDetails = FormulaDetails & {
  localizedDisplay?: string;
  localizedUnfancedDisplay?: string;
};
