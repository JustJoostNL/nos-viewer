import React, { FC } from "react";
import { Tooltip, Typography } from "@mui/material";
import {
  FormattedDate,
  FormattedRelativeTime,
  FormattedTime,
} from "react-intl";
import { selectUnit } from "@formatjs/intl-utils";

interface IProps {
  timestamp: string;
  timeZone?: string;
  timeShift?: number;
  showTime?: boolean;
  relativeByDays?: boolean;
  locale?: string;
}

export const Timestamp: FC<IProps> = ({
  timestamp,
  timeZone,
  timeShift = 0,
  showTime = true,
  relativeByDays = false,
  locale: localeOverride,
  ...rest
}) => {
  const locale = localeOverride || "en-GB";
  const date = new Date(`${timestamp}`);

  const title = new Intl.DateTimeFormat(locale, {
    hour12: false,
    timeZone,
    timeZoneName: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

  const displayDate =
    timeShift === 0 ? date : new Date(date.getTime() + timeShift * 1000);

  if (!showTime) {
    return (
      <Tooltip arrow title={title}>
        <Typography component="time" {...rest}>
          <FormattedDate
            value={displayDate}
            year="numeric"
            month="short"
            day="numeric"
            timeZone={timeZone}
          />
        </Typography>
      </Tooltip>
    );
  }

  if (relativeByDays) {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );
    const dateByDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
    );
    const diff = selectUnit(dateByDay, today, {
      second: 0,
      minute: 0,
      hour: 0,
    });

    return (
      <Tooltip arrow title={title}>
        <Typography component="time" {...rest}>
          <FormattedRelativeTime
            numeric="auto"
            value={diff.value}
            unit={diff.unit}
          />
        </Typography>
      </Tooltip>
    );
  }

  return (
    <Tooltip arrow title={title}>
      <Typography component="time" variant="inherit" {...rest}>
        <FormattedTime
          value={displayDate}
          year="numeric"
          month="short"
          day="numeric"
          hour="2-digit"
          minute="2-digit"
          second="2-digit"
          timeZone={timeZone}
        />
      </Typography>
    </Tooltip>
  );
};
