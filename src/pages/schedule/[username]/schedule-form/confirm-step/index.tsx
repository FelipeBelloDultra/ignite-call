import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { CalendarBlank, Clock } from "phosphor-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import * as S from "./styles";

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome precisa no minimo de 3 caracteres" }),
  email: z.string().email({ message: "Digite um email valido" }),
  observations: z.string().nullable(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  });

  async function handleConfirmScheduling(data: ConfirmFormData) {}

  const describedDate = dayjs(schedulingDate).format("DD[ de ]MMMM [ de ]YYYY");
  const describedTime = dayjs(schedulingDate).format("HH:mm[h]");

  return (
    <S.ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <S.FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </S.FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput
          placeholder="Seu nome"
          crossOrigin=""
          {...register("name")}
        />
        {errors.name && (
          <S.FormError size="sm">{errors.name.message}</S.FormError>
        )}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          crossOrigin=""
          {...register("email")}
        />
        {errors.email && (
          <S.FormError size="sm">{errors.email.message}</S.FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register("observations")} />
      </label>

      <S.FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </S.FormActions>
    </S.ConfirmForm>
  );
}
