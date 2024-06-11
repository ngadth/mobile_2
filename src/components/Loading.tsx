import React from 'react';
import { View, Image, StyleSheet,ActivityIndicator  } from 'react-native';

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator style={styles.image} size="large" color={'#294DFF'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#31353b91', // Set background color if necessary
  },
  image: {
    // You can adjust the image style as needed
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Adjust the image resizing mode as needed
  },
});

export default Loading;
