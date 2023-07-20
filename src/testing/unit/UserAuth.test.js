/**
 * @jest-environment jsdom
 */
jest.mock("../../UserAuth/FirebaseHooks");

import React from "react";
import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { Login } from "../../UserAuth/Login";
import { Register } from "../../UserAuth/Register";
import { Reset } from "../../UserAuth/Reset";

import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  signInWithGoogle,
  useAuth,
} from "../../UserAuth/FirebaseHooks";

const name = "unituserauth";
const email = "unituserauthtester@gmail.com";
const password = "123456";
const uid = "unituserauth-uid";

describe("Register", () => {
  const WrappedRegister = () => {
    return (
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/home" element={<></>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    useAuth.mockReturnValue(null);
  });

  test("Render registration form correctly", async () => {
    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedRegister />);
      container = renderedContainer;
    });

    expect(container.querySelector("#name")).toBeInTheDocument();
    expect(container.querySelector("#email")).toBeInTheDocument();
    expect(container.querySelector("#password")).toBeInTheDocument();
    expect(container.querySelector("#submit-button")).toBeInTheDocument();
    expect(
      container.querySelector("#google-signin-button")
    ).toBeInTheDocument();
  });

  test("Call registerWithEmailAndPassword when form is submitted", async () => {
    registerWithEmailAndPassword.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedRegister />);
      container = renderedContainer;
    });

    await act(() => {
      const nameInput = container.querySelector("#name");
      const emailInput = container.querySelector("#email");
      const passwordInput = container.querySelector("#password");
      const submitButton = container.querySelector("#submit-button");

      fireEvent.change(nameInput, { target: { value: name } });
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.click(submitButton);
    });

    expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
      name,
      email,
      password
    );
  });

  test("Call signInWithGoogle when form is submitted", async () => {
    signInWithGoogle.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedRegister />);
      container = renderedContainer;
    });

    await act(() => {
      const signInWithGoogle = container.querySelector("#google-signin-button");
      fireEvent.click(signInWithGoogle);
    });

    expect(signInWithGoogle).toHaveBeenCalled();
  });

  test("Redirect to /home if user is already authenticated", async () => {
    useAuth.mockReturnValue({ uid: uid, email: email });

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedRegister />);
      container = renderedContainer;
    });

    expect(container.querySelector("#name")).not.toBeInTheDocument();
    expect(container.querySelector("#email")).not.toBeInTheDocument();
    expect(container.querySelector("#password")).not.toBeInTheDocument();
    expect(container.querySelector("#submit-button")).not.toBeInTheDocument();
    expect(
      container.querySelector("#google-signin-button")
    ).not.toBeInTheDocument();
  });
});

describe("Login", () => {
  const WrappedLogin = () => {
    return (
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<></>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    useAuth.mockReturnValue(null);
  });

  test("Render login form correctly", async () => {
    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedLogin />);
      container = renderedContainer;
    });

    expect(container.querySelector("#email")).toBeInTheDocument();
    expect(container.querySelector("#password")).toBeInTheDocument();
    expect(container.querySelector("#submit-button")).toBeInTheDocument();
    expect(
      container.querySelector("#google-signin-button")
    ).toBeInTheDocument();
  });

  test("Call logInWithEmailAndPassword when form is submitted", async () => {
    logInWithEmailAndPassword.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedLogin />);
      container = renderedContainer;
    });

    await act(() => {
      const emailInput = container.querySelector("#email");
      const passwordInput = container.querySelector("#password");
      const submitButton = container.querySelector("#submit-button");

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.click(submitButton);
    });

    expect(logInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
  });

  test("Call signInWithGoogle when Google sign-in button is clicked", async () => {
    signInWithGoogle.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedLogin />);
      container = renderedContainer;
    });

    await act(() => {
      const signInWithGoogleButton = container.querySelector(
        "#google-signin-button"
      );
      fireEvent.click(signInWithGoogleButton);
    });

    expect(signInWithGoogle).toHaveBeenCalled();
  });
});

describe("Reset", () => {
  const WrappedReset = () => {
    return (
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Reset />} />
          <Route path="/home" element={<></>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    useAuth.mockReturnValue(null);
  });

  test("Render reset form correctly", async () => {
    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedReset />);
      container = renderedContainer;
    });

    expect(container.querySelector("#email")).toBeInTheDocument();
    expect(container.querySelector("#submit-button")).toBeInTheDocument();
  });

  test("Call sendPasswordReset when form is submitted", async () => {
    sendPasswordReset.mockResolvedValueOnce();

    let container;
    await act(() => {
      const { container: renderedContainer } = render(<WrappedReset />);
      container = renderedContainer;
    });

    await act(() => {
      const emailInput = container.querySelector("#email");
      const submitButton = container.querySelector("#submit-button");

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.click(submitButton);
    });

    await expect(sendPasswordReset).toHaveBeenCalledWith(email);
  });
});
