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
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Route, Routes } from "react-router-dom";

import "./mocks/MockFirebase";
import { mockComment, mockPost } from "./mocks/MockData";
import { TestProviderWithStore, testStore } from "../utils/TestProvider";

import { Forum } from "../../Forum/Forum.js";
import { Post } from "../../Forum/Post";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  editComment,
  editPost,
} from "../../Forum/ForumStore";

describe("Integration Test: Forum Page", () => {
  const WrappedForum = () => {
    return (
      <TestProviderWithStore initialRoute="/forum">
        <Routes>
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<Post />} />
        </Routes>
      </TestProviderWithStore>
    );
  };

  async function navigateToPost() {
    await act(() => {
      // Verify that forum view is not empty
      expect(screen.queryByText("No posts found.")).toBeNull();

      // Navigate to created post
      const goToPostLink = screen.getByTestId(`go-to-post-${mockPost.id}`);
      expect(goToPostLink).toBeInTheDocument();
      fireEvent.click(goToPostLink);
    });
  }

  it("Render loading spinner initially", () => {
    act(() => render(<WrappedForum />));

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it('Render "No posts found" when there are no posts', async () => {
    await act(() => render(<WrappedForum />));

    // Verify that forum view is empty
    expect(screen.getByText("No posts found.")).toBeInTheDocument();
  });

  it("Create post successfully", async () => {
    // Create post
    await act(() => testStore.dispatch(createPost(mockPost)));
    await act(() => render(<WrappedForum />));

    // Verify that forum view is not empty
    expect(screen.queryByText("No posts found.")).toBeNull();
  });

  it("Render created post with no comments correctly", async () => {
    await act(() => render(<WrappedForum />));
    await navigateToPost();

    // Verify rendering of post
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.post)).toBeInTheDocument();

    // Verify that there is no comments
    expect(
      screen.getByText("No comments... Be the first to comment!")
    ).toBeInTheDocument();
  });

  it("Edit and render edited post correctly", async () => {
    // Edit post
    const editedPost = {
      ...mockPost,
      title: "edited1",
      post: "edited2",
    };
    await act(() => testStore.dispatch(editPost(editedPost, mockPost.id)));
    await act(() => render(<WrappedForum />));
    await navigateToPost();

    // Verify rendering of post
    expect(screen.getByText(editedPost.title)).toBeInTheDocument();
    expect(screen.getByText(editedPost.post)).toBeInTheDocument();
  });

  it("Create and render comment successfully", async () => {
    // Create comment
    await act(() => testStore.dispatch(createComment(mockComment)));
    await act(() => render(<WrappedForum />));
    await navigateToPost();

    // Verify rendering of created comment
    expect(
      screen.queryByText("No comments... Be the first to comment!")
    ).toBeNull();
    expect(screen.getByText(mockComment.text)).toBeInTheDocument();
  });

  it("Edit and render comment successfully", async () => {
    // Edit comment
    const editedComment = {
      ...mockComment,
      text: "edited3",
    };
    await act(() =>
      testStore.dispatch(editComment(editedComment, mockComment.id))
    );
    await act(() => render(<WrappedForum />));
    await navigateToPost();

    // Verify rendering of edited comment
    expect(
      screen.queryByText("No comments... Be the first to comment!")
    ).toBeNull();
    expect(screen.getByText(editedComment.text)).toBeInTheDocument();
  });

  it("Delete and render no comments successfully", async () => {
    // Delete comment
    await act(() => testStore.dispatch(deleteComment(mockComment.id)));
    await act(() => render(<WrappedForum />));
    await navigateToPost();

    // Verify that there is no comments
    expect(
      screen.getByText("No comments... Be the first to comment!")
    ).toBeInTheDocument();
  });

  it("Delete and render no posts correctly", async () => {
    // Delete post
    await act(() => testStore.dispatch(deletePost(mockPost.id)));
    await act(() => render(<WrappedForum />));

    // Verify that forum view is empty
    const noPostsMessage = screen.getByText("No posts found.");
    expect(noPostsMessage).toBeInTheDocument();
  });
});
