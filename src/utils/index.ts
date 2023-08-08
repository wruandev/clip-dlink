import { ZodError } from 'zod';

export const findZodError = (zodError: ZodError | undefined, pathName: string) => {
  if (!zodError) {
    return null;
  }

  const obj = zodError.issues.find((data) => data.path[0] === pathName);

  return obj;
};
