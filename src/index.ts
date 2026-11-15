import DcpEquationEditor from '@/components/EquationEditor.vue';
import DcpEditorFunctionButton from '@/components/EditorFunctionButton.vue';
export { getLocalizedDisplay, getLocalizedUnfancedDisplay } from '@/composables/useFormulaLocalization';

const dcpComponents = {
  DcpEquationEditor,
  DcpEditorFunctionButton
};

export default {
  install(app: any) {
    for (const [name, component] of Object.entries(dcpComponents)) {
      app.component(name, component);
    }
  },
};

// Export components individually as well
export {
  DcpEquationEditor,
  DcpEditorFunctionButton
};

export {
  parseFormulaString,
  EquationEditor,
  joinTokensNormalized,
  type FormulaDetails,
  type Variable,
  type TokenType,
  type Operator,
  type Parenthesis,
  type CustomValidatorFunction
} from '@open-dcp/equation-editor';

export type { LocalizedFormulaDetails } from './types';