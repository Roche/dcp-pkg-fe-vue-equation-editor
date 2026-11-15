import type { Meta, StoryFn } from "@storybook/vue3";
import { computed, ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { useI18n } from "vue-i18n";
import type { LocalizedFormulaDetails } from "@/types";

const meta: Meta<typeof EquationEditor> = {
    title: "TranslationPayload",
    component: EquationEditor,
};

export default meta;

const Template: StoryFn<typeof EquationEditor> = (args) => ({
    components: { EquationEditor },
    setup() {
        const { t, locale, availableLocales } = useI18n();
        const equation = ref<LocalizedFormulaDetails>();

        // Variable mirrors the real-world id/label split from translation-related reports.
        const variables = [
            {
                label: "Druck_P1.U",
                value: "D1C00001PI1AbERuYiTbprtUev-SErXP9OeQQMgcCNex6BGA-gBQVplZogwRnvOFcvrEGLCDr3dLsD8g"
            },
            { label: "temperature", value: "sensor_temp" }
        ];

        const translation = computed(() => ({
            translationPrefix: "@open-dcp/i18n",
            translator: t,
            // Keep locale in payload so changing language updates the prop deeply.
            locale: locale.value
        }));

        const fence = {
            variableOpen: "{",
            variableClose: "}"
        };

        return {
            args,
            equation,
            variables,
            translation,
            fence,
            locale,
            localeOptions: availableLocales && availableLocales.length > 0 ? availableLocales : ["en", "de"]
        };
    },
    template: `
    <div style="padding: 20px; max-width: 1000px;">
      <h2>Translated Payload Fields</h2>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <label for="locale-select" style="color: #555; font-weight: 600;">Locale:</label>
                <select id="locale-select" v-model="locale" style="border: 1px solid #ccc; border-radius: 4px; padding: 6px 8px;">
                    <option v-for="lng in localeOptions" :key="lng" :value="lng">{{ lng }}</option>
                </select>
                <span style="color: #555;">Active locale: <strong>{{ locale }}</strong></span>
            </div>

      <EquationEditor
        v-model="equation"
        mode="equation"
        :variables="variables"
        :translation="translation"
        :fence="fence"
        :fail-on-unknown="true"
        label="Try: Druck_P1.U between [10,100]"
      />

      <div style="margin-top: 20px; display: grid; gap: 8px;">
        <div><strong>display:</strong> {{ equation?.display }}</div>
        <div><strong>unfancedDisplay:</strong> {{ equation?.unfancedDisplay }}</div>
        <div><strong>localizedDisplay:</strong> {{ equation?.localizedDisplay }}</div>
        <div><strong>localizedUnfancedDisplay:</strong> {{ equation?.localizedUnfancedDisplay }}</div>
        <div><strong>raw:</strong> {{ equation?.raw }}</div>
        <div><strong>fanciedRaw:</strong> {{ equation?.fanciedRaw }}</div>
      </div>

      <h3 style="margin-top: 20px;">Full Payload</h3>
      <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; overflow: auto; max-height: 320px;">{{ equation }}</pre>
    </div>
  `,
});

export const TranslationPayload = Template.bind({});
TranslationPayload.parameters = {
    docs: {
        description: {
            story: "Validates localized payload fields. Compare display/unfancedDisplay against localizedDisplay/localizedUnfancedDisplay while changing the current i18n locale."
        }
    }
};
