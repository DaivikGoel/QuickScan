import React, {useEffect} from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { isLoggedIn, auth, db } from '../helpers/firebase'

const test = auth.currentUser
console.log(test)

export default function UploadScreen({ navigation }) {
  useEffect(() => {
    if (!isLoggedIn()) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'StartScreen' }],
      })
    }
  });

  return (
    <Background>
      <Logo />
      <Header>Upload Video</Header>
      <Paragraph>
        Logged in.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        gay
      </Button>
    </Background>
  )
}
