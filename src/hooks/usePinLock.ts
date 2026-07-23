import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY_PIN_ENABLED = 'expense_tracker_pin_enabled_v1';
const STORAGE_KEY_PIN_CODE = 'expense_tracker_pin_code_v1';
const STORAGE_KEY_PIN_QUESTION = 'expense_tracker_pin_question_v1';
const STORAGE_KEY_PIN_ANSWER = 'expense_tracker_pin_answer_v1';

export interface PinState {
  pinEnabled: boolean;
  pinCode: string; // 4-digit PIN string e.g. "1234"
  securityQuestion: string;
  securityAnswer: string;
}

export function usePinLock() {
  const [pinEnabled, setPinEnabled] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_PIN_ENABLED) === 'true';
  });

  const [pinCode, setPinCode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PIN_CODE) || '';
  });

  const [securityQuestion, setSecurityQuestion] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PIN_QUESTION) || 'What was your first pet name?';
  });

  const [securityAnswer, setSecurityAnswer] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PIN_ANSWER) || '';
  });

  // App lock state - if PIN is enabled and code exists, app starts locked
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const enabled = localStorage.getItem(STORAGE_KEY_PIN_ENABLED) === 'true';
    const code = localStorage.getItem(STORAGE_KEY_PIN_CODE);
    return Boolean(enabled && code && code.length === 4);
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PIN_ENABLED, String(pinEnabled));
  }, [pinEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PIN_CODE, pinCode);
  }, [pinCode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PIN_QUESTION, securityQuestion);
  }, [securityQuestion]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PIN_ANSWER, securityAnswer);
  }, [securityAnswer]);

  // Attempt unlock with entered PIN
  const unlockApp = useCallback((inputPin: string): boolean => {
    if (inputPin === pinCode) {
      setIsLocked(false);
      return true;
    }
    return false;
  }, [pinCode]);

  // Lock app manually
  const lockApp = useCallback(() => {
    if (pinEnabled && pinCode) {
      setIsLocked(true);
    }
  }, [pinEnabled, pinCode]);

  // Enable PIN lock with code and recovery
  const enablePin = useCallback((newPin: string, question: string, answer: string) => {
    setPinCode(newPin);
    setSecurityQuestion(question);
    setSecurityAnswer(answer.trim().toLowerCase());
    setPinEnabled(true);
    setIsLocked(false);
  }, []);

  // Disable PIN lock
  const disablePin = useCallback(() => {
    setPinEnabled(false);
    setIsLocked(false);
  }, []);

  // Update existing PIN
  const changePin = useCallback((oldPin: string, newPin: string): boolean => {
    if (oldPin === pinCode) {
      setPinCode(newPin);
      return true;
    }
    return false;
  }, [pinCode]);

  // Reset PIN using security recovery answer
  const resetPinWithAnswer = useCallback((answerInput: string, newPin: string): boolean => {
    if (answerInput.trim().toLowerCase() === securityAnswer.trim().toLowerCase()) {
      setPinCode(newPin);
      setPinEnabled(true);
      setIsLocked(false);
      return true;
    }
    return false;
  }, [securityAnswer]);

  return {
    pinEnabled,
    pinCode,
    securityQuestion,
    securityAnswer,
    isLocked,
    unlockApp,
    lockApp,
    enablePin,
    disablePin,
    changePin,
    resetPinWithAnswer,
  };
}
