import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const Feed = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.1.4:8000/post/"); // Reemplaza con tu dirección IP local
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePostPress(item)}>
      <View style={styles.postContainer}>
        <Text style={styles.username}>{item.titulo}</Text>
        {item.rutaImg && (
          <Image
            source={{ uri: `http://192.168.1.7:8000/Imagenes/${item.rutaImg}` }} // Reemplaza con tu dirección IP local
            style={styles.postImage}
          />
        )}
        <Text style={styles.caption} numberOfLines={3}>
          {item.description}
        </Text>
        <Text style={styles.date}>{item.fecha}</Text>
      </View>
    </TouchableOpacity>
  );

  const handlePostPress = (post) => {
    // Navegar a la pantalla de detalles pasando los datos de la publicación
    navigation.navigate("Post", { post });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.feedTitle}>Publicaciones</Text>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  feedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  postContainer: {
    marginBottom: 20,
    border: "solid",
    borderRadius: 30,
    borderColor: "#119050",
    borderWidth: 3,
    padding: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 8,
  },
  caption: {
    fontSize: 18,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
});

export default Feed;
