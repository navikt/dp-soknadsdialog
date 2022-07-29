import React from "react";
import { Label } from "@navikt/ds-react";
import * as AllIcons from "@navikt/ds-icons";

import styles from "./Timeline.module.css";
import { TypedObject } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import { PortableTextComponentProps } from "@portabletext/react/src/types";

interface ItemProps {
  icon: string;
  title: string;
  body: TypedObject | TypedObject[];
}

export function Timeline(props: PortableTextComponentProps<{ elements: ItemProps[] }>) {
  return <>{props.value.elements.map(TimelineItem)}</>;
}

function TimelineItem(props: ItemProps) {
  // @ts-ignore
  const Icon: typeof React.Component = AllIcons[props.icon];
  return (
    <div key={props.title} className={styles.timelineItem}>
      <div className={styles.iconWrapper}>{Icon && <Icon className={styles.icon} />}</div>
      <div>
        <Label size={"medium"}>{props.title}</Label>
        <PortableText value={props.body} />
      </div>
    </div>
  );
}
