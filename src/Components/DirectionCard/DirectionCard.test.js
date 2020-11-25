import React from 'react';
import renderer from 'react-test-renderer';
import DirectionCard from './DirectionCard';

test('test DirectionCard', () => {
    const tree = renderer.create(<DirectionCard />).toJSON();
    expect(tree).toMatchSnapshot();
});