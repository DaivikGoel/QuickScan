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
import axios from 'axios';
import { navigate } from 'gatsby';
import { requestUrl } from '../../utils/requestUrl';

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const submit = async () => {
    try {
      if (emailValidator(email) && passwordValidator(password)) {
        const { data } = await axios.post(`${requestUrl}/createuser`, {
          email,
          password
        })
        navigate(`/dashboard?id=${data.uid}`)
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
        {/* <Checkbox onChange={onCheckbox}>
          Agree to <Link to="/">Terms & Conditions</Link>
        </Checkbox> */}
        <Button onClick={submit} status="Success" type="button" shape="SemiRound" fullWidth>
          Register
        </Button>
      </form>
      {/* <Socials /> */}
      <p>
        Already have an account? <Link to="/auth/login">Log In</Link>
      </p>
    </Auth>
  );
}
