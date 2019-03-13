/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { cloneDeep, get } from 'lodash/fp';
import React from 'react';

import { Ecs } from '../../../../graphql/types';
import { defaultHeaders, mockEcsData } from '../../../../mock';
import { getEmptyValue } from '../../../empty_value';

import { emptyColumnRenderer } from '.';

describe('empty_column_renderer', () => {
  let mockDatum: Ecs;
  beforeEach(() => {
    mockDatum = cloneDeep(mockEcsData[0]);
  });

  test('renders correctly against snapshot', () => {
    delete mockDatum.source;
    const emptyColumn = emptyColumnRenderer.renderColumn({
      columnName: 'source.ip',
      eventId: mockDatum._id,
      value: get('source.ip', mockDatum),
      field: defaultHeaders.find(h => h.id === 'source.ip')!,
    });
    const wrapper = shallow(<span>{emptyColumn}</span>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should return isInstance true if source is empty', () => {
    delete mockDatum.source;
    expect(emptyColumnRenderer.isInstance('source', mockDatum)).toBe(true);
  });

  test('should return isInstance false if source is NOT empty', () => {
    expect(emptyColumnRenderer.isInstance('source', mockDatum)).toBe(false);
  });

  test('should return isInstance true if source.ip is empty', () => {
    delete mockDatum.source!.ip;
    expect(emptyColumnRenderer.isInstance('source.ip', mockDatum)).toBe(true);
  });

  test('should return isInstance false if source.ip is NOT empty', () => {
    expect(emptyColumnRenderer.isInstance('source.ip', mockDatum)).toBe(false);
  });

  test('should return isInstance true if it encounters a column it does not know about', () => {
    expect(emptyColumnRenderer.isInstance('made up name', mockDatum)).toBe(true);
  });

  test('should return an empty value', () => {
    delete mockDatum.source;
    const emptyColumn = emptyColumnRenderer.renderColumn({
      columnName: 'source.ip',
      eventId: mockDatum._id,
      value: null,
      field: defaultHeaders.find(h => h.id === 'source.ip')!,
    });
    const wrapper = mount(<span>{emptyColumn}</span>);
    expect(wrapper.text()).toEqual(getEmptyValue());
  });
});
