export function toDateKey(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().split("T")[0];
}

export function formatDayLabel(value) {
  if (!value) {
    return "Unknown date";
  }

  return new Date(value).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeRange(start, end) {
  if (!start) {
    return "Time not available";
  }

  const options = {
    hour: "numeric",
    minute: "2-digit",
  };

  const startLabel = new Date(start).toLocaleTimeString(undefined, options);
  const endLabel = end ? new Date(end).toLocaleTimeString(undefined, options) : null;

  return endLabel ? `${startLabel} - ${endLabel}` : startLabel;
}

export function groupActivitiesByDate(activities) {
  return activities.reduce((accumulator, activity) => {
    const key = toDateKey(activity.startDateTime || activity.date);

    if (!accumulator[key]) {
      accumulator[key] = [];
    }

    accumulator[key].push(activity);
    return accumulator;
  }, {});
}
