import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { FormulaDetails } from "@open-dcp/equation-editor";
import { useI18n } from "vue-i18n";

const meta: Meta<typeof EquationEditor> = {
  title: "Default",
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

    const translation = {
      translationPrefix: "@open-dcp/i18n",
      translator: t
    };

    const fence = {
      variableOpen: "@",
      variableClose: "@"
    };

    return { args, equation, variables, translation, fence };
  },
  template: `
      <div>
        <EquationEditor v-model="equation" :variables="variables" :fail-on-unknown="true" :fence="fence" :translation="translation" />
        <h3>Current Equation Value:</h3>
        <pre>{{ equation }}</pre>
      </div>
    `,
});

export const Default = Template.bind({});