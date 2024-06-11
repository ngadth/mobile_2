import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ListMeeting from '../pages/ListMeeting';
import MeetingMe from '../pages/MeetingMe';

const TopTabs = createMaterialTopTabNavigator();

export default function TopTabsGroup() {
  return (
    <TopTabs.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: "capitalize",
          fontWeight: "bold",
        },
        tabBarIndicatorStyle: {
          height: 5,
          borderRadius: 5,
          backgroundColor: "#1DA1F2",
        },
      }}
    >
      <TopTabs.Screen name="Meeting List" component={ListMeeting} />
      <TopTabs.Screen name="Meeting Me" component={MeetingMe} />
    </TopTabs.Navigator>
  );
}