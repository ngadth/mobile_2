import {View, Text, Image, Switch, TouchableOpacity, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import KeyboardAvoidingComponent from '../components/KeyboardAvoidingComponent';
import {TextInput, HelperText} from 'react-native-paper';
import {useState, useEffect} from 'react';
import DatePicker from 'react-native-date-picker';
import { firebase } from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/core';

import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import { useLoadingStore } from '../hook/useLoading';
import { useGlobalStore } from '../store';
import { log } from '../utils';
import { useSnackBar } from '../store/snack-bar';


type IMeeting = {
  name: string;
  passRoom: string;
  isPublic: boolean;
  dateStart: any;
  dateTime: any;
};

const MeetingSchema = z.object({
  name: z.string().min(6),
  passRoom: z.string().min(6),
  isPublic: z.boolean().optional(),
  dateStart: z.coerce.date().optional(),
  dateTime: z.coerce.date().optional(),
});
type MeetingSchemaType = z.infer<typeof MeetingSchema>;

const StartMeeting = () => {
  const [open, setOpen] = useState(false);
  const [meeting, setMeeting] = useState<IMeeting>({
    name: '',
    passRoom: '',
    isPublic: false,
    dateStart: Date.now(),
    dateTime: '',
  });
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState<any>(new Date());
  const [mode, setMode] = useState<'date'| 'time'>('date');

  const _username = useGlobalStore(store => store._username);
  const createMeeting = useGlobalStore(s => s.createMeeting);
  const {toggleSnackBar} = useSnackBar()

  const {control, register, handleSubmit, reset} = useForm<MeetingSchemaType>({
    resolver: zodResolver(MeetingSchema),
  });
  const [loading, setLoadingFalse, setLoadingTrue] = useLoadingStore(
    (state) => [state.loading, state.setLoadingFalse, state.setLoadingTrue]
  );
  const navigation =  useNavigation();

  const onSubmit = (data: MeetingSchemaType) => {
    Keyboard.dismiss()
    setLoadingTrue(true)
    createMeeting().then(meetInfo => {
      log('meeting info:-', meetInfo);

      const formData = {
        ...data,
        isPublic: data.isPublic || false,
        dateStart: String(date),
        dateTime: String(time),
        participants: [_username],
        idMeeting: meetInfo.id,
        status: meetInfo.status
      }
      const meetRef = firebase.database().ref('Meets');
      meetRef.push(formData)
      setLoadingFalse(true)
      toggleSnackBar(true, 'Meeting create success');
      reset({
        name: '',
        passRoom: '',
        isPublic: false
      })
    });
  };

  const clearForm = () =>{

  }

  const handleOpenDate = (mode: 'date' | 'time') =>{
    setOpen(true)
    setMode(mode)
  }

  console.log(time);
  

  return (
    <View className="h-screen p-4 bg-[#CDE0EE]">
      
      <Image
        style={{position: 'absolute', top: 0, right: 0}}
        source={require('../assets/outline.png')}
        />
      <View className="flex flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
        <Image
          // style={styles.tinyLogo}
          source={require('../assets/logo-app-call.png')}
        />
        </TouchableOpacity>
        <View className="bg-black px-2 py-1 rounded-md">
          <Icon name="user" size={20} color="#fff" />
        </View>
      </View>

      <View className="flex flex-col justify-center h-full">
        <Controller
          control={control}
          name="name"
          render={({
            field: {onChange, onBlur, value},
            formState: {errors: formErrors},
          }) => (
            <>
              <KeyboardAvoidingComponent>
                <TextInput
                  label="Name Room"
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  value={value}
                  left={
                    <TextInput.Icon
                      size={50}
                      icon={require('../assets/icon-user.png')}
                    />
                  }
                />
              </KeyboardAvoidingComponent>
              {formErrors.name && (
                <HelperText type="error" visible={true}>
                  {formErrors.name.message}
                </HelperText>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="passRoom"
          render={({
            field: {onChange, onBlur, value},
            formState: {errors: formErrors},
          }) => (
            <>
              <KeyboardAvoidingComponent>
                <TextInput
                  label="Id Room"
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  value={value}
                  className="mt-3"
                  left={
                    <TextInput.Icon
                      size={50}
                      icon={require('../assets/icon-meet.png')}
                    />
                  }
                />
              </KeyboardAvoidingComponent>
              {formErrors.passRoom && (
                <HelperText type="error" visible={true}>
                  {formErrors.passRoom.message}
                </HelperText>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="isPublic"
          render={({
            field: {onChange, onBlur, value},
            formState: {errors: formErrors},
          }) => (
            <View className="flex flex-row items-center mt-3">
              <Text className="font-medium text-md ">Private Room</Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={value ? '#294DFF' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => onChange(value)}
                value={value}
              />
            </View>
          )}
        />
        <View className="flex flex-row gap-4 justify-between mt-3">
          <TextInput
            className="flex-1"
            label="Date Room"
            value={date.toDateString()}
            onPressIn={() => handleOpenDate('date')}
            left={
              <TextInput.Icon
                size={20}
                icon={require('../assets/icon-date.png')}
              />
            }
          />
          <TextInput
            label="Time"
            className="flex-1"
            value={time.toTimeString()}
            onPressIn={() => handleOpenDate('time')}
            left={
              <TextInput.Icon
                size={20}
                icon={require('../assets/icon-time.png')}
              />
            }
          />
        </View>

        <TouchableOpacity
          className="w-full p-4 rounded-md bg-[#294DFF] mt-4"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-white text-xl text-center font-light">
            Create Meeting
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center mt-[100px]">
          <Image
            // style={styles.tinyLogo}
            source={require('../assets/image4.png')}
          />
        </View>
      </View>
      <DatePicker
        modal
        mode={mode}
        open={open} 
        date={date}
        onConfirm={date => {
          setOpen(false);
          if(mode === 'date') {

            setDate(date);
          }else{
            setTime(date);
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default StartMeeting;
