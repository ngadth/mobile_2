import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput, Avatar, Checkbox} from 'react-native-paper';
import useDebounce from '../hook/useDebounce';
import {firebase} from '@react-native-firebase/database';
import {log} from '../utils';
import { useGlobalStore } from '../store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSnackBar } from '../store/snack-bar';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { URL_FILE } from '../utils';
import RNFetchBlob from 'rn-fetch-blob';

type IUser = {
  id: string;
  name: string;
  email: string;
  checked: boolean;
};

const AddUserMeeting = ({idMeeting , id, status}:{idMeeting: string, id: string, status: string}) => {
  const [listUser, setListUser] = useState<IUser[]>([]);
  const [textUser, setTextUser] = useState<string>('');
  const [listItemActive, setListItemActive] = useState<IUser[]>([]);
  const _username = useGlobalStore(store => store._username);
  const [listParticipants, setParticipants] = useState<number>(0)
  const [participants, setItemParticipants] = useState();
  const {toggleSnackBar} = useSnackBar();
  const [loadingTextTranscripts, setLoadingTextTranscripts] = useState<boolean>(false)
  const [textTranscript, setTextTranscript] = useState<string>('');

  const handleFetchingUser = (value: string) => {
    setTextUser(value);
    fetchUserByEmail(value);
  };

  useEffect(()=>{
    fetchDataItem();
  },[])

  const fetchUserByEmail = async (email: string) => {
    console.log(email);

    const userRef = firebase.database().ref('Users');
    const snapshot = await userRef
      .orderByChild('email')
      .startAt(`%${email}%`)
      .endAt(email + '\uf8ff')
      .once('value');

    if (!snapshot.val()) {
      setListUser([]);
      return;
    }

    // Handle the result, for example:
    const users = Object.entries(snapshot.val()).map(([key, value]) => {
        if (_username !== value?.email) {
            return {
                id: key,
                ...(value as any),
                checked: false,
            };
        }
        return null; // Return null for cases where the condition is not met
    }).filter(user => user !== null); // Filter out any null values
    
    // setListUser(mergeListObject(users));
    setListUser(users);
    
  };

  const handleCheckedItem = (id: string) => {
    if (!listUser) {
        return;
    }

    const filteredList = listUser.map(user =>
        user.id === id ? { ...user, checked: !user.checked } : user
    );
      
    setListUser(filteredList);
    setListItemActive(filteredList);
};

const fetchDataItem = () =>{
  const meetRef = firebase.database().ref('Meets/' + id);
  meetRef.once('value', (data) => {
    console.log('data',data);
    
    setParticipants(data.val().participants?.length || 0)
    setItemParticipants(data.val().participants); 
  })
}

const updateUser = (listUserAdd: IUser[]) => {
  const meetRef = firebase.database().ref('Meets/' + id);
  meetRef.once('value', (data) => {
    // do some stuff once
    const listUser = data.val();
    
    const updatedParticipants = [_username, ...listUserAdd.map(item => item.email)]

    const newData = {
      ...listUser,
      participants: updatedParticipants
    };

    meetRef.update(newData)
      .then(() => {
        toggleSnackBar(true, "Add List Success")
        console.log('Data updated successfully');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  });
};


const handleAddParticipant = () =>{
  Keyboard.dismiss();

  const listUserAdd = listUser.filter((item) => item.checked);
  if(!idMeeting){
    return toggleSnackBar(true, "Id meet does not exist")
  }
  if(listUserAdd.length > 0){
    updateUser(listUserAdd);
  }else{
    toggleSnackBar(true, "List Participants does not exist")
  }
}

const getValueTranscript = async(idRecord: string) =>{
  setLoadingTextTranscripts(true);
  const response: any = await axios.get(`${URL_FILE}/translate?id=${idRecord}`);
  if(response && response.data){
    console.log(response.data.data);
    setTextTranscript(response.data.data);
    setLoadingTextTranscripts(false);
  }else{
    setTextTranscript('');
    //text undefined
    setLoadingTextTranscripts(false);
    
  }
}

const getLinkDownLoad = (type: string) =>{
  const meetRef = firebase.database().ref('Meets/' + id);
  meetRef.once('value', (data) => {
    const value = data.val();
    
    if(type === 'file'){
      getValueTranscript(value?.idRecord)
    }else{
      downloadVideo(value?.idRecord)
    }
  })
}

const downloadVideo = async (id: string) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Download file Permission',
        message:
          'Your permission is required to save Files to your device ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      const {config, fs} = RNFetchBlob;
      const date = new Date();
      const fileDir = fs.dirs.DownloadDir;
      RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads:{
          useDownloadManager: true,
          notification: true,
          path: fileDir + "/download_" + Math.floor(date.getDate()+ date.getSeconds() /2) + '.mp4',
          description: 'Download Files'
        }
      }).fetch('GET',`${URL_FILE}/download-video-transcript?id=${id}`,{

      }).then(res=>{
        console.log('file to save', res.path());
      })

      console.log('You can use the storage');
    } else {
      console.log('storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
  
};


// try {
//   const downloadPath = RNFS.DocumentDirectoryPath + '/video-transcript.mp4';

//   const downloadFileOptions = {
//     fromUrl: `${URL_FILE}/download-video-transcript?id=${id}`,
//     toFile: downloadPath,
//     background: true,
//     discretionary: true
//   };

//   const downloadResult = await RNFS.downloadFile(downloadFileOptions).promise;

//   console.log('Download success. File saved at:', downloadPath);
//   console.log('Download result:', downloadResult);
// } catch (error) {
//   console.log('Download error:', error);
// }

  console.log(_username);
  console.log(participants);

  return (
    <>
    <View className={listUser.length > 0 &&  'h-[250px]'}>
      <View className="flex flex-row items-center">
        <Icon name="user-plus" size={20} color="#000" />
        <Text className="text-black font-bold text-lg my-3 ml-3 uppercase">List Member</Text>
        <Text className="text-[#583CBC] font-bold text-lg ml-3 underline">{listParticipants}</Text>
        </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex flex-row items-center gap-2">
        <TextInput
          label="Search name ..."
          className="flex-1"
          disabled={status === 'STOP' && true}
          onChangeText={value => handleFetchingUser(value)}
          value={textUser}
          left={
            <TextInput.Icon
              size={50}
              icon={require('../assets/icon-user.png')}
            />
          }
        />

        {
          participants && participants[0] === _username && (
            <TouchableOpacity className="bg-sky-600 p-4 rounded-md" onPress={handleAddParticipant}>
              <Text className="font-medium text-white">Add</Text>
            </TouchableOpacity>
          )
        }

        </View>
      </TouchableWithoutFeedback>
      {listUser.length > 0 ? (
        <View className="bg-white rounded-lg shadow-2xl mt-4 h-[200px]">
          <FlatList
            data={listUser}
            renderItem={({item, index}) => (
              <View className="flex flex-row justify-between items-center border-b m-4 pb-2">
                <View className="flex flex-row items-center">
                  <Avatar.Text size={50} label="K" className="shadow-sm" />
                  <View className="ml-3">
                    <Text className="font-bold text-xl text-[#182C40]">
                      {item.email}
                    </Text>
                    <Text>{item.name}</Text>
                  </View>
                </View>
                <Checkbox.Item
                  label=""
                  status={item.checked ? 'checked' : 'unchecked'}
                  onPress={e => handleCheckedItem(item.id)}
                />
              </View>
            )}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
    <View className="mt-3">
    <TouchableOpacity className="bg-sky-800 p-2 rounded-md" onPress={() => getLinkDownLoad('file')}>
          <Text className="font-medium text-white text-lg text-center">Show Scripts Record</Text>
    </TouchableOpacity>
    </View>
    <View className="mt-3">
    <TouchableOpacity className="bg-sky-800 p-2 rounded-md" onPress={()=> getLinkDownLoad('video')}>
          <Text className="font-medium text-white text-lg text-center">Download Video Records</Text>
        </TouchableOpacity>
    </View>
    {
      !loadingTextTranscripts ? (
        <>
          {
            textTranscript.length > 0 && (
              <ScrollView style={{
                minHeight: 200,
                backgroundColor: '#fff',
                marginTop: 10,
                padding: 10,
                borderRadius: 5
              }}>
              <Text>{textTranscript}</Text>
             </ScrollView>
            ) 
            //  (
            //   <View style={{
            //     display: 'flex',
            //     flexDirection: 'row',
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //   }}>
            //     <Text className="text-black mt-5 text-lg font-bold">Not found scripts :((</Text>
            //   </View>
            // )
          }
        </>
      ) : (
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )
    }
    </>
  );
};

export default AddUserMeeting;

const styles = StyleSheet.create({});
