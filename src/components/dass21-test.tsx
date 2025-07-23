// src/components/dass21-test.tsx

"use client";

import { useState } from "react";
import { DASS21_QUESTIONS, DASS21_LABELS } from "@/lib/dass21-questions";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

type Language = "fr" | "en" | "ar";

interface Dass21TestProps {
    onComplete: (results: number[]) => void;
}

const Dass21Test: React.FC<Dass21TestProps> = ({ onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [language, setLanguage] = useState<Language>("fr");

    const handleAnswer = (answer: number) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestionIndex < DASS21_QUESTIONS[language].length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            onComplete(newAnswers);
        }
    };

    const progress = ((currentQuestionIndex + 1) / DASS21_QUESTIONS[language].length) * 100;
    const labels = DASS21_LABELS[language];
    const isArabic = language === 'ar';

    return (
        <div className="p-4 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
             <div className="flex justify-center gap-2 mb-4 border-b pb-4">
                <Button variant={language === 'fr' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('fr')}>Français</Button>
                <Button variant={language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('en')}>English</Button>
                <Button variant={language === 'ar' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('ar')}>العربية</Button>
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                    {labels.question} {currentQuestionIndex + 1} {labels.of} {DASS21_QUESTIONS[language].length}
                </p>
                <Progress value={progress} className="w-full" />
            </div>

            <div className="h-24 flex items-center">
                <p className="text-sm font-semibold text-card-foreground">
                    {DASS21_QUESTIONS[language][currentQuestionIndex]}
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button variant="outline" onClick={() => handleAnswer(0)}>0</Button>
                <Button variant="outline" onClick={() => handleAnswer(1)}>1</Button>
                <Button variant="outline" onClick={() => handleAnswer(2)}>2</Button>
                <Button variant="outline" onClick={() => handleAnswer(3)}>3</Button>
            </div>
             <div className={cn("text-xs text-muted-foreground pt-2 space-y-1", isArabic ? "text-right" : "text-left")}>
                <p><b>0</b> = {labels.option0}</p>
                <p><b>1</b> = {labels.option1}</p>
                <p><b>2</b> = {labels.option2}</p>
                <p><b>3</b> = {labels.option3}</p>
            </div>
        </div>
    );
};

export default Dass21Test;
