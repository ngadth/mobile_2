import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useState, useEffect} from 'react';
import React from 'react';
import {firebase} from '@react-native-firebase/database';
import {useGlobalStore} from '../store';
import {MenuView} from '@react-native-menu/menu';
import {convertToDate, convertToTime, log} from '../utils';
import {useSnackBar} from '../store/snack-bar';
import {IMeeting} from '../types/general';
import { useNavigation } from '@react-navigation/native';

const Item = (props: IMeeting & {item: IMeeting}) => {
  const {toggleSnackBar} = useSnackBar();

  const navigation = useNavigation();
  const detailRecord = useGlobalStore(s => s.detailRecord);

  // useEffect(()=>{
  //   new Promise(async()=>{
  //     const res = await detailRecord('ffff462d-dae8-42a0-b033-146c2a6f0acd');
  //   if(res){
  //     console.log(res);
      
  //   }
  //   })
  // },[])


  const deleteMeeting = (id: string) => {
    const meetRef = firebase.database().ref('Meets/' + id);
    meetRef.remove().then(() => {
      toggleSnackBar(true, 'Delete success');
    });
  };

  const handleStartCall = () =>{
    const params : any = {
      idMeet: props.item.idMeeting,
      name: props.item.name,
      idUser: props.item.id
    }
    navigation.navigate('call',{ ...params})
  }


  return (
    <View className="bg-[#ffffff8c] p-4 rounded-md shadow-2xl flex flex-row justify-between items-center my-2">
      <TouchableOpacity onPress={() => navigation.navigate('Detail meetings', {idMeet: props.item.idMeeting!, id: props.item.id!, name: props.item.name, dateStart: props.item.dateStart, dateTime: props.item.dateTime, status: props.item.status})}>
        <Text className="font-bold text-2xl text-[#182C40] leading-none">
          {props.item.name}
        </Text>
        <Text className="text-[#182C40] font-light text-lg leading-none">
          {props.item.participants[0]}
        </Text>
        <Text className="text-[#182C40] font-light text-lg leading-none w-[250px]">
          {convertToDate(props.item.dateStart)} -{' '}
          {convertToTime(props.item.dateTime)}
        </Text>
      </TouchableOpacity>
      <View className="flex flex-row items-center">
        {
          props.item.status === 'ACTIVE' ? (
            <TouchableOpacity className="bg-[#583CBC] py-2 px-4 rounded-md" onPress={() => handleStartCall()}>
          <Text className="text-white">Start</Text>
        </TouchableOpacity>
          ) : (
            <TouchableOpacity className="bg-red-500 py-2 px-4 rounded-md">
          <Text className="text-white">STOP</Text>
        </TouchableOpacity>
          )
        }
        <MenuView
          title="Menu Title"
          onPressAction={({nativeEvent}) => {
            console.warn(JSON.stringify(nativeEvent));
            if (nativeEvent.event === 'destructive') {
              console.warn(props.item.id);
              deleteMeeting(props.item.id!);
            }

            if (nativeEvent.event === 'share') {
            }
          }}
          actions={[
            {
              id: 'share',
              title: 'Share Action',
              titleColor: '#182C40',
              subtitle: 'Share action on SNS',
              image: Platform.select({
                ios: 'square.and.arrow.up',
                android: 'ic_menu_share',
              }),
              imageColor: '#182C40',
              state: 'on',
            },
            {
              id: 'destructive',
              title: 'Delete',
              attributes: {
                destructive: true,
              },
              image: Platform.select({
                ios: 'trash',
                android: 'ic_menu_delete',
              }),
            },
          ]}
          shouldOpenOnLongPress={false}>
          <Image source={require('../assets/bar.png')} />
        </MenuView>
      </View>
    </View>
  );
};

const MeetingMe = () => {
  const [listMeeting, setListMeeting] = useState<IMeeting[]>([]);

  const _username = useGlobalStore(store => store._username);
  const {isShow} = useSnackBar();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    new Promise(async () => {
      await fetchListMeeting();
    });
  }, [isShow]);

  useEffect(() => {
    if (refreshing) {
      new Promise(async () => {
        await fetchListMeeting();
      });
    }
  }, [refreshing]);

  const fetchListMeeting = async () => {
    try {
      const meetRef = firebase.database().ref('Meets');
      const snapshot = await meetRef.once('value');
      const mappedData = snapshot.val()
        ? Object.entries(snapshot.val()).map(([key, value]) => {
            if (value?.participants && value?.participants[0] === _username) {
              return {
                id: key,
                ...value,
              };
            }
            return null;
          })
        : [];

      // Filter out null values and log the mapped data
      const filteredData = mappedData.filter(item => item !== null);
      setListMeeting(filteredData as IMeeting[]);
    } catch (error) {
      console.error('Error fetching meeting data:', error);
    }
  };

  const renderItem = (props: IMeeting) => <Item {...props} />;

  return (
    <View className="h-full p-4 bg-[#CDE0EE]">
      <Image
        style={{position: 'absolute', top: 0, right: 0}}
        source={require('../assets/outline.png')}
      />
      <ScrollView
        // contentContainerStyle={{marginBottom: 500}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View>
          {listMeeting.length > 0 && (
            <FlatList
              data={listMeeting}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              // keyExtractor={(key) => key.id?.toString()}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MeetingMe;
