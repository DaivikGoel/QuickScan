import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Row from '@paljs/ui/Row';
import Select from '@paljs/ui/Select';
import Col from '@paljs/ui/Col';
import styled from 'styled-components';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import axios from 'axios';
import { navigate } from 'gatsby';

const Home = () => {
  interface CardPropsType {
    title: string,
    description: string,
    thumbnail: string,
  }

  const defaultCardProps: CardPropsType[] = [
    {
      title: 'Card 1',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      title: 'Card 2',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      title: 'Card 3',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      title: 'Card 4',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      title: 'Card 5',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
  ];

  const requestUrl = 'http://ec2-3-98-130-154.ca-central-1.compute.amazonaws.com:3000/collection'
  const [cardProps, setCardProps] = useState<CardPropsType[]>(defaultCardProps);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(requestUrl)
        if (response) {
          const objects = response.data.data
          const cardProps = objects.map((obj: any) => ({title: obj["name"], description: obj["description"], thumbnail: obj["thumbnail"]}))
          setCardProps(cardProps)
        }
      } catch (error) {
        console.log(error)
      }
    })();
  }, [])

  const FilterStyle = styled.div`
    margin: 1rem;
  `;

  const Text = styled.div`
    font-size: 16px;
    margin-bottom: 1rem;
  `;

  const tags = [
    { value: '3d', label: '3D' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'nature', label: 'Nature' },
    { value: 'weather', label: 'Weather' },
  ];

  const sort = [
    { value: 'mostPopular', label: 'Most Popular' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  const NUM_OF_COL = 4;

  const cardLayout = [];
  for (let i = 0; i < cardProps.length; i = i + NUM_OF_COL) {
    const cardPropsRow: CardPropsType[] = [];
    for (let k = 0; k < NUM_OF_COL; k++) {
      if (i + k < cardProps.length) {
        cardPropsRow.push(cardProps[i + k]);
      }
    }
    cardLayout.push(
      <Row>
        {cardPropsRow.map((cardProp) => (
          // Need to change the breakpoint when changing the num of cards per col
          <Col breakPoint={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <div onClick={() => navigate("/view", {
              state: {
                cardProp,
              }
            })} >
              <Card accent="Info">
                <CardBody>
                  <img src={cardProp.thumbnail} />
                </CardBody>
                <CardFooter>
                    {cardProp.title}
                </CardFooter>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    );
  }
  return (
    <>
      <SEO title="Home" />
      <Row>
        <Col breakPoint={{ xs: 12, sm: 8, md: 8, lg: 9 }}>
          <Card>
            <FilterStyle>
              <Text>Tags</Text>
              <Select options={tags} isMulti multiple placeholder="Select Tags" />
            </FilterStyle>
          </Card>
        </Col>
        <Col breakPoint={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
          <Card>
            <FilterStyle>
              <Text>Sort by</Text>
              <Select options={sort} placeholder="Any" />
            </FilterStyle>
          </Card>
        </Col>
      </Row>
      {cardLayout}
    </>
  );
};
export default Home;
