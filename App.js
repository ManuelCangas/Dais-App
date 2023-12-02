import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./src/navigations/Navigation";
import FormLogin from "./src/components/FormLogin";
import FormRegistro from "./src/components/FormRegistro";
import Post from "./src/components/Post";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='FormLogin'>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='FormLogin' component={FormLogin} />
          <Stack.Screen name='FormRegistro' component={FormRegistro} />
          <Stack.Screen name='Post' component={Post} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
