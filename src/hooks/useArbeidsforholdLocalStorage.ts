export function useArbeidsforholdLocalStorage() {
  function getArbeidsforholdStorageDataByKey(key: string) {
    const storage = localStorage?.getItem(`${key}`);

    if (!storage) {
      localStorage.setItem(`${key}`, JSON.stringify([]));
    }

    return storage ? JSON.parse(storage) : [];
  }

  return { getArbeidsforholdStorageDataByKey };
}
