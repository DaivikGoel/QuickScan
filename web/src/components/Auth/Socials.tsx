import styled from 'styled-components';
import React from 'react';
import { EvaIcon } from '@paljs/ui/Icon';

const SocialsStyle = styled.section`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  .links {
    font-size: 2.5rem;
    a {
      margin: 0 1rem;
    }
  }
`;

export default function Socials(props) {
  const { googleLogin } = props
  return (
    <SocialsStyle>
      <p>or enter with:</p>
      <div onClick={googleLogin} className="links">
        <EvaIcon name="google" />
      </div>
    </SocialsStyle>
  );
}
