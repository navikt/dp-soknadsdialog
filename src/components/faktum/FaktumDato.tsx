import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";

export function FaktumDato(props: IPrimitivFaktum) {


  return (
    <div>
      <DatePicker label="Dato" onChange={() => { }} />
    </div>
  )
}
