import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { X, Camera, User as UserIcon, Mail, MapPin } from "lucide-react-native";
import { useUser } from "@/contexts/user-context";
import Colors from "@/constants/colors";

export default function SettingsScreen() {
    const router = useRouter();
    const { preferences, updateUserName, updateProfilePhoto, updateUserEmail, updateUserAddress } = useUser();
    const [userName, setUserName] = useState(preferences.userName);
    const [userEmail, setUserEmail] = useState(preferences.userEmail || "");
    const [userAddress, setUserAddress] = useState(preferences.userAddress || "");
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permissão necessária",
                "Precisamos de acesso à galeria para atualizar a foto de perfil"
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images" as ImagePicker.MediaType,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            updateProfilePhoto(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        if (Platform.OS === "web") {
            pickImage();
            return;
        }

        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permissão necessária",
                "Precisamos de acesso à câmara para tirar uma foto"
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            updateProfilePhoto(result.assets[0].uri);
        }
    };

    const removePhoto = () => {
        Alert.alert(
            "Remover foto",
            "Tens a certeza que queres remover a tua foto de perfil?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => updateProfilePhoto(undefined),
                },
            ]
        );
    };

    const handleSaveName = () => {
        if (userName.trim()) {
            updateUserName(userName.trim());
            setIsEditing(false);
        } else {
            Alert.alert("Erro", "O nome não pode estar vazio");
        }
    };

    const handleSaveEmail = () => {
        if (userEmail.trim()) {
            // Validação básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(userEmail.trim())) {
                updateUserEmail(userEmail.trim());
                setIsEditingEmail(false);
            } else {
                Alert.alert("Erro", "Por favor insere um email válido");
            }
        } else {
            Alert.alert("Erro", "O email não pode estar vazio");
        }
    };

    const handleSaveAddress = () => {
        if (userAddress.trim()) {
            updateUserAddress(userAddress.trim());
            setIsEditingAddress(false);
        } else {
            Alert.alert("Erro", "A morada não pode estar vazia");
        }
    };

    const handlePhotoOptions = () => {
        Alert.alert(
            "Foto de perfil",
            "Escolhe uma opção",
            [
                {
                    text: "Tirar foto",
                    onPress: takePhoto,
                },
                {
                    text: "Escolher da galeria",
                    onPress: pickImage,
                },
                preferences.profilePhotoUri && {
                    text: "Remover foto",
                    style: "destructive",
                    onPress: removePhoto,
                },
                {
                    text: "Cancelar",
                    style: "cancel",
                },
            ].filter(Boolean) as any
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => router.back()}
                    >
                        <X size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Definições</Text>
                    <View style={styles.closeButton} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Foto de Perfil</Text>
                        <TouchableOpacity
                            style={styles.photoContainer}
                            onPress={handlePhotoOptions}
                        >
                            {preferences.profilePhotoUri ? (
                                <Image
                                    source={{ uri: preferences.profilePhotoUri }}
                                    style={styles.profilePhoto}
                                    contentFit="cover"
                                />
                            ) : (
                                <View style={styles.photoPlaceholder}>
                                    <UserIcon size={48} color={Colors.light.primary} />
                                </View>
                            )}
                            <View style={styles.cameraIconContainer}>
                                <Camera size={20} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.photoHint}>
                            Toca para alterar a tua foto de perfil
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Nome de Utilizador</Text>
                        {isEditing ? (
                            <View style={styles.nameEditContainer}>
                                <TextInput
                                    style={styles.nameInput}
                                    value={userName}
                                    onChangeText={setUserName}
                                    placeholder="Nome de utilizador"
                                    placeholderTextColor={Colors.light.textSecondary}
                                    autoFocus
                                />
                                <View style={styles.nameEditButtons}>
                                    <TouchableOpacity
                                        style={[styles.nameButton, styles.cancelButton]}
                                        onPress={() => {
                                            setUserName(preferences.userName);
                                            setIsEditing(false);
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.nameButton, styles.saveButton]}
                                        onPress={handleSaveName}
                                    >
                                        <Text style={styles.saveButtonText}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.nameDisplayContainer}
                                onPress={() => setIsEditing(true)}
                            >
                                <Text style={styles.nameDisplay}>{preferences.userName}</Text>
                                <Text style={styles.nameHint}>Toca para editar</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Email</Text>
                        {isEditingEmail ? (
                            <View style={styles.editContainer}>
                                <TextInput
                                    style={styles.nameInput}
                                    value={userEmail}
                                    onChangeText={setUserEmail}
                                    placeholder="utilizador@iul-iscte.pt"
                                    placeholderTextColor={Colors.light.textSecondary}
                                    autoFocus
                                    keyboardType="email-address"
                                />
                                <View style={styles.editButtons}>
                                    <TouchableOpacity
                                        style={[styles.editButton, styles.cancelButton]}
                                        onPress={() => {
                                            setUserEmail(preferences.userEmail || "");
                                            setIsEditingEmail(false);
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.editButton, styles.saveButton]}
                                        onPress={handleSaveEmail}
                                    >
                                        <Text style={styles.saveButtonText}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.infoDisplayContainer}
                                onPress={() => setIsEditingEmail(true)}
                            >
                                <View style={styles.infoWithIcon}>
                                    <Mail size={20} color={Colors.light.textSecondary} style={styles.infoIcon} />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoDisplay}>
                                            {preferences.userEmail || "Adicionar email"}
                                        </Text>
                                        <Text style={styles.infoHint}>Toca para editar</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Morada</Text>
                        {isEditingAddress ? (
                            <View style={styles.editContainer}>
                                <TextInput
                                    style={styles.nameInput}
                                    value={userAddress}
                                    onChangeText={setUserAddress}
                                    placeholder="Ex: Rua Exemplo, 123, Lisboa"
                                    placeholderTextColor={Colors.light.textSecondary}
                                    autoFocus

                                />
                                <View style={styles.editButtons}>
                                    <TouchableOpacity
                                        style={[styles.editButton, styles.cancelButton]}
                                        onPress={() => {
                                            setUserAddress(preferences.userAddress || "");
                                            setIsEditingAddress(false);
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.editButton, styles.saveButton]}
                                        onPress={handleSaveAddress}
                                    >
                                        <Text style={styles.saveButtonText}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.infoDisplayContainer}
                                onPress={() => setIsEditingAddress(true)}
                            >
                                <View style={styles.infoWithIcon}>
                                    <MapPin size={20} color={Colors.light.textSecondary} style={styles.infoIcon} />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoDisplay}>
                                            {preferences.userAddress || "Adicionar morada"}
                                        </Text>
                                        <Text style={styles.infoHint}>Toca para editar</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoText}>
                            📝 As tuas informações são guardadas localmente no dispositivo e
                            nunca são partilhadas.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700" as const,
        color: Colors.light.text,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700" as const,
        color: Colors.light.text,
        marginBottom: 16,
    },
    photoContainer: {
        alignSelf: "center",
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 8,
        position: "relative",
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.light.backgroundSecondary,
    },
    photoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.light.primaryLight,
        alignItems: "center",
        justifyContent: "center",
    },
    cameraIconContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: Colors.light.background,
    },
    photoHint: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        textAlign: "center",
    },
    nameEditContainer: {
        gap: 12,
    },
    nameInput: {
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Colors.light.text,
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    nameEditButtons: {
        flexDirection: "row",
        gap: 12,
    },
    nameButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    editContainer: {
        gap: 12,
    },
    inputWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    textInput: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: Colors.light.text,
    },
    inputIcon: {
        marginRight: 12,
    },
    editButtons: {
        flexDirection: "row",
        gap: 12,
    },
    editButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: Colors.light.card,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    saveButton: {
        backgroundColor: Colors.light.primary,
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: "600" as const,
        color: Colors.light.text,
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: "600" as const,
        color: "#FFF",
    },
    nameDisplayContainer: {
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
    },
    infoDisplayContainer: {
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
    },
    nameDisplay: {
        fontSize: 16,
        fontWeight: "600" as const,
        color: Colors.light.text,
        marginBottom: 4,
    },
    nameHint: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    infoWithIcon: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    infoIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoDisplay: {
        fontSize: 16,
        fontWeight: "600" as const,
        color: Colors.light.text,
        marginBottom: 4,
    },
    infoHint: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    infoCard: {
        backgroundColor: Colors.light.primaryLight,
        borderRadius: 16,
        padding: 20,
        marginTop: 5,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        color: Colors.light.primaryDark,
        textAlign: "center",
    },
});