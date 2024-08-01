import React, { FC, useMemo } from "react";
import { FormattedRelativeTime } from "react-intl";

function getRelativeUnit(
  relativeTime: number,
): [number, number | undefined, Intl.RelativeTimeFormatUnitSingular] {
  const seconds = Math.abs(relativeTime);
  if (seconds < 60) {
    return [relativeTime, 10, "second"];
  } else if (seconds < 60 * 45) {
    return [Math.round(relativeTime / 60), 60, "minute"];
  } else if (seconds < 60 * 60 * 23) {
    return [Math.round(relativeTime / (60 * 60)), undefined, "hour"];
  } else if (seconds < 60 * 60 * 24 * 6) {
    return [Math.round(relativeTime / (60 * 60 * 24)), undefined, "day"];
  } else if (seconds < 60 * 60 * 24 * 23) {
    return [Math.round(relativeTime / (60 * 60 * 24 * 7)), undefined, "week"];
  } else if (seconds < 60 * 60 * 24 * 30 * 11) {
    return [Math.round(relativeTime / (60 * 60 * 24 * 28)), undefined, "month"];
  } else {
    return [Math.round(relativeTime / (60 * 60 * 24 * 365)), undefined, "year"];
  }
}

interface IProps {
  value: number;
}

export const RelativeTimeAgo: FC<IProps> = ({ value, ...rest }) => {
  const [relativeTime, updateIntervalInSeconds, relativeUnit] = useMemo(
    () => getRelativeUnit(Math.floor(value - Date.now() / 1000)),
    [value],
  );

  return (
    <FormattedRelativeTime
      value={relativeTime}
      unit={relativeUnit}
      numeric="auto"
      updateIntervalInSeconds={updateIntervalInSeconds}
      {...rest}
    />
  );
};
