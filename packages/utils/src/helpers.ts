export const sleep = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout))

export const isServerSide = () => typeof window !== 'undefined'
