import React from 'react';
import TestRenderer from 'react-test-renderer';
import { If } from '../src/components';

describe('sandbox tests', () => {
  it('falsy condition', () => {
    const testRenderer = TestRenderer.create(
      <If condition={false}>
        <span />
      </If>
    );
    const testInstance = testRenderer.root;

    expect(testInstance.children.length).toEqual(0);
  });
  it('true condition', () => {
    const testRenderer = TestRenderer.create(
      <If condition={true}>
        <span />
      </If>
    );
    const testInstance = testRenderer.root;

    expect(testInstance.children.length).toEqual(1);
    expect(testInstance.children[0].type).toBe('span');
  });
});
