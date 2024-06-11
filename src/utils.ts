import {Linking} from 'react-native';

export const contacts = [
  {
    name: 'John Doe',
    username: 'johndoe',
    icon: 'https://i.pravatar.cc/300?img=1',
  },
  {
    name: 'Jane Smith',
    username: 'janesmith',
    icon: 'https://i.pravatar.cc/300?img=2',
  },
  {
    name: 'David Johnson',
    username: 'davidjohnson',
    icon: 'https://i.pravatar.cc/300?img=3',
  },
  {
    name: 'Emily Wilson',
    username: 'emilywilson',
    icon: 'https://i.pravatar.cc/300?img=4',
  },
  {
    name: 'Michael Brown',
    username: 'michaelbrown',
    icon: 'https://i.pravatar.cc/300?img=5',
  },
];

export const server_url = 'https://lovely-bats-love.loca.lt';

export function log(title: string, object: any) {
  console.log(title);
  console.log(JSON.stringify(object, null, 2));
}

export const reOpenApp = async () => {
  console.log('opening ringer://');
  return Linking.openURL('ringer://open');
};

export function convertToDate(dateStr: string) {
  // Construct the formatted date string

  // Create a Date object from the formatted date string
  const convertedDate = new Date(dateStr);

  return convertedDate.toDateString();
}

export function convertToTime(dateStr: string) {
  // Construct the formatted date string

  // Create a Date object from the formatted date string
  const convertedDate = new Date(dateStr);

  return convertedDate.toTimeString();
}

export const URL_FILE = 'https://lovely-bats-love.loca.lt'