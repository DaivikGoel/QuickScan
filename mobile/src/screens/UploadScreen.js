import React, {useEffect,useState } from 'react'
import { StyleSheet, Text, Modal, View, Alert } from 'react-native';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import { isLoggedIn, auth, db } from '../helpers/firebase'
import Amplify, { Storage } from 'aws-amplify';
import awsmobile from '../aws-exports'
import TextInput from '../components/TextInput'
import uuid from 'react-native-uuid';
import * as Progress from 'react-native-progress';

Amplify.configure(awsmobile);

export default function UploadScreen({ navigation, route }) {
  useEffect(() => {
    if (!isLoggedIn()) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'StartScreen' }],
      })
    }
  });

  const [name, setName] = useState({ value: '', error: '' })
  const [description, setDescription] = useState({ value: '', error: '' })
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const progressCallback = (progress) => {
    const progressInPercentage = 
      (progress.loaded / progress.total) 
    ;
    setProgress(progressInPercentage);
  };

  const uploadS3 = async () => {
    setShowModal(true);
    setProgress(0)
    const response = await fetch(route.params.path)
    const blob = await response.blob();
    const fileId = uuid.v4() + '.mov'
    const userId = auth.currentUser.uid

    await Storage.put(fileId, blob, {
      contentType: 'mov',
      progressCallback
    });

    console.log(userId)
    console.log(fileId)
    console.log(name.value)
    console.log(description.value)

    fetch('http://ec2-3-98-130-154.ca-central-1.compute.amazonaws.com:3000/collection', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        uuid: fileId,
        name: name,
        description: description,
      })
    });

    setShowModal(false);
    Alert.alert('Upload Finished 🎉')
  }

  return (
    <>
      <Background>
        <Logo />
        <Header>Upload Video</Header>
        <TextInput
          label="Title"
          returnKeyType="next"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
        />
          <TextInput
          label="Description"
          returnKeyType="next"
          value={description.value}
          onChangeText={(text) => setDescription({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
        />
        <Button
          mode="outlined"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'CameraScreen' }],
            })
          }
        >
          Take a new video
        </Button>
        <Button mode="contained" onPress={uploadS3}>
          Upload
        </Button>
      </Background>
      <Modal
        visible={showModal}
        transparent={true}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.welcome}>Upload Progress</Text>
            <Progress.Bar
              style={styles.progress}
              progress={progress}
              indeterminate={false}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  circles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});
