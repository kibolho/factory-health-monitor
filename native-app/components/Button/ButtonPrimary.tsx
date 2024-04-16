import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

type Props = {
  flex?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
  icon?: keyof typeof Feather.glyphMap;
};
export const ButtonPrimary: React.FC<React.PropsWithChildren<Props>> = ({
  onPress,
  flex,
  disabled,
  isLoading,
  icon,
  children,
}) => {
  return (
    <PrimaryButton flex={flex} onPress={onPress} disabled={disabled}>
      {icon && <Feather name={icon} size={20} color="#fff" />}
      {isLoading ? <ActivityIndicator color="#fff" /> : <PrimaryText>{children}</PrimaryText>}
    </PrimaryButton>
  );
};

const PrimaryButton = styled.TouchableOpacity<{
  disabled?: boolean;
  flex?: boolean;
}>`
  ${(props) => props.flex && 'flex: 1;'}
  height: 50px;
  border-radius: 30px;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.disabled ? '#DFDFDF' : '#237ee8')};
`;

const PrimaryText = styled.Text`
  font-family: SF Pro Text;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: ${(props) => (props.disabled ? '#5A5A5E' : '#fff')};
`;
