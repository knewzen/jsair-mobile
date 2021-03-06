'use strict';

import {
  REQUEST_EPISODES_DATA,
  RECEIVED_EPISODES_DATA,
  ERROR_FETCHING_EPISODES_DATA
}                               from '../actions';

const initialState = {
  isFetching:             false,
  storedPastEpisode:      false,
  storedUpcomingEpisode:  false,
  storedFuturEpisode:     false,
  actionDate:             null,

  allEpisodes:            [],

  pastEpisodes:           [],
  upcomingEpisodes:       [],
  futurEpisodes:          [],

  error:                  null
};

const episodes = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_EPISODES_DATA:
      return {
        ...state,
        isFetching:             true,
        storedPastEpisode:      false,
        storedUpcomingEpisode:  false,
        storedFuturEpisode:     false,
        actionDate:             action.actionDate,
        error:                  null
      };
    case ERROR_FETCHING_EPISODES_DATA:
      return {
        ...state,
        isFetching:             false,
        error:                  action.error
      };
    case RECEIVED_EPISODES_DATA:
      return {
        ...state,
        isFetching:             false,
        allEpisodes:            [...action.allEpisodes],
        storedPastEpisode:      true,
        pastEpisodes:           [...action.pastEpisodes],
        storedUpcomingEpisode:  true,
        upcomingEpisodes:       [...action.upcomingEpisodes],
        storedFuturEpisode:     true,
        futurEpisodes:          [...action.futurEpisodes],
        actionDate:             action.actionDate,
        error:                  null
      };
    default:
      return state;
  }
};

export default episodes;
