import Countdown from 'react-countdown';
import './index.css';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"

const Completionist = () => <span>You are good to go!</span>;

const padZero = (digit: number) => { return digit.toString().padStart(2, '0') };

const renderer = ({ hours, minutes, seconds, completed }: { hours: number; minutes: number; seconds: number; completed: boolean}) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <div>
      <h1 className="text-white text-9xl tracking-widest font-medium font-mono">{padZero(hours)}:{padZero(minutes)}:{padZero(seconds)}</h1>
    </div>
  }
};

type DaysOfWeekThing = { label: string; isSelected: boolean }[];

const daysOfWeekThing = [
  { label: 'M', isSelected: false },
  { label: 'T', isSelected: false },
  { label: 'W', isSelected: false },
  { label: 'T', isSelected: false },
  { label: 'F', isSelected: false },
  { label: 'S', isSelected: false },
  { label: 'S', isSelected: false },
] as DaysOfWeekThing;

const testIfCurrentDay = (timer: TimerBody) => {
  const currDate = new Date();
  const currDay = currDate.getDay() - 1; // our days array is zero indexed
  if (timer.repeat) {
    return timer.repeatDays?.[currDay];
  }

  const currHour = currDate.getHours();
  const currMinute = currDate.getMinutes();

  const { hours, minutes } = getHoursMinutesFromTime(timer.time);

  if (currHour < hours || (currHour === hours && currMinute < minutes)) {
    return true;
  }

  return false;
}

function AddCountdownDialog({ addDialog }: { addDialog: (body: TimerBody) => void }) {
  const [repeat, setRepeat] = useState<boolean>(false);
  const [countdownName, setCountdownName] = useState<string>('');
  const [countdownTime, setCountdownTime] = useState<string>('');
  const [daysOfWeek, setDaysOfWeek] = useState<DaysOfWeekThing>(daysOfWeekThing);
  const [open, setOpen] = useState<boolean>(false);

  const clearInput = () => {
    setRepeat(false);
    setCountdownName('');
    setCountdownTime('');
    setDaysOfWeek(daysOfWeekThing);
  }

  return (
    <Dialog open={open} onOpenChange={() => { 
      setOpen(!open); 
      clearInput();
    }}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button variant="outline">Add Countdown</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Countdown</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={countdownName}
              onChange={(e) => setCountdownName(e.currentTarget.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Time
            </Label>
            <Input
              id="username"
              value={countdownTime}
              onChange={(e) => setCountdownTime(e.currentTarget.value)}
              className="col-span-3"
              type="time"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Repeat
            </Label>
            <Checkbox id="terms1" onCheckedChange={() => {setRepeat(!repeat)}} checked={repeat} className="" />
          </div>
          {
            repeat 
              ?           
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Days
                  </Label>
                  <div className="flex flex-row">
                    {
                      daysOfWeek.map((day, idx) => (
                        <div 
                          className={`mx-1 ${day.isSelected ? 'border-b-4' : null} border-white h-8 w-max flex justify-center items-center p-2`} 
                          onClick={() => {
                            const copy = [...daysOfWeek];
                            copy[idx].isSelected = !copy[idx].isSelected;
                            setDaysOfWeek(copy);
                          }}>
                          <p className="text-white">
                            {day.label}
                          </p>
                        </div>
                      ))
                    }
                  </div>
                </div>
                : null
          }
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => {
            const body = {
              name: countdownName,
              time: countdownTime,
              repeat: repeat
            } as TimerBody;

            if (repeat) {
              body.repeatDays = daysOfWeek.map(day => day.isSelected);
            }

            addDialog(body);
            setOpen(false);
            clearInput();
          }}>Add Countdown</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

interface TimerBody {
  name: string;
  repeatDays?: boolean[];
  time: string;
  repeat: boolean;
}

function getHoursMinutesFromTime(time: string) {
  const parts = time.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  return {
    hours, minutes
  };
}

function sortTimers(a: TimerBody, b: TimerBody) {
  const aParts = a.time.split(':');
  const bParts = b.time.split(':');

  const aHours = parseInt(aParts[0]);

  const bHours = parseInt(bParts[0]);

  if (aHours < bHours) {
    return -1;
  } else if (aHours > bHours) {
    return 1;
  } else {
    const aMinutes = parseInt(aParts[1]);
    const bMinutes = parseInt(bParts[1]);

    if (aMinutes < bMinutes) {
      return -1;
    } else if (aMinutes > bMinutes) {
      return 1;
    }
  }

  return -1
}

function orderByOperationalTime(timers: TimerBody[]) {
  if (timers.length <= 1) {
    return timers;
  }

  const currDate = new Date();
  const currDateHours = currDate.getHours();
  const currDateMinutes = currDate.getMinutes();

  const { hours: firstHours, minutes: firstMinutes } = getHoursMinutesFromTime(timers[0].time);
  const { hours: lastHours, minutes: lasMinutes } = getHoursMinutesFromTime(timers[timers.length - 1].time);

  if (currDateHours < firstHours 
    || currDateHours === firstHours && currDateMinutes <= firstMinutes
    || currDateHours > lastHours
    || currDateHours === firstHours && currDateMinutes >= lasMinutes
  ) {
    return timers;
  }

  const before: TimerBody[] = [];
  const after: TimerBody[] = [];

  for (let i = 0; i < timers.length; i++) {
    const { hours, minutes } = getHoursMinutesFromTime(timers[i].time);
    if (hours < currDateHours || hours === currDateHours && minutes < currDateMinutes) {
      before.push(timers[i]);
    } else if (hours > currDateHours || hours === currDateHours && minutes > currDateMinutes) {
      after.push(timers[i]);
    } else {
      before.push(timers[i]);
    }
  }

  return after.concat(before);
}

const fetchExistingTimers = () => {
  const existingDataFromStorage = localStorage.getItem('timer');
  let timers = [] as TimerBody[];
  if (existingDataFromStorage) {
    timers = JSON.parse(existingDataFromStorage);
  }

  timers.sort(sortTimers);
  return timers;
}

const findTimeDiffMilliSeconds = (timer: TimerBody) => {
  const currTime = new Date();
  const currHour = currTime.getHours();
  const currMinute = currTime.getMinutes();
  const currSeconds = currTime.getSeconds();

  const { hours, minutes } = getHoursMinutesFromTime(timer.time);

  const hoursDiff = hours - currHour;
  const minutesDiff = minutes - currMinute - 1;
  const secondsDiff = 60 - currSeconds;

  return (secondsDiff + (minutesDiff * 60) + (hoursDiff * 60 * 60)) * 1000;
}

function App() {
  const [timers, setTimers] = useState<TimerBody[]>([]);
  const [currTimer, setCurrTimer] = useState<TimerBody | null>(null);

  useEffect(() => {
    const timers = fetchExistingTimers();
    const todaysTimers = timers.filter(testIfCurrentDay);
    const orderedTimers = orderByOperationalTime(todaysTimers);
    setTimers(orderedTimers);
    setCurrTimer(orderedTimers[0])
  }, [])

  const addDialog = (body: TimerBody) => {
    const toAdd = fetchExistingTimers();
    toAdd.sort(sortTimers)
    toAdd.push(body);
    localStorage.setItem('timer', JSON.stringify(toAdd));
    const todaysTimers = toAdd.filter(testIfCurrentDay);
    const orderedTimers = orderByOperationalTime(todaysTimers);
    setTimers(orderedTimers);
    setCurrTimer(orderedTimers[0]);
  }

  const removePastTimers = () => {
    const existing = fetchExistingTimers();
    existing.sort(sortTimers);
    const toKeep = [];

    for (const timer of existing) {
      if (timer.repeat || testIfCurrentDay(timer)) {
        toKeep.push(timer);
      }
    }

    localStorage.setItem('timer', JSON.stringify(toKeep));
  }

  const onCurrTimerComplete = () => {
    const remainingTimers = timers.slice(1);

    if (remainingTimers.length >= 1) {
      setCurrTimer(remainingTimers[0]);
    } else {
      setCurrTimer(null);
    }

    setTimers(remainingTimers);
    removePastTimers();
  }

  return (
    <div className="min-h-screen min-w-screen bg-slate-900 justify-center items-center flex flex-col gap-16" >
      <div>
        <h1 className="scroll-m-20 text-9xl font-extrabold tracking-tight text-white">
          {currTimer?.name}
        </h1>
      </div>
      {
        currTimer ? 
          <Countdown 
            date={Date.now() + findTimeDiffMilliSeconds(currTimer)}
            renderer={renderer}
            onComplete={() => onCurrTimerComplete()}
            key={currTimer.name}
          />
          : null
      }
      <AddCountdownDialog addDialog={addDialog} />
      {JSON.stringify(timers)}

      <Button onClick={() => { localStorage.removeItem('timer'); setTimers([]); }}>Clear</Button>
    </div>
  )
}

export default App
