import { useParams } from "react-router-dom";

export const useRequiredParam = (param: string) => {
  const params = useParams();
  const value = params[param];

  if (value === undefined) {
    throw new Error(`Missing required parameter: ${param}`);
  }

  return value;
};
