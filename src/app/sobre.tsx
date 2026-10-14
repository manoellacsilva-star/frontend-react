import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
export default function sobre() {
  return (
    <View style={styles.container}>
      <Text>contae App</Text>
      <Link href="/" style={styles.button}>
        inicio
        
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#396090"
  },
  button: {
    fontSize: 20,
    textDecorationLine: "none",
    color: "#fff",
  }

});
