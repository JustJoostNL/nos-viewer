export function timestampToUnix(timestamp: string | undefined) {
  return timestamp
    ? Math.floor(new Date(timestamp).getTime() / 1000)
    : undefined;
}
