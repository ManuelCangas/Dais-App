import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const URL = "http://192.168.1.7:8000/";

const Scanqr = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

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
        `${URL}participante/validarqr`,
        { userToken, data },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        console.log("Asistencia actualizada exitosamente");
        // Manejar la respuesta según sea necesario
      } else {
        console.error(
          "Error en la respuesta del servidor:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error al enviar solicitud al servidor: ", error);
    }
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScanned(false)}>
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
