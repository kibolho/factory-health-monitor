import { Feather } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import styled from 'styled-components/native';

type Props = {
  flex?: boolean;
  variant?: 'light' | 'default';
  textAlign?: 'left' | 'center';
  onPress?: () => void;
  flexDirection?: 'row' | 'column';
  bottom?: ReactNode;
  icon?: keyof typeof Feather.glyphMap;
};
export const ButtonTertiary: React.FC<React.PropsWithChildren<Props>> = ({
  variant,
  textAlign,
  onPress,
  flex,
  flexDirection,
  bottom,
  icon,
  children,
}) => {
  return (
    <Button flex={flex} onPress={onPress} flexDirection={flexDirection}>
      {icon && <Feather name={icon} size={20} color="#237EE8" />}

      <Text textAlign={textAlign} variant={variant}>
        {children}
      </Text>
      {bottom}
    </Button>
  );
};

const Button = styled.TouchableOpacity<{
  flex?: boolean;
  flexDirection?: 'row' | 'column';
}>`
  ${(props) => props.flex && 'flex: 1;'}
  ${(props) => props.flexDirection && `flex-direction: ${props.flexDirection};`}
`;

const Text = styled.Text<{
  textAlign?: 'left' | 'center';
  variant?: 'light' | 'default';
}>`
  font-family: SF Pro Text;
  font-size: 16px;
  font-weight: ${(props) => (props.variant === 'light' ? '400' : '500')};
  line-height: 19px;
  text-align: ${(props) => props.textAlign ?? 'center'};
  color: #237ee8;
`;
