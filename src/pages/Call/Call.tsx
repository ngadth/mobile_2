import {JoinCallScreenProps} from '../../types/navigation';
import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useGlobalStore} from '../../store';
import {Meeting, ParticipantDetails} from '../../types/general';
import {log} from '../../utils';
import {notifyServer} from '../../api';
import {DyteProvider, useDyteClient} from '@dytesdk/react-native-core';
import {DyteMeeting, DyteUIProvider, DyteMicToggle,} from '@dytesdk/react-native-ui-kit';
import {firebase} from '@react-native-firebase/database';

// import {
//   DyteParticipantsAudio,
//   DyteNotifications,
//   DyteGrid,
//   DyteMicToggle,
//   DyteCameraToggle,
//   DyteSettingsToggle,
//   DyteHeader,
// } from '@dytesdk/react-ui-kit'

interface IAction {
  action: 'pause' | 'stop' | 'resume'
}

export default function Call({route, navigation}: JoinCallScreenProps) {
  const {idMeet, name, idUser} = route.params as any;
  const actionRecord = useGlobalStore(s => s.actionRecord);
  const startRecordVideo = useGlobalStore(s => s.startRecordVideo);
  const addParticipant = useGlobalStore(s => s.addParticipant);
  const localUsername = useGlobalStore(s => s._username);
  const localFullName = useGlobalStore(s => s._fullName);
  const [meeting, setMeeting] = useState<string>();
  const [participant, setParticipant] = useState<ParticipantDetails>();
  // const [client, initClient] = useDyteClient();
  const [meeting, initMeeting] = useDyteClient();
  const [idRecord, setIdRecord] = useState<string>();
  const [listParticipants, setListParticipants] = useState<any>([]);
  const _username = useGlobalStore(store => store._username);

  useEffect(() => {
    if (idMeet) {
      log('active meeting info:-', idMeet);
      setMeeting(idMeet);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idMeet]);

  useEffect(()=>{
    new Promise(async() =>{
      try {
        const responseMeeting = await startRecordVideo(idMeet);
        console.log("responseMeeting: " + responseMeeting)
        if(responseMeeting){
          setIdRecord(responseMeeting.id)
        }
      } catch (error) {
        console.log(error);
        
      }
    })
    fetchDataItem();
  },[])

  useEffect(() => {
    if (!meeting) {
      return;
    }
    addParticipant(meeting, localUsername, localFullName).then(
      participantInfo => {
        log('participant info:-', participantInfo);
        if (participantInfo?.token) {
          initClient({
            authToken: participantInfo?.token,
            defaults: {
              audio: true,
              video: true,
            },
          });
        }
        setParticipant(participantInfo);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting, localUsername, localFullName, navigation]);

  const actionRecordHandle = async(idRecord:string,action: string) =>{
    const responseMeeting = await actionRecord(idRecord,action);
    if(responseMeeting){
      console.log(responseMeeting);
      updateUser(responseMeeting.id)
    }
  }

  const fetchDataItem = () =>{
    const meetRef = firebase.database().ref('Meets/' + idUser);
    meetRef.once('value', (data) => {
      
      setListParticipants(data.val().participants)
      
    })
  }

  const updateUser = (idRecord: string) => {
    const meetRef = firebase.database().ref('Meets/' + idUser);
    meetRef.once('value', (data) => {
      // do some stuff once
      const listUser = data.val();
  
      const newData = {
        ...listUser,
        idRecord: idRecord,
        status: 'STOP'
      };
  
      meetRef.update(newData)
        .then(() => {
          console.log('Record updated successfully');
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    });
  };

  useEffect(() => {
    const onInitMeeting = async (_meeting: string) => {
      log('received meeting:-', _meeting);
      if (!meeting) {
        return;
      }
      if (!client) {
        return;
      }
      client.self.on('roomLeft', async() => {
        setParticipant(undefined);

        if(idRecord && listParticipants[0]! === _username){
          await actionRecordHandle(idRecord, 'stop')
        }
        navigation.goBack();
      });
      // notifyServer({
      //   meeting,
      //   contact,
      //   caller: {username: localUsername, name: localFullName, icon: ''},
      // });
    };
    if (meeting) {
      onInitMeeting(meeting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting, client]);

  // useEffect(()=>{
  //  if(activeMeeting){
  //   client.self.disableAudio()
  //  }
  // },[activeMeeting])

  console.log('id record',idRecord);
  

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View className="bg-black" style={{flex: 1}}>
      <Text className="text-white text-xl bg-[#141414] p-4">
        Meeting with {name}
      </Text>
      {client && participant?.token && meeting ? (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{flex: 1}}>
          <DyteProvider value={client}>
            <DyteUIProvider>
              <DyteMeeting meeting={client} />
              {/* <DyteMicToggle meeting={client} /> */}
            </DyteUIProvider>
          </DyteProvider>
        </View>
      ) : (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <Text style={{color: 'white'}}>Loading...</Text>
        </View>
      )}
    </View>
  );
}
