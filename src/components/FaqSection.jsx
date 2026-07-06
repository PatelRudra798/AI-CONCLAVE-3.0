import { useState } from 'react';
import SectionHeader from './SectionHeader';

export default function FaqSection() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Submitted Question Data:", data);
  };

  return (
    <section id="faq" className="relative z-10 section-pad">
      <div className="max-container">
        <SectionHeader label="PANEL DISCUSSION" title="Drop Your Questions" />

        <div className="max-w-[720px] mx-auto text-center mb-8 sm:mb-10">
          <p className="t-muted text-[14px] sm:text-[15px] leading-relaxed">
            Have a question you'd like our panelists to answer?<br />
            Submit it below and we'll consider it during the live panel discussion.
          </p>
        </div>

        <div className="max-w-[600px] mx-auto">
          <form
            onSubmit={handleSubmit}
            className="t-card-bg p-6 sm:p-8 rounded-[16px] sm:rounded-[20px] flex flex-col gap-5 border border-[rgba(255,255,255,0.08)] shadow-lg backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name (optional)"
                  className="w-full bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm t-text focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Email (branch)"
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

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="bg-[var(--accent)] text-white px-8 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Submit Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

