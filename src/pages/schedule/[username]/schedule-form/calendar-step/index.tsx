import { useState } from "react";
import { Calendar } from "../../../../../components/calendar";

import * as S from "./styles";

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isDateSelected = !!selectedDate;

  return (
    <S.Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <S.TimePicker>
          <S.TimePickerHeader>
            terca-feira <span>20 de setembro</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
            <S.TimePickerItem>08:00h</S.TimePickerItem>
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.Container>
  );
}
