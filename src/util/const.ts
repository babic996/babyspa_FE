import { AxiosError } from "axios";
import { toastErrorNotification } from "./toastNotification";

export const DEFAULT_PAGE_SIZE = 10;

export const calendarMessages = {
  today: "Danas",
  previous: "Prethodni",
  next: "Naredni",
  month: "Mjesec",
  week: "Sedmica",
  day: "Dan",
  agenda: "Agenda",
  date: "Datum",
  time: "Vrijeme",
  event: "Događaj",
};

export const errorResponse = (e: unknown) => {
  if (e instanceof AxiosError) {
    const errorMessage = e.response?.data?.message || "Došlo je do greške.";
    return toastErrorNotification(errorMessage);
  } else {
    return toastErrorNotification("Došlo je do greške.");
  }
};

export const groupDataReportType = [
  { value: "day", name: "Grupiši rezultate po danu" },
  { value: "month", name: "Grupiši rezultate po mjesecu" },
  { value: "year", name: "Grupiši rezultate po godini" },
];
