import { useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseFormPersistenceOptions {
  storageKey: string;
  form: UseFormReturn<any>;
  enabled?: boolean;
}

export const useFormPersistence = ({ 
  storageKey, 
  form, 
  enabled = true 
}: UseFormPersistenceOptions) => {
  
  // Save form data to localStorage
  const saveFormData = useCallback(() => {
    if (!enabled) return;
    
    try {
      const formData = form.getValues();
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  }, [storageKey, form, enabled]);

  // Load form data from localStorage
  const loadFormData = useCallback(() => {
    if (!enabled) return;
    
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        return true;
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error);
    }
    return false;
  }, [storageKey, form, enabled]);

  // Clear saved form data
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear form data from localStorage:', error);
    }
  }, [storageKey]);

  // Auto-save form data when it changes
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch(() => {
      saveFormData();
    });

    return () => subscription.unsubscribe();
  }, [form, saveFormData, enabled]);

  return {
    saveFormData,
    loadFormData,
    clearFormData
  };
};