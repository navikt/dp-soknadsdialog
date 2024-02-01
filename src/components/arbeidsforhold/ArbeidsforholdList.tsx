export interface IArbeidsforhold {
  id: string;
  organisasjonsnavn: string;
  startdato: string;
  sluttdato?: string;
}

interface IProps {
  arbeidsforhold: IArbeidsforhold[];
}

export function ArbeidsforholdList(props: IProps) {
  const { arbeidsforhold } = props;

  function getArbeidsforholdText(forhold: IArbeidsforhold) {
    return `${forhold.organisasjonsnavn} (${forhold.startdato} - ${
      forhold.sluttdato ?? "pågående"
    })`;
  }

  return (
    <ul>
      {arbeidsforhold.map((forhold) => {
        return <li key={forhold.id}>{getArbeidsforholdText(forhold)}</li>;
      })}
    </ul>
  );
}
