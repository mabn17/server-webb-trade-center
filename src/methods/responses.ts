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
  },

  checkValues: function(values: Array<any>): boolean {
    let result: boolean = true;

    for (let i = 0; i < values.length; i++) {
      if (!values[i]) {
        result = false;
        break;
      }
    }

    return result;
  }
};

export { responses };
