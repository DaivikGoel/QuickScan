import React, { Suspense, useEffect } from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import { Link } from 'gatsby';
import AWS from 'aws-sdk';
import SEO from '../components/SEO';

export default function View() {
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
  return (
    <>
      <SEO title="Detailed View" />
        <Card size="Giant">
          <CardBody>
            <a rel='ar' href = 'https://devimages-cdn.apple.com/ar/photogrammetry/AirForce.usdz'>
              <img src={'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'} />
            </a>
            <p>Title</p>
            {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
            <Button onClick={handleDownload}>
              Download from aws
            </Button>
          </CardBody>
        </Card>
    </>
  );
}
