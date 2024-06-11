import {
    View,
    Text,
    Image,
    Switch,
    TouchableOpacity,
    Keyboard,
    StyleSheet,
  } from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome';
  import React from 'react';
  import KeyboardAvoidingComponent from '../components/KeyboardAvoidingComponent';
  import {TextInput, HelperText, Snackbar} from 'react-native-paper';
  import {useState, useEffect} from 'react';
  import DatePicker from 'react-native-date-picker';
  import {firebase} from '@react-native-firebase/database';
  import {useNavigation} from '@react-navigation/core';
  
  import {z} from 'zod';
  import {zodResolver} from '@hookform/resolvers/zod';
  import {useForm, Controller} from 'react-hook-form';
  import {useLoadingStore} from '../hook/useLoading';
  import {useGlobalStore} from '../store';
  import {IMeeting} from '../types/general';
  
  const MeetingSchema = z.object({
    userName: z.string().min(6),
    password: z.string().min(6),
    email: z.string().min(6),
  });
  
  const Profile = () => {
    const navigation = useNavigation();
    const [textSnackBar, setTextSnackBar] = useState('');
    const [visible, setVisible] = React.useState(false);
    const _username = useGlobalStore(store => store._username);
    const onToggleSnackBar = () => setVisible(!visible);
  
    const onDismissSnackBar = () => setVisible(false);
  
    const {control, register, handleSubmit, reset} = useForm<any>({
      resolver: zodResolver(MeetingSchema),
    });
  
    const onSubmit = (dataOut: any) => {
      Keyboard.dismiss();
  
      const meetRef = firebase.database().ref('Meets');
      meetRef.once('value', data => {
        Object.entries(data.val()).map(([key, value]) => {
          console.log(key);
          if(value.status === 'STOP'){
              setTextSnackBar('Meet is stopped');
              onToggleSnackBar();
          }else{
              if (value.isPublic) {
                  if (value.passRoom === dataOut?.idMeeting) {
                    navigation.navigate('call',{idMeet: value.idMeeting , name: _username, idUser: key})
                    // redirect
                  } else {
                    // fall pass room
                    setTextSnackBar('Please enter right pass');
                    onToggleSnackBar();
                  }
                } else {
                  if (value.passRoom === dataOut?.idMeeting) {
                    const participants = value.participants;
                    if (participants.length >= 0 && participants.includes(_username)) {
                        navigation.navigate('call',{idMeet: value.idMeeting , name: _username, idUser: key})
                    } else {
                      setTextSnackBar('You dont have permission to join this room');
                      onToggleSnackBar();
                    }
                  } else {
                    setTextSnackBar('Please enter right pass');
                    onToggleSnackBar();
                  }
                }
          }
        });
      });
    };
  
    return (
      <View className="h-screen p-4 bg-[#CDE0EE]">
        <Image
          style={{position: 'absolute', top: 0, right: 0}}
          source={require('../assets/outline.png')}
        />
        <View className="flex flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.navigate('home')} className="flex flex-row justify-between items-center">
          <Icon name="long-arrow-left" size={20} color="#000" />
          <Text className="text-xl font-bold text-black ml-3">Profile</Text>
          </TouchableOpacity>
        </View>
  
        <View className="flex flex-col justify-center h-full">

        <View className="flex flex-row items-center justify-center">
        <Image
          style={{height: 100, width: 100, borderRadius: 50, borderBottomWidth: 2, marginBottom: 5}}
          source={{uri: 'https://www.w3schools.com/w3images/avatar2.png'}}
        />
        </View>


          <Controller
            control={control}
            name="username"
            render={({
              field: {onChange, onBlur, value},
              formState: {errors: formErrors},
            }) => (
              <>
                <KeyboardAvoidingComponent>
                  <TextInput
                    label="User name"
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
                {formErrors.username && (
                  <HelperText type="error" visible={true}>
                    {formErrors.username.message}
                  </HelperText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({
              field: {onChange, onBlur, value},
              formState: {errors: formErrors},
            }) => (
              <>
                <KeyboardAvoidingComponent>
                  <TextInput
                    label="Password"
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    left={
                      <TextInput.Icon
                        size={50}
                        icon={require('../assets/icon-meet.png')}
                      />
                    }
                  />
                </KeyboardAvoidingComponent>
                {formErrors.password && (
                  <HelperText type="error" visible={true}>
                    {formErrors.password.message}
                  </HelperText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({
              field: {onChange, onBlur, value},
              formState: {errors: formErrors},
            }) => (
              <>
                <KeyboardAvoidingComponent>
                  <TextInput
                    label="Email"
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
                {formErrors.email && (
                  <HelperText type="error" visible={true}>
                    {formErrors.email.message}
                  </HelperText>
                )}
              </>
            )}
          />
  
          <TouchableOpacity
            className="w-full p-4 rounded-md bg-[#294DFF] mt-4"
            onPress={handleSubmit(onSubmit)}>
            <Text className="text-white text-xl text-center font-medium">
              Update Profile
            </Text>
          </TouchableOpacity>

          <View className="flex flex-row items-center justify-center mt-[100px]">
            <Image
              // style={styles.tinyLogo}
              source={require('../assets/image4.png')}
            />
          </View>

        </View>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Off',
            onPress: () => {
              onDismissSnackBar();
            },
          }}>
          {textSnackBar}
        </Snackbar>
      </View>
    );
  };
  
  export default Profile;
  
  const styles = StyleSheet.create({});
  