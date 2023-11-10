import { Button, TextInput } from "@ignite-ui/react";
import * as S from "./styles";
import { ArrowRight } from "phosphor-react";

export default function ClaimUserNameForm() {
  return (
    <S.Form as="form">
      <TextInput
        size="sm"
        prefix="ignite.com/"
        placeholder="seu-usuario"
        crossOrigin=""
      />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </S.Form>
  );
}
