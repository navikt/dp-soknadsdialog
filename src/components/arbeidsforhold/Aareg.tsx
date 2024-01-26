export interface IAareg {
  id: string;
  organisasjonsnavn: string;
  startdato: string;
  sluttdato?: string;
}

export interface IAaregProps {
  arbeidsforhold: IAareg[];
}

export function Aareg(props: IAaregProps) {
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
