import { describe, it, expect, afterEach } from 'vitest';
import { createApp, defineComponent, h, nextTick, ref, type App } from 'vue';
import EquationEditor from '../EquationEditor.vue';

const variables = [
  { label: 'Temp', value: 'temp' },
  { label: 'Press', value: 'press' }
] as any;

let app: App | undefined;
afterEach(() => app?.unmount());

/** Mounts the editor under a parent that owns the v-model; the combobox stub records the chips it receives. */
function mountWithParent(initial: any) {
  const model = ref<any>(initial);
  const chips = ref<any[]>([]);
  const VComboboxStub = defineComponent({
    props: ['modelValue'],
    setup(props) {
      return () => { chips.value = props.modelValue ?? []; return h('div'); };
    }
  });
  const Parent = defineComponent({
    setup: () => () => h(EquationEditor, {
      variables,
      noCopyButton: true,
      noRawToggle: true,
      modelValue: model.value,
      'onUpdate:modelValue': (value: any) => { model.value = value; }
    })
  });
  app = createApp(Parent);
  app.config.warnHandler = () => {};
  app.component('v-combobox', VComboboxStub);
  app.mount(document.createElement('div'));
  return { model, chips };
}

const settle = async () => { await nextTick(); await nextTick(); };
const chipLabels = (chips: any[]) => chips.map(chip => chip.label);

describe('EquationEditor v-model', () => {
  it('applies a formula set by the parent after mount (e.g. loaded asynchronously)', async () => {
    const { model, chips } = mountWithParent(undefined);
    await settle();
    expect(chips.value).toHaveLength(0);

    model.value = { display: '{Temp} + {Press}' };
    await settle();

    expect(chipLabels(chips.value)).toEqual(['Temp', '+', 'Press']);
    expect(model.value.localizedDisplay).toBeDefined();
  });

  it('clears the editor when the parent resets the model', async () => {
    const { model, chips } = mountWithParent({ display: '{Temp} + {Press}' });
    await settle();
    expect(chips.value).toHaveLength(3);

    model.value = null;
    await settle();

    expect(chips.value).toHaveLength(0);
  });

  it('does not loop when the editor emits its own changes', async () => {
    const { model, chips } = mountWithParent({ display: '{Temp}' });
    await settle();
    const before = model.value;

    await settle();

    expect(model.value).toBe(before);
    expect(chipLabels(chips.value)).toEqual(['Temp']);
  });
});
