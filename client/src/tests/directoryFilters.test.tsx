// Tests for the directory filters (story #125): the FilterChipGroup component on its own, and
// the real HomeScreen, where filters show on the all-churches view but not on My Favorites.
import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import HomeScreen from "../app/index";
import { FilterChipGroup, FilterOption } from "../components/FilterChipGroup";
import { getChurches } from "../api/churches";
import { MOCK_CHURCHES } from "../constants/mockChurches";

// Stand in for the server: getChurches resolves with the mock data instead of calling fetch.
jest.mock("../api/churches", () => ({ getChurches: jest.fn() }));

beforeEach(() => {
  jest.mocked(getChurches).mockResolvedValue(MOCK_CHURCHES);
});

const SEARCH_PLACEHOLDER = "Search by church name or ZIP code...";

const DISTANCE_CHOICES: FilterOption<number | null>[] = [
  { label: "Any distance", value: null, key: "any" },
  { label: "Within 3 mi", value: 3, key: "3" },
  { label: "Within 5 mi", value: 5, key: "5" },
];

// Signs in, skips the quiz and waits for the church list, so each test starts on the
// all-churches view the way a student would. Returns the render helpers.
const openDirectory = async () => {
  const utils = render(<HomeScreen />);
  await act(async () => {}); // flush the resolved getChurches promise
  fireEvent.changeText(utils.getByPlaceholderText("Username"), "FilterUser");
  fireEvent.press(utils.getByTestId("btn-auth"));
  fireEvent.press(utils.getByTestId("btn-skip-quiz"));
  await utils.findByPlaceholderText(SEARCH_PLACEHOLDER);
  return utils;
};

describe("FilterChipGroup component", () => {
  const renderGroup = (selected: number | null = 3, onSelect = jest.fn()) =>
    render(
      <FilterChipGroup
        title="Distance"
        options={DISTANCE_CHOICES}
        selected={selected}
        onSelect={onSelect}
        testIDPrefix="btn-distance"
      />
    );

  test("given options, when rendered, then the title and every option label show", () => {
    const { getByText } = renderGroup();
    expect(getByText("Distance")).toBeTruthy();
    expect(getByText("Any distance")).toBeTruthy();
    expect(getByText("Within 3 mi")).toBeTruthy();
    expect(getByText("Within 5 mi")).toBeTruthy();
  });

  test("given options, when rendered, then each chip's testID is the prefix plus its key", () => {
    const { getByTestId } = renderGroup();
    expect(getByTestId("btn-distance-any")).toBeTruthy();
    expect(getByTestId("btn-distance-3")).toBeTruthy();
    expect(getByTestId("btn-distance-5")).toBeTruthy();
  });

  test("given a selected value, when rendered, then only that chip is marked selected", () => {
    const { getByTestId } = renderGroup(3);
    expect(getByTestId("btn-distance-3").props.accessibilityState).toEqual({ selected: true });
    expect(getByTestId("btn-distance-5").props.accessibilityState).toEqual({ selected: false });
    expect(getByTestId("btn-distance-any").props.accessibilityState).toEqual({ selected: false });
  });

  test("given a null value is selected, when rendered, then the null option is selected", () => {
    const { getByTestId } = renderGroup(null);
    expect(getByTestId("btn-distance-any").props.accessibilityState).toEqual({ selected: true });
  });

  test("when a chip is pressed, then onSelect gets that chip's value", () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderGroup(3, onSelect);
    fireEvent.press(getByTestId("btn-distance-5"));
    fireEvent.press(getByTestId("btn-distance-any"));
    expect(onSelect).toHaveBeenNthCalledWith(1, 5);
    expect(onSelect).toHaveBeenNthCalledWith(2, null);
  });
});

// Returns whether a chip is selected in its group, e.g. isSelected(utils, "btn-worship-All").
const isSelected = (utils: Awaited<ReturnType<typeof openDirectory>>, testID: string) =>
  utils.getByTestId(testID).props.accessibilityState.selected;

describe("Filters on the all-churches view", () => {
  test("when the directory opens, then all three filter groups show", async () => {
    const utils = await openDirectory();
    expect(utils.getByTestId("directory-filters")).toBeTruthy();
    expect(utils.getByText("Denomination")).toBeTruthy();
    expect(utils.getByText("Worship style")).toBeTruthy();
    expect(utils.getByText("Distance")).toBeTruthy();
  });

  test("when the directory opens, then each group starts on its show-everything chip", async () => {
    const utils = await openDirectory();
    expect(isSelected(utils, "btn-denomination-All")).toBe(true);
    expect(isSelected(utils, "btn-worship-All")).toBe(true);
    expect(isSelected(utils, "btn-distance-any")).toBe(true);
  });

  test("when a chip is pressed, then it becomes the selected one in its group", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("btn-worship-Contemporary"));
    expect(isSelected(utils, "btn-worship-Contemporary")).toBe(true);
    expect(isSelected(utils, "btn-worship-All")).toBe(false);
  });

  test("given the old button text, when the directory opens, then it is gone", async () => {
    const utils = await openDirectory();
    expect(utils.queryByText("Filter Favorites")).toBeNull();
    expect(utils.getByText("My Favorites ★")).toBeTruthy();
  });
});

describe("My Favorites view", () => {
  test("when My Favorites is pressed, then the filters hide and search stays", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));

    expect(utils.queryByTestId("directory-filters")).toBeNull();
    expect(utils.queryByTestId("btn-denomination-All")).toBeNull();
    expect(utils.queryByTestId("btn-worship-All")).toBeNull();
    expect(utils.queryByTestId("btn-distance-any")).toBeNull();
    expect(utils.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeTruthy();
  });

  test("when the button is pressed twice, then the label flips and filters return", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));
    expect(utils.getByText("Show All Churches")).toBeTruthy();

    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));
    expect(utils.getByText("My Favorites ★")).toBeTruthy();
    expect(utils.getByTestId("directory-filters")).toBeTruthy();
  });

  test("given a denomination filter, when favorites open, then saved ones still show", async () => {
    const utils = await openDirectory();
    // Crossroads is Nondenominational, so the Catholic filter hides it on the all-churches view.
    fireEvent.press(utils.getByTestId("favorite-button-2"));
    fireEvent.press(utils.getByTestId("btn-denomination-Catholic"));
    expect(utils.queryByText("Crossroads Bible Church")).toBeNull();

    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));
    expect(utils.getByText("Crossroads Bible Church")).toBeTruthy();
    expect(utils.queryByText("Cathedral of St. Andrew")).toBeNull(); // not saved
  });

  test("given worship and distance filters, when on favorites, then saved ones show", async () => {
    const utils = await openDirectory();
    // Calvary is Blended and 5.1 mi away, so Traditional + Within 3 mi hides it.
    fireEvent.press(utils.getByTestId("favorite-button-3"));
    fireEvent.press(utils.getByTestId("btn-worship-Traditional"));
    fireEvent.press(utils.getByTestId("btn-distance-3"));
    expect(utils.queryByText("Calvary Church")).toBeNull();

    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));
    expect(utils.getByText("Calvary Church")).toBeTruthy();
  });

  test("given picked filters, when going to favorites and back, then they apply", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("btn-denomination-Catholic"));

    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));

    expect(isSelected(utils, "btn-denomination-Catholic")).toBe(true);
    expect(utils.getByText("Cathedral of St. Andrew")).toBeTruthy();
    expect(utils.queryByText("Crossroads Bible Church")).toBeNull();
  });

  test("given two saved churches, when searching by name, then only the match shows", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("favorite-button-1"));
    fireEvent.press(utils.getByTestId("favorite-button-2"));
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));

    fireEvent.changeText(utils.getByPlaceholderText(SEARCH_PLACEHOLDER), "Crossroads");

    expect(utils.getByText("Crossroads Bible Church")).toBeTruthy();
    expect(utils.queryByText("Cathedral of St. Andrew")).toBeNull();
  });

  test("given two saved churches, when searching by ZIP, then only the match shows", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("favorite-button-1"));
    fireEvent.press(utils.getByTestId("favorite-button-2"));
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));

    fireEvent.changeText(utils.getByPlaceholderText(SEARCH_PLACEHOLDER), "49504");

    expect(utils.getByText("Crossroads Bible Church")).toBeTruthy();
    expect(utils.queryByText("Cathedral of St. Andrew")).toBeNull();
  });

  test("when a church is unsaved on My Favorites, then it leaves the list", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("favorite-button-1"));
    fireEvent.press(utils.getByTestId("favorite-button-2"));
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));

    fireEvent.press(utils.getByTestId("favorite-button-1"));

    expect(utils.queryByText("Cathedral of St. Andrew")).toBeNull();
    expect(utils.getByText("Crossroads Bible Church")).toBeTruthy();
  });

  test("given nothing is saved, when My Favorites opens, then it says so", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));
    expect(utils.getByText("You haven't saved any churches yet.")).toBeTruthy();
  });

  test("given a search with no saved match, when on favorites, then no-match shows", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("favorite-button-1"));
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));

    fireEvent.changeText(utils.getByPlaceholderText(SEARCH_PLACEHOLDER), "zzz-no-church");

    expect(utils.getByText("No churches found matching your criteria.")).toBeTruthy();
  });

  test("given favorites showing, when logging out and in again, then filters show", async () => {
    const utils = await openDirectory();
    fireEvent.press(utils.getByTestId("btn-toggle-favorites"));
    fireEvent.press(utils.getByText("Log Out"));

    fireEvent.changeText(utils.getByPlaceholderText("Username"), "NextStudent");
    fireEvent.press(utils.getByTestId("btn-auth"));
    fireEvent.press(utils.getByTestId("btn-skip-quiz"));

    expect(utils.getByTestId("directory-filters")).toBeTruthy();
    expect(utils.getByText("My Favorites ★")).toBeTruthy();
  });
});
