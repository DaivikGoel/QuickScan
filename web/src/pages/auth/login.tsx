import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState } from 'react';
import { Link } from 'gatsby';
import { emailValidator } from '../../utils/emailValidator'
import { passwordValidator } from '../../utils/passwordValidator'
import { navigate } from 'gatsby';
import Auth, { Group } from '../../components/Auth';
import Socials from '../../components/Auth/Socials';
import SEO from '../../components/SEO';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { useFirebase } from '../../utils/useFirebase';

export default function Login() {
  const [checked, setChecked] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [badLogin, setBadLogin] = useState(false)
  const firebase = useFirebase();
  const provider = new GoogleAuthProvider();
  const onCheckbox = (v) => {
    setChecked(v)
  };
  const submit = async () => {
    try {
      if (!emailValidator(email) && !passwordValidator(password) && firebase) {
        await setPersistence(firebase, browserSessionPersistence)
        await signInWithEmailAndPassword(firebase, email, password);
        navigate('/edit')
      } else {
        return null
      }
    } catch {
      console.log("Incorrect email or password.")
      return null
    }
  }

  const googleLogin = async () => {
    try {
      if (firebase) {
        await setPersistence(firebase, browserSessionPersistence)
        await signInWithPopup(firebase, provider);
        navigate('/edit')
      } else {
        return null
      }
    } catch(e) {
      console.log(e)
      return null
    }
  }
  
  return (
    <Auth title="Login" subTitle="Hello! Login with your email">
      <SEO title="Login" />
      <form>
        <InputGroup fullWidth>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address" />
        </InputGroup>
        <InputGroup fullWidth>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        </InputGroup>
        <Group>
          <Checkbox checked={checked} onChange={onCheckbox}>Remember me</Checkbox>
          <Link to="/auth/request-password">Forgot Password?</Link>
        </Group>
        <Button onClick={submit} status="Success" type="button" shape="SemiRound" fullWidth>
          Login
        </Button>
      </form>
      <Socials googleLogin={googleLogin} />
      <p>
        Don&apos;t have account? <Link to="/auth/register">Register</Link>
      </p>
    </Auth>
  );
}
