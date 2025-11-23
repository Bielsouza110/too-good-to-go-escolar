import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";
import { Zap, TrendingUp } from "lucide-react-native";
import { Stack } from "expo-router";
import MealCard from "@/components/meal-card";
import { MOCK_MEALS } from "@/mocks/meals";
import { useUser } from "@/contexts/user-context";
import Colors from "@/constants/colors";


export default function HomeScreen() {
  const { impact } = useUser();

  const expressMeals = useMemo(
    () => MOCK_MEALS.filter((meal) => meal.isExpress),
    []
  );

  const regularMeals = useMemo(
    () => MOCK_MEALS.filter((meal) => !meal.isExpress).slice(0, 6),
    []
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Início",
          headerLargeTitle: true,
          headerLeft: () => (
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: 32, height: 32, borderRadius: 8, marginLeft: 12, marginRight: 4, marginBottom: 4 }}
            />
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.subtitle}>Descobre refeições deliciosas e salva o planeta</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{impact.mealsSaved}</Text>
            <Text style={styles.statLabel}>Refeições Salvas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{impact.co2Saved.toFixed(1)} kg</Text>
            <Text style={styles.statLabel}>CO₂ Evitado</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{impact.mealsDonated}</Text>
            <Text style={styles.statLabel}>Doações</Text>
          </View>
        </View>

        {expressMeals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.expressIconContainer}>
                  <Zap size={20} color="#FFF" fill="#FFF" />
                </View>
                <Text style={styles.sectionTitle}>Modo Express</Text>
              </View>
              <Text style={styles.sectionSubtitle}>Disponível agora! ⚡</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {expressMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <TrendingUp size={20} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Refeições Disponíveis</Text>
            </View>
          </View>

          <View style={styles.gridContainer}>
            {regularMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} isLarge />
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingBottom: 20,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.primaryLight,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.light.primaryDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.primaryDark,
    textAlign: "center",
    fontWeight: "600" as const,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.primary,
    marginHorizontal: 12,
    opacity: 0.3,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  expressIconContainer: {
    backgroundColor: Colors.light.urgent,
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.light.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 40,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  gridContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  bottomPadding: {
    height: 20,
  },
});
