/*!
 * By:
 * Martin Borg
 */

export interface ErrorDerails {
  source: string;
  title: string;
  detail: string;
  status: number;
}

export interface ExpressError {
  errors: ErrorDerails;
}
