// Tests for the account page (story #122: "As a student, I can open up an account
// menu with my information"). Covers the describePreferences helper, the AccountScreen
// component on its own, and the real HomeScreen driven the way a student would use it.
import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import React from "react";
import { render, fireEvent, act, within } from "@testing-library/react-native";
import HomeScreen from "../app/index";
import { AccountScreen } from "../components/AccountScreen";
import { getChurches } from "../api/churches";
import { MOCK_CHURCHES } from "../constants/mockChurches";
import { NO_PREFERENCE, QuizAnswers } from "../constants/quizQuestions";
import { describePreferences, NOT_SET } from "../utils/accountInfo";

// Stand in for the server: getChurches resolves with the mock data instead of calling fetch.
jest.mock("../api/churches", () => ({ getChurches: jest.fn() }));

beforeEach(() => {
  jest.mocked(getChurches).mockResolvedValue(MOCK_CHURCHES);
});

const SEARCH_PLACEHOLDER = "Search by church name or ZIP code...";

const SAMPLE_ANSWERS: QuizAnswers = {
  denomination: "Christian Reformed",
  worshipStyle: "Contemporary",
  maxDistance: "5",
};

// Renders the app, waits for the mocked church load, and signs in as AccountUser,
// which lands on the quiz. Returns the render helpers.
const signIn = async () => {
  const utils = render(<HomeScreen />);
  await act(async () => {}); // flush the resolved getChurches promise
  fireEvent.changeText(utils.getByPlaceholderText("Username"), "AccountUser");
  fireEvent.press(utils.getByTestId("btn-auth"));
  return utils;
};

type Utils = Awaited<ReturnType<typeof signIn>>;

// Checks that one row on the account page shows the expected value,
// e.g. expectRow(utils, "Username", "AccountUser").
const expectRow = (utils: Pick<Utils, "getByTestId">, label: string, value: string) => {
  const row = utils.getByTestId(`account-row-${label}`);
  expect(within(row).getByText(value)).toBeTruthy();
};

describe("describePreferences", () => {
  test("given no quiz answers, when described, then every preference is Not set", () => {
    const rows = describePreferences(null);
    expect(rows.map((row) => row.label)).toEqual([
      "Denomination",
      "Worship style",
      "Distance from campus",
    ]);
    expect(rows.every((row) => row.value === NOT_SET)).toBe(true);
  });

  test("given quiz answers, when described, then the quiz's own wording is shown", () => {
    expect(describePreferences(SAMPLE_ANSWERS)).toEqual([
      { label: "Denomination", value: "Christian Reformed" },
      { label: "Worship style", value: "Contemporary" },
      { label: "Distance from campus", value: "Within 5 miles" },
    ]);
  });

  test("given no-preference answers, when described, then they read as No preference", () => {
    const rows = describePreferences({
      denomination: NO_PREFERENCE,
      worshipStyle: NO_PREFERENCE,
      maxDistance: NO_PREFERENCE,
    });
    expect(rows.map((row) => row.value)).toEqual([
      "No preference",
      "No preference",
      "Distance doesn’t matter",
    ]);
  });

  test("given an answer that matches no option, when described, then the raw value is shown", () => {
    const rows = describePreferences({ ...SAMPLE_ANSWERS, denomination: "Lutheran" });
    expect(rows[0]).toEqual({ label: "Denomination", value: "Lutheran" });
  });
});

describe("AccountScreen component", () => {
  const renderAccount = (overrides: Partial<React.ComponentProps<typeof AccountScreen>> = {}) =>
    render(
      <AccountScreen
        username="  Sam  "
        quizAnswers={SAMPLE_ANSWERS}
        notificationsOn={false}
        onNotificationsChange={jest.fn()}
        onReturnHome={jest.fn()}
        onLogout={jest.fn()}
        {...overrides}
      />
    );

  test("given student info, when rendered, then every detail is in its row", () => {
    const utils = renderAccount();
    expect(utils.getByText("My Account")).toBeTruthy();
    expectRow(utils, "Username", "Sam"); // surrounding spaces trimmed
    expectRow(utils, "Denomination", "Christian Reformed");
    expectRow(utils, "Worship style", "Contemporary");
    expectRow(utils, "Distance from campus", "Within 5 miles");
    expectRow(utils, "Notifications", "Off");
  });

  test("when rendered, then it has exactly the login, quiz and notification sections", () => {
    const { getByText, queryByText } = renderAccount();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Quiz Answers")).toBeTruthy();
    expect(getByText("Notification Preferences")).toBeTruthy();
    expect(queryByText("Email")).toBeNull();
    expect(queryByText(/Saved churches/)).toBeNull();
  });

  test("given a skipped quiz, when rendered, then preferences show Not set", () => {
    const { getAllByText } = renderAccount({ quizAnswers: null });
    expect(getAllByText(NOT_SET)).toHaveLength(3);
  });

  test("given notifications are off, when rendered, then the switch is off", () => {
    const { getByTestId } = renderAccount();
    expect(getByTestId("switch-notifications").props.value).toBe(false);
  });

  test("given notifications are on, when rendered, then the switch is on and reads On", () => {
    const utils = renderAccount({ notificationsOn: true });
    expect(utils.getByTestId("switch-notifications").props.value).toBe(true);
    expectRow(utils, "Notifications", "On");
  });

  test("when the switch is flipped, then onNotificationsChange gets the new value", () => {
    const onNotificationsChange = jest.fn();
    const { getByTestId } = renderAccount({ onNotificationsChange });
    fireEvent(getByTestId("switch-notifications"), "valueChange", true);
    expect(onNotificationsChange).toHaveBeenCalledTimes(1);
    expect(onNotificationsChange).toHaveBeenCalledWith(true);
  });

  test("when Return Home is pressed, then onReturnHome is called once", () => {
    const onReturnHome = jest.fn();
    const { getByTestId } = renderAccount({ onReturnHome });
    fireEvent.press(getByTestId("btn-account-home"));
    expect(onReturnHome).toHaveBeenCalledTimes(1);
  });

  test("when Log Out is pressed, then onLogout is called once", () => {
    const onLogout = jest.fn();
    const { getByTestId } = renderAccount({ onLogout });
    fireEvent.press(getByTestId("btn-account-logout"));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});

describe("Account page in the app", () => {
  test("when Account is pressed, then the account page replaces the current screen", async () => {
    const utils = await signIn();
    expect(utils.queryByTestId("account-screen")).toBeNull();

    fireEvent.press(utils.getByTestId("btn-account"));

    expect(utils.getByTestId("account-screen")).toBeTruthy();
    expect(utils.queryByTestId("btn-submit-quiz")).toBeNull(); // quiz is gone
    expect(utils.queryByText("Welcome, AccountUser!")).toBeNull(); // header is gone
    expectRow(utils, "Username", "AccountUser");
  });

  test("given the quiz was submitted, when the account page opens, then it shows the answers", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("option-denomination-Christian Reformed"));
    fireEvent.press(utils.getByTestId("option-worshipStyle-Contemporary"));
    fireEvent.press(utils.getByTestId("option-maxDistance-5"));
    fireEvent.press(utils.getByTestId("btn-submit-quiz"));

    fireEvent.press(utils.getByTestId("btn-account"));
    expectRow(utils, "Denomination", "Christian Reformed");
    expectRow(utils, "Worship style", "Contemporary");
    expectRow(utils, "Distance from campus", "Within 5 miles");
  });

  test("given the quiz was skipped, when the account page opens, then preferences show Not set", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-skip-quiz"));
    fireEvent.press(utils.getByTestId("btn-account"));
    expect(utils.getAllByText(NOT_SET)).toHaveLength(3);
  });

  test("when Return Home is pressed, then the student is back on the directory", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-account"));
    fireEvent.press(utils.getByTestId("btn-account-home"));

    expect(utils.queryByTestId("account-screen")).toBeNull();
    expect(await utils.findByPlaceholderText(SEARCH_PLACEHOLDER)).toBeTruthy();
    expect(utils.getByText("Welcome, AccountUser!")).toBeTruthy();
  });

  test("given saved churches, when the student goes to Account and back, then they stay saved", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-skip-quiz"));
    fireEvent.press(utils.getByTestId("favorite-button-1"));

    fireEvent.press(utils.getByTestId("btn-account"));
    fireEvent.press(utils.getByTestId("btn-account-home"));
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));

    expect(utils.getByText("Cathedral of St. Andrew")).toBeTruthy();
    expect(utils.queryByText("Crossroads Bible Church")).toBeNull();
  });

  test("when Log Out is pressed on the account page, then the sign-in page shows", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-account"));
    fireEvent.press(utils.getByTestId("btn-account-logout"));

    expect(utils.getByText("Find Your Community")).toBeTruthy();
    expect(utils.queryByTestId("account-screen")).toBeNull();
  });

  test("given a log out from the account page, when someone signs in again, then they start at the quiz", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-account"));
    fireEvent.press(utils.getByTestId("btn-account-logout"));

    fireEvent.changeText(utils.getByPlaceholderText("Username"), "NextStudent");
    fireEvent.press(utils.getByTestId("btn-auth"));

    expect(utils.getByTestId("btn-submit-quiz")).toBeTruthy();
    fireEvent.press(utils.getByTestId("btn-account"));
    expectRow(utils, "Username", "NextStudent");
  });
});

describe("Notifications on the account page", () => {
  // Signs in, skips the quiz and waits for the directory, so tests start where a student would.
  const openDirectory = async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-skip-quiz"));
    await utils.findByPlaceholderText(SEARCH_PLACEHOLDER);
    return utils;
  };

  test("given the directory, when it renders, then there is no notifications control in the filters", async () => {
    const utils = await openDirectory();
    expect(utils.queryByTestId("btn-toggle-notifications")).toBeNull();
    expect(utils.queryByTestId("switch-notifications")).toBeNull();
    expect(utils.queryByText(/Notifications/)).toBeNull();
  });

  test("given a new sign-in, when the account page opens, then notifications are on", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-account"));
    expect(utils.getByTestId("switch-notifications").props.value).toBe(true);
    expectRow(utils, "Notifications", "On");
  });

  test("when the switch is turned off, then the page reads Off", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-account"));
    fireEvent(utils.getByTestId("switch-notifications"), "valueChange", false);
    expect(utils.getByTestId("switch-notifications").props.value).toBe(false);
    expectRow(utils, "Notifications", "Off");
  });

  test("given notifications turned off, when the student goes home and back, then they stay off", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-account"));
    fireEvent(utils.getByTestId("switch-notifications"), "valueChange", false);

    fireEvent.press(utils.getByTestId("btn-account-home"));
    await utils.findByPlaceholderText(SEARCH_PLACEHOLDER);
    fireEvent.press(utils.getByTestId("btn-account"));

    expect(utils.getByTestId("switch-notifications").props.value).toBe(false);
  });

  test("given notifications turned off, when the student logs out and back in, then they are on again", async () => {
    const utils = await signIn();
    fireEvent.press(utils.getByTestId("btn-account"));
    fireEvent(utils.getByTestId("switch-notifications"), "valueChange", false);
    fireEvent.press(utils.getByTestId("btn-account-logout"));

    fireEvent.changeText(utils.getByPlaceholderText("Username"), "NextStudent");
    fireEvent.press(utils.getByTestId("btn-auth"));
    fireEvent.press(utils.getByTestId("btn-account"));

    expect(utils.getByTestId("switch-notifications").props.value).toBe(true);
  });
});
