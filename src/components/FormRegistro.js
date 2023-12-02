import {
  Pressable,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import DatePicker from "@react-native-community/datetimepicker";

const FormRegistro = () => {
  const URI = "http://192.168.1.18:8000";
  const navigation = useNavigation();
  //Datos de usuario
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [sexo, setSexo] = useState("");
  //Fecha de nacimiento
  const [selectedDate, setSelectedDate] = useState(new Date()); // Valor inicial como instancia de Date
  const [showDatePicker, setShowDatePicker] = useState(false);
  //Botón fecha
  const handleDateChange = () => {
    setShowDatePicker(true); // Mostrar el DatePicker al presionar el botón
  };
  const handleDatePickerChange = (event, selectedDate) => {
    setShowDatePicker(false); // Ocultar el DatePicker
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };
  //Botón registro
  const handleRegistro = () => {
    axios
      .post(URI + "/usuarios/", {
        nombre: nombre,
        mail: mail,
        nickname: nickname,
        password: password,
        edad: selectedDate,
        sexo: sexo,
      })
      .then(() => {
        alert("Usuario registrado ");
        navigation.navigate(Feed);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.footer}>
        <Text style={styles.title}>Registro</Text>
        <View>
          <Text style={styles.txtsign}>Ingrese sus datos</Text>
          <View style={styles.inputgroup}>
            <TextInput
              placeholder='Nombre'
              onChange={setNombre}
              style={styles.txtinput}
            />
          </View>
          <View style={styles.inputgroup}>
            <TextInput placeholder='Correo' onChange={setMail} style={styles.txtinput} />
          </View>
          <View style={styles.inputgroup}>
            <TextInput placeholder='Apodo' onChange={setNickname} style={styles.txtinput} />
          </View>
          <View style={styles.inputgroup}>
            <TextInput placeholder='Contraseña' onChange={setPassword} style={styles.txtinput} />
          </View>
          <View style={styles.inputgroup}>
            <TextInput placeholder='Sexo' onChange={setSexo} style={styles.txtinput} />
          </View>
          <View style={styles.inputgroup}>
            <Text style={styles.dateinput}>Fecha de nacimiento</Text>
            <Pressable style={styles.btn} onPress={handleDateChange}>
              <Text style={styles.txtbtn}>
                {selectedDate.toLocaleDateString()}
              </Text>
              {showDatePicker && (
                <DatePicker
                  value={selectedDate}
                  mode='date'
                  display='default'
                  onChange={handleDatePickerChange}
                />
              )}
            </Pressable>
          </View>
          <Pressable style={styles.btn} onPress={handleRegistro}>
            <Text style={styles.txtbtn}>Registrarse</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FormRegistro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
  },
  header: {
    flex: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
    alignSelf: "center",
  },
  txtsign: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15,
  },
  inputgroup: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgreen",
    paddingBottom: 5,
  },
  txtinput: {
    width: "auto",
    paddingStart: 10,
  },
  dateinput: {
    fontSize: 20,
    fontWeight: "bold",
    width: "80%",
    marginTop: 10,
    marginBottom: 10,
  },
  txtbtn: {
    fontSize: 20,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "lightgreen",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 200,
    height: 50,
  },
});
