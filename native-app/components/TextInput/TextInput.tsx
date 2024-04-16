import { Feather } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import { TextInput as TextInputRN, TextInputProps } from 'react-native';
import styled from 'styled-components/native';

type Props = TextInputProps & {
  secureTextEntry?: boolean;
  hasError?: boolean;
  textError?: string;
  defaultShowPassword?: boolean;
};

export const TextInput = forwardRef<TextInputRN, Props>(
  ({ hasError, textError, secureTextEntry, defaultShowPassword = false, ...props }, ref) => {
    const invalid = !!textError || hasError;
    const [showPassword, setShowPassword] = useState(defaultShowPassword);
    const [isFocused, setIsFocused] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword((p) => !p);
    };

    return (
      <TextInputContainer>
        <InputContainer hasError={invalid} isFocused={isFocused}>
          <StyledInput
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            // @ts-ignore
            ref={ref}
            secureTextEntry={!showPassword && secureTextEntry}
            {...props}
          />
          {secureTextEntry && (
            <TogglePassword onPress={toggleShowPassword}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color="#007aff" />
            </TogglePassword>
          )}
        </InputContainer>
        {!!textError && <ErrorText>{textError}</ErrorText>}
      </TextInputContainer>
    );
  }
);

const TextInputContainer = styled.View`
  gap: 12px;
`;

const ErrorText = styled.Text`
  color: #ff453a;
`;

const InputContainer = styled.View<{ hasError?: boolean; isFocused?: boolean }>`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props.hasError ? '#FF453A' : props.isFocused ? '#237ee8' : '#ccc'};
  align-items: center;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  height: 42px;
`;

const TogglePassword = styled.TouchableOpacity`
  margin-right: 8px;
`;
