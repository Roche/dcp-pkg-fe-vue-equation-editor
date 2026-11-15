import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { FormulaDetails, FormulaToken, TokenType } from "@open-dcp/equation-editor";
import { useI18n } from "vue-i18n";

const meta: Meta<typeof EquationEditor> = {
  title: "AdditionalOperators",
  component: EquationEditor,
};
export default meta;

const Template: StoryFn<typeof EquationEditor> = (args) => ({
  components: { EquationEditor },
  setup() {
    const { t } = useI18n();
    const equation = ref<FormulaDetails>();
    const variables = [
      { label: "x", value: "var_x" },
      { label: "y", value: "var_y" },
      { label: "z", value: "var_z" }
    ];
    const functions = ["sin", "cos", "tan", "log", "sqrt"];
    
    const operators = [
      { label: 'is equal to', value: '=' },
      { label: 'is not equal to', value: '!=' },
      { label: 'AND', value: '&&', modes: ['equation'], visible: (last: FormulaToken) => !!last && last.type === TokenType.Number },
      { label: 'NOT', value: '!', modes: ['equation'], visible: (last: FormulaToken) => !!last && last.type === TokenType.Variable }
    ];

    const translation = {
      translationPrefix: "@open-dcp/i18n",
      translator: t
    };

    return { args, equation, variables, functions, operators, translation };
  },
  template: `
      <div>
        <EquationEditor v-model="equation" mode="equation" :variables="variables" :functions="functions" :operators="operators" :fail-on-unknown="true" :translation="translation" />
        <h3>Current Equation Value:</h3>
        <pre>{{ equation }}</pre>
      </div>
    `,
});

export const AdditionalOperators = Template.bind({});