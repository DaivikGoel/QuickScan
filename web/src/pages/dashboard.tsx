import React, { useState, useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import Row from '@paljs/ui/Row';
import Select from '@paljs/ui/Select';
import Col from '@paljs/ui/Col';
import styled from 'styled-components';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import axios from 'axios';
import { navigate } from 'gatsby';
import { CardPropsType, TagType } from '../utils/types';
import { Toastr, ToastrRef } from '@paljs/ui/Toastr';
import { requestUrl } from '../utils/requestUrl';

const Home = (props) => {
  const defaultCardProps: CardPropsType[] = [
    {
      title: 'Card 1',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      three_dimen_object_blob_storage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
    },
    {
      title: 'Card 2',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      three_dimen_object_blob_storage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
    },
    {
      title: 'Card 3',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      three_dimen_object_blob_storage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
    },
    {
      title: 'Card 4',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      three_dimen_object_blob_storage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
    },
    {
      title: 'Card 5',
      description: 'Description',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      three_dimen_object_blob_storage: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
    },
  ];

  const collectionUrl = `${requestUrl}/collection`
  const tagUrl = `${requestUrl}/tags`
  const [cardProps, setCardProps] = useState<CardPropsType[]>(defaultCardProps);
  const [filteredCardProps, setFilteredCardProps] = useState<CardPropsType[]>(defaultCardProps);
  const [tags, setTags] = useState<TagType[]>([{value: 'hi', label: 'HI'}]);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const toastRef = useRef<ToastrRef>(null)

  useEffect(() => {
    (async () => {
      try {
        const tagResponse = await axios.get(tagUrl)
        if (tagResponse) {
          const data = tagResponse.data.data;
          setTags(data.map((t: string) => ({ value: t, label: t.toUpperCase() })))
        }
        const response = await axios.get(collectionUrl)
        if (response) {
          const objects = response.data.data
          const cardProps = objects.map((obj: any) => ({
            title: obj["name"],
            description: obj["description"],
            thumbnail: `https://quickscanthumbnails.s3.ca-central-1.amazonaws.com/${obj["thumbnail"]}`,
            three_dimen_object_blob_storage: `https://quick-scan-3d-objects.s3.ca-central-1.amazonaws.com/${obj["three_dimen_object_blob_storage"]}`,
            objectname: obj["three_dimen_object_blob_storage"],
            tags: obj["tags"]
          }))
          setCardProps(cardProps)
          setFilteredCardProps(cardProps)
        }
      } catch (error) {
        console.log(error)
      }
    })();
  }, [])

  useEffect(() => {
    if (selectedTags.length == 0) {
      setFilteredCardProps(cardProps)
    } else {
      setFilteredCardProps(cardProps.filter(card => selectedTags.every(t => card.tags?.includes(t.value))))
    }
  }, [selectedTags])

  const FilterStyle = styled.div`
    margin: 1rem;
  `;

  const Text = styled.div`
    font-size: 16px;
    margin-bottom: 1rem;
  `;

  const sort = [
    { value: 'mostPopular', label: 'Most Popular' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  const NUM_OF_COL = 4;

  const cardLayout = [];
  for (let i = 0; i < filteredCardProps.length; i = i + NUM_OF_COL) {
    const cardPropsRow: CardPropsType[] = [];
    for (let k = 0; k < NUM_OF_COL; k++) {
      if (i + k < filteredCardProps.length) {
        cardPropsRow.push(filteredCardProps[i + k]);
      }
    }
    cardLayout.push(
      <Row>
        {cardPropsRow.map((cardProp) => (
          // Need to change the breakpoint when changing the num of cards per col
          <Col breakPoint={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <div onClick={() => navigate("/view", {
              state: {
                isEditable: false,
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

  const handleSelect = (selectedTags) => {
    setSelectedTags(selectedTags)
  }

  return (
    <>
      <Toastr hasIcon={false} ref={toastRef} />
      <SEO title="Home" />
      <Row>
        <Col breakPoint={{ xs: 12, sm: 8, md: 8, lg: 9 }}>
          <Card>
            <FilterStyle>
              <Text>Tags</Text>
              <Select value={selectedTags} onChange={handleSelect} options={tags} isMulti multiple placeholder="Select Tags" />
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
