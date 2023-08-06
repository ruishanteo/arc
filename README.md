# ARC

ARC is a one-stop web application designed to meet the academic needs of students, providing a convenient platform to manage study plans, calculate grades, and check degree requirements. The platform aims to streamline academic processes, allowing students to focus on other important aspects of university life. It is accessible here: https://arc123.netlify.app.

## Scope of Project

ARC is a web application with the following key features:

### Grade Calculator
<img width="1474" alt="Screenshot 2023-08-06 at 11 09 00 PM" src="https://github.com/ruishanteo/arc/assets/111447603/42138e0f-6af2-496a-bde2-fd1f16a89e91">

Users can enter their module assessment scores and calculate their overall scores. The calculator will display the scores needed to achieve the desired grade.

### Module Planner
<img width="1059" alt="Screenshot 2023-08-06 at 11 11 08 PM" src="https://github.com/ruishanteo/arc/assets/111447603/766b4e33-5c0d-4832-b767-0c1124680650">

Users can plan their modules for multiple semesters, adding and removing modules as needed. The platform will support different degree programs and update the degree requirement tables accordingly.

### Forum
<img width="1467" alt="Screenshot 2023-08-06 at 11 11 54 PM" src="https://github.com/ruishanteo/arc/assets/111447603/f12211d8-5c8d-4888-bf13-95ad917255ce">

ARC will include a forum where students can share their study plans with others, fostering collaboration and providing valuable references for academic planning.

### Profile
<img width="1462" alt="Screenshot 2023-08-06 at 11 13 07 PM" src="https://github.com/ruishanteo/arc/assets/111447603/d87fced7-5847-448a-a70a-5bcb1933d11c">

The profile page in ARC serves as a central hub for users to manage their account information and settings. It provides users with the ability to update their user properties and make changes to their account details.

### Feedback Form
<img width="996" alt="Screenshot 2023-08-06 at 11 14 09 PM" src="https://github.com/ruishanteo/arc/assets/111447603/1178aa4c-3392-41b6-8093-967f047d783f">

The feedback form in ARC allows authenticated users to submit feedback, bug reports, or issues by clicking a button located at the bottom right of any page, which opens a form for users to type their feedback and submit it.

## Testing

The test plan for ARC ensures the quality and reliability of the application through three main types of tests: system testing, integration testing, and unit testing. System tests cover the complete user flow using Puppeteer, while integration tests verify interactions between components with the help of MockProvider and mockStore for isolation. Unit tests use Jest and @testing-library/react for UI and Firebase backend testing, with Jest-Environment-JSDOM providing the simulated DOM environment.

### Tools

System Tests: Puppeteer, Local Firebase emulator server, Axios
Integration and Unit Tests: Jest, @testing-library/react, jest-environment-jsdom, MockProvider, mockStore, MockFirebase, MockFirestore
The test suite covers various scenarios and ensures thorough testing of the core functionalities, combining different testing methodologies for comprehensive coverage and early bug detection.

## Getting Started

To run ARC locally on your machine, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/arc.git`
2. Install the necessary dependencies: `yarn install`
3. Start the development server: `yarn start`
4. Open your browser and navigate to `http://localhost:3000` to access ARC.

## Technologies Used

- React.js: Frontend development framework.
- MUI: Frontend component library.
- Formik, Yup: Form building and input validation.
- Firebase: Database for storing user data.
- Netlify: Deployment of project.
