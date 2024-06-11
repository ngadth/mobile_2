import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { JoinCallScreenProps } from '../types/navigation';

const Home = ({route, navigation}: JoinCallScreenProps) => {
  return (
    <View className="h-screen p-4 bg-[#CDE0EE]">
      <View className="flex flex-row justify-between ">
        <Text className="font-medium text-2xl text-black">Meet Up</Text>
      <TouchableOpacity onPress={() => navigation.push('profile')}>
        <Avatar.Text size={50} label="K" className="shadow-sm" />
      </TouchableOpacity>
      </View>

      <View className="mt-[150px] border-2 border-[#fff] rounded-[30px] p-4">
        <View className="flex flex-row items-center justify-around">
          <TouchableOpacity onPress={()=> navigation.push('start-meeting')} className="bg-[#F67110] w-[150px] h-[150px] flex flex-col items-center justify-center shadow-md rounded-[30px]">
            <Icon name="user-plus" size={50} color="#fff" />
            <Text className="text-xl text-white">New Meeting</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.push('join-meeting')} className="bg-[#1019F6] w-[150px] h-[150px] flex flex-col items-center justify-center shadow-md rounded-[30px]">
            <Icon name="mouse-pointer" size={50} color="#fff" />
            <Text className="text-xl text-white">Join Meeting</Text>
          </TouchableOpacity>

        </View>
        <View className="flex flex-row items-center justify-around mt-[30px]">
          <TouchableOpacity onPress={()=> navigation.push('list-meeting')} className="bg-[#1019F6] w-[150px] h-[150px] flex flex-col items-center justify-center shadow-md rounded-[30px]">
            <Icon name="calendar" size={50} color="#fff" />
            <Text className="text-xl text-white">Schedule</Text>
          </TouchableOpacity>
            <TouchableOpacity className="bg-[#F67110] w-[150px] h-[150px] flex flex-col items-center justify-center shadow-md rounded-[30px]" onPress={()=> navigation.push('history-meeting')}>
            <Icon name="history" size={50} color="#fff" />
            <Text className="text-xl text-white">History Meeting</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Home;
