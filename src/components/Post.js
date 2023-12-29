import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.API_URL;

const URL = `${apiUrl}/participante/`;

const Post = ({ route }) => {
  const { post } = route.params;
  const [participated, setParticipated] = useState(false);
  const [codigoData, setCodigoData] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const verificarParticipante = async () => {
      try {
        const userToken = await SecureStore.getItemAsync("userToken");
        console.log("Token de usuario :", userToken);
        const response = await axios.post(
          `${URL}${post.id}`,
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
          setCodigoData(response.data.codigo);
          console.log(response.data.codigo);
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleQR = () => {
    console.log(codigoData);
    toggleModal();
  };

  // Función para manejar la participación
  const handleParticipation = async () => {
    try {
      const userToken = await SecureStore.getItemAsync("userToken");
      await axios.post(`${URL}${post.id}/create`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setParticipated(true);
      Alert.alert(
        "Participación exitosa",
        "¡Gracias por participar en este evento!"
      );
      navigation.navigate("Feed");
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
          source={{
            uri: `${apiUrl}/Imagenes/${post.rutaImg}`,
          }}
          style={styles.postImage}
        />
      )}
      <View style={styles.card}>
        <ScrollView>
          <Text style={styles.description}>{post.description}</Text>
        </ScrollView>
        <Text style={styles.date}> Fecha: {post.fecha}</Text>
        <Text style={styles.location}> Lugar: {post.ubication}</Text>
      </View>
      {!participated ? (
        <TouchableOpacity
          style={styles.participationButton}
          onPress={handleParticipation}>
          <Text style={styles.participationButtonText}>Participar</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.participationButton}>
            <Text style={styles.participationButtonText}>Participando</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qrButton} onPress={handleQR}>
            <Text style={styles.qrText}>Código QR</Text>
          </TouchableOpacity>
          <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
            <View style={styles.modalContainer}>
              <QRCode value={codigoData} size={200} />
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.closeModalText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: "#cbe4dd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#257d7f",
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 8,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#257d7f",
  },
  card: {
    borderRadius: 30,
    backgroundColor: "white",
    padding: 13,
    height: "45%",
  },
  description: {
    fontSize: 18,
    marginBottom: 8,
    overflow: "scroll",
  },
  date: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
  },
  location: {
    fontSize: 15,
    color: "#555",
  },
  participationButton: {
    backgroundColor: "#257d7f",
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
  qrButton: {
    backgroundColor: "#a3473d",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 16,
  },
  qrText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "#82aca9",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeModalText: {
    marginTop: 25,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#a3473d",
    color: "#fff",
  },
});

export default Post;
