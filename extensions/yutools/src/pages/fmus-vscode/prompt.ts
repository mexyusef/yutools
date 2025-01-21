import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export const applyUpworkNotused = `

**Job Application Proposal:**

---

**Generated Job Application Proposal:**

---

**Introduction:**

Hello [Client's Name],

I am [Your Name], a [Your Profession, e.g., software developer, graphic designer, content writer] with over [X] years of experience in [specific industry or skill]. I am excited to apply for the [Job Title] position you posted on Upwork.

**Relevant Skills and Experience:**

I have extensive experience in [list relevant skills and tools]. In my previous roles, I have successfully [describe specific experiences related to the job description, e.g., developed websites, designed marketing materials, written articles]. My expertise includes [mention any other relevant skills or technologies].

**Project Understanding and Approach:**

From the job description, I understand that you need [briefly summarize the project requirements]. To tackle this project, I plan to [outline your approach, including any specific methods or tools you will use]. My strategy ensures that the project will be completed efficiently and to the highest standard.

**Examples of Past Work:**

I have completed similar projects in the past, such as [briefly describe 1-2 relevant past projects]. For example, [describe a specific project and its outcome]. You can view my portfolio [attach or link to portfolio if applicable].

**Closing and Call to Action:**

I am eager to bring my skills and experience to your project. I am confident that I can deliver excellent results and exceed your expectations. Please feel free to contact me to discuss the project further. I look forward to the opportunity to work with you.

Thank you for considering my application.

Best regards,

[Your Name]
[Your Contact Information]
[Your Upwork Profile Link]

---

**Instructions for the LLM:**

- Insert the provided job description into the "{job_description}" placeholder.
- Use the job description to customize each section of the application proposal.
- Ensure the tone is professional and the content is tailored to the specific job requirements.
- Maintain a clear and concise format.

---`;

export const applyUpwork = `
You are a professional freelancer seeking to apply for jobs on Upwork. The goal is to generate a customized job application proposal based on the provided job description. The proposal should be professional, tailored to the specific job requirements, and highlight relevant skills, experience, and enthusiasm for the project. The generated application should include the following sections:

1. **Introduction**: A brief introduction of yourself and your profession.
2. **Relevant Skills and Experience**: Detailed information about your skills and experience relevant to the job description.
3. **Project Understanding and Approach**: A summary of your understanding of the project and how you plan to approach it.
4. **Examples of Past Work**: Mention any relevant past projects or work examples that demonstrate your ability to successfully complete the job.
5. **Closing and Call to Action**: A polite closing statement expressing your eagerness to discuss the project further and encouraging the client to contact you.

**Job Description:**
`;


export const applyRemoteWorkkNotused = `
**Job Application Cover Letter:**

---

**Generated Job Application Cover Letter:**

---

**Introduction:**

Dear [Employer's Name or Hiring Manager],

I am [Your Name], a dedicated [Your Profession, e.g., software developer, graphic designer, content writer] with over [X] years of experience in [specific industry or skill]. I am excited to apply for the [Job Title] position listed on [Job Site Name].

**Relevant Skills and Experience:**

Throughout my career, I have honed my skills in [list relevant skills and tools]. I have successfully [describe specific experiences related to the job description, e.g., developed innovative software solutions, designed impactful marketing materials, authored compelling content]. My expertise includes [mention any other relevant skills or technologies].

**Project Understanding and Approach:**

From the job description, I understand that you need [briefly summarize the job requirements]. To excel in this role, I plan to [outline your approach, including any specific methods or tools you will use]. My strategic approach ensures that I can meet and exceed the expectations for this role effectively.

**Examples of Past Work:**

I have successfully completed similar projects, such as [briefly describe 1-2 relevant past projects]. For instance, [describe a specific project and its outcome]. You can view more details about my work in my portfolio [attach or link to portfolio if applicable].

**Closing and Call to Action:**

I am enthusiastic about the opportunity to bring my skills and experience to [Company Name]. I am confident that my background and approach will enable me to contribute effectively to your team. I look forward to the possibility of discussing this role further. Please feel free to contact me at your convenience.

Thank you for considering my application.

Best regards,

[Your Name]
[Your Contact Information]
[Your LinkedIn Profile Link, if applicable]

---

**Instructions for the LLM:**

- Insert the provided job description into the "{job_description}" placeholder.
- Use the job description to customize each section of the cover letter.
- Ensure the tone is professional and the content is tailored to the specific job requirements.
- Maintain a clear and concise format.

---
`;

export const applyRemoteWork = `
You are a professional freelancer or job seeker applying for positions on various job sites such as We Work Remotely, LinkedIn, Glassdoor, RemoteOK, etc. The objective is to generate a customized job application cover letter based on the provided job description. The cover letter should be professional, tailored to the specific job requirements, and highlight relevant skills, experience, and enthusiasm for the role. The generated application should include the following sections:

1. **Introduction**: A brief introduction of yourself and your profession.
2. **Relevant Skills and Experience**: Detailed information about your skills and experience relevant to the job description.
3. **Project Understanding and Approach**: A summary of your understanding of the job role and how you plan to approach it.
4. **Examples of Past Work**: Mention any relevant past projects or work examples that demonstrate your ability to successfully fulfill the role.
5. **Closing and Call to Action**: A polite closing statement expressing your eagerness to discuss the role further and encouraging the employer to contact you.

**Job Description:**
`;


export const resumeRemoteWorkNotUsed = `
**Generated Resume:**

---

**Contact Information:**

John Doe
123 Main Street
City, State, ZIP Code
Phone: (123) 456-7890
Email: john.doe@example.com
LinkedIn: linkedin.com/in/johndoe

---

**Professional Summary:**

Seasoned software developer with over 8 years of experience in designing, developing, and maintaining software applications. Proficient in a variety of programming languages and technologies including Python, JavaScript, and React. Proven track record of delivering high-quality software solutions that meet business objectives. Seeking to leverage my skills and experience in a challenging role at a forward-thinking company.

---

**Technical Skills:**

- Programming Languages: Python (10 years), JavaScript (8 years), Java (7 years), C++ (6 years)
- Web Technologies: HTML, CSS, React, Angular, Node.js
- Databases: MySQL, PostgreSQL, MongoDB
- Tools and Platforms: Git, Docker, Kubernetes, AWS, Azure
- Methodologies: Agile, Scrum, TDD (Test-Driven Development)

---

**Professional Experience:**

**Senior Software Developer**
Tech Innovators Inc., City, State
March 2018 - Present

- Led a team of developers to design and implement scalable web applications using React and Node.js.
- Collaborated with cross-functional teams to define and achieve project goals.
- Enhanced application performance, resulting in a 25% increase in user satisfaction.
- Implemented CI/CD pipelines using Jenkins, Docker, and Kubernetes.

**Software Developer**
Creative Solutions Ltd., City, State
June 2015 - February 2018

- Developed and maintained web applications using Python and Django.
- Integrated third-party APIs to enhance application functionality.
- Optimized database queries, reducing data retrieval time by 30%.
- Conducted code reviews and provided mentorship to junior developers.

**Junior Software Developer**
NextGen Technologies, City, State
January 2012 - May 2015

- Assisted in the development of client-side applications using JavaScript and Angular.
- Participated in the full software development lifecycle, from requirements gathering to deployment.
- Collaborated with designers to create user-friendly interfaces.
- Wrote unit and integration tests to ensure code quality.

---

**Education:**

Bachelor of Science in Computer Science
State University, City, State
Graduated: May 2011

---

**Certifications:**

- Certified Python Developer, Python Institute
- AWS Certified Solutions Architect, Amazon Web Services
- Certified ScrumMaster (CSM), Scrum Alliance

---

**Projects:**

**E-commerce Platform Development**

- Developed a full-featured e-commerce platform using React and Node.js.
- Implemented payment processing, user authentication, and product management features.
- Deployed the application on AWS, ensuring high availability and scalability.

**Real-time Chat Application**

- Built a real-time chat application using WebSockets and Python.
- Implemented features such as group chats, file sharing, and message history.
- Optimized the application for low latency and high concurrency.

---

**References:**

Available upon request.

---

**Instructions for the LLM:**

- Use the provided job application information to tailor the resume.
- Ensure the resume is professional, detailed, and realistic.
- Mock companies, projects, and timeframes should be believable and relevant to the software development field.
- Maintain a clear and concise format.

---
`;


const not_used1 = `
The resume should include the following sections:

1. **Contact Information**: Name, address, phone number, email, and LinkedIn profile link.
2. **Professional Summary**: A brief summary highlighting your experience, skills, and career objectives.
3. **Technical Skills**: A list of relevant technical skills, including programming languages, tools, and technologies.
4. **Professional Experience**: Detailed descriptions of your work experience, including companies, roles, responsibilities, and achievements. Use mocked but realistic company names and projects.
5. **Education**: Educational background with degrees, institutions, and graduation dates.
6. **Certifications**: Any relevant certifications or professional courses completed.
7. **Projects**: Specific projects that demonstrate your expertise and contributions.
`;

export const resumeRemoteWork = `
You are a professional freelancer or job seeker with at least 5 years of software development experience.
Based on the provided job application information from job sites such as We Work Remotely, LinkedIn, Glassdoor, RemoteOK, etc.,
generate a comprehensive and realistic resume which has good quantifiable achievements.

**Job Application Information:**
`;


const not_used2 = `

**Generated CV:**

---

**Contact Information:**

John Doe
123 Main Street
City, State, ZIP Code
Phone: (123) 456-7890
Email: john.doe@example.com
LinkedIn: linkedin.com/in/johndoe

---

**Professional Summary:**

Seasoned software developer with over 8 years of experience in designing, developing, and maintaining software applications. Proficient in a variety of programming languages and technologies including Python, JavaScript, and React. Proven track record of delivering high-quality software solutions that meet business objectives. Seeking to leverage my skills and experience in a challenging role at a forward-thinking company.

---

**Technical Skills:**

- Programming Languages: Python (10 years), JavaScript (8 years), Java (7 years), C++ (6 years)
- Web Technologies: HTML, CSS, React, Angular, Node.js
- Databases: MySQL, PostgreSQL, MongoDB
- Tools and Platforms: Git, Docker, Kubernetes, AWS, Azure
- Methodologies: Agile, Scrum, TDD (Test-Driven Development)

---

**Professional Experience:**

**Senior Software Developer**
Tech Innovators Inc., City, State
March 2018 - Present

- Led a team of developers to design and implement scalable web applications using React and Node.js.
- Collaborated with cross-functional teams to define and achieve project goals.
- Enhanced application performance, resulting in a 25% increase in user satisfaction.
- Implemented CI/CD pipelines using Jenkins, Docker, and Kubernetes.
- Mentored junior developers and conducted regular code reviews.

**Software Developer**
Creative Solutions Ltd., City, State
June 2015 - February 2018

- Developed and maintained web applications using Python and Django.
- Integrated third-party APIs to enhance application functionality.
- Optimized database queries, reducing data retrieval time by 30%.
- Conducted code reviews and provided mentorship to junior developers.
- Participated in Agile development processes and sprints.

**Junior Software Developer**
NextGen Technologies, City, State
January 2012 - May 2015

- Assisted in the development of client-side applications using JavaScript and Angular.
- Participated in the full software development lifecycle, from requirements gathering to deployment.
- Collaborated with designers to create user-friendly interfaces.
- Wrote unit and integration tests to ensure code quality.
- Contributed to team meetings and provided input on software design.

---

**Education:**

Bachelor of Science in Computer Science
State University, City, State
Graduated: May 2011

---

**Certifications:**

- Certified Python Developer, Python Institute
- AWS Certified Solutions Architect, Amazon Web Services
- Certified ScrumMaster (CSM), Scrum Alliance

---

**Projects:**

**E-commerce Platform Development**

- Developed a full-featured e-commerce platform using React and Node.js.
- Implemented payment processing, user authentication, and product management features.
- Deployed the application on AWS, ensuring high availability and scalability.
- Conducted user testing to gather feedback and improve the user experience.

**Real-time Chat Application**

- Built a real-time chat application using WebSockets and Python.
- Implemented features such as group chats, file sharing, and message history.
- Optimized the application for low latency and high concurrency.
- Developed a user-friendly interface with React and Redux.

---

**Publications:**

- Doe, J. (2020). "Optimizing Web Applications for Scalability." Journal of Software Engineering, 15(2), 45-60.
- Doe, J. (2018). "Implementing Real-time Features in Modern Web Applications." International Conference on Web Development, Proceedings, 123-130.

---

**Presentations:**

- "Building Scalable Web Applications with React and Node.js," Tech Innovators Conference, 2022.
- "Optimizing Database Performance for High-Traffic Applications," State University Alumni Conference, 2019.

---

**Awards and Honors:**

- Developer of the Year, Tech Innovators Inc., 2021
- Best Software Project, Creative Solutions Ltd., 2017

---

**Professional Memberships:**

- Member, Association for Computing Machinery (ACM)
- Member, Institute of Electrical and Electronics Engineers (IEEE)

---

**References:**

Available upon request.

---

**Instructions for the LLM:**

- Use the provided job application information to tailor the CV.
- Ensure the CV is professional, detailed, and realistic.
- Mock companies, projects, and timeframes should be believable and relevant to the software development field.
- Maintain a clear and concise format.

---
`;

export const cvRemoteWork = `
You are a professional freelancer or job seeker with at least 5 years of software development experience. Based on the provided job application information from job sites such as We Work Remotely, LinkedIn, Glassdoor, RemoteOK, etc., generate a comprehensive and realistic CV. The CV should include the following sections:

1. **Contact Information**: Name, address, phone number, email, and LinkedIn profile link.
2. **Professional Summary**: A brief summary highlighting your experience, skills, and career objectives.
3. **Technical Skills**: A list of relevant technical skills, including programming languages, tools, and technologies.
4. **Professional Experience**: Detailed descriptions of your work experience, including companies, roles, responsibilities, and achievements. Use mocked but realistic company names and projects.
5. **Education**: Educational background with degrees, institutions, and graduation dates.
6. **Certifications**: Any relevant certifications or professional courses completed.
7. **Projects**: Specific projects that demonstrate your expertise and contributions.
8. **Publications**: Any relevant publications or research papers.
9. **Presentations**: Presentations given at conferences or events.
10. **Awards and Honors**: Any awards or honors received throughout your career.
11. **Professional Memberships**: Memberships in professional organizations.
12. **References**: Available upon request.

**Job Application Information:**
`;

// export const fmusFormat = ``;

// generate typescript function to read file "fmus-prompt.txt" located at the same directory of this typescript file
// then put the content into variable `fmusFormat`

function readFileContent(): string {
    // "copy-files": "copyfiles -u 1 \"./src/fmus-prompt.txt\" out/",
    const filename = 'fmus-prompt2.txt';
    // const filePath = path.join(__dirname, filename);
    const filePath = 'C:\\ai\\yuagent\\extensions\\yutools\\src\\pages\\fmus-vscode\\fmus-prompt2.txt'
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (err: any) {
        console.error(`Error reading file: ${err}`);
        vscode.window.showErrorMessage(`Error reading ${filename}: ${err.message}`);
        return '';
    }
}

export const fmusFormatPrompt = readFileContent();


// **Explanation:**

// 1. **Import necessary modules:**
//    - `fs`: Provides file system operations.
//    - `path`: Helps construct file paths.

// 2. **`readFileContent` function:**
//    - **`path.join(__dirname, 'fmus-prompt.txt')`:** Constructs the absolute path to the file by combining the current directory (`__dirname`) with the filename.
//    - **`fs.readFileSync(filePath, 'utf8')`:** Reads the file content synchronously and decodes it as UTF-8.
//    - **Error handling:** Uses a `try...catch` block to handle potential errors during file reading. If an error occurs, it logs the error message and returns an empty string.

// 3. **`fmusFormat` variable:**
//    - Calls the `readFileContent` function to get the file content and stores it in the `fmusFormat` variable.

// **How to use:**

// 1. Make sure you have the `fmus-prompt.txt` file in the same directory as your TypeScript file.
// 2. Run your TypeScript code.
// 3. The `fmusFormat` variable will contain the content of the file.

// **Note:** This code uses synchronous file reading. For larger files or asynchronous operations, consider using `fs.readFile` with a callback or promise.
