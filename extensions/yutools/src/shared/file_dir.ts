function sanitize(input: string): string {
    return input.trim().toLowerCase().replace(/\s+/g, '_');
}

export function getProjectFrameworkFmusFilepath(project: string, framework: string): string {
    const baseFolder = 'C:\\Users\\usef\\work\\sidoarjo\\schnell\\app\\llmutils\\servers\\create_projects';
    const sanitizedProject = sanitize(project);
    const sanitizedFramework = sanitize(framework);

    return `${baseFolder}\\${sanitizedProject}_${sanitizedFramework}.fmus`;
}