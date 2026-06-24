"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { Lightbulb, GitBranch, Layers, Star, Bot, Loader2, Sparkles } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const FEATURES = [
  {
    icon: Lightbulb,
    title: "Project Idea Generator",
    description: "AI-powered ideas tailored to your skill level and goals",
    gradient: "from-[#6366F1] to-[#8B5CF6]",
  },
  {
    icon: GitBranch,
    title: "Architecture Review",
    description: "Expert feedback on system design and technical patterns",
    gradient: "from-[#8B5CF6] to-[#06B6D4]",
  },
  {
    icon: Layers,
    title: "Tech Stack Recommendations",
    description: "The right tools for every project and team size",
    gradient: "from-[#06B6D4] to-[#6366F1]",
  },
  {
    icon: Star,
    title: "Resume-worthy Projects",
    description: "Build projects that impress technical recruiters",
    gradient: "from-[#6366F1] to-[#8B5CF6]",
  },
  {
    icon: Bot,
    title: "AI Coding Assistant",
    description: "Real-time guidance and code review as you build",
    gradient: "from-[#8B5CF6] to-[#06B6D4]",
  },
];

const NODES = [
  { id: 0, x: 10, y: 10, color: "#6366F1" },
  { id: 1, x: 28, y: 7,  color: "#8B5CF6" },
  { id: 2, x: 48, y: 13, color: "#06B6D4" },
  { id: 3, x: 68, y: 7,  color: "#6366F1" },
  { id: 4, x: 88, y: 11, color: "#8B5CF6" },
  { id: 5, x: 6,  y: 34, color: "#06B6D4" },
  { id: 6, x: 22, y: 42, color: "#6366F1" },
  { id: 7, x: 40, y: 37, color: "#8B5CF6" },
  { id: 8, x: 58, y: 43, color: "#06B6D4" },
  { id: 9, x: 76, y: 37, color: "#6366F1" },
  { id: 10, x: 92, y: 34, color: "#8B5CF6" },
  { id: 11, x: 14, y: 63, color: "#6366F1" },
  { id: 12, x: 34, y: 69, color: "#06B6D4" },
  { id: 13, x: 52, y: 61, color: "#8B5CF6" },
  { id: 14, x: 70, y: 67, color: "#6366F1" },
  { id: 15, x: 88, y: 61, color: "#06B6D4" },
  { id: 16, x: 28, y: 87, color: "#8B5CF6" },
  { id: 17, x: 64, y: 85, color: "#6366F1" },
];

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [0, 6], [1, 6], [1, 7], [2, 7], [2, 8], [3, 8], [3, 9], [4, 9], [4, 10],
  [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [5, 11], [6, 11], [6, 12], [7, 12], [7, 13], [8, 13], [8, 14], [9, 14], [9, 15], [10, 15],
  [11, 12], [12, 13], [13, 14], [14, 15],
  [11, 16], [12, 16], [12, 17], [13, 17], [14, 17], [15, 17],
  [16, 17],
  [1, 8], [3, 11], [7, 15],
];

const FLOAT_DURATIONS = [4.2, 3.8, 5.1, 4.6, 3.5, 4.9, 3.7, 5.3, 4.1, 3.9, 4.7, 5.0, 4.3, 3.6, 4.8, 5.2, 4.0, 3.4];

function NeuralNetwork() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {CONNECTIONS.map(([from, to], i) => (
        <motion.line
          key={i}
          x1={`${NODES[from].x}%`}
          y1={`${NODES[from].y}%`}
          x2={`${NODES[to].x}%`}
          y2={`${NODES[to].y}%`}
          stroke={i % 3 === 0 ? "#6366F1" : i % 3 === 1 ? "#8B5CF6" : "#06B6D4"}
          strokeWidth="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.04, 0.28, 0.04] }}
          transition={{
            duration: 2.8 + (i % 6) * 0.7,
            delay: i * 0.09,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {NODES.map((node, i) => (
        <g key={node.id}>
          <motion.circle
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={7}
            fill="none"
            stroke={node.color}
            strokeWidth="0.8"
            animate={{ opacity: [0, 0.22, 0] }}
            transition={{
              duration: FLOAT_DURATIONS[i],
              delay: i * 0.28,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.circle
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={3}
            fill={node.color}
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{
              duration: FLOAT_DURATIONS[i],
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </g>
      ))}
    </svg>
  );
}

export function SignInScreen() {
  const reduced = useReducedMotion() ?? false;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithOAuth(provider: "google" | "github") {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  const buttonHover: TargetAndTransition = reduced ? {} : { y: -2, scale: 1.015 };
  const buttonTap: TargetAndTransition = reduced ? {} : { scale: 0.975 };

  return (
    <div
      className="relative flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="relative hidden flex-col justify-center overflow-hidden px-12 py-12 lg:flex lg:flex-1 xl:px-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(99,102,241,0.13) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 35% 55%, rgba(99,102,241,0.07) 0%, transparent 70%)",
          }}
        />

        <NeuralNetwork />

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-10 flex items-center gap-2.5"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
            >
              <Sparkles size={17} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide" style={{ color: "#94A3B8" }}>
              ProjectMentor AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="mb-4 text-5xl font-bold leading-[1.13] tracking-tight text-white xl:text-[3.4rem]"
          >
            Build Outstanding{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Projects
            </span>{" "}
            with AI Guidance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
            className="mb-8 text-base leading-relaxed"
            style={{ color: "#94A3B8" }}
          >
            Get project ideas, architecture feedback, implementation guidance,
            and personalised mentorship — all powered by AI.
          </motion.p>

          <div className="flex flex-col gap-2.5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.28 + i * 0.07, ease: "easeOut" }}
              >
                <motion.div
                  animate={reduced ? {} : { y: [0, -4, 0] }}
                  transition={{
                    duration: 3.6 + i * 0.45,
                    delay: 1.0 + i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-start gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient}`}
                  >
                    <feature.icon size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{feature.title}</p>
                    <p className="mt-0.5 text-xs leading-snug" style={{ color: "#94A3B8" }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex w-full items-center justify-center px-5 py-8 lg:w-[490px] lg:shrink-0"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-[360px]"
        >
          <div className="mb-7 flex items-center gap-2 lg:hidden">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
            >
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "#94A3B8" }}>
              ProjectMentor AI
            </span>
          </div>

          <div
            className="rounded-3xl p-7 sm:p-8"
            style={{
              background: "rgba(18,18,18,0.85)",
              backdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.07), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white">Get started</h2>
              <p className="mt-1 text-sm" style={{ color: "#94A3B8" }}>
                Your AI project mentor awaits.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <OAuthButton
                onClick={() => signInWithOAuth("google")}
                disabled={loading}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </OAuthButton>

              <OAuthButton
                onClick={() => signInWithOAuth("github")}
                disabled={loading}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <GitHubIcon />}
                Continue with GitHub
              </OAuthButton>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl px-4 py-2.5 text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.22)",
                  color: "#FCA5A5",
                }}
              >
                {error}
              </motion.p>
            )}

            <p className="mt-6 text-center text-xs" style={{ color: "#475569" }}>
              By continuing, you agree to our{" "}
              <span
                className="cursor-default underline decoration-dotted"
                style={{ color: "#64748B" }}
              >
                Terms
              </span>{" "}
              &{" "}
              <span
                className="cursor-default underline decoration-dotted"
                style={{ color: "#64748B" }}
              >
                Privacy Policy
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function OAuthButton({
  children,
  onClick,
  disabled,
  whileHover,
  whileTap,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
      className="flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors disabled:opacity-60"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#FFFFFF",
      }}
    >
      {children}
    </motion.button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.67 3.67 0 0 1-1.59 2.41v2h2.57c1.5-1.38 2.4-3.42 2.4-5.87z"
        fill="#4285F4"
      />
      <path
        d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.58-2a4.82 4.82 0 0 1-7.17-2.53H.97v2.06A8 8 0 0 0 8 16z"
        fill="#34A853"
      />
      <path
        d="M3.55 9.53a4.8 4.8 0 0 1 0-3.06V4.41H.97a8 8 0 0 0 0 7.18l2.58-2.06z"
        fill="#FBBC05"
      />
      <path
        d="M8 3.18c1.22 0 2.31.42 3.17 1.24l2.37-2.37A8 8 0 0 0 .97 4.41L3.55 6.47A4.77 4.77 0 0 1 8 3.18z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
