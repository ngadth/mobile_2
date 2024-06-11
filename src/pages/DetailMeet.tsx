import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { JoinCallScreenProps } from '../types/navigation'
import { log } from '../utils'
import Icon from 'react-native-vector-icons/FontAwesome';
import AddUserMeeting from '../components/AddUserMeeting';
import { convertToDate, convertToTime } from '../utils';

const DetailMeet = ({route, navigation}: JoinCallScreenProps) => {


    console.log(route.params);
    

  return (
    <View className="h-full p-4 bg-[#CDE0EE]">
        <View className="bg-white rounded-lg">
            <Text className="text-center text-black font-bold text-2xl uppercase p-3">{route.params?.name}</Text>
            <View>
                <View className="flex flex-row items-center px-3 py-2">
                    <Text className="text-black font-bold text-xl uppercase ">Date</Text>
                    <Text className="ml-3">{convertToDate(route.params?.dateStart)}</Text>
                </View>
                <View className="flex flex-row items-center px-3 py-2">
                    <Text className="text-black font-bold text-xl uppercase">Time</Text>
                    <Text className="ml-3">{convertToTime(route.params?.dateTime)}</Text>
                </View>
            </View>
        </View>
        
        <View>
            <AddUserMeeting idMeeting={route.params?.idMeet} id={route.params?.id} status={route.params?.status}/>
        </View>
        <View>
            <Image
            style={{height: 200, width: '100%', marginTop: 100 }}
            source={require('../assets/image6.png')}
        />
        </View>
    </View>
  )
}

export default DetailMeet

const styles = StyleSheet.create({})