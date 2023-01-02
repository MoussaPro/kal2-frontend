export default function timeHandler() {
  // Define the heights on tasks in pixel depends on task length
  const taskHeight = {
    hour: 24, // 3.5 REM
    halfHour: 12, // 1.75 REM
    minute: 0.45 // 0.03 REM
  };

  // Gets the difference between two hours in specified format
  const diffBetweenTwoTimes = (start, end, format) => {
    const startDate = new Date();
    const endDate = new Date();

    start = start.split(':');
    end = end.split(':');

    startDate.setHours(start[0], start[1], start[2], 0);
    endDate.setHours(end[0], end[1], end[2], 0);

    switch (format) {
      case 'minutes':
        return (endDate-startDate)/60/1000;
      case 'hours':
        return (endDate-startDate)/60/60/1000
      default:
        return endDate-startDate
    }
  }

  const insideTimeBox = (timeBox, taskTime) => {
    const diff = diffBetweenTwoTimes(taskTime, timeBox, 'minutes');

    // Set to true if the task is inside the blocks minutes
    if(diff >= 0 && diff <= 119) {
      return diff === 0 ? true : diff;
    }
  }

  return {
    diffBetweenTwoTimes,
    taskHeight,
    insideTimeBox
  }
}