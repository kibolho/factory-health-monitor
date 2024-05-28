import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
import styled from "styled-components/native";
import { z } from "zod";
import { SafeArea } from "../../components/SafeAreaView";

import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput/TextInput";
import { API_ROUTES } from "../../constants";
import { httpClient } from "../../infra/http";
import { HttpStatusCode } from "../../infra/http/http-client";
import { Version } from "../../infra/utils/version";
import { useAuth } from "../../providers/authProvider";
import { KeyboardAvoiding } from "../../components/KeyboardAvoidView";

const signUpFormSchema = z.object({
  email: z
    .string({
      required_error: "Insert your email",
    })
    .email({ message: "It should be a valid email" }),
  password: z
    .string({
      required_error: "Insert your password",
    })
    .min(6, { message: "The password should have at least 6 characters" })
    .regex(/\d+/, { message: "The password should contain at least 1 digit" }),
});

export type SignUpValues = z.infer<typeof signUpFormSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, setUserInfo, setTokens } = useAuth();

  const { control, handleSubmit, setValue, setFocus } = useForm<SignUpValues>({
    reValidateMode: "onChange",
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: userInfo?.email,
    },
  });

  useEffect(() => {
    if (userInfo?.email) setValue("email", userInfo?.email);
  }, [userInfo]);

  const onSubmit = async (data: SignUpValues) => {
    setIsLoading(true);
    login(data);
  };

  const login = async (
    data: SignUpValues,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    const { statusCode, body } = await httpClient.request({
      url: API_ROUTES.register,
      method: "post",
      isAuthenticated: false,
      body: data,
    });

    if (statusCode === HttpStatusCode.ok) {
      onSuccess?.();
      setTokens({
        accessToken: body?.accessToken,
        refreshToken: body?.refreshToken,
      });
      setUserInfo({
        email: data?.email,
      });
      setIsLoading(false);
      return router.push("/(tabs)");
    }
    setIsLoading(false);
    Alert.alert("Error", body?.message || "Unable to sign up. Try again.");
    onError?.();
  };

  return (
    <SafeArea>
      <KeyboardAvoiding>
        <BodyView>
          <Header>
            <Title>Sign up</Title>
          </Header>
          <Controller
            name="email"
            control={control}
            render={({
              field: { value, onChange, onBlur, ref },
              fieldState: { error },
            }) => (
              <TextInput
                ref={ref}
                autoCorrect={false}
                placeholder="your@email.com"
                inputMode="email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                returnKeyType="next"
                onSubmitEditing={() => {
                  setFocus("password");
                }}
                textError={error?.message as string}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({
              field: { value, onChange, onBlur, ref },
              fieldState: { error },
            }) => (
              <TextInput
                ref={ref}
                secureTextEntry
                placeholder="Password"
                autoComplete="password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                returnKeyType="go"
                onSubmitEditing={handleSubmit(onSubmit)}
                textError={error?.message as string}
              />
            )}
          />
        </BodyView>
        <ColumnView>
          <Button.Primary
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          >
            Sign Up
          </Button.Primary>

          <Button.Tertiary
            onPress={() => {
              router.replace("/login");
            }}
          >
            Log In
          </Button.Tertiary>
        </ColumnView>
      </KeyboardAvoiding>
      <BottomView>
        <VersionText>{Version.getFullVersionStatic()}</VersionText>
      </BottomView>
    </SafeArea>
  );
}

const BodyView = styled.View`
  flex: 1;
  gap: 20px;
  padding-top: 40px;
  padding: 20px;
  justify-content: center;
`;

const ColumnView = styled.View`
  justify-content: flex-start;
  gap: 20px;
  padding: 20px;
`;

const Header = styled.View`
  gap: 8px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  line-height: 38px;
  text-align: left;
  color: #000000;
`;

const BottomView = styled.View`
  justify-content: flex-end;
  padding-bottom: 20px;
  margin-top: 20px;
`;
const VersionText = styled.Text`
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #3c3c43;
  opacity: 0.5;
`;
