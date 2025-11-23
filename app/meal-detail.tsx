import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Clock,
  MapPin,
  Leaf,
  Heart,
  Store,
  AlertCircle,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { MOCK_MEALS } from "@/mocks/meals";
import { useUser } from "@/contexts/user-context";
import Colors from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function MealDetailScreen() {
  const { mealId } = useLocalSearchParams();
  const router = useRouter();
  const { recordMealSaved, recordMealDonated } = useUser();

  const [includeSolidarity, setIncludeSolidarity] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  const meal = useMemo(
    () => MOCK_MEALS.find((m) => m.id === mealId),
    [mealId]
  );

  if (!meal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Refeição não encontrada</Text>
      </View>
    );
  }

  const handleReserve = async () => {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setIsReserving(true);

    setTimeout(() => {
      const saved = meal.originalPrice - meal.discountedPrice;
      recordMealSaved(meal.carbonSaved, saved);

      if (includeSolidarity) {
        recordMealDonated();
      }

      setIsReserving(false);
      router.back();
    }, 1500);
  };

  const openMaps = async () => {
    const { name, address, coordinates } = meal.restaurant;
    const { latitude, longitude } = coordinates;

    // URLs para diferentes aplicações de mapas
    const urls = {
      google: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`,
      apple: `maps://?ll=${latitude},${longitude}&q=${encodeURIComponent(name)}`,
      waze: `waze://?ll=${latitude},${longitude}&navigate=yes`,
      googleMapsApp: `comgooglemaps://?q=${latitude},${longitude}&center=${latitude},${longitude}&zoom=15`
    };

    try {
      // Primeiro tenta abrir Google Maps app
      const googleMapsSupported = await Linking.canOpenURL(urls.googleMapsApp);
      if (googleMapsSupported) {
        await Linking.openURL(urls.googleMapsApp);
        return;
      }

      // Se não, tenta Google Maps web
      const googleWebSupported = await Linking.canOpenURL(urls.google);
      if (googleWebSupported) {
        await Linking.openURL(urls.google);
        return;
      }

      // Se não, tenta Apple Maps
      const appleSupported = await Linking.canOpenURL(urls.apple);
      if (appleSupported) {
        await Linking.openURL(urls.apple);
        return;
      }

      // Se nada funcionar, mostra alerta
      Alert.alert(
        "Aplicação de Mapas Não Encontrada",
        "Instala o Google Maps ou Apple Maps para usar esta funcionalidade.",
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error('Erro ao abrir maps:', error);
      Alert.alert("Erro", "Não foi possível abrir o mapa");
    }
  };

  const totalPrice = includeSolidarity
    ? meal.discountedPrice + 2.0
    : meal.discountedPrice;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: meal.imageUrl }}
          style={styles.headerImage}
          contentFit="cover"
        />

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.headerTop}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{meal.name}</Text>
                {meal.isExpress && (
                  <View style={styles.expressBadge}>
                    <Text style={styles.expressBadgeText}>EXPRESS</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.description}>{meal.description}</Text>
          </View>

          <TouchableOpacity style={styles.restaurantCard} onPress={openMaps}>
            <View style={styles.restaurantIconContainer}>
              <Store size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{meal.restaurant.name}</Text>
              <View style={styles.restaurantMeta}>
                <MapPin size={14} color={Colors.light.textSecondary} />
                <Text style={styles.restaurantAddress}>
                  {meal.restaurant.address} · {meal.restaurant.distance} km
                </Text>
              </View>
              <Text style={styles.tapToOpenMaps}>Toca para abrir no mapa</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Informações</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Clock size={20} color={Colors.light.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Horário de Recolha</Text>
                  <Text style={styles.infoValue}>
                    {meal.pickupTime.start} - {meal.pickupTime.end}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Leaf size={20} color={Colors.light.success} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Impacto Ambiental</Text>
                  <Text style={styles.infoValue}>
                    {meal.carbonSaved} kg CO₂ evitado
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <AlertCircle size={20} color={Colors.light.warning} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Disponibilidade</Text>
                  <Text style={styles.infoValue}>
                    {meal.availableQuantity} refeições disponíveis
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {meal.dietaryInfo.length > 0 && (
            <View style={styles.dietarySection}>
              <Text style={styles.infoTitle}>Informação Dietética</Text>
              <View style={styles.tagsContainer}>
                {meal.dietaryInfo.map((tag) => (
                  <View key={tag} style={styles.dietaryTag}>
                    <Text style={styles.dietaryTagText}>
                      {getDietaryLabel(tag)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.solidaritySection}>
            <TouchableOpacity
              style={[
                styles.solidarityCard,
                includeSolidarity && styles.solidarityCardActive,
              ]}
              onPress={() => setIncludeSolidarity(!includeSolidarity)}
              activeOpacity={0.7}
            >
              <View style={styles.solidarityHeader}>
                <View style={styles.solidarityIconContainer}>
                  <Heart
                    size={24}
                    color={
                      includeSolidarity ? "#FFF" : Colors.light.solidarity
                    }
                    fill={
                      includeSolidarity ? "#FFF" : "transparent"
                    }
                  />
                </View>
                <View style={styles.solidarityContent}>
                  <Text
                    style={[
                      styles.solidarityTitle,
                      includeSolidarity && styles.solidarityTitleActive,
                    ]}
                  >
                    Modo Solidário
                  </Text>
                  <Text
                    style={[
                      styles.solidarityDescription,
                      includeSolidarity && styles.solidarityDescriptionActive,
                    ]}
                  >
                    Adiciona €2.00 e doa uma refeição a quem precisa
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceSection}>
          <View>
            <Text style={styles.priceLabel}>Total</Text>
            <View style={styles.priceRow}>
              <Text style={styles.originalPrice}>
                €{meal.originalPrice.toFixed(2)}
              </Text>
              <Text style={styles.finalPrice}>€{totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.reserveButton, isReserving && styles.reserveButtonLoading]}
          onPress={handleReserve}
          disabled={isReserving}
        >
          <Text style={styles.reserveButtonText}>
            {isReserving ? "A Reservar..." : "Reservar Agora"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getDietaryLabel(pref: string): string {
  const labels: Record<string, string> = {
    vegetarian: "Vegetariano",
    vegan: "Vegan",
    "gluten-free": "Sem Glúten",
    "lactose-free": "Sem Lactose",
    halal: "Halal",
    kosher: "Kosher",
  };
  return labels[pref] || pref;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  content: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 20,
  },
  headerTop: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.light.text,
    flex: 1,
  },
  expressBadge: {
    backgroundColor: Colors.light.urgent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  expressBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800" as const,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.textSecondary,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    gap: 12,
  },
  restaurantIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.primaryDark,
    marginBottom: 4,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  restaurantAddress: {
    fontSize: 13,
    color: Colors.light.primaryDark,
    opacity: 0.8,
  },
  tapToOpenMaps: {
    fontSize: 11,
    color: Colors.light.primary,
    fontWeight: "600" as const,
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
  },
  dietarySection: {
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dietaryTag: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dietaryTagText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.primaryDark,
  },
  solidaritySection: {
    marginBottom: 20,
  },
  solidarityCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.solidarity,
  },
  solidarityCardActive: {
    backgroundColor: Colors.light.solidarity,
    borderColor: Colors.light.solidarity,
  },
  solidarityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  solidarityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  solidarityContent: {
    flex: 1,
  },
  solidarityTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  solidarityTitleActive: {
    color: "#FFF",
  },
  solidarityDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  solidarityDescriptionActive: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceSection: {
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    textDecorationLine: "line-through",
  },
  finalPrice: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.light.primary,
  },
  reserveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  reserveButtonLoading: {
    opacity: 0.7,
  },
  reserveButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFF",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
});
