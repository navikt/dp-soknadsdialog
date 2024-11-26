import { PropsWithChildren } from "react";
import { AppProvider } from "../context/app-context";
import { DokumentkravProvider } from "../context/dokumentkrav-context";
import { SoknadProvider } from "../context/soknad-context";
import { SanityProvider } from "../context/sanity-context";
import { SoknadProvider } from "../context/soknad-context";
import { UserInfoProvider } from "../context/user-info-context";
import { ValidationProvider } from "../context/validation-context";
import { IDokumentkrav, IDokumentkravList } from "../types/documentation.types";
import { IOrkestratorSeksjon, IOrkestratorSoknad } from "../types/orkestrator.types";
import { IQuizSeksjon, IQuizState } from "../types/quiz.types";
import { ISanityTexts } from "../types/sanity.types";
import { MockSoknadProvider } from "./MockSoknadProvider";
import { FeatureTogglesProvider } from "../context/feature-toggle-context";
import { UserInfoProvider } from "../context/user-info-context";
import { IOrkestratorSeksjon, IOrkestratorSoknad } from "../types/orkestrator.types";

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

export const mockOrkestratorSeksjon: IOrkestratorSeksjon = {
  navn: "bostedsland",
  besvarteOpplysninger: [],
  erFullført: false,
  nesteUbesvarteOpplysning: {
    opplysningId: "55d35f94-ff20-4c50-a699-2bd1c9619cc9",
    tekstnøkkel: "faktum.hvilket-land-bor-du-i",
    type: "land",
    svar: null,
    gyldigeSvar: ["NOR", "SWE", "FIN"],
  },
};

export const mockOrkestratorState: IOrkestratorSoknad = {
  søknadId: "123456",
  seksjoner: [mockOrkestratorSeksjon],
  erFullført: true,
  antallSeksjoner: 2,
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

  const mockFeatureToggles = {
    orkestratorEnEnabled: true,
    orkestratorToEnabled: true,
  };

  return (
    <div id="__next">
      <SanityProvider initialState={sanityTexts}>
        <AppProvider featureToggles={mockFeatureToggles}>
          {mockQuizContext && (
            <MockSoknadProvider
              quizState={{ ...soknadState, seksjoner: quizSeksjoner }}
              orkestratorState={mockOrkestratorState}
            >
              <UserInfoProvider arbeidsforhold={[]} contextSelectedArbeidsforhold={undefined}>
                <DokumentkravProvider
                  initialState={{ ...mockDokumentkravList, krav: dokumentkrav }}
                >
                  <ValidationProvider>{children}</ValidationProvider>
                </DokumentkravProvider>
              </UserInfoProvider>
            </MockSoknadProvider>
          )}

          {!mockQuizContext && (
            <SoknadProvider
              quizState={{ ...soknadState, seksjoner: quizSeksjoner }}
              orkestratorState={mockOrkestratorState}
            >
              <UserInfoProvider arbeidsforhold={[]} contextSelectedArbeidsforhold={undefined}>
                <DokumentkravProvider
                  initialState={{ ...mockDokumentkravList, krav: dokumentkrav }}
                >
                  <ValidationProvider>{children}</ValidationProvider>
                </DokumentkravProvider>
              </UserInfoProvider>
            </SoknadProvider>
          )}
        </AppProvider>
      </SanityProvider>
    </div>
  );
}
