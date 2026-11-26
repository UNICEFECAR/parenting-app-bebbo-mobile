import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {useStableContentShuffle} from '../../customHooks/useStableContentShuffle';

test('content refresh keeps existing card order, updates records and fills from new IDs', () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  let result: any[] = [];
  function Probe({items}: {items: any[]}) {
    result = useStableContentShuffle(items, 10);
    return null;
  }
  let view!: TestRenderer.ReactTestRenderer;
  const initial = [1, 2, 3].map(id => ({id, title: 'Old'}));
  act(() => {view = TestRenderer.create(<Probe items={initial} />);});
  const order = result.map(item => item.id);
  act(() => view.update(<Probe items={[{id: 4}, ...initial.slice().reverse().map(item => ({...item, title: 'New'}))]} />));
  expect(result.map(item => item.id)).toEqual([...order, 4]);
  expect(result[0].title).toBe('New');
  act(() => view.update(<Probe items={initial.filter(item => item.id !== order[0])} />));
  expect(result.map(item => item.id)).toEqual(order.slice(1));
  act(() => view.unmount());
});
