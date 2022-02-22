import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { DeviceMotion } from 'expo-sensors';
import RecordButton from '../components/RecordButton';

const CameraScreen = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [fileLocation, setFileLocation] = useState(null);
  const [motionSubscription, setMotionSubscription] = useState(null);
  const [motionData, setMotionData] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const startRecording = async () => {
    if (camera) {
      setIsRecording(true);
      trackMotion();
      const data = await camera.recordAsync({
        maxDuration: 30,
        mute: true,
      });
      setFileLocation(data.uri);
    }
  }

  const stopRecording = async () => {
    camera.stopRecording();
    setIsRecording(false);
    stopTrackingMotion();
  }

  const trackMotion = () => {
    setMotionSubscription(
      DeviceMotion.addListener(data => {
        setMotionData(data);
      })
    );
  }

  const stopTrackingMotion = () => {
    if (motionSubscription && motionSubscription.remove()) {
      setMotionSubscription(null);
    }
  }

  return (
    <View style={styles.container}>
      <Camera ref={ref => setCamera(ref)} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          <RecordButton style={styles.recordButton} isRecording={isRecording} onPress={isRecording ? stopRecording : startRecording} />
          <RecordButton style={styles.recordButton} isRecording={isRecording} onPress={isRecording ? stopRecording : startRecording} />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default CameraScreen;
