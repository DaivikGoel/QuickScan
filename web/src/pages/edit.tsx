import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import SEO from '../components/SEO';
import axios from 'axios';
import { CardPropsType } from '../utils/types';
import { navigate } from 'gatsby';
import { requestUrl } from '../utils/requestUrl';
import useFirebase from '../utils/useFirebase';
import styled from 'styled-components';

export default function Edit(props) {
  const collectionUrl = `${requestUrl}/collection`
  const [cardProps, setCardProps] = useState<CardPropsType[]>([]);
  const [filteredCardProps, setFilteredCardProps] = useState<CardPropsType[]>([]);
  const firebase = useFirebase();
  useEffect(() => {
    if (firebase && !firebase.currentUser) {
      navigate("/auth/login")
    }
  }, [firebase, props])

  useEffect(() => {
    (async () => {
      try {
        if (!firebase) { return null }
        if (!firebase.currentUser) { return null }
        const response = await axios.get(collectionUrl)
        if (response) {
          const userId = firebase.currentUser.uid
          const objects = response.data.data
          const cardProps = objects.filter((obj: any) => userId !== obj["user_id"]).map((obj: any) => ({
            title: obj["name"],
            description: obj["description"],
            thumbnail: `https://quickscanthumbnails.s3.ca-central-1.amazonaws.com/${obj["thumbnail"]}`,
            three_dimen_object_blob_storage: `https://quick-scan-3d-objects.s3.ca-central-1.amazonaws.com/${obj["three_dimen_object_blob_storage"]}`,
            objectname: obj["three_dimen_object_blob_storage"],
            tags: obj["tags"],
            uid: obj["user_id"],
            collection_id: obj["collection_id"]
          }))
          setCardProps(cardProps)
        }
      } catch (error) {
        console.log(error)
      }
      if (props && props.location) {
        const params = new URLSearchParams(props.location.search)
        if (params) {
          const searchString = params.get('search')?.toLowerCase()
          if (!searchString) {
            setFilteredCardProps(cardProps)
          } else if (searchString) {
            setFilteredCardProps([...cardProps].filter(card => card.description?.toLowerCase().includes(searchString) || card.title?.toLowerCase().includes(searchString)))
          }
        }
      }
    })();
  }, [props.location])

  const Image = styled.img`
    align-self: 'center';
    max-width: 96%;
    max-height: 96%;
  `;

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
                isEditable: true,
                cardProp,
              }
            })} >
              <Card accent="Info">
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
  return (
    <>
      <SEO title="Your Models" />
      {cardLayout}
    </>
  );
}
