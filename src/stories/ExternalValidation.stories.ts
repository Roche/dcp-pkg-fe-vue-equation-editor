import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { FormulaDetails, FormulaToken } from "@open-dcp/equation-editor";
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

        const customValidator = async (formula: string, tokens: FormulaToken[]) => {
            if (tokens.length === 0) return null;

            return ['Custom Validator always says: No'];
        }

        return { args, equation, variables, translation, customValidator };
    },
    template: `
      <div>
        <EquationEditor v-model="equation" :variables="variables" :nbrOfErrorsToShow="null" :translation="translation" :custom-validator="customValidator" />
        <h3>Current Equation Value:</h3>
        <pre>{{ equation }}</pre>
      </div>
    `,
});

export const ExternalValidation = Template.bind({});