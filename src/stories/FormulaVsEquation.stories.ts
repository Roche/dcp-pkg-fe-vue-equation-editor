import type { Meta, StoryFn } from "@storybook/vue3";
import { ref } from "vue";
import EquationEditor from "@/components/EquationEditor.vue";
import { FormulaDetails } from "@open-dcp/equation-editor";
import { useI18n } from "vue-i18n";

const meta: Meta<typeof EquationEditor> = {
  title: "FormulaVsEquation",
  component: EquationEditor,
};
export default meta;

const Template: StoryFn<typeof EquationEditor> = (args) => ({
  components: { EquationEditor },
  setup() {
    const { t } = useI18n();
    const mode = ref<'formula' | 'equation'>('formula');
    const formula = ref<FormulaDetails>();
    const equation = ref<FormulaDetails>();

    const variables = [
      { label: "x", value: "var_x" },
      { label: "y", value: "var_y" },
      { label: "z", value: "var_z" },
      { label: "age", value: "user_age" }
    ];

    const functions = ["sin", "cos", "tan", "log", "sqrt", "abs"];

    const translation = {
      translationPrefix: "@open-dcp/i18n",
      translator: t
    };

    return {
      args,
      mode,
      formula,
      equation,
      variables,
      functions,
      translation
    };
  },
  template: `
    <div style="display: flex; gap: 20px; padding: 20px;">
      <div style="flex: 1; border-right: 1px solid #ccc; padding-right: 20px;">
        <h2>Formula Mode</h2>
        <p style="color: #666; font-size: 12px;">Arithmetic operators only (+, -, *, /)</p>
        <EquationEditor
          v-model="formula"
          mode="formula"
          :variables="variables"
          :functions="functions"
          :translation="translation"
          label="Formula"
        />
        <h3>Value:</h3>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">{{ formula }}</pre>
      </div>

      <div style="flex: 1; padding-left: 20px;">
        <h2>Equation Mode</h2>
        <p style="color: #666; font-size: 12px;">Arithmetic + Comparison + Text operators</p>
        <EquationEditor
          v-model="equation"
          mode="equation"
          :variables="variables"
          :functions="functions"
          :translation="translation"
          label="Equation"
        />
        <h3>Value:</h3>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">{{ equation }}</pre>
      </div>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 4px;">
      <h3>Key Differences:</h3>
      <ul>
        <li><strong>Formula:</strong> Basic math (+ - * /), functions, variables, parentheses</li>
        <li><strong>Equation:</strong> Everything from formula PLUS built-in comparison/list/text operators</li>
        <li><strong>Validation:</strong> Different rules apply per mode (e.g., min variables, comparison operator limits)</li>
        <li><strong>Custom Operators:</strong> Optional when you need domain-specific behavior beyond built-ins</li>
      </ul>
    </div>
  `,
});

export const FormulaVsEquation = Template.bind({});
FormulaVsEquation.parameters = {
  docs: {
    description: {
      story: 'Side-by-side comparison of formula and equation modes. Formula mode accepts arithmetic expressions, while equation mode enables built-in comparison/list/text operators and equation-aware validation.'
    }
  }
};

// Story showcasing mode-specific operator filtering
const EquationModeStory: StoryFn<typeof EquationEditor> = (args) => ({
  components: { EquationEditor },
  setup() {
    const { t } = useI18n();
    const equation = ref<FormulaDetails>();

    const variables = [
      { label: "amount", value: "var_amount" },
      { label: "threshold", value: "var_threshold" },
      { label: "status", value: "var_status" }
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
    <div style="padding: 20px;">
      <h2>Equation Mode with Comprehensive Operators</h2>
      <p>Try different operators and observe which ones are available based on mode configuration.</p>
      
      <EquationEditor
        v-model="equation"
        mode="equation"
        :variables="variables"
        :translation="translation"
        label="Equation"
      />

      <h3>Parsed Result:</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; max-height: 300px; overflow: auto;">{{ equation }}</pre>

      <h3>Try these expressions:</h3>
      <ul>
        <li><code>amount > threshold</code> - Compare two variables</li>
        <li><code>amount * 2 = threshold</code> - Combine arithmetic and comparison</li>
        <li><code>amount in [1, 2, 3]</code> - Check if value is in a list (list membership operator)</li>
        <li><code>amount between [1, 10]</code> - Check if value is inside a range</li>
      </ul>
    </div>
  `,
});

export const EquationModeComprehensive = EquationModeStory.bind({});
EquationModeComprehensive.parameters = {
  docs: {
    description: {
      story: 'Demonstrates equation mode with built-in comparison/list/text operators. No custom operators are required unless you need domain-specific behavior.'
    }
  }
};

// Story for testing custom label/value mismatch
const CustomOperatorStory: StoryFn<typeof EquationEditor> = (args) => ({
  components: { EquationEditor },
  setup() {
    const { t } = useI18n();
    const equation = ref<FormulaDetails>();

    const variables = [
      { label: "email", value: "user_email" },
      { label: "domain", value: "email_domain" }
    ];

    const customOperators = [
      {
        label: 'has text',
        value: 'contains',
        modes: ['equation'],
        category: 'text',
        arity: 'binary',
        fixity: 'infix'
      },
      {
        label: 'does NOT have text',
        value: 'doesNotContain',
        modes: ['equation'],
        category: 'text',
        arity: 'binary',
        fixity: 'infix'
      },
      {
        label: 'begins with',
        value: 'startsWith',
        modes: ['equation'],
        category: 'text',
        arity: 'binary',
        fixity: 'infix'
      }
    ];

    const translation = {
      translationPrefix: "@open-dcp/i18n",
      translator: t
    };

    return {
      equation,
      variables,
      customOperators,
      translation
    };
  },
  template: `
    <div style="padding: 20px;">
      <h2>Custom Operators with Different Labels and Values</h2>
      <p>Notice how the display text (label) differs from the parsed value. This is useful for user-friendly operator names.</p>
      
      <EquationEditor
        v-model="equation"
        mode="equation"
        :variables="variables"
        :operators="customOperators"
        :translation="translation"
        label="Boolean Expression"
      />

      <h3>Parsed Formula:</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">{{ equation?.display }}</pre>

      <h3>Raw Representation:</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; max-height: 300px; overflow: auto;">{{ equation?.raw }}</pre>

      <h3>Key Points:</h3>
      <ul>
        <li>Display labels are user-friendly: "has text", "does NOT have text", "begins with"</li>
        <li>Parser uses the actual operator values: contains, doesNotContain, startsWith</li>
        <li>The Vue wrapper correctly maps display text to validator tokens</li>
        <li>All operators are built-in from the underlying package with proper validation rules</li>
      </ul>
    </div>
  `,
});

export const CustomOperatorLabels = CustomOperatorStory.bind({});
CustomOperatorLabels.parameters = {
  docs: {
    description: {
      story: 'Demonstrates built-in text operators with custom display labels. Shows how the Vue wrapper correctly maps user-friendly label names to validator tokens (contains, doesNotContain, startsWith).'
    }
  }
};
