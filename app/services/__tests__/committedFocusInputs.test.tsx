import React, {useCallback, useEffect, useState} from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {useCommittedRef} from '../../customHooks/useCommittedRef';
let focus: () => void;
let view: TestRenderer.ReactTestRenderer;
function Form({profile}: {profile: {name: string}}) {
  const inputs = useCommittedRef(profile);
  const [name, setName] = useState('');
  const onFocus = useCallback(() => setName(inputs.current.name), [inputs]);
  useEffect(() => {
    focus = onFocus;
    onFocus();
  }, [onFocus]);
  return React.createElement('form', {
    testID: 'form',
    name,
    onEdit: setName,
  } as any);
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});
afterEach(() => {
  if (view) act(() => view.unmount());
});
test('new committed profile inputs do not reset edits, but the next focus reads them', () => {
  act(() => {
    view = TestRenderer.create(<Form profile={{name: 'First'}} />);
  });
  const form = () => view.root.findByProps({testID: 'form'}).props;
  expect(form().name).toBe('First');
  const originalFocus = focus;
  act(() => form().onEdit('Caregiver draft'));
  act(() => view.update(<Form profile={{name: 'Second'}} />));
  expect(form().name).toBe('Caregiver draft');
  expect(focus).toBe(originalFocus);
  act(() => focus());
  expect(form().name).toBe('Second');
});

test('a committed input factory can safely read functions declared later in the render', () => {
  let read!: () => string;
  function Inputs({label}: {label: string}) {
    const current = useCommittedRef(() => ({run}));
    const run = () => label;
    read = () => current.current().run();
    return null;
  }
  act(() => {
    view = TestRenderer.create(<Inputs label="First" />);
  });
  expect(read()).toBe('First');
  act(() => view.update(<Inputs label="Second" />));
  expect(read()).toBe('Second');
});
