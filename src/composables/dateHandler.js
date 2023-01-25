export default function dateHandler() {
  const monthNames = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Oktober', 'September', 'November', 'December'];
  const dateLocale = 'da-DK';

  const dateToTimestamp = (date) => {
    return new Date(date).getTime() / 1000;
  }

  const getDay = (timestamp, format) => {
    const date = new Date(timestamp * 1000);

    if (format === 'name') {
      return date.toLocaleDateString(dateLocale, {weekday: 'long'});
    } else {
      return date.getDate();
    }
  }

  const getMonth = (timestamp, format) => {
    const date = new Date(timestamp * 1000);

    if (format === 'name') {
      return monthNames[date.getMonth()];
    } else {
      return date.getMonth()+1;
    }
  }

  const getYear = (timestamp) => {
    const date = new Date(timestamp * 1000);

    return date.getFullYear();
  }

  const getDate = (timestamp) => {
    const date = new Date(timestamp * 1000);

    return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
  }

  const isToday = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();

    return date.toLocaleDateString(dateLocale) === today.toLocaleDateString(dateLocale);
  }

  const dateCalender = (dateParser, slice = true) => {
    const date = new Date(dateParser).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).replaceAll('.', '/');

    if (slice) {
      return date.slice(0, 5);
    } else {
      return date;
    }
  }

  const danishToDate = (danishDate) => {
    const date = danishDate.split("/");

    return new Date(+date[2], date[1] - 1, +date[0]);
  }

  return {
    getDay,
    getMonth,
    getYear,
    getDate,
    isToday,
    dateCalender,
    dateToTimestamp,
    danishToDate
  }
}