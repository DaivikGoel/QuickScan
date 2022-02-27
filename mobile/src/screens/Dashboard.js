import React, {useEffect} from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { isLoggedIn } from '../helpers/firebase'

export default function Dashboard({ navigation }) {
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
      <Header>Welcome</Header>
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
        Logout
      </Button>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'CameraScreen' }],
          })
        }
      >
        Upload Video
      </Button>
    </Background>
  )
}
