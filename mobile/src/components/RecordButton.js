import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'

const RecordButton = ({ style, isRecording, onPress }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={styles.outerRing}>
        <View style={[
          styles.innerRing,
          {
            borderColor: isRecording ? 'red' : 'white',
            backgroundColor: isRecording ? 'red' : 'white'
          }
        ]} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  outerRing: { 
    borderWidth: 2,
    borderRadius:25,
    borderColor: 'white',
    height: 50,
    width:50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    borderWidth: 2,
    borderRadius:25,
    height: 40,
    width:40,
  }
})

export default RecordButton;
