import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { ClerkProviderWrapper } from '../lib/clerk';

export default function RootLayout() {
  return (
    <ClerkProviderWrapper>
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Level Select' }} />
          <Stack.Screen name="game/[id]" options={{ title: 'Game' }} />
        </Stack>
      </SignedIn>
      <SignedOut>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="auth/sign-up" options={{ headerShown: false }} />
        </Stack>
      </SignedOut>
      <StatusBar style="light" />
    </ClerkProviderWrapper>
  );
}
