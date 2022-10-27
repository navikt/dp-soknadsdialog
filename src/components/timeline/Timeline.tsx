import React from "react";
import { Label } from "@navikt/ds-react";
import { Applicant, Bag, DirectionSign } from "@navikt/ds-icons";

import styles from "./Timeline.module.css";
import { TypedObject } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import { PortableTextComponentProps } from "@portabletext/react/src/types";

interface ITimelineItem {
  iconName: string;
  title: string;
  body: TypedObject | TypedObject[];
  _key: string;
}

export function Timeline(props: PortableTextComponentProps<{ elements: ITimelineItem[] }>) {
  return <>{props.value.elements.map(TimelineItem)}</>;
}

const SupportedIcons = { Applicant, DirectionSign, Bag };

function TimelineItem(props: ITimelineItem) {
  // @ts-ignore
  const Icon: typeof React.Component = SupportedIcons[props.iconName];
  return (
    <div key={props._key} className={styles.timelineItem}>
      <div className={styles.iconWrapper}>{Icon && <Icon className={styles.icon} />}</div>
      <div>
        <Label size={"medium"}>{props.title}</Label>
        <PortableText value={props.body} />
      </div>
    </div>
  );
}
