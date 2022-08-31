import moment, { Moment } from "moment"

export const dateHoursSeparator = "-";

const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";
const DEFAULT_LIMIT_DATE_FORMAT = `DD/MM${dateHoursSeparator}hh:mm A`;

export const createDateOfNow = () => {
  return formatDate(moment().toDate());
}

export const formatDate = (date: Date): string => {
  return moment(date).format(DEFAULT_DATE_FORMAT);
}

export const createDaysLimitOf = (daysLimit: number) => {
  const limitDate = setDaysLimit(daysLimit);

  return formatDateAndTime(setDefaultTime(limitDate).toDate());
}

const setDaysLimit = (days: number): Moment => {
  return setDefaultTime(moment().add(days, "days"));
}

export const formatDateAndTime = (date: Date): string => {
  return moment(date).format(DEFAULT_LIMIT_DATE_FORMAT);
}

const setDefaultTime = (momentDate: Moment): Moment => {
  momentDate.set("hour", 23);
  momentDate.set("minute", 59);
  momentDate.set("second", 59);

  return momentDate;
}