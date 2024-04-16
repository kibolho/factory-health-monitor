import React, { PropsWithChildren } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

type EdgeProp = ('top' | 'right' | 'bottom' | 'left')[];

type Props = {
  header?: boolean;
  edges?: EdgeProp;
};
export const SafeArea: React.FC<Props & PropsWithChildren> = ({
  children,
  header,
  edges = ['bottom', 'top', 'left', 'right'],
}) => {
  return (
    <Background>
      <Container header={header} edges={edges}>
        <StatusBar backgroundColor="#fff" />
        {children}
      </Container>
    </Background>
  );
};

const Background = styled.View`
  background-color: #fff;
  flex: 1;
`;

const Container = styled(SafeAreaView).attrs<{
  header?: boolean;
  edges: EdgeProp;
}>((props) => ({
  edges: props.edges,
}))`
  flex: 1;
  background-color: #fff;
  padding-top: ${(props) => (props.header ? 64 : 0)}px;
`;
