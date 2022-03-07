import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import AWS from 'aws-sdk';
import SEO from '../components/SEO';
import styled from 'styled-components';

export default function View({ location }) {
  AWS.config.update({
    accessKeyId: 'AKIA4RGMXYINS5GS6JIA',
    secretAccessKey: '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',
    region: 'ca-central-1'
  });

  const [newTitle, setTitle] = useState<string>("");
  const [newDescription, setDescription] = useState<string>("");
  const [hasChanged, setHasChanged] = useState(false);
  const isEditable = false
  const cardProp = {title : '',
  description : '',
  thumbnail : '',
  three_dimen_object_blob_storage : '',
  objectname : ''}
  // const { isEditable = false, cardProp = {} } = location.state
  const {
    title = '',
    description = '',
    thumbnail = '',
    three_dimen_object_blob_storage = '',
    objectname = ''
  } = cardProp;

  useEffect(() => {
    setTitle(title);
    setDescription(description);
  }, [title, description])

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

  const submitChanges = () => {
    if (hasChanged) {

    }
  }

  const Input = styled(InputGroup)`
    margin-bottom: 10px;
  `;
  
  let body
  if (isEditable) {
    body = (
      <>
        <Input fullWidth size="Large">
          <input value={newTitle} onChange={handleTitleChange} type="text" placeholder="Title" />
        </Input>
        <Input fullWidth size="Large">
          <textarea value={newDescription} onChange={handleDescriptionChange} placeholder="Description" />
        </Input>
        <Button disabled={hasChanged} onClick={submitChanges}>
          Submit
        </Button>
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
  console.log(cardProp)
  return (
    <>
      <SEO title="Detailed View" />
        <Card size="Giant">
          <CardBody>
            <a rel='ar' href = {three_dimen_object_blob_storage}>
              <img src={thumbnail} />
            </a>
            {body}
            
          </CardBody>
        </Card>
    </>
  );
}
