import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import Auth from '../../components/Auth';
import SEO from '../../components/SEO';
import { emailValidator } from '../../utils/emailValidator'
import { passwordValidator } from '../../utils/passwordValidator'
import { navigate } from 'gatsby';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import useFirebase from '../../utils/useFirebase';

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const firebase = useFirebase();

  const submit = async () => {
    try {
      if (password === confirmPassword && !emailValidator(email) && !passwordValidator(password) && firebase) {
        await createUserWithEmailAndPassword(firebase, email, password);
        navigate('/dashboard')
      } else {
        return null
      }
    } catch {
      console.log("Couldn't create a new user.")
      return null
    }
  }
  return (
    <Auth title="Create new account">
      <SEO title="Register" />
      <form>
        <Input fullWidth>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address" />
        </Input>
        <Input fullWidth>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        </Input>
        <Input fullWidth>
          <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" />
        </Input>
        <Button onClick={submit} status="Success" type="button" shape="SemiRound" fullWidth>
          Register
        </Button>
      </form>
      <p>
        Already have an account? <Link to="/auth/login">Log In</Link>
      </p>
    </Auth>
  );
}
