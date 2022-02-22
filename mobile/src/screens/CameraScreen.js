import React, {useState} from 'react'

const CameraScreen = ({navigation}) => {
  const devices = useCameraDevices('wide-angle-camera')
  const device = devices.back

  if (device == null) return null
    return (
      <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}