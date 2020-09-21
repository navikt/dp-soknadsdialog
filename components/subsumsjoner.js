import {useEffect, useState} from "react";
import Spørsmål from "./spørsmål";
import useSWR from "swr"

export default function Subsumsjoner() {

    const { subsumsjoner, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/subsumsjoner`);

    return (
        <>
            Vi vil stille disse spørsmålene:
            {subsumsjoner.map((subsumsjon) => (
                <Subsumsjon key={subsumsjon.id} {...subsumsjon} />
            ))}
        </>
    );
}