import { Pipe, PipeTransform } from '@angular/core';

export const constants = {
  MS: 'ms', // millseconds
  SEC: 'secs', // seconds
  MIN: 'min', // minutes
  HRS: 'hrs', // minutes
};

@Pipe({
  name: 'toTimeUnit'
})
export class ToTimeUnitPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // ensure that input is a number
    value = parseFloat(value || 0);
    return `${value} ${constants.MS}`;
  }

}
