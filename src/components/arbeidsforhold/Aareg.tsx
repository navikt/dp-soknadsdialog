export interface IAareg {
  id: string;
  organisasjonsnummer: string;
  startdato: string;
  sluttdato?: string;
}

export interface IAaregProps {
  arbeidsforhold: IAareg[];
}

export function Aareg(props: IAaregProps) {
  const arbeidsforhold = props.arbeidsforhold;

  return (
    <ul>
      {arbeidsforhold.map((forhold) => (
        <li key={forhold.id}>{forhold.organisasjonsnummer}</li>
      ))}
    </ul>
  );
}
