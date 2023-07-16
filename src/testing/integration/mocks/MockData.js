export const mockUser = {
  displayName: "user 1",
  email: "user1@test.com",
  emailVerified: true,
  uid: "id123",
  providerData: [
    {
      email: "user1@test.com",
      displayName: "user 1",
      providerId: "email",
    },
  ],
  sendEmailVerification: jest.fn(),
};

export const mockPost = {
  id: "post-1",
  title: "Post 1",
  post: "This is the first post",
  author: { userId: mockUser.uid },
  datetime: new Date(),
};

export const mockComment = {
  id: "comment-1",
  text: "This is the first comment",
  datetime: new Date(),
  author: { userId: mockUser.uid },
};

export function getMockData() {
  return {
    users: [mockUser],
    posts: [],
    comments: [],
  };
}
