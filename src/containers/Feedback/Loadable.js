import React from 'react';
import Loadable from 'react-loadable';

const FeedbackLoadable = Loadable({
  loader: () => import('./Feedback'),
  loading: () => <div>Loading</div>
});

export default FeedbackLoadable;
