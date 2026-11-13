// Tests for the business logic layer. The database layer is replaced with a
// pretend one, so no real database is needed.
jest.mock("../src/db/churchRepository", () => ({
  getAllChurches: jest.fn(),
  getChurchById: jest.fn()
}));

const churchRepository = require("../src/db/churchRepository");
const { listChurches, getChurch, toChurch, formatServiceTimes } =
  require("../src/services/churchService");

const row = overrides => ({
  id: 7,
  name: "Calvary Church",
  address: "707 East Beltline Ave NE",
  city: "Grand Rapids",
  state: "MI",
  zip: "49525",
  denomination: "Nondenominational",
  worship_style: "Blended",
  description: "Large community.",
  rating: "4.6",
  distance_miles: "5.1",
  services: [
    { day_of_week: "Sunday", start_time: "10:45:00", visits: [{ comment: "Loved it" }] },
    { day_of_week: "Sunday", start_time: "09:00:00", visits: [{ comment: null }, { comment: "  " }] }
  ],
  ...overrides
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe("toChurch", () => {
  test("renames database columns to the names the app uses", () => {
    const church = toChurch(row());

    expect(church.zipcode).toBe("49525");
    expect(church.worshipStyle).toBe("Blended");
    expect(church.distanceMiles).toBe(5.1);
    expect(church).not.toHaveProperty("zip");
    expect(church).not.toHaveProperty("worship_style");
  });

  test("turns the id and number columns into the right types", () => {
    const church = toChurch(row());

    expect(church.id).toBe("7");
    expect(church.rating).toBe(4.6);
  });

  test("collects comments from visits and skips empty ones", () => {
    expect(toChurch(row()).userFeedback).toEqual(["Loved it"]);
  });

  test("handles a church with no services or comments", () => {
    const church = toChurch(row({ services: [], rating: null, description: null }));

    expect(church.serviceTimes).toBe("");
    expect(church.userFeedback).toEqual([]);
    expect(church.rating).toBe(0);
    expect(church.description).toBe("");
  });
});

describe("formatServiceTimes", () => {
  test("puts two times on one line in order", () => {
    expect(formatServiceTimes([
      { day_of_week: "Sunday", start_time: "10:45:00" },
      { day_of_week: "Sunday", start_time: "09:00:00" }
    ])).toBe("Sun 9:00 AM & 10:45 AM");
  });

  test("separates three or more times with commas", () => {
    expect(formatServiceTimes([
      { day_of_week: "Sunday", start_time: "08:30:00" },
      { day_of_week: "Sunday", start_time: "10:30:00" },
      { day_of_week: "Sunday", start_time: "17:30:00" }
    ])).toBe("Sun 8:30 AM, 10:30 AM, 5:30 PM");
  });

  test("shows noon and midnight correctly", () => {
    expect(formatServiceTimes([
      { day_of_week: "Wednesday", start_time: "12:00:00" },
      { day_of_week: "Wednesday", start_time: "00:30:00" }
    ])).toBe("Wed 12:30 AM & 12:00 PM");
  });

  test("lists days in week order", () => {
    expect(formatServiceTimes([
      { day_of_week: "Wednesday", start_time: "19:00:00" },
      { day_of_week: "Sunday", start_time: "10:00:00" }
    ])).toBe("Sun 10:00 AM; Wed 7:00 PM");
  });
});

describe("listChurches", () => {
  beforeEach(() => {
    churchRepository.getAllChurches.mockResolvedValue([
      row({ id: 1, name: "Cathedral of St. Andrew", denomination: "Catholic", worship_style: "Liturgical", city: "Grand Rapids" }),
      row({ id: 2, name: "Crossroads Bible Church", denomination: "Nondenominational", worship_style: "Contemporary", city: "Wyoming" })
    ]);
  });

  test("returns every church from the database layer", async () => {
    const churches = await listChurches();

    expect(churches.map(c => c.id)).toEqual(["1", "2"]);
    expect(churchRepository.getAllChurches).toHaveBeenCalledTimes(1);
  });

  test("searches by name, case does not matter", async () => {
    const churches = await listChurches({ search: "cathedral" });

    expect(churches.map(c => c.id)).toEqual(["1"]);
  });

  test("searches by city", async () => {
    const churches = await listChurches({ search: "wyoming" });

    expect(churches.map(c => c.id)).toEqual(["2"]);
  });

  test("filters by denomination", async () => {
    const churches = await listChurches({ denomination: "Catholic" });

    expect(churches.map(c => c.id)).toEqual(["1"]);
  });

  test("filters by worship style", async () => {
    const churches = await listChurches({ worshipStyle: "contemporary" });

    expect(churches.map(c => c.id)).toEqual(["2"]);
  });

  test("returns an empty list when nothing matches", async () => {
    expect(await listChurches({ search: "nothing here" })).toEqual([]);
  });

  test("passes database errors up", async () => {
    churchRepository.getAllChurches.mockRejectedValue(new Error("Database error"));

    await expect(listChurches()).rejects.toThrow("Database error");
  });
});

describe("getChurch", () => {
  test("returns the church for a valid id", async () => {
    churchRepository.getChurchById.mockResolvedValue(row({ id: 3 }));

    const church = await getChurch("3");

    expect(church.id).toBe("3");
    expect(churchRepository.getChurchById).toHaveBeenCalledWith(3);
  });

  test("returns null when no church has that id", async () => {
    churchRepository.getChurchById.mockResolvedValue(null);

    expect(await getChurch("999")).toBeNull();
  });

  test("returns null for an id that is not a number, without asking the database", async () => {
    expect(await getChurch("abc")).toBeNull();
    expect(churchRepository.getChurchById).not.toHaveBeenCalled();
  });
});