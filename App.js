import React, { useState, useEffect } from "react";
import { StyleSheet, Image, View, TouchableOpacity, Text } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import Svg, { Rect } from "react-native-svg";
import uuid from "react-native-uuid";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [facesArray, setfacesArray] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleFacesDetected = ({ faces }) => {
    setfacesArray(faces);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onFacesDetected={({ faces }) => {
          setfacesArray(faces);
        }}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.accurate,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 500,
          tracking: true,
        }}
      >
        <Svg height="100%" width="100%">
          {facesArray.map((face) => (
            <Rect
              key={uuid.v4()}
              x={face.bounds.origin.x}
              y={face.bounds.origin.y}
              width={face.bounds.size.width}
              height={face.bounds.size.height}
              stroke="yellow"
              strokeWidth="1"
            />
          ))}
        </Svg>
      </Camera>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Image
            style={styles.switchCamera}
            source={require("./assets/icons8-switch-camera-48.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 0.9,
  },
  buttonContainer: {
    flex: 0.1,
    backgroundColor: "#DDDDDD",
  },
  button: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
  },
  switchCamera: { width: 64, height: 64 },
  text: {
    fontSize: 18,
    color: "white",
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
