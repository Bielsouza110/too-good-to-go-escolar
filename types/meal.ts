export type DietaryPreference = 
  | "vegetarian" 
  | "vegan" 
  | "gluten-free" 
  | "lactose-free"
  | "halal"
  | "kosher";

export type MealType = "lunch" | "dinner" | "breakfast" | "snack";

// Adiciona uma interface separada para Restaurant
export interface Restaurant {
  id: string;
  name: string;
  type: "school" | "restaurant" | "institution";
  address: string;
  distance: number;
  coordinates: {  // ← ADICIONA ESTA PROPRIEDADE
    latitude: number;
    longitude: number;
  };
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  restaurant: Restaurant; // ← MUDA para usar a interface Restaurant
  originalPrice: number;
  discountedPrice: number;
  availableQuantity: number;
  pickupTime: {
    start: string;
    end: string;
  };
  dietaryInfo: DietaryPreference[];
  mealType: MealType;
  isExpress: boolean;
  expressExpiresAt?: string;
  carbonSaved: number;
  isFavorite?: boolean;
}

export interface ImpactStats {
  mealsSaved: number;
  co2Saved: number;
  moneySaved: number;
  mealsDonated: number;
  currentStreak: number;
}

export interface UserPreferences {
  dietaryPreferences: DietaryPreference[];
  maxDistance: number;
  favoriteRestaurants: string[];
  userName: string;
  profilePhotoUri?: string;
  userEmail?: string;
  userAddress?: string;
}