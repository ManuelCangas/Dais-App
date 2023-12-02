import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

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

  // Aquí podrías tener una función para cargar los datos del usuario cuando el componente se monte
  const loadUserData = async () => {
    try {
      const userToken = await SecureStore.getItemAsync("userToken");
      console.log("Token de usuario:", userToken);
      // Hacer una solicitud al backend para obtener los detalles del usuario
      const response = await axios.post(URI + "/usuario/perfil", null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("Respuesta completa del servidor:", response);
      // Desestructurar solo los campos que necesitas
      const { nombre, mail, nickname, edad, sexo } = response.data;
      // Actualizar el estado con los datos del usuario
      setUserData({ nombre, mail, nickname, edad, sexo });
      console.log("Datos del usuario actualizados:", {
        nombre,
        mail,
        nickname,
        edad,
        sexo,
      });
      setLoading(false); // Indicar que ya no estamos cargando
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      }
      setLoading(false); // Manejar el error y dejar de cargar
    }
  };

  // Llamar a la función de carga de datos del usuario cuando el componente se monte
  useEffect(() => {
    console.log("Ejecutando useEffect de Usuario");
    loadUserData();
  }, []); // El segundo argumento del useEffect asegura que solo se ejecute una vez al montar el componente

  return (
    <View>
      {loading ? (
        <Text>Cargando datos del usuario...</Text>
      ) : userData ? (
        <View>
          <Text>Perfil del Usuario</Text>
          <Text>Nombre: {userData.nombre}</Text>
          <Text>Correo: {userData.mail}</Text>
          <Text>Apodo: {userData.nickname}</Text>
          <Text>Edad: {userData.edad}</Text>
          <Text>Sexo: {userData.sexo}</Text>
          <Button title='Cerrar Sesión' onPress={handleLogout} />
        </View>
      ) : (
        <Text>No se pudieron cargar los datos del usuario.</Text>
      )}
    </View>
  );
};

export default Usuario;
