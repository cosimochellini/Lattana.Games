import { computed } from "vue";
import { differenceInDays } from "@/utils";
import { datable, Dictionary } from "@/types";
import { currentLocale } from "@/services/language.service";

const dayFormat = computed(
  () =>
    new Intl.DateTimeFormat(currentLocale.value, {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
);

const dateFormat = computed(
  () =>
    new Intl.DateTimeFormat(currentLocale.value, {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
);

const recentDayFormat = computed(
  () =>
    new Intl.DateTimeFormat(currentLocale.value, {
      hour12: false,
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
);

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
} as Dictionary<number>;

const relativeTimeFormat = computed(
  () =>
    new Intl.RelativeTimeFormat(currentLocale.value, {
      numeric: "auto",
    })
);

const parseDate = (date: datable): [boolean, Date] => {
  const isValid = false;

  if (!date) return [isValid, new Date()];

  if (date instanceof Date) return [true, date];

  if (typeof date === "string" || typeof date === "number")
    return [true, new Date(date)];

  return [false, new Date()];
};

export const formatter = {
  relativeTime(d1: Date, d2: Date = new Date()) {
    const elapsed = d1.getTime() - d2.getTime();

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (const unit of Object.keys(units)) {
      if (Math.abs(elapsed) > units[unit] || unit === "second")
        return relativeTimeFormat.value.format(
          Math.round(elapsed / units[unit]),
          unit as Intl.RelativeTimeFormatUnit
        );
    }
    return "";
  },

  longNumberFormatter(n: number) {
    return n.toLocaleString(currentLocale.value, {
      minimumIntegerDigits: 4,
      useGrouping: false,
    });
  },

  smallNumberFormatter(n: number) {
    return n.toLocaleString(currentLocale.value, {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  },

  smallestNumberFormatter(n: number) {
    return n.toLocaleString(currentLocale.value, {
      minimumIntegerDigits: 1,
      maximumFractionDigits: 2,
      useGrouping: false,
    });
  },

  percentageFormatter: (n: number) => (n * 100).toFixed(0) + "%",

  dateFormatter: (date: datable) => {
    const [isValid, d] = parseDate(date);
    if (!isValid) return "";
    return dateFormat.value.format(d);
  },

  dayFormatter: (date: datable) => {
    const [isValid, d] = parseDate(date);
    if (!isValid) return "";
    return dayFormat.value.format(d);
  },

  recentDayFormatter: (date: datable) => {
    const [isValid, d] = parseDate(date);
    if (!isValid) return "";
    return recentDayFormat.value.format(d);
  },

  relativeTimeFormatter: (date: datable) => {
    const [isValid, d] = parseDate(date);
    if (!isValid) return "";
    return formatter.relativeTime(d);
  },

  smartRelativeTime: (date: datable, range: number = 1) => {
    const [isValid, d] = parseDate(date);
    if (!isValid) return "";

    if (differenceInDays(d) >= range) {
      return recentDayFormat.value.format(d);
    }
    return formatter.relativeTime(d);
  },
};
