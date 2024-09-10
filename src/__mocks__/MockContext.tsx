import React, { PropsWithChildren } from "react";
import { DokumentkravProvider } from "../context/dokumentkrav-context";
import { QuizProvider } from "../context/quiz-context";
import { SanityProvider } from "../context/sanity-context";
import { ValidationProvider } from "../context/validation-context";
import { IDokumentkrav, IDokumentkravList } from "../types/documentation.types";
import { IQuizSeksjon, IQuizState } from "../types/quiz.types";
import { ISanityTexts } from "../types/sanity.types";
import { MockQuizProvider } from "./MockQuizProvider";
import { FeatureTogglesProvider } from "../context/feature-toggle-context";
import { UserInfoProvider } from "../context/user-info-context";

interface IProps {
  dokumentkrav?: IDokumentkrav[];
  soknadState?: IQuizState;
  quizSeksjoner?: IQuizSeksjon[];
  sanityTexts?: ISanityTexts;
  mockQuizContext?: boolean;
}

export const mockSanityTexts: ISanityTexts = {
  fakta: [],
  seksjoner: [],
  svaralternativer: [],
  landgrupper: [],
  apptekster: [],
  dokumentkrav: [],
  dokumentkravSvar: [],
  infosider: [],
};

export const mockSoknadState: IQuizState = {
  ferdig: false,
  antallSeksjoner: 11,
  seksjoner: [],
  versjon_navn: "Dagpenger",
  roller: [],
};

export const mockSection: IQuizSeksjon = {
  fakta: [],
  beskrivendeId: "din-situasjon",
  ferdig: true,
};

const mockDokumentkravList: IDokumentkravList = {
  soknad_uuid: "12345",
  krav: [],
};

export function MockContext(props: PropsWithChildren<IProps>) {
  const {
    children,
    dokumentkrav = [],
    quizSeksjoner = [mockSection],
    soknadState = mockSoknadState,
    sanityTexts = mockSanityTexts,
    mockQuizContext,
  } = props;

  return (
    <div id="__next">
      <SanityProvider initialState={sanityTexts}>
        <FeatureTogglesProvider featureToggles={{ arbeidsforholdIsEnabled: false }}>
          {mockQuizContext && (
            <MockQuizProvider initialState={{ ...soknadState, seksjoner: quizSeksjoner }}>
              <UserInfoProvider arbeidsforhold={[]} contextSelectedArbeidsforhold={undefined}>
                <DokumentkravProvider
                  initialState={{ ...mockDokumentkravList, krav: dokumentkrav }}
                >
                  <ValidationProvider>{children}</ValidationProvider>
                </DokumentkravProvider>
              </UserInfoProvider>
            </MockQuizProvider>
          )}

          {!mockQuizContext && (
            <QuizProvider initialState={{ ...soknadState, seksjoner: quizSeksjoner }}>
              <UserInfoProvider arbeidsforhold={[]} contextSelectedArbeidsforhold={undefined}>
                <DokumentkravProvider
                  initialState={{ ...mockDokumentkravList, krav: dokumentkrav }}
                >
                  <ValidationProvider>{children}</ValidationProvider>
                </DokumentkravProvider>
              </UserInfoProvider>
            </QuizProvider>
          )}
        </FeatureTogglesProvider>
      </SanityProvider>
    </div>
  );
}
