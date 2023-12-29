import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Feed from "../components/Feed";
import Usuario from "../components/Usuario";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

const Tab = createBottomTabNavigator();

export const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: "#cbe4dd",
        headerStyle: { backgroundColor: "#257d7f" },
        tabBarActiveTintColor: "#a3473d",
      }}>
      <Tab.Screen
        name='Feed'
        component={Feed}
        options={{
          tabBarIcon: () => (
            <FontAwesomeIcon name='Feed' size={22} icon={faHouse} />
          ),
        }}
      />
      <Tab.Screen
        name='Usuario'
        component={Usuario}
        options={{
          tabBarIcon: () => (
            <FontAwesomeIcon name='Usuario' size={22} icon={faUser} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
