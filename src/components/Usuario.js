import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { differenceInYears, parseISO } from "date-fns";

const Usuario = () => {
  const URI = "http://192.168.1.7:8000";

  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      navigation.reset({
        index: 0,
        routes: [{ name: "FormLogin" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const loadUserData = async () => {
    try {
      const userToken = await SecureStore.getItemAsync("userToken");
      console.log("Token de usuario:", userToken);
      // Hacer una solicitud al backend para obtener los detalles del usuario mediante token
      const response = await axios.post(URI + "/usuario/perfil", null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // Desestructurar datos
      const { nombre, mail, nickname, edad, sexo } = response.data;
      // Calcular edad
      const edadCalculada = calculateAgeFromDOB(edad);
      // Actualizar el estado con los datos
      setUserData({ nombre, mail, nickname, edad: edadCalculada, sexo });
      console.log("Datos del usuario actualizados:", {
        nombre,
        mail,
        nickname,
        edad: edadCalculada,
        sexo,
      });
      setLoading(false); // Detenemos la carga
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      }
      setLoading(false); // Manejar el error y dejar de cargar
    }
  };

  const calculateAgeFromDOB = (dob) => {
    const edad = parseISO(dob);
    const edadCalculada = differenceInYears(new Date(), edad);
    return edadCalculada;
  };

  // Llamar a la función de carga de datos del usuario cuando el componente se monte
  useEffect(() => {
    console.log("Ejecutando useEffect de Usuario");
    loadUserData();
  }, []); // El segundo argumento del useEffect asegura que solo se ejecute una vez al montar el componente

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Cargando datos del usuario...</Text>
      ) : userData ? (
        <View style={styles.profileContainer}>
          <Text style={styles.titulo}>Perfil del Usuario</Text>
          <View style={styles.avatarContainer}>
            <FontAwesomeIcon size={200} icon={faCircleUser} />
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.textUser}>Nombre: {userData.nombre}</Text>
            <Text style={styles.textUser}>Correo: {userData.mail}</Text>
            <Text style={styles.textUser}>Apodo: {userData.nickname}</Text>
            <Text style={styles.textUser}>Edad: {userData.edad}</Text>
            <Text style={styles.textUser}>Sexo: {userData.sexo}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>No se pudieron cargar los datos del usuario.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
    marginBottom: 35,
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    borderRadius: 30,
    borderColor: "#119050",
    borderWidth: 3,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textUser: {
    fontSize: 18,
    marginVertical: 5,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#119050",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Usuario;
