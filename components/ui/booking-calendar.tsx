"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar as CalendarIcon, MessageCircle, Clock, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const dayNames = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

const CalendarDay: React.FC<{
  day: number | string;
  isHeader?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  isPast?: boolean;
  onClick?: () => void;
}> = ({ day, isHeader, isToday, isSelected, isPast, onClick }) => {
  const baseClasses = "col-span-1 row-span-1 flex h-10 w-10 items-center justify-center transition-all duration-200";

  if (isHeader) {
    return (
      <div className={baseClasses}>
        <span className="font-bold text-[10px] uppercase tracking-widest text-gray-400">
          {day}
        </span>
      </div>
    );
  }

  const dayClasses = isPast
    ? "text-gray-300 cursor-not-allowed"
    : isSelected
    ? "bg-[#0a4d2c] text-white shadow-lg shadow-[#0a4d2c]/30 scale-110"
    : isToday
    ? "bg-[#16a34a]/10 text-[#0a4d2c] font-bold ring-2 ring-[#16a34a]/30"
    : "text-gray-700 hover:bg-[#0a4d2c]/5 hover:text-[#0a4d2c] cursor-pointer";

  return (
    <div
      className={`${baseClasses} rounded-xl ${dayClasses}`}
      onClick={!isPast ? onClick : undefined}
    >
      <span className="font-medium text-sm">{day}</span>
    </div>
  );
};

interface BookingCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingCalendarModal({ isOpen, onClose }: BookingCalendarModalProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "time">("date");

  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentDay, setCurrentDay] = useState(1);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState(28);
  const [monthIndex, setMonthIndex] = useState(0);

  useEffect(() => {
    const now = new Date();
    setCurrentMonth(monthNames[now.getMonth()]);
    setCurrentYear(now.getFullYear());
    setCurrentDay(now.getDate());
    setMonthIndex(now.getMonth());
    setFirstDayOfWeek(new Date(now.getFullYear(), now.getMonth(), 1).getDay());
    setDaysInMonth(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
  }, []);

  const whatsappBase = "https://wa.me/5512997150819";

  const handleClose = useCallback(() => {
    onClose();
    setSelectedDay(null);
    setSelectedTime(null);
    setStep("date");
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setStep("time");
  };

  const handleBack = () => {
    setSelectedTime(null);
    setStep("date");
  };

  const handleBooking = () => {
    const dayStr = selectedDay ? String(selectedDay).padStart(2, "0") : "";
    const monthStr = String(monthIndex + 1).padStart(2, "0");
    const timeStr = selectedTime ? ` às ${selectedTime}` : "";
    const message = selectedDay
      ? `Olá Dr. Carlos! Gostaria de agendar uma avaliação para o dia ${dayStr}/${monthStr}/${currentYear}${timeStr}. Podemos confirmar?`
      : `Olá Dr. Carlos! Gostaria de agendar uma avaliação. Qual o melhor horário disponível?`;

    window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const renderCalendarDays = () => {
    const days: React.ReactNode[] = [
      ...dayNames.map((day) => (
        <CalendarDay key={`header-${day}`} day={day} isHeader />
      )),
      ...Array(firstDayOfWeek)
        .fill(null)
        .map((_, i) => (
          <div key={`empty-start-${i}`} className="col-span-1 row-span-1 h-10 w-10" />
        )),
      ...Array(daysInMonth)
        .fill(null)
        .map((_, i) => (
          <CalendarDay
            key={`date-${i + 1}`}
            day={i + 1}
            isToday={i + 1 === currentDay}
            isSelected={selectedDay === i + 1}
            isPast={i + 1 < currentDay}
            onClick={() => handleSelectDay(i + 1)}
          />
        )),
    ];
    return days;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-[#0a4d2c]/10 border border-gray-100 overflow-hidden w-full max-w-[480px] max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0a4d2c] to-[#16a34a] p-6 md:p-8 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Fechar calendário"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    {step === "date" ? <CalendarIcon className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold font-outfit">
                      {step === "date" ? "Agendar Avaliação" : "Escolher Horário"}
                    </h2>
                    <p className="text-white/60 text-sm font-medium">Consulta de 60 min • Presencial</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {step === "date"
                    ? "Selecione um dia no calendário abaixo."
                    : `Dia ${selectedDay} de ${currentMonth} — escolha o horário.`}
                </p>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <AnimatePresence mode="wait">
                  {step === "date" ? (
                    <motion.div
                      key="date"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                          <p className="text-base font-bold font-outfit text-gray-900">
                            {currentMonth}, {currentYear}
                          </p>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                            60 min
                          </span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 place-items-center">
                          {renderCalendarDays()}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="time"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {/* Back button */}
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0a4d2c] transition-colors mb-4"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao calendário
                      </button>

                      {/* Selected date summary */}
                      <div className="px-4 py-3 bg-[#0a4d2c]/5 rounded-xl flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-[#0a4d2c] text-white flex items-center justify-center font-bold font-outfit">
                          {selectedDay}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {selectedDay} de {currentMonth}, {currentYear}
                          </p>
                          <p className="text-[11px] text-gray-500">Selecione o horário abaixo</p>
                        </div>
                      </div>

                      {/* Time slots grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 px-4 rounded-xl text-sm font-bold font-outfit transition-all duration-200 border ${
                              selectedTime === time
                                ? "bg-[#0a4d2c] text-white border-[#0a4d2c] shadow-lg shadow-[#0a4d2c]/20 scale-105"
                                : "bg-white text-gray-700 border-gray-100 hover:border-[#0a4d2c]/30 hover:bg-[#0a4d2c]/5"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA */}
                {step === "time" && (
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedTime}
                    className="w-full mt-6 h-14 md:h-16 text-base md:text-lg font-bold font-outfit bg-[#0a4d2c] hover:bg-[#0d5c35] text-white rounded-2xl shadow-xl shadow-[#0a4d2c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {selectedTime
                      ? `Confirmar ${selectedDay}/${String(monthIndex + 1).padStart(2, "0")} às ${selectedTime}`
                      : "Selecione um horário"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
