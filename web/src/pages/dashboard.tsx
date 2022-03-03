import React, { useState } from 'react';
import SEO from '../components/SEO';
import Row from '@paljs/ui/Row';
import Select from '@paljs/ui/Select';
import Col from '@paljs/ui/Col';
import { InputGroup } from '@paljs/ui/Input';
import styled from 'styled-components';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import AWS from 'aws-sdk';
import { Button } from '@paljs/ui/Button';
import axios from 'axios';

const Home = () => {
  // yolo
  AWS.config.update({
    accessKeyId: 'AKIA4RGMXYINS5GS6JIA',
    secretAccessKey: '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',
    region: 'ca-central-1'
  });

  const requestUrl = 'http://ec2-3-98-130-154.ca-central-1.compute.amazonaws.com:3000/collection'
  axios.get(requestUrl)
  .then(function (response) {
    const objects = response.data.data
    console.log(response.data.data[1]["three_dimen_object_blob_storage"])
    console.log(objects)
    //console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });


  const handleDownload = () => {
    const fileName = '1215.usdz'
    const s3 = new AWS.S3();

    const params = {
      Bucket: 'quick-scan-3d-objects',
      Key: fileName,
    };

    const signedUrl = s3.getSignedUrl('getObject', params)
    const link = document.createElement('a');
    // Set link's href to point to the Blob URL
    link.href = signedUrl;
    link.download = fileName;
    // Append link to the body
    document.body.appendChild(link);
    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    // Remove link from body
    document.body.removeChild(link);
}


  const FilterStyle = styled.div`
    margin: 1rem;
  `;

  const Text = styled.div`
    font-size: 16px;
    margin-bottom: 1rem;
  `;

  const defaultCardProps = [
    {
      title: 'Card 1',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      title: 'Card 2',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      title: 'Card 3',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      title: 'Card 4',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
    {
      title: 'Card 5',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    },
  ];

  const tags = [
    { value: '3d', label: '3D' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'nature', label: 'Nature' },
    { value: 'weather', label: 'Weather' },
  ];

  const rating = [
    { value: 'any', label: 'Any' },
    { value: '4star', label: '4+ Stars' },
    { value: '3star', label: '3+ Stars' },
    { value: '2star', label: '2+ Stars' },
    { value: '1star', label: '1+ Stars' },
  ];

  const sort = [
    { value: 'mostPopular', label: 'Most Popular' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  const NUM_OF_COL = 4;

  const cardLayout = [];
  for (let i = 0; i < defaultCardProps.length; i = i + NUM_OF_COL) {
    const cardProps = [];
    for (let k = 0; k < NUM_OF_COL; k++) {
      if (i + k < defaultCardProps.length) {
        cardProps.push(defaultCardProps[i + k]);
      }
    }
    cardLayout.push(
      <Row>
        {cardProps.map((cardProp) => (
          // Need to change the breakpoint when changing the num of cards per col
          <Col breakPoint={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            <Card accent="Info">
              <CardBody>
                <img src={cardProp.thumbnail} />
                <Button onClick={handleDownload}>
                  Download from aws
                </Button>
              </CardBody>
              <CardFooter>{cardProp.title}</CardFooter>
            </Card>
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
              <Row>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Text>Tags</Text>
                </Col>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Text>Rating</Text>
                </Col>
              </Row>
              <Row>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Select options={tags} isMulti multiple placeholder="Select Tags" />
                </Col>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Select options={rating} placeholder="Select a rating" />
                </Col>
              </Row>
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
