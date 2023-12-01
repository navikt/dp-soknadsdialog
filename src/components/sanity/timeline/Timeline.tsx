import React from "react";
import { TypedObject } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { useSvgIcon } from "../../../hooks/useSvgIcon";
import styles from "./Timeline.module.css";

interface ITimelineItem {
  iconName: string;
  title: string;
  body: TypedObject | TypedObject[];
  _key: string;
}

export function Timeline(props: PortableTextComponentProps<{ elements: ITimelineItem[] }>) {
  return <>{props.value.elements.map(TimelineItem)}</>;
}

function TimelineItem(props: ITimelineItem) {
  const { svg } = useSvgIcon(props.iconName);

  return (
    <div key={props._key} className={styles.timelineItem}>
      <div className={styles.iconWrapper} aria-hidden>
        {svg && <span className={styles.icon}>{svg}</span>}
      </div>
      <dl>
        <dt className={styles.timeLineItemTitle}>{props.title}</dt>
        <dd>
          <PortableText value={props.body} />
        </dd>
      </dl>
    </div>
  );
}
