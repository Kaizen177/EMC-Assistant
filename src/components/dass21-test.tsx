// src/components/dass21-test.tsx

"use client";

import { useState } from "react";
import { DASS21_QUESTIONS } from "@/lib/dass21-questions";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface Dass21TestProps {
    onComplete: (results: number[]) => void;
}

const Dass21Test: React.FC<Dass21TestProps> = ({ onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);

    const handleAnswer = (answer: number) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestionIndex < DASS21_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            onComplete(newAnswers);
        }
    };

    const progress = ((currentQuestionIndex + 1) / DASS21_QUESTIONS.length) * 100;

    return (
        <div className="p-4 space-y-4">
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestionIndex + 1} sur {DASS21_QUESTIONS.length}
                </p>
                <Progress value={progress} className="w-full" />
            </div>

            <div className="h-24 flex items-center">
                <p className="text-sm font-semibold text-card-foreground">
                    {DASS21_QUESTIONS[currentQuestionIndex]}
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button variant="outline" onClick={() => handleAnswer(0)}>0</Button>
                <Button variant="outline" onClick={() => handleAnswer(1)}>1</Button>
                <Button variant="outline" onClick={() => handleAnswer(2)}>2</Button>
                <Button variant="outline" onClick={() => handleAnswer(3)}>3</Button>
            </div>
             <p className="text-xs text-muted-foreground pt-2">
                0 = Ne s'applique pas du tout à moi. <br/>
                1 = S'applique un peu à moi, ou une partie du temps. <br/>
s'applique                2 = S'applique assez à moi, ou une bonne partie du temps. <br/>
                3 = S'applique beaucoup à moi, ou la plupart du temps.
            </p>
        </div>
    );
};

export default Dass21Test;
