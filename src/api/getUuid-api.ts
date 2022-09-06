export async function getUuid() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/soknad/get-uuid`);

    if (res.ok) {
      return res.text();
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
