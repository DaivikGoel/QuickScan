import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Row from '@paljs/ui/Row';
import Select from '@paljs/ui/Select';
import Col from '@paljs/ui/Col';
import styled from 'styled-components';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import axios from 'axios';
import { navigate } from 'gatsby';
import { CardPropsType, TagType } from '../utils/types';
import { requestUrl } from '../utils/requestUrl';

const Home = ({ location }) => {
  const collectionUrl = `${requestUrl}/collection`
  const tagUrl = `${requestUrl}/tags`
  const [cardProps, setCardProps] = useState<CardPropsType[]>([]);
  const [filteredCardProps, setFilteredCardProps] = useState<CardPropsType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [selectedSort, setSelectedSort] = useState<TagType>();

  const filterByUrlParam = (newCardProps) => {
    const params = new URLSearchParams(location?.search)
    if (params.has('search')) {
      const searchString = params.get('search')?.toLowerCase()
      if (!searchString) {
        setFilteredCardProps(newCardProps)
      } else if (searchString) {
        setFilteredCardProps([...newCardProps].filter(card => card.description?.toLowerCase().includes(searchString) || card.title?.toLowerCase().includes(searchString)))
      }
    } else {
      setFilteredCardProps(newCardProps)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (location) {
          const tagResponse = await axios.get(tagUrl)
          if (tagResponse) {
            const data = tagResponse.data.data;
            setTags(data.map(t => ({ value: t['TAG_TITLE'], label: t['TAG_TITLE'] })))
          }
          const response = await axios.get(collectionUrl)
          if (response) {
            const objects = response.data.data
            const newCardProps = objects.filter((obj: any) => typeof obj['thumbnail'] == 'string').map((obj: any) => ({
              title: obj["name"],
              description: obj["description"],
              thumbnail: `https://quickscanthumbnails.s3.ca-central-1.amazonaws.com/${obj["thumbnail"]}`,
              three_dimen_object_blob_storage: `https://quick-scan-3d-objects.s3.ca-central-1.amazonaws.com/${obj["three_dimen_object_blob_storage"]}`,
              objectname: obj["three_dimen_object_blob_storage"],
              tags: JSON.parse(obj["tags"])?.data?.replace('[', '').replace(']', '').split(',') || [],
              date: new Date(obj['timestamp']),
              uid: obj["user_id"],
              collection_id: obj["collection_id"]
            }))
            setCardProps(newCardProps)
            filterByUrlParam(newCardProps)
          }
        }
      } catch (error) {
        console.log(error)
      }
    })();
  }, [location])

  useEffect(() => {
    if (selectedTags.length == 0) {
      setSelectedSort({ value: 'newest', label: 'Newest' })
      filterByUrlParam(cardProps)
    } else {
      setFilteredCardProps(filteredCardProps.filter(card => selectedTags.every(t => {
        return card.tags?.includes(t.value)
      })))
    }
  }, [selectedTags])

  useEffect(() => {
    if (selectedSort) {
      if (selectedSort.value === 'newest') {
        const newCards = [...filteredCardProps].sort((first, second) => {
          if (first.date < second.date) {
            return 1
          }
          if (first.date > second.date) {
            return -1
          }
          return 0
        })
        setFilteredCardProps(newCards)
      } else if (selectedSort.value === 'oldest') {
        const newCards = [...filteredCardProps].sort((first, second) => {
          if (first.date < second.date) {
            return -1
          }
          if (first.date > second.date) {
            return 1
          }
          return 0
        })
        setFilteredCardProps(newCards)
      } else if (selectedSort.value === 'creator') {
        const newCards = [...filteredCardProps].sort((first, second) => {
          if (first.uid < second.uid) {
            return 1
          }
          if (first.uid > second.uid) {
            return -1
          }
          return 0
        })
        setFilteredCardProps(newCards)
      }
    }
  }, [selectedSort])

  useEffect(() => {
    setSelectedSort({ value: 'newest', label: 'Newest' })
    setSelectedTags([])
    filterByUrlParam(cardProps)
  }, [location])

  const FilterStyle = styled.div`
    margin: 1rem;
  `;

  const Text = styled.div`
    font-size: 16px;
    margin-bottom: 1rem;
  `;

  const Image = styled.img`
    align-self: 'center';
    max-width: 96%;
    max-height: 96%;
  `;

  const sort = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'creator', label: 'Creator' },
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
              <Card size={'Small'} accent="Info">
                <CardBody>
                  <Image src={cardProp.thumbnail} />
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

  const handleSort = (selectedSort) => {
    setSelectedSort(selectedSort)
  }

  return (
    <>
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
              <Select value={selectedSort} onChange={handleSort} options={sort} placeholder="Any" />
            </FilterStyle>
          </Card>
        </Col>
      </Row>
      {cardLayout}
    </>
  );
};
export default Home;
