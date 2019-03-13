/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getOr } from 'lodash/fp';
import React from 'react';
import { Query } from 'react-apollo';

import { DetailItem, GetEventDetailsQuery } from '../../../graphql/types';
import { getDefaultFetchPolicy } from '../../helpers';

import { timelineDetailsQuery } from './index.gql_query';

export interface EventsArgs {
  detailsData: DetailItem[] | null;
  loading: boolean;
}

export interface TimelineDetailsProps {
  children?: (args: EventsArgs) => React.ReactNode;
  indexName: string;
  eventId: string;
  executeQuery: boolean;
  sourceId: string;
}

export class TimelineDetailsComponentQuery extends React.PureComponent<TimelineDetailsProps> {
  public render() {
    const { children, indexName, eventId, executeQuery, sourceId } = this.props;
    return executeQuery ? (
      <Query<GetEventDetailsQuery.Query, GetEventDetailsQuery.Variables>
        query={timelineDetailsQuery}
        fetchPolicy={getDefaultFetchPolicy()}
        notifyOnNetworkStatusChange
        variables={{
          sourceId,
          indexName,
          eventId,
        }}
      >
        {({ data, loading, refetch }) => {
          return children!({
            loading,
            detailsData: getOr([], 'source.EventDetails.data', data),
          });
        }}
      </Query>
    ) : (
      children!({ loading: false, detailsData: null })
    );
  }
}
