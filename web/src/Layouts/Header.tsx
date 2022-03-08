import React from 'react';
import { Link } from 'gatsby';
import styled, { DefaultTheme } from 'styled-components';
import Select from '@paljs/ui/Select';
import { LayoutHeader } from '@paljs/ui/Layout';
import { EvaIcon, Icon } from '@paljs/ui/Icon';
import { Search } from '@paljs/ui/Search';
import { Actions } from '@paljs/ui/Actions';
import { InputGroup } from '@paljs/ui/Input';
import ContextMenu from '@paljs/ui/ContextMenu';
import User from '@paljs/ui/User';
import { getPathReady } from './Sidebar';
import { Location } from '@reach/router';
import { breakpointDown } from '@paljs/ui/breakpoints';
import { navigate } from 'gatsby';

const HeaderStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  .right > div {
    height: auto;
    display: flex;
    align-content: center;
  }
  .logo {
    font-size: 1.25rem;
    white-space: nowrap;
    text-decoration: none;
  }
  .left {
    display: flex;
    align-items: center;
    .github {
      font-size: 18px;
      margin-right: 5px;
    }
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const SelectStyled = styled(Select)`
  min-width: 150px;
`;

const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

interface HeaderProps {
  toggleSidebar: () => void;
  theme: {
    set: (value: DefaultTheme['name']) => void;
    value: DefaultTheme['name'];
  };
  changeDir: () => void;
  dir: 'rtl' | 'ltr';
}

const Header: React.FC<HeaderProps> = (props) => {
  const themeOptions = [
    {
      value: 'default',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#a6c1ff' }} />
          Default
        </Label>
      ),
    },
    {
      value: 'dark',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#192038' }} />
          Dark
        </Label>
      ),
    },
    {
      value: 'cosmic',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#5a37b8' }} />
          Cosmic
        </Label>
      ),
    },
    {
      value: 'corporate',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#3366ff' }} />
          Corporate
        </Label>
      ),
      selected: true,
    },
  ];

  const submitHandle = (e) => {
    if (window && window.location) {
      if (!e) {
        navigate(window.location.pathname, { replace: true })
      } else {
        navigate(`${window.location.pathname}?search=${e}`, { replace: true })
      }
    }
  }
  return (
    <LayoutHeader fixed>
      <HeaderStyle>
        <Actions
          size="Medium"
          actions={[
            {
              icon: { name: 'menu-2-outline' },
              url: {
                onClick: props.toggleSidebar,
              },
            },
            {
              content: (
                <Link to="/dashboard" className="logo">
                  QuickScan
                </Link>
              ),
            },
            {content: (
                  <SelectStyled
                    isSearchable={false}
                    shape="SemiRound"
                    placeholder="Themes"
                    value={themeOptions.find((item) => item.value === props.theme.value)}
                    options={themeOptions}
                    onChange={({ value }: { value: DefaultTheme['name'] }) => props.theme.set(value)}
                  />
                ),
              }
          ]}
        />
        <Actions
          size="Small"
          className="right"
          actions={[
            {
              content: (
                <Search submit={(v) => submitHandle(v)} type={'curtain'} placeholder="Search..." hint="Hit Enter to search" />
              ),
            },
          ]}
        />
      </HeaderStyle>
    </LayoutHeader>
  );
};
export default Header;
