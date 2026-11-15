import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { FormulaDetails } from "@open-dcp/equation-editor";
import { useI18n } from "vue-i18n";

const meta: Meta<typeof EquationEditor> = {
  title: "ErrorLogging",
  component: EquationEditor,
};
export default meta;

const Template: StoryFn<typeof EquationEditor> = () => ({
  components: { EquationEditor },
  setup() {
    const { t } = useI18n();
    const equation = ref<FormulaDetails>();
    const validationErrors = ref<string[]>([]);

    const variables = [
      { label: "x", value: "var_x" },
      { label: "y", value: "var_y" },
      { label: "z", value: "var_z" }
    ];

    const translation = {
      translationPrefix: "@open-dcp/i18n",
      translator: t
    };

    const onErrors = (errors: string[]) => {
      validationErrors.value = errors;
    };

    return {
      equation,
      variables,
      translation,
      validationErrors,
      onErrors
    };
  },
  template: `
    <div>
      <p style="margin-bottom: 12px; color: #666;">
        This story displays only validation errors in the UI.
      </p>

      <EquationEditor
        v-model="equation"
        :variables="variables"
        :translation="translation"
        @errors="onErrors"
      />

      <div v-if="validationErrors.length > 0" style="margin-top: 12px;">
        <h3>Validation Errors</h3>
        <ul>
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <h3>Try invalid input, for example:</h3>
      <ul>
        <li>x +</li>
        <li>(x + y</li>
      </ul>
    </div>
  `,
});

export const LogsOnlyErrors = Template.bind({});
