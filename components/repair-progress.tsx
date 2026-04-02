"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { repairWorkflowStages } from "@/lib/constants";

export function RepairProgress({
  currentStage,
}: {
  currentStage?: string;
}) {
  const activeIndex = Math.max(
    0,
    repairWorkflowStages.findIndex((stage) => stage === currentStage)
  );

  return (
    <div className="rounded-[30px] border border-slate-200 bg-[linear-gradient(155deg,rgba(255,255,255,0.98),rgba(226,232,240,0.92))] p-5 shadow-[0_22px_50px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">
            Workshop Progress
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {currentStage || repairWorkflowStages[0]}
          </h3>
        </div>
        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          Stage {activeIndex + 1} / {repairWorkflowStages.length}
        </div>
      </div>

      <div className="relative [perspective:1200px]">
        <div className="absolute left-[15px] top-2 bottom-2 w-[3px] rounded-full bg-[linear-gradient(180deg,#cbd5e1,#e2e8f0)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_12px_rgba(148,163,184,0.18)]" />
        {repairWorkflowStages.map((stage, index) => {
          const complete = index < activeIndex;
          const active = index === activeIndex;

          return (
            <div
              key={stage}
              className="relative pl-10"
            >
              <div
                className={`absolute left-0 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-[linear-gradient(180deg,#ffffff,#e2e8f0)] ${
                  active
                    ? "border-red-500 text-red-500 shadow-[0_0_0_6px_rgba(239,68,68,0.12),0_10px_20px_rgba(239,68,68,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]"
                    : complete
                      ? "border-emerald-500 text-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12),0_10px_20px_rgba(16,185,129,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]"
                      : "border-slate-300 text-slate-300 shadow-[0_10px_18px_rgba(148,163,184,0.12),inset_0_1px_0_rgba(255,255,255,0.85)]"
                }`}
              >
                {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className={`h-4 w-4 ${active ? "fill-red-500/15" : ""}`} />}
              </div>
              <div
                className={`mb-3 rounded-[22px] border px-4 py-4 transition-all ${
                  active
                    ? "border-red-300 bg-[linear-gradient(155deg,#fff1f2,#ffe4e6)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_30px_rgba(239,68,68,0.18)] [transform:translateZ(22px)]"
                    : complete
                      ? "border-emerald-200 bg-[linear-gradient(155deg,#ecfdf5,#d1fae5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_14px_24px_rgba(16,185,129,0.12)] [transform:translateZ(14px)]"
                      : "border-slate-200 bg-[linear-gradient(155deg,#ffffff,#f8fafc)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_24px_rgba(15,23,42,0.08)] [transform:translateZ(8px)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Step {index + 1}
                  </span>
                </div>
                <p className={`mt-2 text-sm font-semibold ${active ? "text-red-700" : "text-slate-700"}`}>
                  {stage}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
