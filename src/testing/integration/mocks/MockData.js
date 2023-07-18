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
export const mockAssessment = {
  title: "Module 1",
  components: [
    { componentTitle: "Test 1", score: "30", total: "40", weight: "20" },
  ],
  desiredGrade: "90",
  requiredGrade: "93.75",
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

export const mockDegree = {
  degrees: [
    { faculty: 'SOC', firstLetter: 'SOC', id: 48, title: 'Computer Science' },
  ],
};

export const mockSemester = {
  semesters: [
    {
      count: 1,
      header: 'Y1S1',
      modules: [
        {
          modInfo: { moduleCode: 'CS1101S', moduleCredit: '4', semester: [1, 2], code: 'CS', id: 645 },
          category: { id: 3, title: 'Programme' },
        },
      ],
    },
  ],
}

export function getMockData() {
  return {
    users: [mockUser],
    assessments: [],
    programme: [], 
    semesters: [],
    posts: [],
    comments: [],
  };
}
