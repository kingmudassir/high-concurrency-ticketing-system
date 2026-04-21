"use client";

import React from "react";
import { CalendarDays, Clock, Timer, History } from "lucide-react";
import { motion } from "framer-motion";

export function TimingSection() {
  return (
    <section className="space-y-10">
      {/* SECTION HEADER */}
      <div className="flex items-end justify-between border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
            <Clock className="w-3 h-3 fill-emerald-500" /> Scheduling
          </p>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 uppercase">
            Timing & Access
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* START DATE */}
        <div className="group space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-950 text-white rounded-md">
              <Timer className="w-3.5 h-3.5" />
            </div>
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
              Event Start
            </label>
          </div>
          <div className="relative">
            <input
              name="startDate"
              type="datetime-local"
              required
              className="w-full bg-white border border-zinc-200 px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all appearance-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-[8px] font-mono font-bold text-zinc-300 uppercase tracking-widest bg-zinc-50 px-1.5 py-0.5 border border-zinc-100">
                Required
              </span>
            </div>
          </div>
        </div>

        {/* END DATE */}
        <div className="group space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-100 text-zinc-400 group-focus-within:bg-zinc-200 group-focus-within:text-zinc-900 transition-colors rounded-md">
              <History className="w-3.5 h-3.5" />
            </div>
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
              Event End
            </label>
          </div>
          <div className="relative">
            <input
              name="endDate"
              type="datetime-local"
              className="w-full bg-zinc-50/50 border border-zinc-100 px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 outline-none focus:bg-white focus:border-zinc-300 focus:text-zinc-950 transition-all appearance-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
               <span className="text-[8px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
                Optional
              </span>
            </div>
          </div>
        </div>

        {/* DOORS OPEN */}
        <div className="group space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-100 text-zinc-400 group-focus-within:bg-zinc-200 group-focus-within:text-zinc-900 transition-colors rounded-md">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
              Doors Open
            </label>
          </div>
          <div className="relative">
            <input
              name="doorsOpen"
              type="datetime-local"
              className="w-full bg-zinc-50/50 border border-zinc-100 px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 outline-none focus:bg-white focus:border-zinc-300 focus:text-zinc-950 transition-all appearance-none"
            />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
               <span className="text-[8px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
                Optional
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM VALIDATION FOOTER */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="flex items-center gap-4 p-4 border-l-2 border-zinc-900 bg-zinc-50"
      >
        <div className="flex flex-col">
          <span className="text-[9px] font-mono font-black text-zinc-950 uppercase tracking-widest">
            Timezone_Lock: UTC_Offset_Auto
          </span>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
            All times will be synchronized to the venue's local coordinate system.
          </p>
        </div>
      </motion.div>
    </section>
  );
}