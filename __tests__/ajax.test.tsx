import React from 'react';
import TestRenderer, { ReactTestInstance } from 'react-test-renderer';
import { If } from '../src/components';

describe('Ajax tests', () => {
  it('true condition', () => {
    const testRenderer = TestRenderer.create(
      <If condition={true}>
        <span />
      </If>
    );
    const testInstance = testRenderer.root;

    expect(testInstance.children.length).toEqual(1);
    expect((testInstance.children[0] as ReactTestInstance).type).toBe('span');
  });
});
