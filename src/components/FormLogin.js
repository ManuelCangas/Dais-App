import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import FormRegistro from "./FormRegistro";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.API_URL;

const FormLogin = () => {
  const URI = `${apiUrl}/usuario/login-jugador`;

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${URI}`, {
        nickname: nickname,
        password: password,
      });
      const userToken = response.data.token;
      await SecureStore.setItemAsync("userToken", userToken); //Guarda el token mediante Storestorage
      console.log("Token de acceso:", response.data.token);
      console.log("Datos del usuario:", response.data.usuario);
      // Capturar los datos del usuario y redirigir
      setUserData(response.data.usuario);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Credenciales invalidas");
        alert("Credenciales invalidas");
      } else {
        console.error("Error en el inicio de sesión: ", error.message);
      }
    }
  };

  const handleRegistro = () => {
    navigation.navigate(FormRegistro);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/Dado.png")} style={styles.logo} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.title}>¡Bienvenid@ a Dais!</Text>
        <View>
          <Text style={styles.txtsign}>Ingrese su usuario</Text>
          <View style={styles.inputgroup}>
            <FontAwesomeIcon size={20} style={styles.icon} icon={faUser} />
            <TextInput
              placeholder='Apodo'
              style={styles.txtinput}
              onChangeText={(text) => setNickname(text)}
            />
          </View>
          <View style={styles.inputgroup}>
            <FontAwesomeIcon size={20} style={styles.icon} icon={faLock} />
            <TextInput
              placeholder='Contraseña'
              style={styles.txtinput}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={styles.btngroup}>
            <Pressable style={styles.btn} onPress={handleLogin}>
              <Text style={styles.btntxt}>Sign in</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={handleRegistro}>
              <Text style={styles.btntxt}>Sign up</Text>
            </Pressable>
          </View>

          <Pressable style={styles.footerpress}>
            <Text style={styles.footertxt}>Recuperar contraseña</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FormLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cbe4dd",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 2,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    height: 210,
    width: 210,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#257d7f",
  },
  txtsign: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15,
    color: "#257d7f",
  },
  inputgroup: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cbe4dd",
    paddingBottom: 5,
  },
  icon: {
    flex: 1,
    marginEnd: 5,
  },
  txtinput: {
    width: "80%",
    paddingStart: 10,
  },
  btngroup: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#82aca9",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 50,
    marginTop: 15,
  },
  btntxt: {
    fontSize: 20,
  },
  footerpress: {
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#cbe4dd",
    marginTop: 15,
  },
  footertxt: {
    fontWeight: "bold",
  },
});
