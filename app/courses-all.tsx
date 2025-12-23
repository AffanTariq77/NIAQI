import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getKajabiProducts, KajabiProduct } from "@/lib/kajabi-client";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { Image } from "expo-image";

const CoursesAllScreen = () => {
  const [products, setProducts] = useState<KajabiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getKajabiProducts();
        if (mounted) setProducts(res || []);
      } catch (e) {
        console.warn("Failed to load Kajabi products", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const renderItem = ({ item }: { item: KajabiProduct }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {item.thumbnail_url ? (
          <Image
            source={item.thumbnail_url}
            style={{ width: 80, height: 56, borderRadius: 8 }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              width: 80,
              height: 56,
              borderRadius: 8,
              backgroundColor: "#EEE",
            }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.description}>
            {item.description || ""}
          </Text>
        </View>
        {item.product_type_name && (
          <View
            style={{
              backgroundColor: "#F3F6FF",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#5A7CFF", fontWeight: "700", fontSize: 12 }}>
              {item.product_type_name}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            const u = item.url || "";
            if (u) Linking.openURL(u);
          }}
          style={styles.link}
          activeOpacity={0.8}
        >
          <Text style={styles.linkText}>Open on Storefront</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Courses & Products</Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#5A7CFF" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: { fontSize: 16, fontWeight: "600" },
  description: { fontSize: 14, color: "#444", marginBottom: 8 },
  actions: { flexDirection: "row", justifyContent: "flex-end" },
  link: { paddingVertical: 6, paddingHorizontal: 10 },
  linkText: { color: "#5A7CFF", fontWeight: "600" },
});

export default CoursesAllScreen;
