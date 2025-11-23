import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Leaf, Award, Flame, Car, Euro, Users } from "lucide-react-native";
import { Stack } from "expo-router";
import { useUser } from "@/contexts/user-context";
import Colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";

export default function ImpactScreen() {
  const { impact } = useUser();

  const stats = [
    {
      icon: Car,
      value: Math.round(impact.co2Saved * 20),
      label: "km evitados",
      color: Colors.light.primary,
      bgColor: Colors.light.primaryLight,
    },
    {
      icon: Euro,
      value: `${impact.moneySaved.toFixed(0)}€`,
      label: "poupados",
      color: Colors.light.solidarity,
      bgColor: "#EEF5FB",
    },
    {
      icon: Users,
      value: impact.mealsDonated,
      label: "doadas",
      color: Colors.light.urgent,
      bgColor: "#FFEBEA",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "O Teu Impacto",
          headerLargeTitle: true,
          headerLeft: () => (
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: 32, height: 32, borderRadius: 8, marginLeft: 12, marginRight: 4, marginBottom: 4}}
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
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.primaryDark]}
              style={styles.heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroIconContainer}>
                <Award size={56} color="#FFF" strokeWidth={2.5} />
              </View>
              <Text style={styles.heroValue}>{impact.mealsSaved}</Text>
              <Text style={styles.heroLabel}>Refeições Salvas</Text>
              <Text style={styles.heroDescription}>
                Parabéns! Cada refeição conta. 🌍
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
                  <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                    <IconComponent size={20} color="#FFF" strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <View style={styles.impactIconCircle}>
                <Leaf size={32} color="#FFF" strokeWidth={2.5} />
              </View>
              <View style={styles.impactHeaderText}>
                <Text style={styles.impactTitle}>Impacto Ambiental</Text>
                <Text style={styles.impactSubtitle}>CO₂ evitado</Text>
              </View>
            </View>

            <View style={styles.impactValueContainer}>
              <Text style={styles.impactMainValue}>{impact.co2Saved.toFixed(1)}</Text>
              <Text style={styles.impactUnit}>kg de CO₂</Text>
            </View>

            <View style={styles.impactDivider} />

            <View style={styles.impactEquivalent}>
              <Car size={20} color={Colors.light.primary} />
              <Text style={styles.impactEquivalentText}>
                Equivale a {Math.round(impact.co2Saved * 20)} km de carro não percorridos
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.streakCard}>
            <View style={styles.streakIconContainer}>
              <Flame size={40} color={Colors.light.warning} fill={Colors.light.warning} />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakValue}>{impact.currentStreak}</Text>
              <Text style={styles.streakLabel}>dias de sequência</Text>
              <Text style={styles.streakDescription}>
                {impact.currentStreak > 5
                  ? "Incrível! Continua assim! 🔥"
                  : "Continua a salvar refeições!"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>💚 Fazes a diferença!</Text>
            <Text style={styles.motivationText}>
              Juntos, milhares de pessoas já salvaram toneladas de comida.
              Cada ação conta para um planeta mais sustentável.
            </Text>
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
    backgroundColor: Colors.light.backgroundSecondary,
  },
  content: {
    paddingBottom: 20,
  },
  heroSection: {
    padding: 20,
    paddingTop: 12,
  },
  heroCard: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGradient: {
    padding: 40,
    alignItems: "center",
  },
  heroIconContainer: {
    marginBottom: 20,
  },
  heroValue: {
    fontSize: 72,
    fontWeight: "900" as const,
    color: "#FFF",
    marginBottom: 4,
    letterSpacing: -2,
  },
  heroLabel: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#FFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  heroDescription: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    fontWeight: "500" as const,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "900" as const,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  impactCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  impactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  impactIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  impactHeaderText: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  impactSubtitle: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.light.textSecondary,
  },
  impactValueContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  impactMainValue: {
    fontSize: 56,
    fontWeight: "900" as const,
    color: Colors.light.primary,
    letterSpacing: -2,
  },
  impactUnit: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  impactDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 16,
  },
  impactEquivalent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.light.primaryLight,
    padding: 16,
    borderRadius: 16,
  },
  impactEquivalentText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.primaryDark,
    lineHeight: 20,
  },
  streakCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  streakIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF5E6",
    alignItems: "center",
    justifyContent: "center",
  },
  streakContent: {
    flex: 1,
  },
  streakValue: {
    fontSize: 40,
    fontWeight: "900" as const,
    color: Colors.light.text,
    marginBottom: 2,
    letterSpacing: -1,
  },
  streakLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  streakDescription: {
    fontSize: 13,
    color: Colors.light.warning,
    fontWeight: "600" as const,
  },
  motivationCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: "center",
  },
  motivationText: {
    fontSize: 15,
    lineHeight: 23,
    color: Colors.light.textSecondary,
    textAlign: "center",
    fontWeight: "500" as const,
  },
  bottomPadding: {
    height: 20,
  },
});
