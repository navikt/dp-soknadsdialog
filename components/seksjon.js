import Spørsmål from "./spørsmål";

export default function Seksjon({ fakta = [], faktumlagrer }) {
  return (
    <>
      Vi vil stille disse spørsmålene:
      {fakta.map((faktum) => (
        <Spørsmål
          key={faktum.id}
          {...{ ...faktum, type: faktum.clazz }}
          håndterEndring={faktumlagrer}
        />
      ))}
    </>
  );
}
