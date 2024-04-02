export function useArbeidsforholdLocalStorage() {
  function getStorageArrayByKey<T>(key: string): Array<T> {
    const storage = localStorage?.getItem(key);

    if (!storage) {
      localStorage.setItem(key, JSON.stringify([]));
    }

    return storage ? JSON.parse(storage) : [];
  }

  return { getStorageArrayByKey };
}
