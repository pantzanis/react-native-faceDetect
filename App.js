import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Image, View, TouchableOpacity, Text } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import Svg, { Rect } from "react-native-svg";
import uuid from "react-native-uuid";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [facesArray, setfacesArray] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const camera = useRef(null);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleFacesDetected = ({ faces }) => {
    setfacesArray(faces);
    console.log(faces);
  };

  const snap = async () => {
    try {
      const options = { quality: 0.5, base64: true };
      const data = await camera.current.takePictureAsync(options);
      console.log(data.uri, "<<<<<<<<<<<<<<<<<<<<<");
    } catch (error) {
      console.log(error, "ERROR <<<<<<<<<<<<<");
    }
  };
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={camera}
        type={type}
        flashMode={flashMode}
        onFacesDetected={({ faces }) => {
          setfacesArray(faces);
          // console.log(faces);
        }}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.accurate,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 1500,
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
        <TouchableOpacity style={styles.button} onPress={snap}>
          <Image
            style={styles.switchCamera}
            source={require("./assets/icons8-bandicam-100.png")}
          />
        </TouchableOpacity>
        {type === Camera.Constants.Type.back && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setFlashMode(
                flashMode === Camera.Constants.FlashMode.torch
                  ? Camera.Constants.FlashMode.off
                  : Camera.Constants.FlashMode.torch
              );
            }}
          >
            <Image
              style={styles.switchCamera}
              source={require("./assets/icons8-flash-on-50.png")}
            />
          </TouchableOpacity>
        )}
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
    flexDirection: "row",
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
