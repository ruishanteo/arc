/**
 * @jest-environment jsdom
 */
jest.mock("../../UserAuth/FirebaseHooks");

import React from "react";
import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@testing-library/react";

import { Profile } from "../../UserAuth/Profile";

import {
  updateUserProfilePicture,
  updateUserDisplayName,
  updateUserEmail,
  updateUserPassword,
  onDeleteUser,
  useAuth,
  onReAuth,
} from "../../UserAuth/FirebaseHooks";

let password = "123456";
const mockUser = {
  displayName: "Tester",
  email: "tester@test.com",
  password: "123456",
  photoURL: "",
};

describe("Profile", () => {
  beforeEach(() => {
    useAuth.mockReturnValue(mockUser);
  });

  async function confirmAndAssertPassword(inputPassword, container) {
    onReAuth.mockResolvedValueOnce();
    await act(() => {
      const passwordField = container.querySelector("#password-field");
      fireEvent.change(passwordField, { target: { value: inputPassword } });

      const confirmButton = container.querySelector("#submit-password-button");
      fireEvent.click(confirmButton);
    });
    expect(onReAuth).toHaveBeenCalledWith(expect.anything(), inputPassword);
  }

  test("Render profile page correctly", async () => {
    let container;
    await act(() => {
      const { container: renderedContainer } = render(<Profile />);
      container = renderedContainer;
    });

    expect(container.querySelector("input[type=file]")).toBeInTheDocument();
    expect(
      container.querySelector("#username-edit-button")
    ).toBeInTheDocument();
    expect(container.querySelector("#email-edit-button")).toBeInTheDocument();
    expect(
      container.querySelector("#password-edit-button")
    ).toBeInTheDocument();
    expect(
      container.querySelector("#delete-account-button")
    ).toBeInTheDocument();
  });

  test("Update profile picture", async () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    updateUserProfilePicture.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { baseElement: renderedContainer } = render(<Profile />);
      container = renderedContainer;
    });

    await act(() => {
      const uploadButton = container.querySelector("input[type=file]");
      fireEvent.change(uploadButton, { target: { files: [file] } });
    });

    await act(() => {
      const confirmButton = container.querySelector(
        "#confirm-profile-picture-button"
      );
      fireEvent.click(confirmButton);
    });

    await expect(updateUserProfilePicture).toHaveBeenCalledWith(mockUser, file);
  });

  test("Update display name", async () => {
    const newName = "New Tester";
    updateUserDisplayName.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { baseElement: renderedContainer } = render(<Profile />);
      container = renderedContainer;
    });

    await act(() => {
      const editButton = container.querySelector("#username-edit-button");
      fireEvent.click(editButton);
    });

    await act(() => {
      const nameInput = container.querySelector("#username-particular-field");
      const submitButton = container.querySelector(
        "#username-submit-edit-button"
      );

      fireEvent.change(nameInput, { target: { value: newName } });
      fireEvent.click(submitButton);
    });

    await confirmAndAssertPassword(password, container);
    await expect(updateUserDisplayName).toHaveBeenCalledWith(mockUser, newName);
    mockUser.displayName = newName;
  });

  test("Update email", async () => {
    const newEmail = "newtester@test.com";
    updateUserEmail.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { baseElement: renderedContainer } = render(<Profile />);
      container = renderedContainer;
    });

    await act(() => {
      const editButton = container.querySelector("#email-edit-button");
      fireEvent.click(editButton);
    });

    await act(() => {
      const inputField = container.querySelector("#email-particular-field");
      const submitButton = container.querySelector("#email-submit-edit-button");

      fireEvent.change(inputField, { target: { value: newEmail } });
      fireEvent.click(submitButton);
    });

    await confirmAndAssertPassword(password, container);
    await expect(updateUserEmail).toHaveBeenCalledWith(mockUser, newEmail);
    mockUser.email = newEmail;
  });

  test("Update password", async () => {
    const newPassword = "1234567";
    updateUserPassword.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { baseElement: renderedContainer } = render(<Profile />);
      container = renderedContainer;
    });

    await act(() => {
      const editButton = container.querySelector("#password-edit-button");
      fireEvent.click(editButton);
    });

    await act(() => {
      const inputField = container.querySelector("#password-particular-field");
      const submitButton = container.querySelector(
        "#password-submit-edit-button"
      );

      fireEvent.change(inputField, { target: { value: newPassword } });
      fireEvent.click(submitButton);
    });

    await confirmAndAssertPassword(password, container);
    await expect(updateUserPassword).toHaveBeenCalledWith(
      mockUser,
      newPassword
    );
    password = newPassword;
  });

  test("Delete account", async () => {
    onDeleteUser.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { baseElement: renderedContainer } = render(<Profile />);
      container = renderedContainer;
    });

    await act(() => {
      const deleteButton = container.querySelector("#delete-account-button");
      fireEvent.click(deleteButton);
    });

    await confirmAndAssertPassword(password, container);
    await expect(onDeleteUser).toHaveBeenCalledWith(mockUser);
  });
});
