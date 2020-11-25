import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

test('test App', () => {
    const tree = renderer.create(<App></App>).toJSON();
    expect(tree).toMatchSnapshot();
});
