"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined): string {
    if (!date) return ""
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

function maskDate(value: string): string {
    const cleaned = value.replace(/\D/g, "")
    const truncated = cleaned.slice(0, 8)
    if (truncated.length > 4) {
        return `${truncated.slice(0, 2)}/${truncated.slice(2, 4)}/${truncated.slice(4)}`
    }
    if (truncated.length > 2) {
        return `${truncated.slice(0, 2)}/${truncated.slice(2)}`
    }
    return truncated
}

function parseDate(dateStr: string): Date | undefined {
    const [day, month, year] = dateStr.split("/").map(Number)
    if (day && month && year && year > 1000) {
        const date = new Date(year, month - 1, day)
        if (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        ) {
            return date
        }
    }
    return undefined
}

function isValidDate(date: Date | undefined): boolean {
    return date instanceof Date && !isNaN(date.getTime())
}

type DatePickerProps = {
    value: string
    onValueChange: (value: string) => void
}

export function DatePicker({ value, onValueChange }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(() => parseDate(value))
    const [month, setMonth] = React.useState<Date | undefined>(date)

    React.useEffect(() => {
        const parsed = parseDate(value)
        if (isValidDate(parsed)) {
            setDate(parsed)
            setMonth(parsed)
        }
    }, [value])

    return (
        <div className="flex flex-col gap-3">
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    value={value}
                    placeholder="dd/mm/yyyy"
                    autoComplete="off"
                    onChange={(e) => {
                        const maskedValue = maskDate(e.target.value)
                        onValueChange(maskedValue)
                        const parsed = parseDate(maskedValue)
                        if (isValidDate(parsed)) {
                            setDate(parsed)
                            setMonth(parsed)
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(selectedDate) => {
                                if (selectedDate) {
                                    const formatted = formatDate(selectedDate)
                                    setDate(selectedDate)
                                    setMonth(selectedDate)
                                    onValueChange(formatted)
                                    setOpen(false)
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
