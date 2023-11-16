import dayjs from "dayjs";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { Calendar } from "../../../../../components/calendar";
import { api } from "../../../../../lib/axios";

import * as S from "./styles";

interface Availibility {
  possibleTimes: number[];
  availableTimes: number[];
}

interface CalendarStepProps {
  onSelectdateTime: (date: Date) => void;
}

export function CalendarStep({ onSelectdateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();

  const isDateSelected = !!selectedDate;
  const username = String(router.query.username);

  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const describedDate = isDateSelected
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null;

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  const { data: availability } = useQuery<Availibility>({
    queryKey: ["availability", selectedDateWithoutTime],
    enabled: !!selectedDate,
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      });

      return response.data;
    },
  });

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate();

    onSelectdateTime(dateWithTime);
  }

  return (
    <S.Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <S.TimePicker>
          <S.TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            {availability?.possibleTimes.map((hour) => (
              <S.TimePickerItem
                key={hour}
                disabled={!availability.availableTimes.includes(hour)}
                onClick={() => handleSelectTime(hour)}
              >
                {String(hour).padStart(2, "0")}
              </S.TimePickerItem>
            ))}
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.Container>
  );
}
