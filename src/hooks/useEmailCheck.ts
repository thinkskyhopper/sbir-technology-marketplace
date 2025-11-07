import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string>('');

  const checkEmail = useCallback(async (email: string) => {
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailExists(null);
      return;
    }

    // Don't check the same email twice
    if (email === lastCheckedEmail && emailExists !== null) {
      return;
    }

    setIsChecking(true);
    setLastCheckedEmail(email);

    try {
      const { data, error } = await supabase.functions.invoke('check-email-exists', {
        body: { email }
      });

      if (error) {
        console.error('Error checking email:', error);
        setEmailExists(null);
      } else {
        setEmailExists(data?.exists ?? null);
      }
    } catch (err) {
      console.error('Failed to check email:', err);
      setEmailExists(null);
    } finally {
      setIsChecking(false);
    }
  }, [emailExists, lastCheckedEmail]);

  const resetCheck = useCallback(() => {
    setEmailExists(null);
    setLastCheckedEmail('');
  }, []);

  return {
    checkEmail,
    isChecking,
    emailExists,
    resetCheck,
  };
};
