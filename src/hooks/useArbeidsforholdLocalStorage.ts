export function useArbeidsforholdLocalStorage() {
  function getStorageArrayByKey(key: string) {
    const storage = localStorage?.getItem(`${key}`);

    if (!storage) {
      localStorage.setItem(`${key}`, JSON.stringify([]));
    }

    return storage ? JSON.parse(storage) : [];
  }

  return { getStorageArrayByKey };
}
