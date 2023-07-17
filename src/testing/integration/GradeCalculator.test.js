/**
 * @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import "./mocks/MockFirebase";
import { MockProvider, delay, mockStore } from "./mocks/MockProvider";
import { GradeCalculator } from "../../GradeCalculator/GradeCalculator.js";
import { mockAssessment, mockUser } from "./mocks/MockData";
import { mockDB } from "./mocks/MockFirestore";

import {
  addAssessment,
  addComponent,
  clearCalculator,
  deleteAssessment,
  deleteComponent,
  saveCalculator,
  updateAssessment,
  updateComponent,
} from "../../GradeCalculator/GradeStore";

describe("Integration Test: Grade Calculator Page", () => {
  let assessmentIndex;
  let componentIndex;

  const WrappedCalculator = () => {
    return (
      <MockProvider>
        <GradeCalculator />
      </MockProvider>
    );
  };

  it("Render loading spinner initially", () => {
    act(() => render(<WrappedCalculator />));

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it('Render "No data saved" when there is no data', async () => {
    await act(() => render(<WrappedCalculator />));

    // Verify that calculator view is empty
    expect(
      screen.getByText("You have no saved data. Get started!")
    ).toBeInTheDocument();
  });

  it("Add module successfully", async () => {
    // Add assessment
    await act(() => mockStore.dispatch(addAssessment));
    assessmentIndex = 0;
    componentIndex = 0;

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedCalculator />);
      container = renderedContainer;
    });

    // Verify that calculator view is not empty
    const modules = container.getElementsByClassName("module-card");
    expect(modules.length).toBe(assessmentIndex + 1);
  });

  it("Add component successfully", async () => {
    // Add component
    await act(() => mockStore.dispatch(addComponent(assessmentIndex)));
    componentIndex += 1;

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedCalculator />);
      container = renderedContainer;
    });

    // Verify that there are 2 components
    const components = container.getElementsByClassName(
      `assessment-card-${assessmentIndex}`
    );
    expect(components.length).toBe(componentIndex + 1);
  });

  it("Delete component successfully", async () => {
    // Delete component
    await act(() =>
      mockStore.dispatch(deleteComponent(assessmentIndex, componentIndex))
    );
    componentIndex -= 1;

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedCalculator />);
      container = renderedContainer;
    });

    // Verify that there is 1 component left
    const components = container.getElementsByClassName(
      `assessment-card-${assessmentIndex}`
    );
    expect(components.length).toBe(componentIndex + 1);
  });

  it("Calculate grade correctly", async () => {
    // Input into component
    for (const key in mockAssessment.components[componentIndex]) {
      const value = mockAssessment.components[componentIndex][key];
      await act(() =>
        mockStore.dispatch(
          updateComponent(assessmentIndex, componentIndex, key, value)
        )
      );
    }
    await act(() =>
      mockStore.dispatch(
        updateAssessment(assessmentIndex, mockAssessment.title)
      )
    );

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedCalculator />);
      container = renderedContainer;
    });

    // Verify that calcuate grade is correct
    const desiredGradeInput = container.querySelector(
      `#desired-score-${assessmentIndex}`
    );
    fireEvent.change(desiredGradeInput, {
      target: { value: mockAssessment.desiredGrade },
    });
    const calculateGradeButton = container.querySelector(
      `#calculate-grade-button-${assessmentIndex}`
    );
    expect(calculateGradeButton).toBeInTheDocument();
    await act(() => fireEvent.click(calculateGradeButton));
    expect(screen.queryByText("Current Score: 75.00")).toBeInTheDocument();
    expect(screen.queryByText("Score Required: 93.75")).toBeInTheDocument();
  });

  it("Delete module successfully", async () => {
    // Delete component
    await act(() => mockStore.dispatch(deleteAssessment(assessmentIndex)));
    assessmentIndex -= 1;
    await act(() => render(<WrappedCalculator />));

    // Verify that calculator view is empty
    expect(
      screen.getByText("You have no saved data. Get started!")
    ).toBeInTheDocument();
  });

  it("Save calculator successfully", async () => {
    // Add module
    await act(() => mockStore.dispatch(addAssessment));
    assessmentIndex = 0;

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedCalculator />);
      container = renderedContainer;
    });

    // Verify that calculator view is not empty
    const modules = container.getElementsByClassName("module-card");
    await act(() =>
      waitFor(() => expect(modules.length).toBe(assessmentIndex + 1))
    );

    // Save calculator
    await act(() => mockStore.dispatch(saveCalculator(mockUser.uid)));
    expect(mockDB.assessments.length).toBeGreaterThan(0);
  });

  it("Clear calculator successfully", async () => {
    // Clear calculator
    await act(() => mockStore.dispatch(clearCalculator(mockUser.uid)));
    await act(() => render(<WrappedCalculator />));

    expect(
      screen.getByText("You have no saved data. Get started!")
    ).toBeInTheDocument();
  });
});
