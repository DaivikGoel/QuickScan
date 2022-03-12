import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { List, ListItem } from '@paljs/ui/List';
import AWS from 'aws-sdk';
import SEO from '../components/SEO';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import axios from 'axios';
import { requestUrl } from '../utils/requestUrl';

export default function View({ location }) {
  AWS.config.update({
    accessKeyId: 'AKIA4RGMXYINS5GS6JIA',
    secretAccessKey: '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',
    region: 'ca-central-1'
  });

  const [hasChanged, setHasChanged] = useState(false);
  let isEditable = false
  let cardProp = {title : '',
    description : '',
    thumbnail : '',
    three_dimen_object_blob_storage : '',
    objectname : '',
    uid: '',
    collection_id: '',
    tags: []
  }
  if (location && location.state) {
    isEditable = location.state.isEditable
    cardProp = location.state.cardProp
  }
  const {
    title = '',
    description = '',
    thumbnail = '',
    three_dimen_object_blob_storage = '',
    objectname = '',
    uid = '',
    collection_id = '',
    tags = []
  } = cardProp;

  const [newTitle, setTitle] = useState(title || '');
  const [newDescription, setDescription] = useState(description || '');

  const handleDownload = (usdzFile: string) => {
    const s3 = new AWS.S3();

    const params = {
      Bucket: 'quick-scan-3d-objects',
      Key: usdzFile,
    };

    const signedUrl = s3.getSignedUrl('getObject', params)
    const link = document.createElement('a');
    // Set link's href to point to the Blob URL
    link.href = signedUrl;
    link.download = usdzFile;
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    setHasChanged(true)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
    setHasChanged(true)
  }

  const submit = async (e) => {
    try {
      e.preventDefault()
      await axios.post(`${requestUrl}/updatecollection`, { 
        user_id: uid,
        collection_id,
        description: newDescription,
        name: newTitle,
      });
      navigate(-1);
    } catch (e) {
      console.log(e)
    }
  }

  const deleteObject = async (e) => {
    try {
      e.preventDefault()
      await axios.delete(`${requestUrl}/collection`, { data: { collection_id } })
      navigate(-1);
    } catch (e) {
      console.log(e)
    }
  }

  const Spacer = styled.div`
    margin-bottom: 10px;
  `;

  const Image = styled.a`
    align-self: 'center';
    max-width: 100%;
    max-height: 100%;
  `;
  
  let body
  if (isEditable) {
    body = (
      <>
        <form>
          <InputGroup fullWidth size="Large">
            <input value={newTitle} onChange={handleTitleChange} type="text" placeholder="Title" />
          </InputGroup>
          <Spacer />
          <InputGroup fullWidth size="Large">
            <textarea value={newDescription} onChange={handleDescriptionChange} placeholder="Description" />
          </InputGroup>
          <Spacer />
          <Button status='Success' disabled={!hasChanged} onClick={submit}>
            Submit
          </Button>
          <Button appearance={'outline'} status={'Danger'} onClick={deleteObject}>
            Delete
          </Button>
        </form>
      </>
    )
  } else {
    body = (
      <>
        <h4>{title}</h4>
        <p>{description}</p>
        <Button onClick={() => handleDownload(objectname)}>
          Download
        </Button>
      </>
    )
  }
  return (
    <>
      <SEO title="Detailed View" />
        <Card size="Large">
          <CardBody>
            <Image rel='ar' href = {three_dimen_object_blob_storage}>
              <img src={thumbnail} />
            </Image>
            {body}
            <Spacer />
            <p>Tags</p>
            <Spacer />
            {tags &&
              <List>
                {tags.map((tag, index) => (
                  <ListItem key={index}>{tag}</ListItem>
                ))}
              </List>
            }
          </CardBody>
        </Card>
    </>
  );
}
