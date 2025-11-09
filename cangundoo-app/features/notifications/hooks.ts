import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@services/notifications/pushNotifications';
import { supabase } from '@services/api/supabaseClient';
import { useAuthStore } from '@store/auth-store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useRegisterPushToken = () => {
  const { profile } = useAuthStore();

  useEffect(() => {
    if (!profile?.id) return;

    const setup = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        await supabase.from('users').update({ push_token: token }).eq('id', profile.id);
      } catch (error) {
        if (__DEV__) {
          console.warn('[Notifications]', error);
        }
      }
    };

    setup();
  }, [profile?.id]);
};
