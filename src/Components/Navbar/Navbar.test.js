import React from 'react';
import renderer from 'react-test-renderer';
import Navbar from './Navbar';

test('test Home', () => {
    const tree = renderer.create(<Navbar />).toJSON();
    expect(tree).toMatchSnapshot();
});