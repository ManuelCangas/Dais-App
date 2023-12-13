import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Camera } from "expo-camera";
import axios from "axios";

const URL = "http://192.168.1.4:8000/";

const Scanqr = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(data);
    const userToken = await SecureStore.getItemAsync("userToken");
    console.log("Token de usuario:", userToken);
    // Enviar solicitud al servidor
    try {
      const response = await axios.post(
        `${URL}participante/post/validarqr`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.error === "Usuario no autorizado") {
        alert("El usuario no está autorizado para realizar esta acción.");
        return;
      } else {
        alert("Felicidades, tu asistencia fue confirmada");
      }
    } catch (error) {
      console.error("Error al enviar solicitud al servidor: ", error);
    }
  };

  const resetScanned = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permisos de la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permiso de la cámara denegado</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayMessage}>
          {scanned ? "Código escaneado" : "Apunta la cámara hacia el código QR"}
        </Text>
        {scanned && (
          <TouchableOpacity style={styles.button} onPress={resetScanned}>
            <Text style={styles.buttonText}>Escanear nuevamente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayMessage: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default Scanqr;
