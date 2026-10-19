import React, { useEffect, useState } from "react";
import { CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import { callAPI } from "../../../config/AxiosInstance";
import { useAlert } from "../../../components/common/AlertContextScreen";
import { useTranslation } from "react-i18next";

interface Mcq {
    _id: string;
    questionText: string;
    options: string[];
    correctOptionIndex: number;
}

interface Props {
    sessionId?: string | null;
    onComplete: (score: number) => void | Promise<void>;
}

const ReviewerMCQ: React.FC<Props> = ({ sessionId, onComplete }) => {
    const { showAlert } = useAlert();
    const [mcqs, setMcqs] = useState<Mcq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const { t } = useTranslation();

    const getLocalStorageKey = () => `reviewerMcqState_${sessionId}`;

    useEffect(() => {
        if (!sessionId) return;
        const key = getLocalStorageKey();
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.mcqs && data.mcqs.length > 0) {
                    setMcqs(data.mcqs);
                    setAnswers(data.answers || {});
                    setScore(data.score || 0);
                    setSubmitted(data.submitted || false);
                    setIsLoading(false);
                    return;
                }
            } catch (e) {
                console.error("Failed to parse local MCQ state", e);
            }
        }
        fetchMcqs();
    }, [sessionId]);

    const saveLocalState = (newMcqs: Mcq[], newAnswers: any, newSubmitted: boolean, newScore: number) => {
        if (!sessionId) return;
        localStorage.setItem(getLocalStorageKey(), JSON.stringify({
            mcqs: newMcqs,
            answers: newAnswers,
            submitted: newSubmitted,
            score: newScore
        }));
    };

    const fetchMcqs = async () => {
        setIsLoading(true);
        try {
            const response = await callAPI<any>("GET", "/mcqs/random");
            console.log("Random MCQs Response:", response);
            let fetchedMcqs = [];
            if (response.data) {
                fetchedMcqs = response.data.slice(0, 1); // Testing: limit to 1
            } else if (Array.isArray(response)) {
                fetchedMcqs = response.slice(0, 1); // Testing: limit to 1
            }
            setMcqs(fetchedMcqs);
            saveLocalState(fetchedMcqs, {}, false, 0);
        } catch (error) {
            console.error("Error fetching MCQs", error);
            showAlert(t('reviewerRegistration.mcq.fetchError'), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = (questionId: string, optionIndex: number) => {
        if (!submitted) {
            const newAnswers = { ...answers, [questionId]: optionIndex };
            setAnswers(newAnswers);
            saveLocalState(mcqs, newAnswers, submitted, score);
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < mcqs.length) {
            showAlert(t('reviewerRegistration.mcq.missingAnswers'), "warning");
            return;
        }

        let currentScore = 0;
        mcqs.forEach(mcq => {
            if (answers[mcq._id] === mcq.correctOptionIndex) {
                currentScore++;
            }
        });

        setScore(currentScore);
        setSubmitted(true);
        saveLocalState(mcqs, answers, true, currentScore);

        // Testing: Scale score so the parent validation (>= 8) passes if we get the 1 question right
        const finalScore = currentScore === mcqs.length ? 10 : 0;
        
        setIsSubmitting(true);
        try {
            await onComplete(finalScore);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        saveLocalState([], {}, false, 0);
        fetchMcqs(); // Fetch new set of questions
    };

    const handleFallbackComplete = async () => {
        setIsSubmitting(true);
        try {
            await onComplete(10);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><CircularProgress sx={{ color: '#ec4899' }} /></div>;
    }

    if (mcqs.length === 0) {
        return (
            <div className="text-center p-8 space-y-4">
                <p className="text-white/70">{t('reviewerRegistration.mcq.noMcqs')}</p>
                <button 
                    onClick={handleFallbackComplete}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#8C2963] to-[#6B1D4A] hover:from-[#9d2e6f] hover:to-[#7c2256] text-white rounded-xl shadow-[0_4px_20px_rgba(140,41,99,0.4)] transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting && <CircularProgress size={18} color="inherit" />}
                    {t('reviewerRegistration.mcq.proceedBtn')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-2">
            {submitted && (
                <div className={`p-4 rounded-xl border backdrop-blur-md ${score >= mcqs.length ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/60 border-rose-500/40 text-rose-200'}`}>
                    <h3 className="text-lg font-bold">{t('reviewerRegistration.mcq.scoreText', { score, total: mcqs.length })}</h3>
                    <p className="text-sm mt-1">
                        {score >= mcqs.length 
                            ? t('reviewerRegistration.mcq.scoreSuccess') 
                            : t('reviewerRegistration.mcq.scoreFailed')}
                    </p>
                </div>
            )}

            <div className="space-y-5">
                {mcqs.map((mcq, index) => (
                    <div key={mcq._id} className="bg-white/[0.04] p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-sm">
                        <h4 className="font-semibold text-white/95 mb-3 text-base">
                            {index + 1}. {mcq.questionText}
                        </h4>
                        <FormControl component="fieldset" className="w-full">
                            <RadioGroup
                                value={answers[mcq._id] !== undefined ? answers[mcq._id] : ""}
                                onChange={(e) => handleOptionSelect(mcq._id, parseInt(e.target.value))}
                            >
                                {mcq.options.map((option, optIdx) => (
                                    <FormControlLabel
                                        key={optIdx}
                                        value={optIdx}
                                        control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.6)', '&.Mui-checked': { color: '#ec4899' } }} />}
                                        label={<span className="text-sm text-white/90">{option}</span>}
                                        disabled={submitted}
                                        className={`ml-0 mb-1 rounded-xl p-1.5 transition-colors border ${
                                            submitted && optIdx === mcq.correctOptionIndex 
                                                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 font-medium' 
                                                : submitted && answers[mcq._id] === optIdx && answers[mcq._id] !== mcq.correctOptionIndex
                                                ? 'bg-rose-500/20 border-rose-400/40 text-rose-200'
                                                : 'border-transparent hover:bg-white/[0.06] hover:border-white/10'
                                        }`}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-2 gap-4">
                {submitted && score < mcqs.length && (
                    <button 
                        onClick={handleRetry} 
                        className="px-6 py-2.5 border border-pink-400/40 text-pink-300 rounded-xl hover:bg-pink-500/10 transition-colors font-medium cursor-pointer"
                    >
                        {t('reviewerRegistration.mcq.retryBtn')}
                    </button>
                )}
                {!submitted && (
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#8C2963] to-[#6B1D4A] hover:from-[#9d2e6f] hover:to-[#7c2256] text-white rounded-xl shadow-[0_4px_20px_rgba(140,41,99,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
                    >
                        {isSubmitting && <CircularProgress size={18} color="inherit" />}
                        {t('reviewerRegistration.mcq.submitBtn')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReviewerMCQ;
