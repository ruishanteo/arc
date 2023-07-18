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
import { ModulePlanner } from "../../ModulePlanner/ModulePlanner";
import { mockDegree, mockSemester, mockUser } from "./mocks/MockData";
import { mockDB } from "./mocks/MockFirestore";

import {
  addSem,
  addModule,
  clearPlanner,
  deleteSem,
  deleteModule,
  updateModule,
  updateDegrees,
  savePlanner
} from "../../ModulePlanner/PlannerStore";

describe("Integration Test: Module Planner Page", () => {
    let semIndex;
    let modIndex;
  
    const WrappedPlanner = () => {
      return (
        <MockProvider>
          <ModulePlanner />
        </MockProvider>
      );
    };

    it("Render loading spinner initially", () => {
      act(() => render(<WrappedPlanner />));
  
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it('Render instruction panel initially', async () => {
      await act(() => render(<WrappedPlanner />));
  
      expect(
        screen.getByTestId("instruction-panel")
      ).toBeInTheDocument();
    });

    it("Render empty planner when there is no data", async () => {
      let container;
      await act(() => {
        const { container: renderedContainer } = render(<WrappedPlanner />);
        container = renderedContainer;
      });
  
      const semesters = container.getElementsByClassName("semester-card");
      expect(semesters.length).toBe(0);
    });

    it("Add semester successfully", async () => {
      await act(() => mockStore.dispatch(addSem));
      semIndex = 0;
      modIndex = 0;

      let container;
      await act(() => {
        const { container: renderedContainer } = render(<WrappedPlanner />);
        container = renderedContainer;
      });
  
      const semesters = container.getElementsByClassName("semester-card");
      expect(semesters.length).toBe(semIndex + 1);
    });

    it("Add module successfully", async () => {
      await act(() => mockStore.dispatch(addModule(semIndex)));
      modIndex += 1;

      let container;
      await act(() => {
        const { container: renderedContainer } = render(<WrappedPlanner />);
        container = renderedContainer;
      });
  
      const modules = container.getElementsByClassName(`module-card-${semIndex}`);
      expect(modules.length).toBe(modIndex + 1);
    });

    it("Delete module successfully", async () => {
      await act(() => mockStore.dispatch(deleteModule(semIndex, modIndex)));
      modIndex -= 1;

      let container;
      await act(() => {
        const { container: renderedContainer } = render(<WrappedPlanner />);
        container = renderedContainer;
      });
  
      const modules = container.getElementsByClassName(`module-card-${semIndex}`);
      expect(modules.length).toBe(modIndex + 1);
    });

    it("Delete semester successfully", async () => {
      await act(() => mockStore.dispatch(deleteSem(semIndex)));

      let container;
      await act(() => {
        const { container: renderedContainer } = render(<WrappedPlanner />);
        container = renderedContainer;
      });
  
      const semesters = container.getElementsByClassName(`semester-card`);
      expect(semesters.length).toBe(semIndex);
    });

    it("Select degree successfully", async () => {
      await act(() => render(<WrappedPlanner />));
      await act(async () => {
        const degreeSelector = screen.getByTestId("degree-selector")
        const input = degreeSelector.querySelector("input");
        degreeSelector.focus()
        //fireEvent.click(degreeSelector); // Open the dropdown menu
        fireEvent.change(input, {target:{value:'Computer Science'}})
        fireEvent.keyDown(degreeSelector, {key:'ArrowDown'})
        fireEvent.keyDown(degreeSelector, {key:'Enter'})
      });
    
      const selectedValue = screen.getByTestId("degree-selector").querySelector("input").value;
      expect(selectedValue).toBe("Computer Science");
    });

    it("Table renders correctly", async () => {
      await act(() => mockStore.dispatch(updateDegrees(0, mockDegree.degrees[0])));
      await act(() => render(<WrappedPlanner />));

      modIndex = 0;
      const firstRow = screen.getByTestId(`prog-mod-table1-${modIndex}`);
      expect(firstRow).toHaveTextContent('CS1101S');
    });

    it("Select module successfully", async () => {
      modIndex = 0;
      semIndex = 0;
      await act(() => mockStore.dispatch(addSem))
      await act(() => mockStore.dispatch(addModule(semIndex)))
      await act(() => mockStore.dispatch(updateModule(semIndex, modIndex, mockSemester.semesters[0].modules[0].modInfo)));
      await act(() => render(<WrappedPlanner />));
      
      const selectedValue = screen.getByTestId(`module-selector-${semIndex}-${modIndex}`).querySelector("input").value;
      expect(selectedValue).toBe("CS1101S");
    });

    it("Table updates and renders correctly", async () => {
      modIndex = 0;
      semIndex = 0;
      await act(() => mockStore.dispatch(updateDegrees(0, mockDegree.degrees[0])));
      await act(() => mockStore.dispatch(addSem))
      await act(() => mockStore.dispatch(addModule(semIndex)))
      await act(() => mockStore.dispatch(updateModule(semIndex, modIndex, mockSemester.semesters[0].modules[0].modInfo)));
      await act(() => render(<WrappedPlanner />));
      
      const firstRow = screen.getByTestId(`prog-mod-table1-${modIndex}`);
      const styles = window.getComputedStyle(firstRow);
      const backgroundColor = styles.getPropertyValue('background-color');
      expect(backgroundColor).toBe('rgb(207, 248, 223)');
    });

    it("Save planner successfully", async () => {
      semIndex = 0;
      await act(() => mockStore.dispatch(addSem));
      let container;
      await act(() => {
        const { container: renderedContainer } = render(<WrappedPlanner />);
        container = renderedContainer;
      });
  
      const semesters = container.getElementsByClassName("semester-card");
      expect(semesters.length).toBe(semIndex + 1);
      await act(() => mockStore.dispatch(savePlanner(mockUser.uid)));
      expect(mockDB.semesters.length).toBeGreaterThan(0);
    });

    it("Clear planner successfully", async () => {
      await act(() => mockStore.dispatch(clearPlanner(mockUser.uid)));
      
      let container;
      await act(() => {
        const { container: renderedContainer } = render(<WrappedPlanner />);
        container = renderedContainer;
      });
  
      const semesters = container.getElementsByClassName("semester-card");
      expect(semesters.length).toBe(0);
    });
});