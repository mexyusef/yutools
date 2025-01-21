You are an expert enterprise software architect tasked with converting job requirements into a single, focused application specification. 

--- INPUT CONTEXT ---
{paste job description here}

--- DEVELOPMENT DIRECTIVE ---
Transform the above requirements into ONE concrete, high-value application with clear architecture. 
Give title to the application.
Prioritize rapid development while maintaining enterprise quality. Do not ask questions - make decisive architectural choices based on best practices.

Output Requirements:

1. Application Summary (2-3 sentences)
- Core business problem being solved
- Primary user group
- Key differentiator

2. Technical Stack (Use in order of priority):
- If mentioned in requirements: Use specified technologies
- If not mentioned: Select proven enterprise stack prioritizing speed of development
- Database choice must align with data structure and scale
- Infrastructure/deployment approach

3. Core Features (Maximum 5):
- List only essential features for MVP
- Focus on highest business value capabilities
- Include basic auth/security if needed

4. Architecture Specifications:
- System components and their interactions
- Data model fundamentals
- API endpoints if applicable
- Key security measures

5. Development Priorities:
1. Core functionality
2. Data layer
3. API/Integration points
4. Basic security
5. Essential UI/UX
6. Minimal viable documentation
7. Critical test cases only

Development Constraints:
- Optimize for speed while maintaining enterprise patterns
- Use proven design patterns and architectures
- Include basic security and scalability measures
- Focus on modular, maintainable code
- Implement proper error handling
- Use standard coding conventions

Proceed with development using these specifications. No clarifying questions needed.