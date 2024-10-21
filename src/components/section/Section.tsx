import { useSanity } from "../../context/sanity-context";
import { ErrorTypesEnum } from "../../types/error.types";
import { IOpplysning, IOrkestratorSeksjon } from "../../types/orkestrator.types";
import { mapOrkestratorToQuiz } from "../../utils/orkestrator.util";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { Faktum } from "../faktum/Faktum";
import { SectionHeading } from "./SectionHeading";

interface IProps {
  section: IOrkestratorSeksjon;
  readonly?: boolean;
  showAllTexts?: boolean;
}

export function Section(props: IProps) {
  const { getSeksjonTextById } = useSanity();

  if (!props.section.navn) {
    return <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />;
  }

  const { nesteUbesvarteOpplysning, besvarteOpplysninger } = props.section;

  const nesteUbesvartOpplysningToFaktum =
    nesteUbesvarteOpplysning && mapOrkestratorToQuiz(nesteUbesvarteOpplysning);

  return (
    <>
      <SectionHeading
        text={getSeksjonTextById(props.section.navn)}
        fallback={props.section.navn}
        showAllTexts={props.showAllTexts}
      />
      {besvarteOpplysninger?.map((opplysning: IOpplysning) => {
        const opplysningToFaktum = mapOrkestratorToQuiz(opplysning);

        return (
          <Faktum
            key={opplysningToFaktum.id}
            faktum={opplysningToFaktum}
            readonly={props.readonly}
            showAllFaktumTexts={props.showAllTexts}
            isOrkestrator={true}
          />
        );
      })}

      {nesteUbesvarteOpplysning && (
        <Faktum
          key={nesteUbesvartOpplysningToFaktum.id}
          faktum={nesteUbesvartOpplysningToFaktum}
          readonly={props.readonly}
          showAllFaktumTexts={props.showAllTexts}
          isOrkestrator={true}
        />
      )}
    </>
  );
}
