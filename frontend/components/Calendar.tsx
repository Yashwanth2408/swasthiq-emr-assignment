"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarWidgetProps {
    onDateSelect: (date: string) => void;
    selectedDate: string | null;
}

export default function CalendarWidget({ onDateSelect, selectedDate }: CalendarWidgetProps) {
    const [value, setValue] = useState<Value>(selectedDate ? new Date(selectedDate) : new Date());

    const handleDateChange = (value: Value) => {
        if (value instanceof Date) {
            setValue(value);
            const formatted = value.toISOString().split("T")[0];
            onDateSelect(formatted);
        }
    };

    return (
        <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
            <Calendar
                onChange={handleDateChange}
                value={value}
                className="border-0 w-full"
                tileClassName={({ date, view }) => {
                    if (view === "month") {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date.toDateString() === today.toDateString()) {
                            return "bg-blue-100 text-blue-900 font-bold";
                        }
                    }
                    return "";
                }}
            />
        </div>
    );
}
