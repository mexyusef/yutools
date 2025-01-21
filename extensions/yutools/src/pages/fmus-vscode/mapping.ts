import { generalMultiQuery, generalSingleQuery } from "./networkquery";


export const endpointMapping: {
  [endpoint: string]: (prompt: string) => Promise<string | string[]>
} = {
  '/quickQuery': (prompt) => generalSingleQuery(prompt, '/quickQuery'),
  '/code_query': (prompt) => generalSingleQuery(prompt, '/code_query'),
  '/error_query': (prompt) => generalSingleQuery(prompt, '/error_query'),
  '/changeConfiguration': (prompt) => generalSingleQuery(prompt, '/changeConfiguration'),
  '/multiQueries': (prompt) => generalMultiQuery(prompt, '/multiQueries'),
  '/generateCodeFromFuzzyPrompt': (prompt) => generalSingleQuery(prompt, '/generateCodeFromFuzzyPrompt'),
  '/explainCode': (prompt) => generalSingleQuery(prompt, '/explainCode'),
  '/criticCode': (prompt) => generalSingleQuery(prompt, '/criticCode'),
  '/refactorCodeWithExplanation': (prompt) => generalSingleQuery(prompt, '/refactorCodeWithExplanation'),
  '/createTest': (prompt) => generalSingleQuery(prompt, '/createTest'),
  '/createDocumentation': (prompt) => generalSingleQuery(prompt, '/createDocumentation'),
  '/createProjectSkeleton': (prompt) => generalSingleQuery(prompt, '/createProjectSkeleton'),
  '/researchWithTools': (prompt) => generalSingleQuery(prompt, '/researchWithTools'),
  '/researchRole': (prompt) => generalSingleQuery(prompt, '/role_researcher'),

  '/role_just_scrape_generate_code': (prompt) => generalSingleQuery(prompt, '/role_just_scrape_generate_code'),
  '/role_just_understand_code': (prompt) => generalSingleQuery(prompt, '/role_just_understand_code'),

  '/fixEnglishGrammar': (prompt) => generalSingleQuery(prompt, '/fixEnglishGrammar'),
  '/createMemorableStory': (prompt) => generalSingleQuery(prompt, '/createMemorableStory'),

  '/generateBook': (prompt) => generalSingleQuery(prompt, '/generateBook'),
  '/generateTechnicalArticle': (prompt) => generalSingleQuery(prompt, '/generateTechnicalArticle'),
  '/generateBlogPost': (prompt) => generalSingleQuery(prompt, '/generateBlogPost'),

  '/summarizeWebPage': (prompt) => generalSingleQuery(prompt, '/summarizeWebPage'),
  '/summarizeYoutubeVideo': (prompt) => generalSingleQuery(prompt, '/summarizeYoutubeVideo'),
  '/searchYoutube': (prompt) => generalSingleQuery(prompt, '/searchYoutube'),
  '/searchInternet': (prompt) => generalSingleQuery(prompt, '/searchInternet'),
  '/searchGithub': (prompt) => generalSingleQuery(prompt, '/searchGithub'),
  '/ragCurrentFolder': (prompt) => generalSingleQuery(prompt, '/ragCurrentFolder'),
  '/githubIssues': (prompt) => generalSingleQuery(prompt, '/githubIssues'),

  '/podomoro_planner': (prompt) => generalSingleQuery(prompt, '/podomoro_planner'),
};