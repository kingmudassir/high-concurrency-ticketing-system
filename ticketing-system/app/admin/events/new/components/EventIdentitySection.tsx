"use client";

import React from "react";
import { AlignLeft, Sparkles, Type } from "lucide-react";
import { motion } from "framer-motion";

export function EventIdentitySection() {
  return (
    <section className="space-y-10 mb-20">
      {/* SECTION HEADER */}
      <div className="flex items-end justify-between border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
            <Sparkles className="w-3 h-3 fill-emerald-500" /> Narrative
          </p>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 uppercase">
            Event Identity
          </h2>
        </div>
      </div>

      <div className="space-y-8">
        {/* TITLE FIELD */}
        <div className="group">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
              Headline Title
            </label>
            <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest">Required</span>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-emerald-500 group-focus-within:h-3/4 transition-all duration-300" />
            <input
              name="title"
              required
              placeholder="E.G. MIDNIGHT CITY REVIVAL"
              className="w-full bg-white border-b-2 border-zinc-100 px-4 py-5 text-xl font-black uppercase tracking-tight text-zinc-950 placeholder:text-zinc-100 outline-none focus:border-zinc-950 transition-all"
            />
          </div>
        </div>

        {/* SUBTITLE FIELD */}
        <div className="group">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
              Sub-Heading
            </label>
            <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest italic text-zinc-300">Optional</span>
          </div>
          <div className="relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Type className="w-4 h-4 text-zinc-200 group-focus-within:text-zinc-400 transition-colors" />
             </div>
             <input
                name="subtitle"
                placeholder="A compelling one-liner for the event card..."
                className="w-full bg-zinc-50 border border-zinc-100 pl-12 pr-4 py-4 text-sm font-bold text-zinc-600 placeholder:text-zinc-300 outline-none focus:bg-white focus:border-zinc-300 transition-all"
              />
          </div>
        </div>

        {/* DESCRIPTION FIELD */}
        <div className="group">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
              The Experience
            </label>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white focus-within:border-zinc-950 focus-within:ring-4 focus-within:ring-zinc-950/5 transition-all">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-50 bg-zinc-50/50">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-zinc-200" />
                    <div className="w-2 h-2 rounded-full bg-zinc-200" />
                    <div className="w-2 h-2 rounded-full bg-zinc-200" />
                </div>
                <span className="text-[9px] font-mono font-bold text-zinc-300 uppercase tracking-widest ml-2">Text_Editor</span>
            </div>
            <textarea
              name="description"
              rows={6}
              placeholder="Describe the atmosphere, the lineup, and the exclusive details that make this event unmissable..."
              className="w-full p-6 text-sm leading-relaxed text-zinc-600 placeholder:text-zinc-200 outline-none resize-none"
            />
            
            {/* Bottom metadata bar */}
            <div className="px-6 py-3 border-t border-zinc-50 flex justify-end">
                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                    Rich Text Enabled
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER TIP */}
      <div className="p-6 bg-zinc-950 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-500/20 flex items-center justify-center shrink-0">
            <AlignLeft className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
            <p className="text-white text-[11px] font-black uppercase tracking-widest mb-1">Copywriting Tip</p>
            <p className="text-zinc-500 text-[10px] font-medium leading-relaxed uppercase tracking-wider">
                Events with descriptions over 200 words see a <span className="text-emerald-400">40% higher conversion rate</span>. Be descriptive, be bold.
            </p>
        </div>
      </div>
    </section>
  );
}