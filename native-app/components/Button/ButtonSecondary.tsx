import { Feather } from '@expo/vector-icons';
import React from 'react';
import styled from 'styled-components/native';

type Props = {
  flex?: boolean;
  variant?: 'light' | 'default';
  textAlign?: 'left' | 'center';
  onPress?: () => void;
  icon?: keyof typeof Feather.glyphMap;
  textProps?: React.ComponentProps<typeof Text>;
} & React.ComponentProps<typeof Button>;

export const ButtonSecondary: React.FC<React.PropsWithChildren<Props>> = ({
  variant,
  textAlign,
  onPress,
  flex,
  children,
  icon,
  textProps,
  ...rest
}) => {
  return (
    <Button flex={flex} onPress={onPress} {...rest}>
      <Text hasIcon={!!icon} textAlign={textAlign} variant={variant} {...textProps}>
        {children}
      </Text>
      {icon && <Feather name={icon} size={20} color="#237EE8" />}
    </Button>
  );
};

const Button = styled.TouchableOpacity<{ flex?: boolean }>`
  ${(props) => (props.flex ? 'flex: 1;' : 'align-self: flex-start;')}
  flex-direction: row;
  background-color: #237ee81a;
  padding: 6px 20px 6px 20px;
  border-radius: 10px;
  gap: 10px;
  justify-content: center;
`;

const Text = styled.Text<{
  textAlign?: 'left' | 'center';
  variant?: 'light' | 'default';
  hasIcon?: boolean;
}>`
  font-family: Roboto;
  font-size: 16px;
  font-weight: ${(props) => (props.variant === 'light' ? '400' : '700')};
  line-height: 22px;
  text-align: ${(props) => props.textAlign ?? 'center'};
  color: #237ee8;
  overflow: hidden;
  width: ${(props) => (props.hasIcon ? '90%' : 'auto')};
`;
