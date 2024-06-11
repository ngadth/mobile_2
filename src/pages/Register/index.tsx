import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useGlobalStore} from '../../store';
import {RegisterScreenProps} from '../../types/navigation';

import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {HelperText} from 'react-native-paper';

import { firebase } from '@react-native-firebase/database';

const SignUpSchema = z
  .object({
    email: z.string().email(),
    fullName: z.string().min(6),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export default function Register({
  navigation,
}: RegisterScreenProps): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
  });

  const _username = useGlobalStore(store => store._username);
  const _setUsername = useGlobalStore(store => store.setUsername);
  const _setName = useGlobalStore(store => store.setName);

  const onSubmit = (data: SignUpSchemaType) => {
    console.log('submitted data', data);
    const usersRef = firebase.database().ref('Users');
    usersRef.push(data)

    navigation.push('login');
    
  }
  // function handleSubmit() {
  //   _setUsername(username);
  //   setUsername('');

  //   _setName(fullName);
  //   setFullName('');

  //   navigation.push('contact-list');
  // }

  useEffect(() => {
    if (_username !== '') {
      navigation.push('contact-list');
    }
  }, [_username, navigation]);

  // console.log(errors);
  

  return (
    <View className="h-screen w-scren bg-white p-4 flex flex-col justify-center">
      <View
        className="bg-white rounded-xl p-4 translate-y-[-100px]"
        style={{elevation: 2}}>
        <Text className="text-4xl font-black text-black mb-6 text-center">
          Register
        </Text>
        <Controller
          control={control}
          name="email"
          render={({field: { onChange, onBlur, value }, formState: {errors: formErrors}}) => (
            <>
              <Text className="text-lg font-bold text-black mb-2">Email</Text>
              <TextInput
                className="border border-slate-300 rounded-xl text-lg px-4 text-black"
                placeholder="Enter your name"
                placeholderTextColor="#888"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
              />
              {formErrors.email && (
                <HelperText type="error" visible={true}>
                  {formErrors.email.message}
                </HelperText>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="fullName"
          render={({field: { onChange, onBlur, value }, formState: {errors}}) => (
            <>
              <Text className="text-lg font-bold text-black mb-2 mt-4">
                Username
              </Text>
              <TextInput
                className="border border-slate-300 rounded-xl text-lg px-4 text-black"
                placeholder="Enter your username"
                placeholderTextColor="#888"
                onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
              />
              {errors.fullName && (
                <HelperText type="error" visible={true}>
                  {errors.fullName.message}
                </HelperText>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({field: { onChange, onBlur, value }, formState: {errors}}) => (
            <>
              <Text className="text-lg font-bold text-black mb-2 mt-4">
                Password
              </Text>
              <TextInput
                secureTextEntry={true}
                className="border border-slate-300 rounded-xl text-lg px-4 text-black"
                placeholder="Enter your username"
                placeholderTextColor="#888"
                onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
              />
              {errors.password && (
                <HelperText type="error" visible={true}>
                  {errors.password.message}
                </HelperText>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({field: { onChange, onBlur, value }, formState: {errors}}) => (
            <>
              <Text className="text-lg font-bold text-black mb-2 mt-4">
                Confirm Password
              </Text>
              <TextInput
                secureTextEntry={true}
                className="border border-slate-300 rounded-xl text-lg px-4 text-black"
                placeholder="Enter your username"
                placeholderTextColor="#888"
                onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
              />
              {errors.confirmPassword && (
                <HelperText type="error" visible={true}>
                  {errors.confirmPassword.message}
                </HelperText>
              )}
            </>
          )}
        />

        <TouchableOpacity
          className="w-full p-2 rounded-xl bg-dyte-blue mt-4"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-white text-xl text-center font-bold">
            Register
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full p-2 rounded-xl border-2 border-dyte-blue mt-4"
          onPress={()=> navigation.push('login')}>
          <Text className="text-dyte-blue text-sm text-center font-bold">
            Login
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
