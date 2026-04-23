"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface EventsPaginationProps {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    totalFiltered: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function EventsPagination({
    currentPage,
    totalPages,
    startIndex,
    totalFiltered,
    itemsPerPage,
    onPageChange,
}: EventsPaginationProps) {
    if (totalPages <= 1) return null;

    const endIndex = Math.min(startIndex + itemsPerPage, totalFiltered);

    // Build visible page numbers (max 5, centered on current)
    const getPageNumbers = (): (number | "…")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | "…")[] = [1];
        if (currentPage > 3) pages.push("…");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let p = start; p <= end; p++) pages.push(p);
        if (currentPage < totalPages - 2) pages.push("…");
        pages.push(totalPages);
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="bg-white border border-zinc-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Info */}
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Showing{" "}
                <span className="font-black text-zinc-950 tabular-nums">{startIndex + 1}</span>
                {" – "}
                <span className="font-black text-zinc-950 tabular-nums">{endIndex}</span>
                {" of "}
                <span className="font-black text-zinc-950 tabular-nums">{totalFiltered}</span>
                {" events"}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-1">
                {/* First */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-400 hover:border-zinc-950 hover:text-zinc-950 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    title="First page"
                >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                {/* Prev */}
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-400 hover:border-zinc-950 hover:text-zinc-950 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Page numbers */}
                {pageNumbers.map((p, i) =>
                    p === "…" ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="w-8 h-8 flex items-center justify-center text-[10px] font-mono text-zinc-400"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`w-8 h-8 text-[10px] font-black font-mono transition-all border ${
                                currentPage === p
                                    ? "bg-zinc-950 text-white border-zinc-950"
                                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-400 hover:border-zinc-950 hover:text-zinc-950 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Last */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-400 hover:border-zinc-950 hover:text-zinc-950 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    title="Last page"
                >
                    <ChevronsRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}