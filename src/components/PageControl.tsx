"use client"

import { SetStateAction } from "react";
import { Button } from "./ui/button";


interface PageControlProps {
    totalPages: number
    currentPage: number
    setCurrentPage: (value: SetStateAction<number>) => void
    itemsPerPage: number
    totalItems: number
}

export function PageControl({
    totalPages,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalItems,
}: PageControlProps) {
    return totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                    {`Mostrando ${(currentPage - 1) * itemsPerPage + 1} a ${Math.min(currentPage * itemsPerPage, totalItems)} de ${totalItems} resultados`}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                        {(() => {
                            const maxVisiblePages = 5;
                            const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                            const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);

                            const pages = [];

                            if (adjustedStartPage > 1) {
                                pages.push(
                                    <Button
                                        key={1}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(1)}
                                        className="w-10"
                                    >
                                        1
                                    </Button>
                                );
                                if (adjustedStartPage > 2) {
                                    pages.push(
                                        <span key="start-ellipsis" className="px-2 text-gray-400">
                                            ...
                                        </span>
                                    );
                                }
                            }

                            for (let i = adjustedStartPage; i <= endPage; i++) {
                                pages.push(
                                    <Button
                                        key={i}
                                        variant={currentPage === i ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(i)}
                                        className="w-10"
                                    >
                                        {i}
                                    </Button>
                                );
                            }

                            if (endPage < totalPages) {
                                if (endPage < totalPages - 1) {
                                    pages.push(
                                        <span key="end-ellipsis" className="px-2 text-gray-400">
                                            ...
                                        </span>
                                    );
                                }
                                pages.push(
                                    <Button
                                        key={totalPages}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="w-10"
                                    >
                                        {totalPages}
                                    </Button>
                                );
                            }

                            return pages;
                        })()}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="gap-1"
                    >
                        Próximo
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    )
}