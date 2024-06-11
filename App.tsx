import React, {useEffect} from 'react';
import Register from './src/pages/Register';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useGlobalStore} from './src/store';
import ContactList from './src/pages/ContactList';
import {NavigationRoutesWithParams} from './src/types/navigation';
import JoinCall from './src/pages/JoinCall';
import messaging from '@react-native-firebase/messaging';

import {name as appName} from './app.json';
import {AppRegistry} from 'react-native';
import {PaperProvider, Snackbar} from 'react-native-paper';
import {MD3LightTheme as DefaultTheme} from 'react-native-paper';
import Login from './src/pages/Login';
import {useSnackBar} from './src/store/snack-bar';
import Home from './src/pages/Home';
import StartMeeting from './src/pages/StartMeeting';
import Loading from './src/components/Loading';
import {useLoadingStore} from './src/hook/useLoading';
import TopTabsGroup from './src/components/TopTabNavigation';
import DetailMeet from './src/pages/DetailMeet';
import Call from './src/pages/Call/Call';
import MeetingMe from './src/pages/MeetingMe';
import JoinMeeting from './src/pages/JoinMeeting';
import Profile from './src/pages/Profile';

const theme = {
  ...DefaultTheme,
  default: {
    regular: {
      fontFamily: 'NotoSans-Regular',
      fontSize: 'normal',
    },
    medium: {
      fontFamily: 'NotoSans-Bold',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'NotoSans-Regular',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'NotoSans-Regular',
      fontWeight: 'normal',
    },
  },
  colors: {
    ...DefaultTheme.colors,
    primary: '#0097a7',
    secondary: 'yellow',
    surfaceVariant: '#fff',
  },
};

const Stack = createNativeStackNavigator<NavigationRoutesWithParams>();

function App(): JSX.Element {
  const username = useGlobalStore(state => state._username);

  useEffect(() => {
    messaging()
      .subscribeToTopic('activeMeeting')
      .then(() => console.log('Subscribed to topic!'));
  }, []);

  const {isShow,text , toggleSnackBar} = useSnackBar();
  const loading = useLoadingStore(state => state.loading);

  return (
    <PaperProvider theme={theme}>
      {loading && <Loading />}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={username === '' ? 'register' : 'home'}>
          <Stack.Screen
            name="register"
            component={Register}
            options={{
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="login"
            component={Login}
            options={{
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="home"
            component={Home}
            options={{headerShadowVisible: false, headerShown: false}}
          />
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{headerShadowVisible: false, headerShown: false}}
          />
          <Stack.Screen
            name="start-meeting"
            component={StartMeeting}
            options={{headerShadowVisible: false, headerShown: false}}
          />
          <Stack.Screen
            name="join-meeting"
            component={JoinMeeting}
            options={{headerShadowVisible: false, headerShown: false}}
          />
          <Stack.Screen
            name="contact-list"
            component={ContactList}
            options={{headerShadowVisible: false, }}
          />
          <Stack.Screen
            name="Detail meetings"
            component={DetailMeet}
            options={{headerShadowVisible: false, headerStyle: {
              backgroundColor: '#CDE0EE'
            },}}
          />
          <Stack.Screen
            name="list-meeting"
            
            component={TopTabsGroup}
            // options={{headerShadowVisible: false, headerShown: false}}
            options={{
              headerStyle: {
                backgroundColor: '#CDE0EE',
              },
              headerTintColor: '#122D4D',
              headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="history-meeting"
            
            component={MeetingMe}
            // options={{headerShadowVisible: false, headerShown: false}}
            options={{
              headerStyle: {
                backgroundColor: '#CDE0EE',
              },
              headerTintColor: '#122D4D',
              headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="join-call"
            component={JoinCall}
            options={{
              headerStyle: {
                backgroundColor: '#141414',
              },
              headerTintColor: '#2160fd',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="call"
            component={Call}
            options={{
              headerStyle: {
                backgroundColor: '#141414',
              },
              headerTintColor: '#2160fd',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
        <Snackbar
          visible={isShow}
          onDismiss={() => toggleSnackBar(false)}
          action={{
            label: 'Undo',
            onPress: () => {
              toggleSnackBar(false);
            },
          }}>
            {text}
          
        </Snackbar>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;

AppRegistry.registerComponent(appName, () => App);
