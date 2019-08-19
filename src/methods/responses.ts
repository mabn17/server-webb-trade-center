/*!
 * By:
 * Martin Borg
 */

import { ExpressError } from '../@Interfaces/ExpressError';

const responses = {
  getErrorMessage: function(sourceVal: string, titleVal: string, detailVal: string, statusVal: number):
    ExpressError {
      return {
        errors: {
          source: sourceVal,
          title: titleVal,
          detail: detailVal,
          status: statusVal
        }
      };
  }
};

export { responses };
