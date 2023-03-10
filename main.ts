interface TimeEntry {
  time: number; // minutes since midnight
  description: string;
}

interface Task {
  duration: number; // duration in minutes
  startTime: number; // minutes since midnight
  endTime: number; // minutes since midnight
  description: string;
}

interface DayWithEntries {
  day: string;
  entries: TimeEntry[];
}
interface DayWithTasks {
  day: string;
  tasks: Task[];
}

function readAllDaysWithEntries() {
  const daysWithEntries = new Array<DayWithEntries>();
  // get all the HEADING2 titles
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  let lastHeading2: GoogleAppsScript.Document.Paragraph | null = null;
  const headings2 = body.getParagraphs().filter(p => p.getHeading() === DocumentApp.ParagraphHeading.HEADING2);
  for (const p of headings2) {
    Logger.log(p.getText());

    if (lastHeading2 != null) {
      const day = lastHeading2.getText();
      // get all the vignette items in between the headings,
      // includes sublists
      let iterator = lastHeading2.getNextSibling();

      const entries = new Array<TimeEntry>();
      while (
        iterator != null &&
        !(iterator.getType() === DocumentApp.ElementType.PARAGRAPH
          && iterator.asParagraph().getHeading() === DocumentApp.ParagraphHeading.HEADING2
          && iterator.asParagraph().getText() === p.getText()
        )) {

        Logger.log(iterator.getType());

        if (iterator.getType() === DocumentApp.ElementType.LIST_ITEM) {
          const text = iterator.asListItem().getText();
          Logger.log(text);
          // extract the time and the description
          const _timeEntry = text.match(/(\d{1,2}:\d{1,2})(.*)/);
          if (_timeEntry != null) {
            const time = _timeEntry[1];
            const description = _timeEntry?.[2] ?? '';
            Logger.log(`time: ${time}, description: ${description}`);

            // parse time string to minutes
            const _time = time.match(/(\d{1,2}):(\d{1,2})/);
            const hours = parseInt(_time[1]);
            const minutes = parseInt(_time[2]);
            const totalMinutes = hours * 60 + minutes;
            Logger.log(`totalMinutes: ${totalMinutes}`);

            // add to the entries
            entries.push({
              time: totalMinutes,
              description: description.trim(),
            });
          }
        }

        iterator = iterator.getNextSibling();
      }

      daysWithEntries.push({
        day: day,
        entries: entries,
      });
    }
    lastHeading2 = p;
  }

  return daysWithEntries;
}


function calculateTasksFromTimeEntries(timeEntries: TimeEntry[], day: string) {
  const tasks = new Array<Task>();
  let lastEntry: TimeEntry | null = null;
  for (const entry of timeEntries) {
    if (lastEntry != null) {
      const task = {
        duration: entry.time - lastEntry.time,
        startTime: lastEntry.time,
        endTime: entry.time,
        description: lastEntry.description,
      };
      if (task.duration < 0) {
        throw new Error(`Task duration is negative: ${task.duration} for task ${task.description} on ${day} that starts at ${task.startTime} minutes`);
      }
      tasks.push(task);
    }
    lastEntry = entry;
  }
  return tasks;
}

function sumUpDurationsForRegex(tasks: Task[], exp: RegExp) {
  let totalDuration = 0;
  for (const task of tasks) {
    if (exp.test(task.description)) {
      totalDuration += task.duration;
    }
  }
  return totalDuration;
}

function calculateAllDaysTasks() {
  return readAllDaysWithEntries().map(dayWithEntries => {
    const tasks = calculateTasksFromTimeEntries(dayWithEntries.entries, dayWithEntries.day);
    return {
      day: dayWithEntries.day,
      tasks: tasks,
    };
  });
}

function durationsReport() {
  const daysWithTasks = calculateAllDaysTasks();
  Logger.log('Showing durations for all days:');
  for (const dayWithTasks of daysWithTasks) {
    Logger.log("");
    Logger.log(`Day: ${dayWithTasks.day}`);
    const totalDuration = dayWithTasks.tasks.reduce((acc, task) => acc + task.duration, 0);
    Logger.log(`Total duration: ${totalDuration} minutes`);
    const brTime = sumUpDurationsForRegex(dayWithTasks.tasks, /(break|comida)/i);
    Logger.log(`Breaks/comida: ${brTime} minutes`);
    Logger.log(`Not Breaks/comida: ${totalDuration - brTime} minutes`);
  }
}

function myFunction() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const rowsData = [['Plants', 'Animals'], ['Ficus', 'Goat'], ['Basil', 'Cat'], ['Moss', 'Frog']];
  body.insertParagraph(0, doc.getName())
    .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  const table = body.appendTable(rowsData);
  table.getRow(0).editAsText().setBold(true);
}

