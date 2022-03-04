import React, { Suspense, useEffect } from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import { Link } from 'gatsby';
// import * as THREE from "three";
// import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { DDSLoader } from "three-stdlib";
import AWS from 'aws-sdk';
import SEO from '../components/SEO';
import {Helmet} from "react-helmet";

export default function View() {
  AWS.config.update({
    accessKeyId: 'AKIA4RGMXYINS5GS6JIA',
    secretAccessKey: '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',
    region: 'ca-central-1'
  });

  // THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());
  const Scene = () => {
    const obj = useLoader(OBJLoader, 'https://people.sc.fsu.edu/~jburkardt/data/obj/airboat.obj')
    return <primitive object={obj} />
  }

  useEffect(() => {
    if (document.getElementById("my-model-viewer")) {
      document
        .getElementById("my-model-viewer")
        .addEventListener("error", e =>
          console.log(`Error: ${JSON.stringify(e)}`)
        );
      document
        .getElementById("my-model-viewer")
        .addEventListener("load", e => console.log(`Load: ${JSON.stringify(e)}`));
      document
        .getElementById("my-model-viewer")
        .addEventListener("ar-status", e =>
          console.log(`AR-Status: ${JSON.stringify(e)}`)
        );
    }
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
      <Helmet>
        <script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        />
        <script
          noModule
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js"
        />
      </Helmet>
      <SEO title="Detailed View" />
        <Card size="Giant">
          <CardBody>
            {/* <Canvas camera={{ position: [-10, 15, 15] }}>
              <ambientLight intensity={1} />
              <Suspense fallback={null}>
                <Scene />
                <OrbitControls />
              </Suspense>
            </Canvas> */}
            {/* <a rel='ar' href = 'https://devimages-cdn.apple.com/ar/photogrammetry/AirForce.usdz'>
              
            <img src={'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'} />
              </a> */}
              <model-viewer
                id="my-model-viewer"
                alt="astronaut"
                src={'https://devimages-cdn.apple.com/ar/photogrammetry/AirForce.usdz'}
                auto-rotate
                camera-controls
              />
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
