import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Feed from "../components/Feed";
import Usuario from "../components/Usuario";
import Chat from "../components/Chat";
import Scanqr from "../components/Scanqr";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faQrcode } from "@fortawesome/free-solid-svg-icons/faQrcode";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import Post from "../components/Post";

const Tab = createBottomTabNavigator();

export const Home = () => {
  return (
    <Tab.Navigator>
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
        name='Scan QR'
        component={Scanqr}
        options={{
          tabBarIcon: () => (
            <FontAwesomeIcon name='Scan QR' size={25} icon={faQrcode} />
          ),
        }}
      />
      <Tab.Screen
        name='chat'
        component={Chat}
        options={{
          tabBarIcon: () => (
            <FontAwesomeIcon name='chat' size={22} icon={faComments} />
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
