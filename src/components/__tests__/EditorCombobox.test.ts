import { describe, it, expect, vi } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import EditorCombobox from '../EditorCombobox.vue';

describe('EditorCombobox', () => {
  it('exposes focus() and forwards it to the Vuetify combobox', () => {
    const focus = vi.fn();
    const VComboboxStub = defineComponent({
      name: 'VCombobox',
      setup(_, { expose }) {
        expose({ focus });
        return () => h('div');
      }
    });

    const app = createApp(EditorCombobox, { editor: {}, chipTokens: [], filteredOptions: [] });
    app.component('v-combobox', VComboboxStub);
    const vm = app.mount(document.createElement('div')) as unknown as { focus: () => void };

    vm.focus();

    expect(focus).toHaveBeenCalledTimes(1);
    app.unmount();
  });
});
