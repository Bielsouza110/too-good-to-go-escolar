import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { User, Settings, Heart, Award, ChevronRight } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import { useUser } from "@/contexts/user-context";
import { DietaryPreference } from "@/types/meal";
import Colors from "@/constants/colors";

const DIETARY_OPTIONS: { key: DietaryPreference; label: string; emoji: string }[] = [
    { key: "vegetarian", label: "Vegetariano", emoji: "🥬" },
    { key: "vegan", label: "Vegan", emoji: "🌱" },
    { key: "gluten-free", label: "Sem Glúten", emoji: "🌾" },
    { key: "lactose-free", label: "Sem Lactose", emoji: "🥛" },
    { key: "halal", label: "Halal", emoji: "☪️" },
    { key: "kosher", label: "Kosher", emoji: "✡️" },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { preferences, toggleDietaryPreference, impact } = useUser();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Perfil",
                    headerLargeTitle: true,
                    headerLeft: () => (
                        <Image
                            source={require('../../assets/images/icon.png')}
                            style={{ width: 32, height: 32, borderRadius: 8, marginLeft: 12, marginRight: 4, marginBottom: 4}}
                        />
                    ),
                }}
            />

            <View style={styles.profileHeader}>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={() => router.push({ pathname: "/settings" } as any)}
                >
                    {preferences.profilePhotoUri ? (
                        <Image
                            source={{ uri: preferences.profilePhotoUri }}
                            style={styles.avatarImage}
                            contentFit="cover"
                        />
                    ) : (
                        <User size={48} color={Colors.light.primary} />
                    )}
                </TouchableOpacity>
                <Text style={styles.userName}>{preferences.userName}</Text>
                <View style={styles.badgeContainer}>
                    <Award size={16} color={Colors.light.primary} />
                    <Text style={styles.badgeText}>Herói do Planeta</Text>
                </View>
            </View>

            <View style={styles.quickStatsCard}>
                <View style={styles.quickStat}>
                    <Text style={styles.quickStatValue}>{impact.mealsSaved}</Text>
                    <Text style={styles.quickStatLabel}>Refeições</Text>
                </View>
                <View style={styles.quickStatDivider} />
                <View style={styles.quickStat}>
                    <Text style={styles.quickStatValue}>{impact.currentStreak}</Text>
                    <Text style={styles.quickStatLabel}>Dias Sequência</Text>
                </View>
                <View style={styles.quickStatDivider} />
                <View style={styles.quickStat}>
                    <Text style={styles.quickStatValue}>{impact.co2Saved.toFixed(0)}</Text>
                    <Text style={styles.quickStatLabel}>kg CO₂</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferências Alimentares</Text>
                <Text style={styles.sectionDescription}>
                    Seleciona as tuas preferências para receberes recomendações personalizadas
                </Text>

                <View style={styles.preferencesGrid}>
                    {DIETARY_OPTIONS.map((option) => {
                        const isSelected = preferences.dietaryPreferences.includes(option.key);
                        return (
                            <TouchableOpacity
                                key={option.key}
                                style={[
                                    styles.preferenceCard,
                                    isSelected && styles.preferenceCardSelected,
                                ]}
                                onPress={() => toggleDietaryPreference(option.key)}
                            >
                                <Text style={styles.preferenceEmoji}>{option.emoji}</Text>
                                <Text
                                    style={[
                                        styles.preferenceLabel,
                                        isSelected && styles.preferenceLabelSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                {isSelected && (
                                    <View style={styles.checkmark}>
                                        <Text style={styles.checkmarkText}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ações</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <View style={styles.menuIconContainer}>
                            <Heart size={20} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.menuItemText}>Favoritos</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.light.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push({ pathname: "/settings" } as any)}
                >
                    <View style={styles.menuItemLeft}>
                        <View style={styles.menuIconContainer}>
                            <Settings size={20} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.menuItemText}>Definições</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.light.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                    🌍 A tua jornada contra o desperdício alimentar começou aqui.
                    Obrigado por fazeres a diferença!
                </Text>
            </View>

            <View style={styles.bottomPadding} />
        </ScrollView>
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
    profileHeader: {
        alignItems: "center",
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.light.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        overflow: "hidden",
    },
    avatarImage: {
        width: 100,
        height: 100,
    },
    userName: {
        fontSize: 24,
        fontWeight: "800" as const,
        color: Colors.light.text,
        marginBottom: 8,
    },
    badgeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: Colors.light.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600" as const,
        color: Colors.light.primary,
    },
    quickStatsCard: {
        flexDirection: "row",
        backgroundColor: Colors.light.card,
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    quickStat: {
        flex: 1,
        alignItems: "center",
    },
    quickStatValue: {
        fontSize: 24,
        fontWeight: "800" as const,
        color: Colors.light.primary,
        marginBottom: 4,
    },
    quickStatLabel: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        textAlign: "center",
        fontWeight: "600" as const,
    },
    quickStatDivider: {
        width: 1,
        backgroundColor: Colors.light.border,
        marginHorizontal: 12,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800" as const,
        color: Colors.light.text,
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginBottom: 16,
        lineHeight: 20,
    },
    preferencesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    preferenceCard: {
        width: "47%",
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.light.border,
        position: "relative",
    },
    preferenceCardSelected: {
        borderColor: Colors.light.primary,
        backgroundColor: Colors.light.primaryLight,
    },
    preferenceEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    preferenceLabel: {
        fontSize: 13,
        fontWeight: "600" as const,
        color: Colors.light.text,
        textAlign: "center",
    },
    preferenceLabelSelected: {
        color: Colors.light.primaryDark,
    },
    checkmark: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.light.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    checkmarkText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700" as const,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primaryLight,
        alignItems: "center",
        justifyContent: "center",
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: "600" as const,
        color: Colors.light.text,
    },
    infoCard: {
        marginHorizontal: 16,
        backgroundColor: Colors.light.primaryLight,
        borderRadius: 16,
        padding: 20,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        color: Colors.light.primaryDark,
        textAlign: "center",
    },
    bottomPadding: {
        height: 20,
    },
});
