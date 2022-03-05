import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import { Link } from 'gatsby';
import AWS from 'aws-sdk';
import SEO from '../components/SEO';

export default function View(props) {
  AWS.config.update({
    accessKeyId: 'AKIA4RGMXYINS5GS6JIA',
    secretAccessKey: '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',
    region: 'ca-central-1'
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
  console.log(props.location.state)
  const { title, description, thumbnail } = props.location.state.cardProp;
  return (
    <>
      <SEO title="Detailed View" />
        <Card size="Giant">
          <CardBody>
            <a rel='ar' href = 'https://devimages-cdn.apple.com/ar/photogrammetry/AirForce.usdz'>
              <img src={thumbnail} />
            </a>
            <h4>{title}</h4>
            <p>{description}</p>
            <Button onClick={handleDownload}>
              Download
            </Button>
          </CardBody>
        </Card>
    </>
  );
}
