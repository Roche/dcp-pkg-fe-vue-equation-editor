import { describe, it, expect } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import EditorDisplayText from '../EditorDisplayText.vue';

describe('EditorDisplayText', () => {
  it('limits the suggestion menu height and anchors it below the input', () => {
    let menuAttrs: Record<string, unknown> = {};
    const VMenuStub = defineComponent({
      name: 'VMenu',
      inheritAttrs: false,
      setup(_, { attrs }) {
        return () => {
          menuAttrs = { ...attrs };
          return h('div');
        };
      }
    });

    const app = createApp(EditorDisplayText, { modelValue: '', filteredOptions: [] });
    app.component('v-menu', VMenuStub);
    app.mount(document.createElement('div'));

    expect(menuAttrs['max-height']).toBe(310);
    expect(menuAttrs['location']).toBe('bottom start');
    expect(menuAttrs).not.toHaveProperty('offset-y');
    app.unmount();
  });
});
