import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { FormulaDetails, Variable } from "@open-dcp/equation-editor";
import { useI18n } from "vue-i18n";

const meta: Meta<typeof EquationEditor> = {
  title: "Variables with Data",
  component: EquationEditor,
};
export default meta;

const Template: StoryFn<typeof EquationEditor> = () => ({
  components: { EquationEditor },
  setup() {
    const { t } = useI18n();
    const equation = ref<FormulaDetails>();

    // Variables with additional data metadata
    const variables: Variable[] = [
      { 
        label: "temperature", 
        value: "sensor_temp",
        data: {
          unit: "celsius",
          sensorId: "TEMP001",
          description: "Main temperature sensor"
        }
      },
      { 
        label: "pressure", 
        value: "sensor_pressure",
        data: {
          unit: "pascal",
          sensorId: "PRES001",
          description: "Pressure sensor"
        }
      },
      { 
        label: "humidity", 
        value: "sensor_humidity",
        data: {
          unit: "percent",
          sensorId: "HUM001",
          description: "Humidity sensor"
        }
      },
      { 
        label: "altitude", 
        value: "sensor_altitude",
        data: {
          unit: "meters",
          sensorId: "ALT001",
          description: "Altitude sensor"
        }
      }
    ];

    const translation = {
      translationPrefix: "@open-dcp/i18n",
      translator: t
    };

    return {
      equation,
      variables,
      translation
    };
  },
  template: `
    <div>
      <p style="margin-bottom: 12px; color: #666;">
        This story demonstrates variables with additional metadata stored in the <code>data</code> property.
        Each variable contains information about the sensor unit, ID, and description.
      </p>

      <EquationEditor
        v-model="equation"
        :variables="variables"
        :translation="translation"
      />

      <div v-if="equation" style="margin-top: 24px;">
        <h3>Formula Details</h3>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px;">{{ JSON.stringify(equation, null, 2) }}</pre>
        
        <div v-if="equation.tokens && equation.tokens.length > 0" style="margin-top: 16px;">
          <h3>Token Data</h3>
          <div v-for="(token, index) in equation.tokens" :key="index" style="margin-bottom: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
            <strong>{{ token.label || token.value }}</strong> ({{ token.type }})
            <div v-if="token.data" style="margin-top: 4px; padding-left: 12px;">
              <code style="font-size: 12px;">{{ JSON.stringify(token.data) }}</code>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 24px;">
        <h3>Variable Metadata</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Label</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Value</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Unit</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Sensor ID</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variable in variables" :key="variable.value">
              <td style="padding: 8px; border: 1px solid #ddd;">{{ variable.label }}</td>
              <td style="padding: 8px; border: 1px solid #ddd;"><code>{{ variable.value }}</code></td>
              <td style="padding: 8px; border: 1px solid #ddd;">{{ variable.data?.unit }}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">{{ variable.data?.sensorId }}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">{{ variable.data?.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
});

export const VariablesWithMetadata = Template.bind({});
