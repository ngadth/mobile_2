import {create} from 'zustand';
import axios from 'axios';
import {Meeting, ParticipantDetails} from '../types/general';
import {log} from '../utils';

interface State {
  _username: string;
  _fullName: string;
  _token: string;
  setUsername: (username: string) => void;
  setName: (name: string) => void;
  createMeeting: () => Promise<Meeting>;
  addParticipant: (
    meetId: string,
    username: string,
    fullName: string,
  ) => Promise<ParticipantDetails>;
  startRecordVideo : (meetId: string) => any;
  detailRecord : (idRecord: string) => any;
  actionRecord : (recording_id: string, action: string) => any;
}

interface IActionMeeting {
  action: 'pause' | 'stop' | 'resume'
}

const basic_token = 'd3f7ce10-90d0-4d25-b087-144635a35ff5:e4f863baf113cde1b459';

const Base64 = (str: string) => {
  const base64Chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';

  for (let i = 0; i < str.length; i += 3) {
    const chunk =
      (str.charCodeAt(i) << 16) |
      (str.charCodeAt(i + 1) << 8) |
      str.charCodeAt(i + 2);
    result +=
      base64Chars.charAt((chunk >> 18) & 63) +
      base64Chars.charAt((chunk >> 12) & 63) +
      base64Chars.charAt((chunk >> 6) & 63) +
      base64Chars.charAt(chunk & 63);
  }

  // Pad the result if necessary
  const padding = str.length % 3;
  if (padding === 1) {
    result = result.slice(0, -2) + '==';
  } else if (padding === 2) {
    result = result.slice(0, -1) + '=';
  }

  return result;
};

const encodeBase64 = () => {
  const orgId = '4b54205f-a32d-4e1b-b4c5-cd6e1780a364';
  const apiKey = '3c2b56c6f9e6caecf5c1';

  if (!orgId || !apiKey) {
    console.error('Environment variables ORG_ID and API_KEY are required');
    return null;
  }

  const combined = `${orgId}:${apiKey}`;

  return 'Basic ' + Base64(combined);
};

export const useGlobalStore = create<State>(set => ({
  _username: '',
  _fullName: '',
  _token: basic_token,
  setUsername: username => set(() => ({_username: username})),
  setName: name => set(() => ({_fullName: name})),
  createMeeting: _createMeeting,
  startRecordVideo: _startRecordView,
  actionRecord: _actionRecord,
  detailRecord: _detailRecord,
  addParticipant: _addParticipant,
}));

function _createMeeting() {
  return new Promise<Meeting>((resolve, reject) => {
    axios
      .post(
        'https://api.dyte.io/v2/meetings',
        {
          title: 'Meeting-' + Math.random().toString(8),
          record_on_start: true
        },
        {
          headers: {
            Authorization: encodeBase64(),
          },
        },
      )
      .then(({data}) => {
        if (data.success) {
          resolve(data.data);
        }

        reject('failed');
      })
      .catch(err => {
        log('cannot create meeting', err);
        reject('failed');
      });
  });
}

function _addParticipant(meetId: string, username: string, fullName: string) {
  return new Promise<ParticipantDetails>((resolve, reject) => {
    axios
      .post(
        `https://api.dyte.io/v2/meetings/${meetId}/participants`,
        {
          name: fullName,
          preset_name: 'group_call_host',
          custom_participant_id: username,
        },
        {
          headers: {
            Authorization: encodeBase64(),
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({data}) => {
        if (data.success) {
          resolve(data.data);
        }
        reject('failed');
      })
      .catch(_ => {
        reject('failed');
      });
  });
}

function _startRecordView(meetId: string){
  return new Promise<any>((resolve, reject) => {
    axios
      .post(
        `https://api.dyte.io/v2/recordings`,
        {
          meeting_id:meetId
        },
        {
          headers: {
            Authorization: encodeBase64(),
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({data}) => {
        console.log(data);

        if(data.data){
          resolve(data.data);
        }
       
        // reject('failed');
      })
      .catch((error) => {
        console.log(error);
        
        reject('failed');
      });
  });
}

function _actionRecord(recording_id: string, action: string){

return new Promise<ParticipantDetails>((resolve, reject) => {
  axios
    .put(
      `https://api.dyte.io/v2/recordings/${recording_id}`,
      {
        action: action
      },
      {
        headers: {
          Authorization: encodeBase64(),
        },
      },
    )
    .then(({data}) => {
      if (data.success) {
        resolve(data.data);
      }
      reject('failed');
    })
    .catch(_ => {
      reject('failed');
    });
});
}

function _detailRecord(recording_id: string){

  return new Promise<ParticipantDetails>((resolve, reject) => {
    axios
      .get(
        `https://api.dyte.io/v2/recordings/${recording_id}`,
        {
          headers: {
            Authorization: encodeBase64(),
          },
        },
      )
      .then(({data}) => {
        if (data.success) {
          resolve(data.data);
        }
        reject('failed');
      })
      .catch(_ => {
        reject('failed');
      });
  });
  }