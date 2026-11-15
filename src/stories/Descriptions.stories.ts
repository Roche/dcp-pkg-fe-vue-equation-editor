import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { FormulaDetails, FormulaToken, TokenType, Variable } from "@open-dcp/equation-editor";
import { useI18n } from "vue-i18n";

const meta: Meta<typeof EquationEditor> = {
  title: "Descriptions",
  component: EquationEditor,
};
export default meta;

const Template: StoryFn<typeof EquationEditor> = () => ({
  components: { EquationEditor },
  setup() {
    const { t } = useI18n();
    const equationWithDescriptions = ref<FormulaDetails>();
    const equationIgnoringSomeDescriptions = ref<FormulaDetails>();

    const variables: Variable[] = [
      {
        label: "temperature",
        value: "sensor_temp",
        data: { description: "Primary ambient temperature sensor" }
      },
      {
        label: "humidity",
        value: "sensor_humidity",
        data: { description: "Relative humidity in percent" }
      },
      {
        label: "altitude",
        value: "sensor_altitude",
        data: { description: "Altitude above sea level in meters" }
      }
    ];

    const operators = [
      { label: "is equal to", value: "=", data: { description: "Exact equality check" } },
      { label: "is not equal to", value: "!=", data: { description: "Inequality check" } },
      {
        label: "AND",
        value: "&&",
        modes: ["equation"],
        data: { description: "Both conditions must be true" },
        visible: (last: FormulaToken) => !!last && last.type === TokenType.Number
      }
    ];

    const functions = [
      { label: "abs", description: "Absolute value" },
      { label: "sqrt", data: { description: "Square root" } },
      "round"
    ];

    const translation = {
      translationPrefix: "@open-dcp/i18n",
      translator: t
    };

    return {
      equationWithDescriptions,
      equationIgnoringSomeDescriptions,
      variables,
      operators,
      functions,
      translation
    };
  },
  template: `
    <div style="display: grid; gap: 24px; max-width: 900px;">
      <section>
        <h3 style="margin-bottom: 8px;">All descriptions shown as subtitles</h3>
        <p style="margin-bottom: 12px; color: #666;">
          Open the autocomplete menu to see variable, operator, and function descriptions.
        </p>
        <EquationEditor
          v-model="equationWithDescriptions"
          mode="equation"
          :variables="variables"
          :operators="operators"
          :functions="functions"
          :translation="translation"
        />
      </section>

      <section>
        <h3 style="margin-bottom: 8px;">Ignore operator and function descriptions</h3>
        <p style="margin-bottom: 12px; color: #666;">
          This instance uses <code>ignore-description</code> to hide selected subtitle types.
        </p>
        <EquationEditor
          v-model="equationIgnoringSomeDescriptions"
          mode="equation"
          :variables="variables"
          :operators="operators"
          :functions="functions"
          :ignore-description="{ operators: true, functions: true }"
          :translation="translation"
        />
      </section>
    </div>
  `,
});

export const DescriptionSubtitles = Template.bind({});
