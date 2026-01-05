import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getKajabiProducts, KajabiProduct } from "@/lib/kajabi-client";
import { Image } from "expo-image";
import * as Linking from "expo-linking";

const CoursesScreen = () => {
  const [products, setProducts] = useState<KajabiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getKajabiProducts();
        if (!mounted) return;
        setProducts(res || []);
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
    <View style={styles.productCard}>
      <View style={styles.productRow}>
        {item.thumbnail_url ? (
          <Image
            source={item.thumbnail_url}
            style={styles.thumbnail}
            contentFit="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text numberOfLines={3} style={styles.productDesc}>
            {item.description}
          </Text>
        </View>
        {item.product_type_name && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.product_type_name}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => item.url && Linking.openURL(item.url)}
        style={styles.openBtn}
        activeOpacity={0.8}
      >
        <Text style={styles.openBtnText}>Open on Storefront</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9DAFFB" />
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  productRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  thumbnail: {
    width: 90,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#EEE",
  },
  thumbnailPlaceholder: {
    width: 90,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#EEE",
  },
  productTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  productDesc: { fontSize: 14, color: "#444", marginBottom: 10 },
  openBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#5A7CFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  openBtnText: { color: "#FFF", fontWeight: "700" },
  typeBadge: {
    backgroundColor: "#F3F6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  typeBadgeText: { color: "#5A7CFF", fontWeight: "700", fontSize: 12 },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default CoursesScreen;
