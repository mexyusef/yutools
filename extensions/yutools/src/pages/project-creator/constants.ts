export const defaultCommands = [
    "Run",
    "Build",
    "Test",
];

export const commandMappings: { [key: string]: string[] } = {
    React: [
        "npm start",
        "npm run build",
        "npm test",
    ],
    "Next.js": [
        "next dev",
        "next build",
        "next start",
    ],
    Nest: [
        "nest new .",
        "nest g module",
        "nest g controller",
        "nest g service",
        `npm install @nestjs,dtypeorm typeorm mysql2 && npm install @nestjs,dpassport passport passport-local && npm install @nestjs,djwt passport-jwt && npm install class-validator class-transformer`,
    ],
    Express: [
        "npm start",
        "npm test",
        "npm run build",
    ],
    Vue: [
        "npm run serve",
        "npm run build",
        "npm run lint",
    ],
    Django: [
        "python manage.py runserver",
        "python manage.py test",
    ],
    Rails: [
        "rails server",
        "rails db:migrate",
        "rails test",
    ],
    "Spring Boot": [
        "mvn spring-boot:run",
        "mvn clean install",
    ],
};
