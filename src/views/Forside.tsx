import React from "react";

interface Props {
  title: string;
  content: any;
}

export function Forside(props: Props) {
  return (
    <div>
      <h1>{props.title}</h1>
    </div>
  );
}
