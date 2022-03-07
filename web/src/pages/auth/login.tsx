import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState, useRef } from 'react';
import { Link } from 'gatsby';
import { emailValidator } from '../../utils/emailValidator'
import { passwordValidator } from '../../utils/passwordValidator'
// import { auth, provider, signInWithEmailAndPassword, signInWithRedirect } from '../../utils/firebase'
import { navigate } from 'gatsby';
import Auth, { Group } from '../../components/Auth';
import Socials from '../../components/Auth/Socials';
import SEO from '../../components/SEO';

export default function Login() {
  const [checked, setChecked] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [badLogin, setBadLogin] = useState(false)
  const onCheckbox = (v) => {
    setChecked(v)
  };
  const submit = async () => {
    try {
      if (!emailValidator(email) && !passwordValidator(password)) {
        // let userCredential = await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard", {
          state: {
            justSignedIn: true
          }
        })
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
      // const result = await signInWithRedirect(auth, provider);
      navigate("/dashboard", {
        state: {
          justSignedIn: true
        }
      })
    } catch {
      console.log("Google Login failed.")
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
