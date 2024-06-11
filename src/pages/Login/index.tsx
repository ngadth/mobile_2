import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useGlobalStore} from '../../store';
import {RegisterScreenProps} from '../../types/navigation';

import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {HelperText, Snackbar} from 'react-native-paper';
import { useSnackBar } from '../../store/snack-bar';
import { firebase } from '@react-native-firebase/database';

const SignUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export default function Login({
  navigation,
}: RegisterScreenProps): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
  });

  const {isShow, toggleSnackBar} = useSnackBar()
  
  const _username = useGlobalStore(store => store._username);
  const _setUsername = useGlobalStore(store => store.setUsername);
  const _setName = useGlobalStore(store => store.setName);

  const onSubmit = (data: SignUpSchemaType) => {
    console.log('submitted data', data);
    
    const usersRef = firebase.database().ref('Users');
    usersRef.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            // Lấy dữ liệu của từng con
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
        
            // Kiểm tra xem đối tượng con có chứa thông tin bạn muốn không
            if (childData.email === data.email && childData.password === data.password) {
                _setUsername(childData.email);
                _setName(childData.fullName);
              navigation.push('home'); 
              // return;
            }else{
                toggleSnackBar(true,'Login Fail! Please try again later')
            }
          });
    })

    
    
  }
  // function handleSubmit() {
  //   _setUsername(username);
  //   setUsername('');

  //   _setName(fullName);
  //   setFullName('');

  //   navigation.push('contact-list');
  // }

//   useEffect(() => {
//     if (_username !== '') {
//       navigation.push('contact-list');
//     }
//   }, [_username, navigation]);

  // console.log(errors);
  

  return (
    <View className="h-screen w-scren bg-white p-4 flex flex-col justify-center">
      <View
        className="bg-white rounded-xl p-4 translate-y-[-100px]"
        style={{elevation: 2}}>
        <Text className="text-4xl font-black text-black mb-6 text-center">
          Login
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

        <TouchableOpacity
          className="w-full p-2 rounded-xl bg-dyte-blue mt-4"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-white text-xl text-center font-bold">
            Login
          </Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}
