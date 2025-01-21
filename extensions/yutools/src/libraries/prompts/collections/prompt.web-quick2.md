Generate a complete, production-ready web application specification using the following structure. Provide detailed specifications for ALL sections - do not ask questions or leave sections incomplete.

APPLICATION OVERVIEW

Generate Application title.

Generate specifications for an enterprise-grade web application that:
- Serves a clear business purpose
- Handles high-traffic loads
- Supports multiple user roles
- Includes real-time features
- Implements secure data handling

DETAILED SPECIFICATIONS:

1. Core Application Features
[List minimum 10 essential features with full implementation details]

2. Technical Architecture
Frontend:
- React/Next.js with TypeScript
- State management: [Specify exact solution]
- UI framework: [Specify exact solution]
- API integration pattern: [Specify exact pattern]

Backend:
- Node.js/NestJS with TypeScript
- Database: PostgreSQL or MongoDB
- ORM: Prisma/TypeORM/Drizzle or NoSQL
- API architecture: REST/GraphQL

3. Data Models
[List complete database schema with all tables, fields, relationships, and constraints]

4. API Endpoints
[List all API endpoints with:
- Complete request/response schemas
- Authentication requirements
- Rate limiting specifications
- Error handling patterns]

5. User Interface
[Specify complete component hierarchy with:
- Layout structure
- Page components
- Reusable components
- State management per component]

6. Security Implementation
[Detail all security measures:
- Authentication flow
- Authorization rules
- Data encryption
- Input validation
- Rate limiting
- CSRF protection]

7. Performance Optimizations
[List all optimization techniques:
- Caching strategies
- Code splitting
- Asset optimization
- Database indexing
- Query optimization]

8. Development Standards
[Specify:
- Code organization
- Naming conventions
- Testing requirements
- Documentation standards
- CI/CD pipeline]

IMPLEMENTATION REQUIREMENTS:
- All code must use TypeScript with strict mode
- Include complete error handling
- Implement proper logging
- Include monitoring setup
- Follow security best practices
- Include automated tests
- Use containerization
- Include deployment configuration

OUTPUT FORMAT:
Provide all specifications in a structured format with implementation details for each section. Do not include placeholders or TODOs. All sections must be fully specified and ready for development.

CONSTRAINTS:
- Must be scalable to 100K+ users
- Must handle 1000+ requests/second
- Must maintain sub-200ms response times
- Must achieve 99.9% uptime
- Must include automated scaling