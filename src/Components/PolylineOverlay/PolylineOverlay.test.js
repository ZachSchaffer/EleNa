import React from 'react';
import renderer from 'react-test-renderer';
import PolylineOverlay from './PolylineOverlay';

test('test PolylineOverlay', () => {
    const tree = renderer.create(<PolylineOverlay />).toJSON();
    expect(tree).toMatchSnapshot();
});