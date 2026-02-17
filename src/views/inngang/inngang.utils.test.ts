import { describe, expect, test } from "vitest";
import { IInnsentSoknad, IOrkestratorSoknad } from "../../types/quiz.types";
import {
  combineAndSortInnsendteSoknader,
  mapOrkestratorInnsendteSoknader,
  mapOrkestratorPaabegyntSoknader,
  mapQuizInnsendteSoknader,
} from "./inngang.utils";

describe("mapOrkestratorInnsendteSoknader", () => {
  test("should return empty array when orkestratorSoknader is null", () => {
    expect(mapOrkestratorInnsendteSoknader(null)).toStrictEqual([]);
  });

  test("should return empty array when orkestratorSoknader is undefined", () => {
    expect(mapOrkestratorInnsendteSoknader(undefined)).toStrictEqual([]);
  });

  test("should return empty array when orkestratorSoknader is empty", () => {
    expect(mapOrkestratorInnsendteSoknader([])).toStrictEqual([]);
  });

  test("should filter and map INNSENDT soknader correctly", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "123",
        tittel: "Test",
        innsendtTimestamp: "2026-02-15T10:00:00",
        oppdatertTidspunkt: "2026-02-15T10:00:00",
        status: "INNSENDT",
      },
    ];

    const result = mapOrkestratorInnsendteSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([
      {
        soknadUuid: "123",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: true,
      },
    ]);
  });

  test("should filter and map JOURNALFØRT soknader correctly", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "456",
        tittel: "Test",
        innsendtTimestamp: "2026-02-14T10:00:00",
        oppdatertTidspunkt: "2026-02-14T10:00:00",
        status: "JOURNALFØRT",
      },
    ];

    const result = mapOrkestratorInnsendteSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([
      {
        soknadUuid: "456",
        forstInnsendt: "2026-02-14T10:00:00",
        isOrkestratorSoknad: true,
      },
    ]);
  });

  test("should filter and map GODKJENT soknader correctly", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "789",
        tittel: "Test",
        innsendtTimestamp: "2026-02-13T10:00:00",
        oppdatertTidspunkt: "2026-02-13T10:00:00",
        status: "GODKJENT",
      },
    ];

    const result = mapOrkestratorInnsendteSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([
      {
        soknadUuid: "789",
        forstInnsendt: "2026-02-13T10:00:00",
        isOrkestratorSoknad: true,
      },
    ]);
  });

  test("should filter out PÅBEGYNT soknader", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "123",
        tittel: "Test",
        innsendtTimestamp: "2026-02-15T10:00:00",
        oppdatertTidspunkt: "2026-02-15T10:00:00",
        status: "PÅBEGYNT",
      },
    ];

    const result = mapOrkestratorInnsendteSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([]);
  });

  test("should filter out soknader older than 30 days", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "123",
        tittel: "Test",
        innsendtTimestamp: "2025-12-01T10:00:00",
        oppdatertTidspunkt: "2025-12-01T10:00:00",
        status: "INNSENDT",
      },
    ];

    const result = mapOrkestratorInnsendteSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([]);
  });

  test("should filter out soknader with undefined innsendtTimestamp", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "123",
        tittel: "Test",
        innsendtTimestamp: undefined,
        oppdatertTidspunkt: "2026-02-15T10:00:00",
        status: "INNSENDT",
      },
    ];

    const result = mapOrkestratorInnsendteSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([]);
  });

  test("should handle mixed statuses and filter correctly", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "1",
        tittel: "Test",
        innsendtTimestamp: "2026-02-15T10:00:00",
        oppdatertTidspunkt: "2026-02-15T10:00:00",
        status: "INNSENDT",
      },
      {
        søknadId: "2",
        tittel: "Test",
        innsendtTimestamp: "2026-02-14T10:00:00",
        oppdatertTidspunkt: "2026-02-14T10:00:00",
        status: "PÅBEGYNT",
      },
      {
        søknadId: "3",
        tittel: "Test",
        innsendtTimestamp: "2026-02-13T10:00:00",
        oppdatertTidspunkt: "2026-02-13T10:00:00",
        status: "GODKJENT",
      },
    ];

    const result = mapOrkestratorInnsendteSoknader(orkestratorSoknader);

    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      {
        soknadUuid: "1",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: true,
      },
      {
        soknadUuid: "3",
        forstInnsendt: "2026-02-13T10:00:00",
        isOrkestratorSoknad: true,
      },
    ]);
  });
});

describe("mapQuizInnsendteSoknader", () => {
  test("should return empty array when innsendte is undefined", () => {
    expect(mapQuizInnsendteSoknader(undefined)).toStrictEqual([]);
  });

  test("should return empty array when innsendte is empty", () => {
    expect(mapQuizInnsendteSoknader([])).toStrictEqual([]);
  });

  test("should map single innsendt soknad correctly", () => {
    const innsendte: IInnsentSoknad[] = [
      {
        soknadUuid: "abc-123",
        forstInnsendt: "2026-02-15T10:00:00",
      },
    ];

    const result = mapQuizInnsendteSoknader(innsendte);

    expect(result).toStrictEqual([
      {
        soknadUuid: "abc-123",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: false,
      },
    ]);
  });

  test("should map multiple innsendte soknader correctly", () => {
    const innsendte: IInnsentSoknad[] = [
      {
        soknadUuid: "abc-123",
        forstInnsendt: "2026-02-15T10:00:00",
      },
      {
        soknadUuid: "def-456",
        forstInnsendt: "2026-02-14T10:00:00",
      },
    ];

    const result = mapQuizInnsendteSoknader(innsendte);

    expect(result).toStrictEqual([
      {
        soknadUuid: "abc-123",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: false,
      },
      {
        soknadUuid: "def-456",
        forstInnsendt: "2026-02-14T10:00:00",
        isOrkestratorSoknad: false,
      },
    ]);
  });
});

describe("combineAndSortInnsendteSoknader", () => {
  test("should return empty array when both inputs are empty", () => {
    expect(combineAndSortInnsendteSoknader([], [])).toStrictEqual([]);
  });

  test("should return only orkestrator soknader when standard is empty", () => {
    const orkestrator = [
      {
        soknadUuid: "123",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: true,
      },
    ];

    const result = combineAndSortInnsendteSoknader(orkestrator, []);

    expect(result).toStrictEqual(orkestrator);
  });

  test("should return only standard soknader when orkestrator is empty", () => {
    const standard = [
      {
        soknadUuid: "abc",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: false,
      },
    ];

    const result = combineAndSortInnsendteSoknader([], standard);

    expect(result).toStrictEqual(standard);
  });

  test("should combine and sort by date, newest first", () => {
    const orkestrator = [
      {
        soknadUuid: "1",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: true,
      },
      {
        soknadUuid: "2",
        forstInnsendt: "2026-02-13T10:00:00",
        isOrkestratorSoknad: true,
      },
    ];

    const standard = [
      {
        soknadUuid: "a",
        forstInnsendt: "2026-02-14T10:00:00",
        isOrkestratorSoknad: false,
      },
      {
        soknadUuid: "b",
        forstInnsendt: "2026-02-16T10:00:00",
        isOrkestratorSoknad: false,
      },
    ];

    const result = combineAndSortInnsendteSoknader(orkestrator, standard);

    expect(result).toHaveLength(4);
    expect(result[0].soknadUuid).toBe("b"); // 2026-02-16 (newest)
    expect(result[1].soknadUuid).toBe("1"); // 2026-02-15
    expect(result[2].soknadUuid).toBe("a"); // 2026-02-14
    expect(result[3].soknadUuid).toBe("2"); // 2026-02-13 (oldest)
  });

  test("should handle same dates correctly", () => {
    const orkestrator = [
      {
        soknadUuid: "1",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: true,
      },
    ];

    const standard = [
      {
        soknadUuid: "a",
        forstInnsendt: "2026-02-15T10:00:00",
        isOrkestratorSoknad: false,
      },
    ];

    const result = combineAndSortInnsendteSoknader(orkestrator, standard);

    expect(result).toHaveLength(2);
    // Order doesn't matter when dates are the same, but both should be present
    expect(result.some((s) => s.soknadUuid === "1")).toBe(true);
    expect(result.some((s) => s.soknadUuid === "a")).toBe(true);
  });
});

describe("mapOrkestratorPaabegyntSoknader", () => {
  test("should return empty array when orkestratorSoknader is null", () => {
    expect(mapOrkestratorPaabegyntSoknader(null)).toStrictEqual([]);
  });

  test("should return empty array when orkestratorSoknader is undefined", () => {
    expect(mapOrkestratorPaabegyntSoknader(undefined)).toStrictEqual([]);
  });

  test("should return empty array when orkestratorSoknader is empty", () => {
    expect(mapOrkestratorPaabegyntSoknader([])).toStrictEqual([]);
  });

  test("should filter and map PÅBEGYNT soknader correctly", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "123",
        tittel: "Test",
        innsendtTimestamp: "2026-02-15T10:00:00",
        oppdatertTidspunkt: "2026-02-15T12:00:00",
        status: "PÅBEGYNT",
      },
    ];

    const result = mapOrkestratorPaabegyntSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([
      {
        soknadUuid: "123",
        opprettet: "2026-02-15T12:00:00",
        sistEndretAvbruker: "2026-02-15T12:00:00",
      },
    ]);
  });

  test("should filter out INNSENDT soknader", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "123",
        tittel: "Test",
        innsendtTimestamp: "2026-02-15T10:00:00",
        oppdatertTidspunkt: "2026-02-15T10:00:00",
        status: "INNSENDT",
      },
    ];

    const result = mapOrkestratorPaabegyntSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([]);
  });

  test("should filter out JOURNALFØRT soknader", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "456",
        tittel: "Test",
        innsendtTimestamp: "2026-02-14T10:00:00",
        oppdatertTidspunkt: "2026-02-14T10:00:00",
        status: "JOURNALFØRT",
      },
    ];

    const result = mapOrkestratorPaabegyntSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([]);
  });

  test("should filter out GODKJENT soknader", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "789",
        tittel: "Test",
        innsendtTimestamp: "2026-02-13T10:00:00",
        oppdatertTidspunkt: "2026-02-13T10:00:00",
        status: "GODKJENT",
      },
    ];

    const result = mapOrkestratorPaabegyntSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([]);
  });

  test("should filter out soknader with undefined oppdatertTidspunkt", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "123",
        tittel: "Test",
        innsendtTimestamp: "2026-02-15T10:00:00",
        oppdatertTidspunkt: undefined,
        status: "PÅBEGYNT",
      },
    ];

    const result = mapOrkestratorPaabegyntSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([]);
  });

  test("should handle mixed statuses and filter only PÅBEGYNT", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "1",
        tittel: "Test",
        innsendtTimestamp: "2026-02-15T10:00:00",
        oppdatertTidspunkt: "2026-02-15T11:00:00",
        status: "PÅBEGYNT",
      },
      {
        søknadId: "2",
        tittel: "Test",
        innsendtTimestamp: "2026-02-14T10:00:00",
        oppdatertTidspunkt: "2026-02-14T10:00:00",
        status: "INNSENDT",
      },
      {
        søknadId: "3",
        tittel: "Test",
        innsendtTimestamp: "2026-02-13T10:00:00",
        oppdatertTidspunkt: "2026-02-13T11:00:00",
        status: "PÅBEGYNT",
      },
    ];

    const result = mapOrkestratorPaabegyntSoknader(orkestratorSoknader);

    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      {
        soknadUuid: "1",
        opprettet: "2026-02-15T11:00:00",
        sistEndretAvbruker: "2026-02-15T11:00:00",
      },
      {
        soknadUuid: "3",
        opprettet: "2026-02-13T11:00:00",
        sistEndretAvbruker: "2026-02-13T11:00:00",
      },
    ]);
  });

  test("should map multiple PÅBEGYNT soknader correctly", () => {
    const orkestratorSoknader: IOrkestratorSoknad[] = [
      {
        søknadId: "abc-123",
        tittel: "Test 1",
        innsendtTimestamp: "2026-02-15T10:00:00",
        oppdatertTidspunkt: "2026-02-15T12:00:00",
        status: "PÅBEGYNT",
      },
      {
        søknadId: "def-456",
        tittel: "Test 2",
        innsendtTimestamp: "2026-02-14T10:00:00",
        oppdatertTidspunkt: "2026-02-14T14:00:00",
        status: "PÅBEGYNT",
      },
    ];

    const result = mapOrkestratorPaabegyntSoknader(orkestratorSoknader);

    expect(result).toStrictEqual([
      {
        soknadUuid: "abc-123",
        opprettet: "2026-02-15T12:00:00",
        sistEndretAvbruker: "2026-02-15T12:00:00",
      },
      {
        soknadUuid: "def-456",
        opprettet: "2026-02-14T14:00:00",
        sistEndretAvbruker: "2026-02-14T14:00:00",
      },
    ]);
  });
});
