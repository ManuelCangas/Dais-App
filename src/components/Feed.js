import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.API_URL;

const Feed = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/post/`);
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (text) => {
    setFilter(text);
    filterPosts(text);
  };

  const filterPosts = (text) => {
    const filtered = posts.filter(
      (post) =>
        post.titulo.toLowerCase().includes(text.toLowerCase()) ||
        post.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePostPress(item)}>
      <View style={styles.postContainer}>
        <Text style={styles.username}>{item.titulo}</Text>
        {item.rutaImg && (
          <Image
            source={{
              uri: `${apiUrl}/Imagenes/${item.rutaImg}`,
            }} // Reemplaza con tu dirección IP local
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
      <TextInput
        style={styles.filterInput}
        placeholder='Filtrar '
        value={filter}
        onChangeText={handleFilterChange}
      />
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={filter ? filteredPosts : posts}
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
    backgroundColor: "#cbe4dd",
  },
  feedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#257d7f",
  },
  filterInput: {
    height: 40,
    borderColor: "#257d7f",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 8,
  },
  postContainer: {
    marginBottom: 20,
    border: "solid",
    borderRadius: 30,
    borderColor: "#257d7f",
    backgroundColor: "white",
    borderWidth: 2,
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
