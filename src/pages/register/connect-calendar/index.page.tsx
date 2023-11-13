import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";

import * as registerStyles from "../styles";
import * as connectCalendarStyles from "./styles";

const S = {
  ...registerStyles,
  ...connectCalendarStyles,
};

export default function Register() {
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

          <Button variant="secondary" size="sm">
            Conectar
            <ArrowRight />
          </Button>
        </S.ConnectItem>

        <Button>
          Próximo passo
          <ArrowRight />
        </Button>
      </S.ConnectBox>
    </S.Container>
  );
}
