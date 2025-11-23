import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Clock, MapPin, Leaf, Zap } from "lucide-react-native";
import { Meal } from "@/types/meal";
import Colors from "@/constants/colors";
import { useRouter } from "expo-router";

interface MealCardProps {
    meal: Meal;
    isLarge?: boolean;
}

export default function MealCard({ meal, isLarge = false }: MealCardProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (!meal.isExpress || !meal.expressExpiresAt) return;

        const updateTimer = () => {
            const now = Date.now();
            const expires = new Date(meal.expressExpiresAt!).getTime();
            const diff = expires - now;

            if (diff <= 0) {
                setTimeLeft("Expirado");
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [meal.isExpress, meal.expressExpiresAt]);

    const handlePress = () => {
        router.push({
            pathname: "/meal-detail",
            params: { mealId: meal.id },
        } as any);
    };

    const cardWidth = isLarge ? Dimensions.get("window").width - 32 : 280;

    return (
        <TouchableOpacity
            style={[styles.card, { width: cardWidth }, meal.isExpress && styles.expressCard]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {meal.isExpress && (
                <View style={styles.expressBadge}>
                    <Zap size={14} color="#FFF" fill="#FFF" />
                    <Text style={styles.expressText}>EXPRESS</Text>
                    <Text style={styles.timerText}>{timeLeft}</Text>
                </View>
            )}

            <Image source={{ uri: meal.imageUrl }} style={styles.image} contentFit="cover" />

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {meal.name}
                </Text>

                <View style={styles.restaurantRow}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                        {meal.restaurant.name}
                    </Text>
                    <View style={styles.distanceContainer}>
                        <MapPin size={12} color={Colors.light.textSecondary} />
                        <Text style={styles.distance}>{meal.restaurant.distance} km</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.timeContainer}>
                        <Clock size={14} color={Colors.light.textSecondary} />
                        <Text style={styles.timeText}>
                            {meal.pickupTime.start}-{meal.pickupTime.end}
                        </Text>
                    </View>
                    <View style={styles.carbonContainer}>
                        <Leaf size={14} color={Colors.light.success} />
                        <Text style={styles.carbonText}>{meal.carbonSaved} kg CO₂</Text>
                    </View>
                </View>

                <View style={styles.priceRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.originalPrice}>€{meal.originalPrice.toFixed(2)}</Text>
                        <Text style={styles.discountedPrice}>€{meal.discountedPrice.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.quantity}>{meal.availableQuantity} disponíveis</Text>
                </View>

                {meal.dietaryInfo.length > 0 && (
                    <View style={styles.tagsRow}>
                        {meal.dietaryInfo.slice(0, 2).map((tag) => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{getDietaryLabel(tag)}</Text>
                            </View>
                        ))}
                        {meal.dietaryInfo.length > 2 && (
                            <Text style={styles.moreText}>+{meal.dietaryInfo.length - 2}</Text>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
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
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        overflow: "hidden",
        marginRight: 16,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    expressCard: {
        borderWidth: 2,
        borderColor: Colors.light.urgent,
    },
    expressBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: Colors.light.urgent,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        zIndex: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    expressText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "800" as const,
        letterSpacing: 0.5,
    },
    timerText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "700" as const,
        marginLeft: 4,
    },
    image: {
        width: "100%",
        height: 160,
        backgroundColor: Colors.light.backgroundSecondary,
    },
    content: {
        padding: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: "700" as const,
        color: Colors.light.text,
        marginBottom: 4,
    },
    restaurantRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    restaurantName: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        flex: 1,
        marginRight: 8,
    },
    distanceContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    distance: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    timeText: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    carbonContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    carbonText: {
        fontSize: 12,
        color: Colors.light.success,
        fontWeight: "600" as const,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    originalPrice: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textDecorationLine: "line-through",
    },
    discountedPrice: {
        fontSize: 20,
        fontWeight: "800" as const,
        color: Colors.light.primary,
    },
    quantity: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    tagsRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 6,
    },
    tag: {
        backgroundColor: Colors.light.primaryLight,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    tagText: {
        fontSize: 10,
        color: Colors.light.primaryDark,
        fontWeight: "600" as const,
    },
    moreText: {
        fontSize: 10,
        color: Colors.light.textSecondary,
        fontWeight: "600" as const,
    },
});
