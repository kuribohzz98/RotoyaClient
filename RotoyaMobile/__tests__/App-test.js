/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import EmptyScreen from '../src/components/empty/empty';

test('renders correctly', () => {
  const tree = renderer.create(<EmptyScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
