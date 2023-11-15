import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { getWeekDays } from "../../../utils/get-week-days";
import { convertTimeStringToMinutes } from "../../../utils/convert-time-string-to-minutes";

import * as registerStyles from "../styles";
import * as timeIntervalsStyles from "./styles";
import { api } from "../../../lib/axios";

const S = {
  ...registerStyles,
  ...timeIntervalsStyles,
};

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Selecione pelo menos um dia da semana",
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
      }))
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        ),
      {
        message:
          "O horario de termino deve ser pelo menos 1h distante do inicio",
      }
    ),
});

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  });

  const router = useRouter();

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const intervals = watch("intervals");

  async function handleSetTimeIntervals(data: unknown) {
    const { intervals } = data as TimeIntervalsFormOutput;

    await api.post("/users/time-intervals", {
      intervals,
    });
    await router.push("/register/update-profile");
  }

  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </S.Header>

      <S.IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <S.IntervalsContainer>
          {fields.map((field, index) => (
            <S.IntervalItem key={field.id}>
              <S.IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                      checked={field.value}
                    />
                  )}
                />
                <Text>{getWeekDays(field.weekDay)}</Text>
              </S.IntervalDay>

              <S.IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  crossOrigin=""
                  disabled={intervals[index].enabled === false}
                  {...register(`intervals.${index}.startTime`)}
                />
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  crossOrigin=""
                  disabled={intervals[index].enabled === false}
                  {...register(`intervals.${index}.endTime`)}
                />
              </S.IntervalInputs>
            </S.IntervalItem>
          ))}
        </S.IntervalsContainer>

        {errors.intervals && (
          <S.FormError size="sm">{errors.intervals.root?.message}</S.FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </S.IntervalBox>
    </S.Container>
  );
}
