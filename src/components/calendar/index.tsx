import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { CaretLeft, CaretRight } from "phosphor-react";
import dayjs from "dayjs";

import { api } from "../../lib/axios";

import * as S from "./styles";

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

interface BlockedDates {
  blockedWeekDays: number[];
}

interface CalendarProps {
  selectedDate?: Date | null;
  onDateSelected: (date: Date) => void;
}

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });

  const router = useRouter();

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, "month");

    setCurrentDate(previousMonthDate);
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, "month");

    setCurrentDate(nextMonthDate);
  }

  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const username = String(router.query.username);

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      "blocked-dates",
      currentDate.get("year"),
      currentDate.get("month"),
    ],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get("year"),
          month: currentDate.get("month"),
        },
      });

      return response.data;
    },
  });

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) return [];

    const daysInMonthArray = Array.from(
      {
        length: currentDate.daysInMonth(),
      },
      (_, i) => ({
        date: currentDate.set("date", i + 1),
        disabled: false,
      })
    );

    const firstWeekDay = currentDate.get("day");

    const previousMonthFillArray = Array.from(
      { length: firstWeekDay },
      (_, i) => ({
        date: currentDate.subtract(firstWeekDay - i, "day"),
        disabled: true,
      })
    );

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth()
    );
    const lastWeekDay = lastDayInCurrentMonth.get("day");

    const nextMonthFillArray = Array.from(
      {
        length: 7 - (lastWeekDay + 1),
      },
      (_, i) => ({
        date: lastDayInCurrentMonth.add(i + 1, "day"),
        disabled: true,
      })
    );

    const calendarDays = [
      ...previousMonthFillArray,
      ...daysInMonthArray.map((days) => ({
        date: days.date,
        disabled:
          days.date.endOf("day").isBefore(new Date()) ||
          blockedDates.blockedWeekDays.includes(days.date.get("day")),
      })),
      ...nextMonthFillArray,
    ];

    const calendarWeeks: CalendarWeeks = [];

    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push({
        week: i / 7,
        days: calendarDays.slice(i, i + 7),
      });
    }

    return calendarWeeks;
  }, [currentDate, blockedDates]);

  return (
    <S.CalendarContainer>
      <S.CalendarHeader>
        <S.CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </S.CalendarTitle>

        <S.CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </S.CalendarActions>
      </S.CalendarHeader>

      <S.CalendarBody>
        <thead>
          <tr>
            <th>DOM.</th>
            <th>SEG.</th>
            <th>TER.</th>
            <th>QUA.</th>
            <th>QUI.</th>
            <th>SEX.</th>
            <th>SAB.</th>
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <S.CalendarDay
                    onClick={() => onDateSelected(date.toDate())}
                    disabled={disabled}
                  >
                    {date.get("date")}
                  </S.CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </S.CalendarBody>
    </S.CalendarContainer>
  );
}
