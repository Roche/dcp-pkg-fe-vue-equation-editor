import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { FormulaDetails } from "@open-dcp/equation-editor";
import { useI18n } from "vue-i18n";

const meta: Meta<typeof EquationEditor> = {
    title: "TokenFencing",
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
            { label: "y", value: "var_y" }
        ];

        const translation = {
            translationPrefix: "@open-dcp/i18n",
            translator: t
        };

        // Example fencing: variables with @, numbers with []
        const fence = {
            variableOpen: "@",
            variableClose: "@",
            numberOpen: "[",
            numberClose: "]"
        };

        return { args, equation, variables, translation, fence };
    },
    template: `
    <div>
      <EquationEditor
        v-model="equation"
        :variables="variables"
        :fence="fence"
        :translation="translation"
        :fail-on-unknown="true"
      />
      <h3>Current Equation Value:</h3>
      <pre>{{ equation }}</pre>
      <p>
        <strong>Fencing:</strong> Variables are wrapped with <code>@</code>, numbers with <code>[]</code>
      </p>
    </div>
  `,
});

export const TokenFencing = Template.bind({});