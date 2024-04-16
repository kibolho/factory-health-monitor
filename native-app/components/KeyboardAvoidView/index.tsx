import React, { PropsWithChildren } from 'react';
import {
  Keyboard,
  KeyboardAvoidingViewProps,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

type Props = PropsWithChildren<
  {
    IOSbehavior?: KeyboardAvoidingViewProps['behavior'];
    AndroidBehavior?: KeyboardAvoidingViewProps['behavior'];
  } & KeyboardAvoidingViewProps
>;

export const KeyboardAvoiding: React.FC<Props> = ({
  children,
  IOSbehavior = 'padding',
  AndroidBehavior = 'height',
  ...rest
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? IOSbehavior : AndroidBehavior}
      style={styles.container}
      {...rest}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>{children}</>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});