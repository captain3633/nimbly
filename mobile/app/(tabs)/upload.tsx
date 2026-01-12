import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import TopBar from '@/components/TopBar';
import { useCallback } from 'react';

export default function UploadScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { colors } = useTheme();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      // Reset animation values
      slideAnim.setValue(30);
      fadeAnim.setValue(0);

      // Start animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  const takePicture = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    if (!galleryPermission?.granted) {
      const result = await requestGalleryPermission();
      if (!result.granted) {
        Alert.alert('Permission needed', 'Gallery permission is required to select photos');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadReceipt = async () => {
    if (!imageUri || !token) return;

    setUploading(true);

    try {
      await api.receipts.upload(imageUri, token);
      Alert.alert(
        'Success',
        'Receipt uploaded successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setImageUri(null);
              router.push('/(tabs)');
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Upload failed', err.message || 'Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
      paddingBottom: 120,
      justifyContent: 'center',
    },
    buttonContainer: {
      gap: 16,
    },
    button: {
      backgroundColor: colors.sage,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonSecondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    buttonTextSecondary: {
      color: colors.text.primary,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    previewContainer: {
      flex: 1,
      marginBottom: 24,
    },
    preview: {
      flex: 1,
      borderRadius: 12,
      overflow: 'hidden',
    },
    previewActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    previewButton: {
      flex: 1,
    },
  });

  if (imageUri) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          </View>
          <View style={styles.previewActions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary, styles.previewButton]}
              onPress={() => setImageUri(null)}
              disabled={uploading}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.previewButton, uploading && styles.buttonDisabled]}
              onPress={uploadReceipt}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Upload</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Upload" />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 24 }}>📸</Text>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 24 }}>🖼️</Text>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
