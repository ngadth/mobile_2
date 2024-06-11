import {JoinCallScreenProps} from '../../types/navigation';
import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useGlobalStore} from '../../store';
import {Meeting, ParticipantDetails} from '../../types/general';
import {log} from '../../utils';
import {notifyServer} from '../../api';
import {DyteProvider, useDyteClient} from '@dytesdk/react-native-core';
import {DyteMeeting, DyteUIProvider, DyteMicToggle,} from '@dytesdk/react-native-ui-kit';

// import {
//   DyteParticipantsAudio,
//   DyteNotifications,
//   DyteGrid,
//   DyteMicToggle,
//   DyteCameraToggle,
//   DyteSettingsToggle,
//   DyteHeader,
// } from '@dytesdk/react-ui-kit'

export default function JoinCall({route, navigation}: JoinCallScreenProps) {
  const {contact, activeMeeting, caller} = route.params;
  const createMeeting = useGlobalStore(s => s.createMeeting);
  const addParticipant = useGlobalStore(s => s.addParticipant);
  const localUsername = useGlobalStore(s => s._username);
  const localFullName = useGlobalStore(s => s._fullName);
  const [meeting, setMeeting] = useState<Meeting>();
  const [participant, setParticipant] = useState<ParticipantDetails>();
  const [client, initClient] = useDyteClient();
  useEffect(() => {
    if (activeMeeting?.id) {
      log('active meeting info:-', activeMeeting);
      setMeeting(activeMeeting);
      return;
    }
    createMeeting().then(meetInfo => {
      log('meeting info:-', meetInfo);
      setMeeting(meetInfo);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMeeting]);

  useEffect(() => {
    if (!meeting?.id) {
      return;
    }
    addParticipant(meeting.id, localUsername, localFullName).then(
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
  }, [meeting, localUsername, localFullName, contact, navigation]);

  useEffect(() => {
    const onInitMeeting = async (_meeting: Meeting) => {
      log('received meeting:-', _meeting);
      if (!meeting?.id) {
        return;
      }
      if (!client) {
        return;
      }
      client.self.on('roomLeft', () => {
        setParticipant(undefined);
        navigation.goBack();
      });
      notifyServer({
        meeting,
        contact,
        caller: {username: localUsername, name: localFullName, icon: ''},
      });
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

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View className="bg-black" style={{flex: 1}}>
      <Text className="text-white text-xl bg-[#141414] p-4">
        Meeting with {activeMeeting?.id ? caller?.name : contact.name}
      </Text>
      {client && participant?.token && meeting?.title ? (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{flex: 1}}>
          <DyteProvider value={client}>
            <DyteUIProvider>
              <DyteMeeting meeting={client} />
              <DyteMicToggle meeting={client} />
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
