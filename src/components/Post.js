import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const URL = "http://192.168.1.4:8000/";

const Post = ({ route }) => {
  const { post } = route.params;
  const [participated, setParticipated] = useState(false);

  useEffect(() => {
    const verificarParticipante = async () => {
      try {
        const userToken = await SecureStore.getItemAsync("userToken");
        console.log("Token de usuario :", userToken);
        const response = await axios.post(
          `${URL}participante/${post.id}`,
          { userToken },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log(response.data);
        const participante = response.data;
        if (
          participante &&
          participante.message !== "No se encontró el participante"
        ) {
          // Si el participante existe
          setParticipated(true);
        }
      } catch (error) {
        console.error("Error al verificar participación:", error);
        if (error.response) {
          console.error("Respuesta del servidor:", error.response.data);
        } else if (error.request) {
          console.error("No se recibió respuesta del servidor");
        } else {
          console.error("Error al realizar la solicitud:", error.message);
        }
      }
    };

    verificarParticipante();
  }, [route, setParticipated]);

  // Función para manejar la participación
  const handleParticipation = async () => {
    try {
      const userToken = await SecureStore.getItemAsync("userToken");
      await axios.post(`${URL}participante/${post.id}/create`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setParticipated(true);
      Alert.alert(
        "Participación exitosa",
        "¡Gracias por participar en este evento!"
      );
    } catch (error) {
      console.error("Error al participar:", error);
      // Mostrar un mensaje de error si es necesario
      Alert.alert(
        "Error",
        "Hubo un error al participar en este evento. Inténtalo de nuevo más tarde."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.titulo}</Text>
      {post.rutaImg && (
        <Image
          source={{ uri: `http://192.168.1.4:8000/Imagenes/${post.rutaImg}` }}
          style={styles.postImage}
        />
      )}
      <Text style={styles.description}>{post.description}</Text>
      <Text style={styles.date}>{post.fecha}</Text>
      <Text style={styles.location}>{post.ubication}</Text>
      {!participated ? (
        <TouchableOpacity
          style={styles.participationButton}
          onPress={handleParticipation}>
          <Text style={styles.participationButtonText}>Participar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.participationButton}>
          <Text style={styles.participationButtonText}>Participando</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: "#555",
  },
  participationButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 16,
  },
  participationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Post;
