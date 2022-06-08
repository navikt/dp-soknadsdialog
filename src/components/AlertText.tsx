import { Alert, Heading } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import React from "react";
import { SanityAlertText } from "../types/sanity.types";

interface Props {
  alertText: SanityAlertText;
  inAccordion: boolean;
}

export function AlertText(props: Props) {
  const { type, title, body } = props.alertText;
  // const [open, setOpen] = useState(false);

  // if (props.inAccordion) {
  //   return (
  //     <ReadMore
  //       header={title}
  //       open={open}
  //       onClick={() => setOpen(!open)}
  //       renderContentWhenClosed={true}
  //       size={"medium"}
  //     >
  //       <Alert variant={type}>
  //         <PortableText value={body} />
  //       </Alert>
  //     </ReadMore>
  //   );
  // }
  //
  // if (props.inAccordion) {
  //   return (
  //     <Accordion>
  //       <Accordion.Item open={open}>
  //         <Accordion.Header onClick={() => setOpen(!open)}>{title}</Accordion.Header>
  //         <Accordion.Content>
  //           <Alert variant={type}>
  //             <PortableText value={body} />
  //           </Alert>
  //         </Accordion.Content>
  //       </Accordion.Item>
  //     </Accordion>
  //   );
  // }

  return (
    <Alert variant={type}>
      {title && <Heading size={"small"}>{title} </Heading>}
      <PortableText value={body} />
    </Alert>
  );
}
