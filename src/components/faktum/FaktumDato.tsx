import { IPrimitivFaktum } from "../../types/faktum.types";
import { DatePicker } from "../input/DatePicker";

export function FaktumDato(props: IPrimitivFaktum) {

  function onChange(value: Date) {
    console.log("Ny verdi:", value);
  }

  return (
    <div>
      <DatePicker label={props.title} onChange={onChange} />
    </div>
  )
}
function useState(arg0: string): [any, any] {
  throw new Error("Function not implemented.");
}

