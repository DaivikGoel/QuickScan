import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState } from 'react';
import { Link } from 'gatsby';
import { emailValidator } from '../../utils/emailValidator'
import { passwordValidator } from '../../utils/passwordValidator'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../utils/firebase'

import Auth, { Group } from '../../components/Auth';
import Socials from '../../components/Auth/Socials';
import SEO from '../../components/SEO';

export default function Login() {
  const [checked, setChecked] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const onCheckbox = (v) => {
    setChecked(v)
  };
  const loginValidator = async () => {
    try {
      let userCredential = await signInWithEmailAndPassword(auth, email, password);
      
    } catch {
      console.log("Incorrect email or password.")
      return null
    }
  }
  
  return (
    <Auth title="Login" subTitle="Hello! Login with your email">
      <SEO title="Login" />
      <form>
        <InputGroup fullWidth>
          <input onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address" />
        </InputGroup>
        <InputGroup fullWidth>
          <input onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        </InputGroup>
        <Group>
          <Checkbox checked={checked} onChange={onCheckbox}>Remember me</Checkbox>
          <Link to="/auth/request-password">Forgot Password?</Link>
        </Group>
        <Button onClick={() => loginValidator()} status="Success" type="button" shape="SemiRound" fullWidth>
          Login
        </Button>
      </form>
      {/* <Socials /> */}
      <p>
        Don&apos;t have account? <Link to="/auth/register">Register</Link>
      </p>
    </Auth>
  );
}
