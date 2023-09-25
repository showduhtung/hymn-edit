declare module "@uidotdev/usehooks" {
  import type { Dispatch, SetStateAction } from "react";

  export function useLocalStorage<T>(
    key: string,
    initialValue?: T
  ): [T, Dispatch<SetStateAction<T>>];
}
