import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image
} from "react-native";

import { Search as SearchIcon, Filter, X } from "lucide-react-native";
import { Stack } from "expo-router";
import MealCard from "@/components/meal-card";
import { MOCK_MEALS } from "@/mocks/meals";
import { useUser } from "@/contexts/user-context";
import { DietaryPreference } from "@/types/meal";
import Colors from "@/constants/colors";

const DIETARY_OPTIONS: { key: DietaryPreference; label: string }[] = [
    { key: "vegetarian", label: "Vegetariano" },
    { key: "vegan", label: "Vegan" },
    { key: "gluten-free", label: "Sem Glúten" },
    { key: "lactose-free", label: "Sem Lactose" },
    { key: "halal", label: "Halal" },
    { key: "kosher", label: "Kosher" },
];

export default function SearchScreen() {
    const { preferences, toggleDietaryPreference } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filteredMeals = useMemo(() => {
        return MOCK_MEALS.filter((meal) => {
            const matchesSearch =
                searchQuery === "" ||
                meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meal.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDietary =
                preferences.dietaryPreferences.length === 0 ||
                preferences.dietaryPreferences.some((pref) =>
                    meal.dietaryInfo.includes(pref)
                );

            return matchesSearch && matchesDietary;
        });
    }, [searchQuery, preferences.dietaryPreferences]);

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Procurar",
                    headerLargeTitle: true,
                    headerLeft: () => (
                        <Image
                            source={require('../../assets/images/icon.png')}
                            style={{ width: 32, height: 32, borderRadius: 8, marginLeft: 12, marginRight: 4, marginBottom: 4 }}
                        />
                    ),
                }}
            />

            <View style={styles.container}>
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <SearchIcon size={20} color={Colors.light.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Procurar refeições ou restaurantes..."
                            placeholderTextColor={Colors.light.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery !== "" && (
                            <TouchableOpacity onPress={() => setSearchQuery("")}>
                                <X size={20} color={Colors.light.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            preferences.dietaryPreferences.length > 0 && styles.filterButtonActive,
                        ]}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Filter
                            size={20}
                            color={
                                preferences.dietaryPreferences.length > 0
                                    ? Colors.light.primary
                                    : Colors.light.textSecondary
                            }
                        />
                        {preferences.dietaryPreferences.length > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>
                                    {preferences.dietaryPreferences.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {showFilters && (
                    <View style={styles.filtersContainer}>
                        <Text style={styles.filtersTitle}>Preferências Alimentares</Text>
                        <View style={styles.filtersGrid}>
                            {DIETARY_OPTIONS.map((option) => {
                                const isSelected = preferences.dietaryPreferences.includes(
                                    option.key
                                );
                                return (
                                    <TouchableOpacity
                                        key={option.key}
                                        style={[
                                            styles.filterChip,
                                            isSelected && styles.filterChipSelected,
                                        ]}
                                        onPress={() => toggleDietaryPreference(option.key)}
                                    >
                                        <Text
                                            style={[
                                                styles.filterChipText,
                                                isSelected && styles.filterChipTextSelected,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                <ScrollView
                    style={styles.resultsContainer}
                    contentContainerStyle={styles.resultsContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.resultsCount}>
                        {filteredMeals.length} refeições encontradas
                    </Text>

                    <View style={styles.mealsGrid}>
                        {filteredMeals.map((meal) => (
                            <MealCard key={meal.id} meal={meal} isLarge />
                        ))}
                    </View>

                    {filteredMeals.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateTitle}>
                                Nenhuma refeição encontrada
                            </Text>
                            <Text style={styles.emptyStateText}>
                                Tenta ajustar os filtros ou a pesquisa
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    searchSection: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light.backgroundSecondary,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.light.text,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.light.backgroundSecondary,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    filterButtonActive: {
        backgroundColor: Colors.light.primaryLight,
    },
    filterBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: Colors.light.primary,
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    filterBadgeText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "700" as const,
    },
    filtersContainer: {
        backgroundColor: Colors.light.backgroundSecondary,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    filtersTitle: {
        fontSize: 14,
        fontWeight: "700" as const,
        color: Colors.light.text,
        marginBottom: 12,
    },
    filtersGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    filterChipSelected: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: "600" as const,
        color: Colors.light.text,
    },
    filterChipTextSelected: {
        color: "#FFF",
    },
    resultsContainer: {
        flex: 1,
    },
    resultsContent: {
        padding: 16,
    },
    resultsCount: {
        fontSize: 14,
        fontWeight: "600" as const,
        color: Colors.light.textSecondary,
        marginBottom: 16,
    },
    mealsGrid: {
        gap: 16,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: "700" as const,
        color: Colors.light.text,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textAlign: "center",
    },
});
