import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { View, Text, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="flex-row items-center mb-6">
            <Text className="text-primary text-4xl font-bold">Prompt</Text>
            <Text className="text-secondary text-4xl font-bold">Pal</Text>
          </View>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text className="text-onSurfaceVariant text-base mt-4 text-center">
            Setting up your experience...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  )
}