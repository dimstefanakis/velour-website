"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailFormProps {
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export default function EmailForm({ 
  buttonText = "Join the Waitlist",
  placeholder = "Enter your email",
  className = ""
}: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email");
      return;
    }

    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setMessage("You're on the list! We'll whisper when it's time...");
      setEmail("");
    }, 1000);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
              setMessage("");
            }}
            placeholder={placeholder}
            className="flex-1 h-12 px-5 rounded-full border-2 border-[var(--color-rose-200)] bg-white/80 backdrop-blur-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-soft-gray)] focus:border-[var(--color-plum)] transition-all duration-300 text-base"
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-[var(--color-plum)] to-[var(--color-plum-dark)] text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 text-base whitespace-nowrap border-0"
            size="lg"
          >
            {status === "loading" ? "Joining..." : buttonText}
          </Button>
        </div>
      </form>
      
      {message && (
        <div className={`mt-4 text-center animate-fade-in-up ${
          status === "success" ? "text-[var(--color-plum)]" : "text-rose-500"
        }`}>
          <p className="text-sm italic">{message}</p>
        </div>
      )}
    </div>
  );
}