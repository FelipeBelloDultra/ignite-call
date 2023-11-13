import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { ArrowRight, Check } from "phosphor-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import * as registerStyles from "../styles";
import * as connectCalendarStyles from "./styles";

const S = {
  ...registerStyles,
  ...connectCalendarStyles,
};

export default function ConnectCalendar() {
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!router.query.error;
  const isSignedIn = session.status === "authenticated";

  async function handleConnectCalendar() {
    await signIn();
  }

  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </S.Header>

      <S.ConnectBox>
        <S.ConnectItem>
          <Text>Google Calendar</Text>

          {isSignedIn ? (
            <Button size="sm" disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </S.ConnectItem>

        {hasAuthError && (
          <S.AuthError size="sm">
            Falha ao se connectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </S.AuthError>
        )}

        <Button disabled={!isSignedIn}>
          Próximo passo
          <ArrowRight />
        </Button>
      </S.ConnectBox>
    </S.Container>
  );
}
