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

  return (
    <ul>
      {arbeidsforhold.map((forhold) => {
        const text = `${forhold.organisasjonsnavn} (${forhold.startdato} - ${
          forhold.sluttdato ?? "pågående"
        })`;
        return <li key={forhold.id}>{text}</li>;
      })}
    </ul>
  );
}
