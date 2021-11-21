import React from 'react';
import styled from '@emotion/styled';
import { Button } from 'notion-ui';
import firebase from '../libs/firebase';

const FirebaseTestPage = () => {
  return (
    <Page>
      <Button onClick={() => firebase.getDocs()}>getDocs</Button>
    </Page>
  );
};

export default FirebaseTestPage;

const Page = styled.main`
  height: 100%;
  max-width: 900px;
  margin: 20px auto;
`;
