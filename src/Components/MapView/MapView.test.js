import React from 'react';
import renderer from 'react-test-renderer';
import MapView from './MapView';

test('test MapView', () => {
    const tree = renderer.create(<MapView markers = {[]}/>).toJSON();
    expect(tree).toMatchSnapshot();
});