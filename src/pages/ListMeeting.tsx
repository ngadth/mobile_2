import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useState, useEffect} from 'react';
import React from 'react';
import {firebase} from '@react-native-firebase/database';
import {useGlobalStore} from '../store';
import {MenuView} from '@react-native-menu/menu';
import { convertToDate, convertToTime } from '../utils';

type IMeeting = {
  id?: string | null;
  name: string;
  passRoom: string;
  isPublic: boolean;
  dateStart: any;
  dateTime: any;
  participants: [string];
};

const Item = (props: IMeeting & {item: IMeeting}) => {
  return (
    <View className="bg-[#ffffff8c] p-4 rounded-md shadow-2xl flex flex-row justify-between items-center my-2">
      <View>
        <Text className="font-bold text-2xl text-[#182C40] leading-none">
          {props.item.name}
        </Text>
        <Text className="text-[#182C40] font-light text-lg leading-none">
          {props.item.participants[0]}
        </Text>
        <Text className="text-[#182C40] font-light text-lg leading-none w-[250px]">
          {convertToDate(props.item.dateStart)} - {convertToTime(props.item.dateTime)}
        </Text>
      </View>
      <View className="flex flex-row items-center">
        <TouchableOpacity className="bg-[#583CBC] py-2 px-4 rounded-md">
          <Text className="text-white">Start</Text>
        </TouchableOpacity>
        <MenuView
          title="Menu Title"
          onPressAction={({nativeEvent}) => {
            console.warn(JSON.stringify(nativeEvent));
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
          <Image
                source={require('../assets/bar.png')}
            />
        </MenuView>
      </View>
    </View>
  );
};

const ListMeeting = () => {
  const [listMeeting, setListMeeting] = useState<IMeeting[]>([]);

  const _username = useGlobalStore(store => store._username);

  useEffect(() => {
    new Promise(async () => {
      await fetchListMeeting();
    });
  }, []);

  const fetchListMeeting = async () => {
    try {
      const meetRef = firebase.database().ref('Meets');
      const snapshot = await meetRef.once('value');
      const mappedData = snapshot.val()
        ? Object.entries(snapshot.val()).map(([key, value]) => {
            if (value?.participants && value?.participants.includes(_username)) {
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
    <View className="h-screen p-4 bg-[#CDE0EE]">
      <Image
        style={{position: 'absolute', top: 0, right: 0}}
        source={require('../assets/outline.png')}
      />

      <View className="h-[600px]">
        {listMeeting.length > 0 && (
          <FlatList data={listMeeting} renderItem={renderItem} />
        )}
      </View>
    </View>
  );
};

export default ListMeeting;
