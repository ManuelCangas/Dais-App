import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const Post = ({ route }) => {
  const { post } = route.params;
  const [participated, setParticipated] = useState(false);

  // Función para manejar la participación
  const handleParticipation = async () => {
    try {
      // Lógica para participar, enviar solicitud al servidor, etc.

      // Cambiar el estado local indicando que el usuario ha participado
      setParticipated(true);

      // Mostrar un mensaje de éxito
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
          source={{ uri: `http://192.168.1.7:8000/Imagenes/${post.rutaImg}` }}
          style={styles.postImage}
        />
      )}
      <Text style={styles.description}>{post.description}</Text>
      <Text style={styles.date}>{post.fecha}</Text>
      <Text style={styles.location}>{post.ubication}</Text>
      {!participated && (
        <TouchableOpacity
          style={styles.participationButton}
          onPress={handleParticipation}>
          <Text style={styles.participationButtonText}>Participar</Text>
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
