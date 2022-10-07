import { IDokumentkrav } from "../types/documentation.types";
import { MAX_TOTAL_DOKUMENTKRAV_FILE_SIZE } from "../constants";

export function useDokumentkravRemainingFilesize(dokumentkrav: IDokumentkrav) {
  const totalUploadedFileSize = dokumentkrav.filer
    .map((fil) => fil.storrelse)
    .reduce((accumulator: number, value: number) => accumulator + value, 0);

  return { remainingFilesize: MAX_TOTAL_DOKUMENTKRAV_FILE_SIZE - totalUploadedFileSize };
}
