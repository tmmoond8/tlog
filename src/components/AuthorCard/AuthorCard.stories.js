import React from 'react';
import { storiesOf } from '@storybook/react';
import AuthorCard from './AuthorCard';

storiesOf('AuthorCard', module)
  .add('작성자', () => <AuthorCard/>);