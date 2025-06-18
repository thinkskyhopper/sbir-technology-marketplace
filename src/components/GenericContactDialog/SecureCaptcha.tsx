
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Shield } from "lucide-react";

interface SecureCaptchaProps {
  onVerificationChange: (isVerified: boolean) => void;
}

interface CaptchaChallenge {
  question: string;
  answer: number;
  type: 'math' | 'sequence' | 'logic';
}

const SecureCaptcha = ({ onVerificationChange }: SecureCaptchaProps) => {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [interactionPattern, setInteractionPattern] = useState<number[]>([]);

  // Generate complex challenges
  const generateChallenge = (): CaptchaChallenge => {
    const challengeTypes = ['math', 'sequence', 'logic'] as const;
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    
    switch (type) {
      case 'math':
        return generateMathChallenge();
      case 'sequence':
        return generateSequenceChallenge();
      case 'logic':
        return generateLogicChallenge();
      default:
        return generateMathChallenge();
    }
  };

  const generateMathChallenge = (): CaptchaChallenge => {
    const operations = [
      () => {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 8) + 1;
        return {
          question: `What is ${a} + ${b} × ${c}?`,
          answer: a + (b * c)
        };
      },
      () => {
        const a = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * 5) + 2;
        return {
          question: `What is ${a} - ${b} squared?`,
          answer: a - (b * b)
        };
      },
      () => {
        const base = Math.floor(Math.random() * 8) + 2;
        const exp = Math.floor(Math.random() * 3) + 2;
        return {
          question: `What is ${base} to the power of ${exp}?`,
          answer: Math.pow(base, exp)
        };
      }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)]();
    return {
      question: operation.question,
      answer: operation.answer,
      type: 'math'
    };
  };

  const generateSequenceChallenge = (): CaptchaChallenge => {
    const sequences = [
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const diff = Math.floor(Math.random() * 5) + 2;
        const seq = [start, start + diff, start + 2*diff, start + 3*diff];
        return {
          question: `Complete the sequence: ${seq.join(', ')}, ?`,
          answer: start + 4*diff
        };
      },
      () => {
        const fib = [1, 1, 2, 3, 5, 8, 13, 21];
        const startIndex = Math.floor(Math.random() * 4);
        const seq = fib.slice(startIndex, startIndex + 4);
        return {
          question: `What's the next Fibonacci number: ${seq.join(', ')}, ?`,
          answer: fib[startIndex + 4]
        };
      }
    ];
    
    const sequence = sequences[Math.floor(Math.random() * sequences.length)]();
    return {
      question: sequence.question,
      answer: sequence.answer,
      type: 'sequence'
    };
  };

  const generateLogicChallenge = (): CaptchaChallenge => {
    const logicQuestions = [
      {
        question: "How many letters are in the word 'CAPTCHA'?",
        answer: 7
      },
      {
        question: "What is the number of days in a week plus the number of months in a year?",
        answer: 19
      },
      {
        question: "If today is Wednesday, what day will it be in 10 days? (1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun)",
        answer: 6
      }
    ];
    
    const logic = logicQuestions[Math.floor(Math.random() * logicQuestions.length)];
    return {
      question: logic.question,
      answer: logic.answer,
      type: 'logic'
    };
  };

  // Track interaction patterns for bot detection
  const trackInteraction = () => {
    const now = Date.now();
    setInteractionPattern(prev => [...prev, now]);
  };

  // Bot detection heuristics
  const detectBotBehavior = (): boolean => {
    const timeTaken = Date.now() - startTime;
    
    // Too fast (likely bot)
    if (timeTaken < 3000) return true;
    
    // No interaction pattern recorded
    if (interactionPattern.length === 0) return true;
    
    // Pattern analysis - too regular intervals suggest bot
    if (interactionPattern.length > 2) {
      const intervals = [];
      for (let i = 1; i < interactionPattern.length; i++) {
        intervals.push(interactionPattern[i] - interactionPattern[i-1]);
      }
      
      // Check if intervals are too similar (bot-like behavior)
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((acc, interval) => acc + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
      
      if (variance < 100) return true; // Too consistent
    }
    
    return false;
  };

  const verifyAnswer = () => {
    if (!challenge) return;
    
    const answer = parseInt(userAnswer);
    const isCorrect = answer === challenge.answer;
    const isBotBehavior = detectBotBehavior();
    
    if (isCorrect && !isBotBehavior) {
      setIsVerified(true);
      onVerificationChange(true);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        // Reset after 3 failed attempts
        refreshChallenge();
        setAttempts(0);
      }
      setUserAnswer("");
      onVerificationChange(false);
    }
  };

  const refreshChallenge = () => {
    setChallenge(generateChallenge());
    setUserAnswer("");
    setIsVerified(false);
    setAttempts(0);
    setStartTime(Date.now());
    setInteractionPattern([]);
    onVerificationChange(false);
  };

  useEffect(() => {
    refreshChallenge();
  }, []);

  useEffect(() => {
    // Add a hidden honeypot field to catch bots
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autoComplete = 'off';
    
    const form = document.querySelector('form');
    if (form) {
      form.appendChild(honeypot);
    }
    
    return () => {
      if (form && honeypot.parentNode) {
        form.removeChild(honeypot);
      }
    };
  }, []);

  if (!challenge) return null;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-secondary/10">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        <Label className="font-medium">Security Verification</Label>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label className="text-sm text-muted-foreground">
            {challenge.question}
          </Label>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              trackInteraction();
            }}
            onKeyPress={(e) => {
              trackInteraction();
              if (e.key === 'Enter') {
                verifyAnswer();
              }
            }}
            placeholder="Enter your answer"
            disabled={isVerified}
            className={isVerified ? "border-green-500 bg-green-50" : ""}
          />
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refreshChallenge}
            disabled={isVerified}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        {!isVerified && userAnswer && (
          <Button
            type="button"
            size="sm"
            onClick={verifyAnswer}
            className="w-full"
          >
            Verify Answer
          </Button>
        )}
        
        {isVerified && (
          <div className="text-sm text-green-600 font-medium">
            ✓ Verification successful
          </div>
        )}
        
        {attempts > 0 && !isVerified && (
          <div className="text-sm text-yellow-600">
            Incorrect answer. {3 - attempts} attempts remaining.
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureCaptcha;
