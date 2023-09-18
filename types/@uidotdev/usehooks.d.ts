declare module "@uidotdev/usehooks" {
  import React from "react";

  export function useLocalStorage<T>(
    key: string,
    initialValue?: T
  ): [T, React.Dispatch<React.SetStateAction<T>>];
}
