export namespace Quiz {
  export interface Fakta {
    readonly søknad_uuid: string;
    readonly seksjon_navn: string;
    readonly fakta: Faktum[];
  }

  export enum Rolle {
    SØKER = "søker",
    NAV = "nav",
    SAKSBEHANDLER = "saksbehandler",
  }

  export enum DataType {
    BOOLEAN = "boolean",
    INT = "int",
    DOUBLE = "double",
    STRING = "string",
    LOCALDATE = "localdate",
    DOKUMENT = "dokument",
  }

  export interface Faktum {
    readonly beskrivendeId: string;
    readonly id: string;
    readonly roller: Rolle[];
    readonly type: DataType;
    svar?: any;
  }
}
