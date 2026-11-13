import {DateTime} from 'luxon';
import {toDateTime, type DateInput} from './dateUtils';

export const getCurrentChildAgeInMonths = (t: any, birthDate: DateInput, pluralShow: boolean): any => {
  const date1 = DateTime.local().startOf('day');
  const date2 = (typeof birthDate === 'string'
    ? toDateTime(birthDate.split('T')[0])
    : toDateTime(birthDate)).startOf('day');
  if (!date2.isValid) return '';
  const diff: any = date1.diff(date2, ["years", "months", "days"])
  let ageStr = "";
  if (date2.toMillis() > date1.toMillis()) {
    ageStr = t('noBorn');
  } else {
    if (diff.years > 0) {
      ageStr += diff.years + (diff.years > 1 ? (diff.years >= 5 ? ' ' + t('years5tag') : ' ' + t('yearstag')) : ' ' + t('yeartag'));

    }
    if (diff.months > 0) {
      if (ageStr != "" && ageStr != null && ageStr != undefined) {
        ageStr += ' ' + t('childInfoAndText') + ' ';
      }
      ageStr += diff.months + (diff.months > 1 ? (diff.months >= 5 ? ' ' + t('months5tag') : ' ' + t('monthstag')) : ' ' + t('monthtag'));

    }
    if (diff.days >= 1 && diff.months == "" && diff.years == "") {
      if (pluralShow == true) {
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? ((Math.round(diff.days) >= 5 && Math.round(diff.days) <= 20) || Math.round(diff.days) >= 25 ? ' ' + t('days5tag') : Math.round(diff.days) == 21 ? ' ' + t('daytag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
      else {
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? (Math.round(diff.days) >= 5 ? ' ' + t('days5tag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
    }
    if (ageStr == "") {
      ageStr = t('noday');
    }

  }
  return ageStr;

};

export const getNotificationDateInString = (t: any, birthDate: DateInput, pluralShow: boolean): any => {
  const date1 = DateTime.local().startOf('day');
  const date2 = (typeof birthDate === 'string'
    ? toDateTime(birthDate.split('T')[0])
    : toDateTime(birthDate)).startOf('day');
  if (!date2.isValid) return '';
  const diff: any = date1.diff(date2, ["years", "months", "days"])
  let ageStr = "";
  if (date2.toMillis() > date1.toMillis()) {
    ageStr = t('noBorn');
  } else {
    if (diff.years > 0) {
      ageStr += diff.years + (diff.years > 1 ? (diff.years >= 5 ? ' ' + t('years5tag') : ' ' + t('yearstag')) : ' ' + t('yeartag'));

    }
    if (diff.months > 0) {
      if (ageStr != "" && ageStr != null && ageStr != undefined) {
        ageStr += ' ' + t('childInfoAndText') + ' ';
      }
      ageStr += diff.months + (diff.months > 1 ? (diff.months >= 5 ? ' ' + t('months5tag') : ' ' + t('monthstag')) : ' ' + t('monthtag'));

    }
    if (diff.days >= 1 && diff.months == "" && diff.years == "") {
      if (pluralShow == true) {
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? ((Math.round(diff.days) >= 5 && Math.round(diff.days) <= 20) || Math.round(diff.days) >= 25 ? ' ' + t('days5tag') : Math.round(diff.days) == 21 ? ' ' + t('daytag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
      else {
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? (Math.round(diff.days) >= 5 ? ' ' + t('days5tag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
    }
    if (ageStr == "") {
      ageStr = t('todayTxt');
    } else {
      ageStr = t('notiTimeAgoTxt', { ageStr: ageStr })
    }

  }
  return ageStr

};
