import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import SEO from '../components/SEO';
import axios from 'axios';
import { CardPropsType } from '../utils/types';
import { navigate } from 'gatsby';
import { getUserId } from '../utils/firebase';

export default function Edit(props) {
  const requestUrl = 'http://ec2-3-98-130-154.ca-central-1.compute.amazonaws.com:3000/collection'
  const [cardProps, setCardProps] = useState<CardPropsType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(requestUrl)
        if (response) {
          const userId = getUserId()
          const objects = response.data.data
          const cardProps = objects.filter((obj: any) => userId !== obj["user_id"]).map((obj: any) => ({
            title: obj["name"],
            description: obj["description"],
            thumbnail: `https://quickscanthumbnails.s3.ca-central-1.amazonaws.com/${obj["thumbnail"]}`,
            three_dimen_object_blob_storage: `https://quick-scan-3d-objects.s3.ca-central-1.amazonaws.com/${obj["three_dimen_object_blob_storage"]}`,
            objectname: obj["three_dimen_object_blob_storage"]
          }))
          setCardProps(cardProps)
        }
      } catch (error) {
        console.log(error)
      }
    })();
  }, [])

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
                isEditable: true,
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
      <SEO title="Your Models" />
      {cardLayout}
    </>
  );
}
