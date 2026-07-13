import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';

export default function FaqSection() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
    const [toastMsg, setToastMsg] = useState("");

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        const formData = new FormData(e.target);
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const question = formData.get('question');
        const honeypot = formData.get('botCheck');

        // Spam protection: Honeypot (silent success if caught)
        if (honeypot) {
            console.warn("Spam detected.");
            setSubmitStatus('success');
            return;
        }

        // Rate Limiting (1 minute per submission)
        const lastSubmitTime = localStorage.getItem('lastQuestionSubmit');
        if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime) < 60000) {
            showToast("Please wait a minute before submitting another question.");
            return;
        }

        // Custom Validation
        const errors = [];

        if (!fullName || fullName.trim() === "") {
            errors.push("Full Name is required.");
        } else {
            const nameRegex = /^[A-Za-z\s\-']+$/;
            if (!nameRegex.test(fullName)) {
                errors.push("Invalid Name.");
            }
        }

        if (!email || email.trim() === "") {
            errors.push("Email is required.");
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                errors.push("Invalid Email.");
            } else {
                const domain = email.split('@')[1]?.toLowerCase();
                if (domain !== 'gmail.com' && domain !== 'silveroakuni.ac.in') {
                    errors.push("Only gmail.com or silveroakuni.ac.in domains are allowed.");
                }
            }
        }

        if (!question || question.trim() === "") {
            errors.push("Please enter your question.");
        }

        if (errors.length > 0) {
            if (errors.length > 1) {
                showToast("Please correct the invalid fields before submitting.");
            } else {
                const firstError = errors[0];
                showToast(
                    firstError === "Invalid Name."
                        ? "Invalid Name. Only letters, spaces, hyphens and apostrophes are allowed."
                        : firstError === "Invalid Email."
                            ? "Please enter a valid email address."
                            : firstError
                );
            }
            return;
        }

        setIsSubmitting(true);

        // Do not send honeypot field
        const data = Object.fromEntries(formData.entries());
        delete data.botCheck;

        try {
            const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL;

            if (!scriptUrl || scriptUrl === 'paste_your_google_apps_script_url_here') {
                console.warn("Google Apps Script URL is not configured.");
                setSubmitStatus('error');
                setIsSubmitting(false);
                return;
            }

            await fetch(scriptUrl, {
                method: 'POST',
                body: JSON.stringify(data),
                // Used text/plain to avoid CORS preflight issues with Google Apps Script
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                }
            });

            localStorage.setItem('lastQuestionSubmit', Date.now().toString());
            setSubmitStatus('success');
            e.target.reset(); // Clear the form
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="faq" className="relative z-10 section-pad">
            {toastMsg && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-500/95 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.3)] text-sm backdrop-blur-md transition-opacity pointer-events-none text-center min-w-[280px]">
                    {toastMsg}
                </div>
            )}
            <div className="max-container">
                <SectionHeader label="PANEL DISCUSSION" title="Drop Your Questions" />

                <div className="max-w-[720px] mx-auto text-center mb-8 sm:mb-10">
                    <p className="t-muted text-[14px] sm:text-[15px] leading-relaxed">
                        Have a question for our panelists?<br />
                        Submit it below and we'll bring it into the live discussion.
                    </p>
                </div>

                <div className="max-w-[600px] mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="t-card-bg p-6 sm:p-8 rounded-[16px] sm:rounded-[20px] flex flex-col gap-5 border border-[rgba(255,255,255,0.08)] shadow-lg backdrop-blur-sm"
                    >
                        <div className="flex flex-col sm:flex-row gap-5">
                            <div style={{ display: 'none', visibility: 'hidden' }} aria-hidden="true">
                                <input type="text" name="botCheck" tabIndex="-1" autoComplete="off" />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    placeholder="Full Name"
                                    pattern="[A-Za-z\s\-']+"
                                    title="Only letters, spaces, hyphens and apostrophes are allowed"
                                    className="w-full bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm t-text focus:outline-none focus:border-[var(--accent)] transition-colors"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm t-text focus:outline-none focus:border-[var(--accent)] transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <textarea
                                name="question"
                                required
                                rows="5"
                                placeholder="Type your question here..."
                                className="w-full bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm t-text focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                            ></textarea>
                        </div>

                        <div className="flex justify-center mt-2 flex-col items-center gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-transparent border border-accent/40 text-accent px-8 py-3 rounded-xl text-sm font-medium hover:bg-accent/10 hover:border-accent/70 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(var(--accent-rgb),0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:shadow-none"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Question"}
                            </button>

                            {submitStatus === 'success' && (
                                <p className="text-green-400 text-sm">Your question has been submitted successfully!</p>
                            )}
                            {submitStatus === 'error' && (
                                <p className="text-red-400 text-sm">There was an error submitting your question. Please try again.</p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

