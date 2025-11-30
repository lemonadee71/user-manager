import { z } from 'zod';
import { fromError } from 'zod-validation-error';

// eslint-disable-next-line
type FieldErrors = Record<string, { message: string; value: any }>;

export const formatZodError = <T>(error: z.ZodError<T>) => {
  const formattedError = fromError(error, {
    prefix: 'Validation failed',
  });
  const fieldErrors = formattedError.details.reduce<FieldErrors>((o, issue) => {
    const path = issue.path.join('.');
    // @ts-expect-error not showing on type
    const value = issue.received ?? issue.input; // eslint-disable-line

    // eslint-disable-next-line
    o[path] ??= { message: '', value };

    if (o[path].message) {
      o[path].message += `; ${issue.message}`;
    } else {
      o[path].message = issue.message;
    }

    return o;
  }, {});

  return {
    error: formattedError.toString(),
    fieldErrors,
  };
};
