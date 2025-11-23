import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { UserPreferences, ImpactStats, DietaryPreference } from "@/types/meal";

const STORAGE_KEYS = {
  PREFERENCES: "user-preferences",
  IMPACT: "user-impact",
};

const DEFAULT_PREFERENCES: UserPreferences = {
  dietaryPreferences: [],
  maxDistance: 5,
  favoriteRestaurants: [],
  userName: "Utilizador",
  profilePhotoUri: undefined,
  userEmail: "",
  userAddress: "",
};

const DEFAULT_IMPACT: ImpactStats = {
  mealsSaved: 0,
  co2Saved: 0,
  moneySaved: 0,
  mealsDonated: 0,
  currentStreak: 0,
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [impact, setImpact] = useState<ImpactStats>(DEFAULT_IMPACT);

  const preferencesQuery = useQuery({
    queryKey: ["user-preferences"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
    },
  });

  const impactQuery = useQuery({
    queryKey: ["user-impact"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.IMPACT);
      return stored ? JSON.parse(stored) : DEFAULT_IMPACT;
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: UserPreferences) => {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(newPreferences));
      return newPreferences;
    },
  });

  const updateImpactMutation = useMutation({
    mutationFn: async (newImpact: ImpactStats) => {
      await AsyncStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(newImpact));
      return newImpact;
    },
  });

  useEffect(() => {
    if (preferencesQuery.data) {
      setPreferences(preferencesQuery.data);
    }
  }, [preferencesQuery.data]);

  useEffect(() => {
    if (impactQuery.data) {
      setImpact(impactQuery.data);
    }
  }, [impactQuery.data]);

  const toggleDietaryPreference = (pref: DietaryPreference) => {
    const newPrefs = preferences.dietaryPreferences.includes(pref)
      ? preferences.dietaryPreferences.filter((p) => p !== pref)
      : [...preferences.dietaryPreferences, pref];
    
    const updated = { ...preferences, dietaryPreferences: newPrefs };
    setPreferences(updated);
    updatePreferencesMutation.mutate(updated);
  };

  const toggleFavoriteRestaurant = (restaurantId: string) => {
    const newFavorites = preferences.favoriteRestaurants.includes(restaurantId)
      ? preferences.favoriteRestaurants.filter((id) => id !== restaurantId)
      : [...preferences.favoriteRestaurants, restaurantId];
    
    const updated = { ...preferences, favoriteRestaurants: newFavorites };
    setPreferences(updated);
    updatePreferencesMutation.mutate(updated);
  };

  const recordMealSaved = (carbonSaved: number, moneySaved: number) => {
    const updated = {
      mealsSaved: impact.mealsSaved + 1,
      co2Saved: impact.co2Saved + carbonSaved,
      moneySaved: impact.moneySaved + moneySaved,
      mealsDonated: impact.mealsDonated,
      currentStreak: impact.currentStreak + 1,
    };
    setImpact(updated);
    updateImpactMutation.mutate(updated);
  };

  const recordMealDonated = () => {
    const updated = {
      ...impact,
      mealsDonated: impact.mealsDonated + 1,
    };
    setImpact(updated);
    updateImpactMutation.mutate(updated);
  };

  const updateUserName = (name: string) => {
    const updated = { ...preferences, userName: name };
    setPreferences(updated);
    updatePreferencesMutation.mutate(updated);
  };

  const updateProfilePhoto = (uri: string | undefined) => {
    const updated = { ...preferences, profilePhotoUri: uri };
    setPreferences(updated);
    updatePreferencesMutation.mutate(updated);
  };

  const updateUserEmail = (email: string) => {
    const updated = { ...preferences, userEmail: email };
    setPreferences(updated);
    updatePreferencesMutation.mutate(updated);
  };

  const updateUserAddress = (address: string) => {
    const updated = { ...preferences, userAddress: address };
    setPreferences(updated);
    updatePreferencesMutation.mutate(updated);
  };

  return {
    preferences,
    impact,
    toggleDietaryPreference,
    toggleFavoriteRestaurant,
    recordMealSaved,
    recordMealDonated,
    updateUserName,
    updateProfilePhoto,
    updateUserEmail,
    updateUserAddress,
    isLoading: preferencesQuery.isLoading || impactQuery.isLoading,
  };
});