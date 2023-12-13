import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import DatePicker from "@react-native-community/datetimepicker";
import Feed from "./Feed";

const FormRegistro = () => {
  const URI = "http://192.168.1.4:8000";
  const navigation = useNavigation();
  //Datos de usuario
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [sexo, setSexo] = useState("");
  const [rol, setRol] = useState(1);
  //Fecha de nacimiento
  const [selectedDate, setSelectedDate] = useState(new Date()); // Valor inicial como instancia de Date
  const [showDatePicker, setShowDatePicker] = useState(false);
  //Botón fecha
  const handleDateChange = () => {
    setShowDatePicker(true); // Mostrar el DatePicker al presionar el botón
  };
  const handleDatePickerChange = (event, selectedDate) => {
    setShowDatePicker(false); // Ocultar el DatePicker
    if (selectedDate instanceof Date) {
      setSelectedDate(selectedDate);
    }
  };
  //Botón registro
  const handleRegistro = async () => {
    try {
      if (password !== repeatPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      const response = await axios.post(URI + "/usuario/", {
        nombre: nombre,
        mail: mail,
        nickname: nickname,
        password: password,
        edad: selectedDate.toISOString(),
        sexo: sexo,
        usuario_rol: rol,
      });
      alert("Usuario registrado");
      console.log(response);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert(
        "Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo."
      );
    }
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
              onChangeText={setNombre}
              style={styles.txtinput}
            />
          </View>
          <View style={styles.inputgroup}>
            <TextInput
              placeholder='Correo'
              onChangeText={setMail}
              style={styles.txtinput}
            />
          </View>
          <View style={styles.inputgroup}>
            <TextInput
              placeholder='Apodo'
              onChangeText={setNickname}
              style={styles.txtinput}
            />
          </View>
          <View style={styles.inputgroup}>
            <TextInput
              placeholder='Contraseña'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.txtinput}
            />
          </View>
          <View style={styles.inputgroup}>
            <TextInput
              placeholder='Repitir Contraseña'
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry={true}
              style={styles.txtinput}
            />
          </View>
          <View style={styles.inputgroup}>
            <Picker
              selectedValue={sexo}
              onValueChange={(itemValue) => setSexo(itemValue)}
              style={styles.picker}>
              <Picker.Item label='Masculino' value='masculino' />
              <Picker.Item label='Femenino' value='femenino' />
              <Picker.Item label='Otro' value='otro' />
            </Picker>
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
    fontSize: 16,
    width: "80%",
    marginTop: 0,
    marginBottom: 8,
  },
  txtbtn: {
    fontSize: 20,
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
