import Image from "next/image";
import { Heading, Text } from "@ignite-ui/react";

import * as S from "./styles";

import previewImage from "../../assets/app-preview.png";
import ClaimUserNameForm from "./components/ClaimUserNameForm";

export default function Home() {
  return (
    <S.Container>
      <S.Hero>
        <Heading size="4xl" as="h1">
          Agendamento descomplicado
        </Heading>
        <Text size="lg">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUserNameForm />
      </S.Hero>

      <S.Preview>
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt="Calendario da aplicacao em funcionamento"
        />
      </S.Preview>
    </S.Container>
  );
}
