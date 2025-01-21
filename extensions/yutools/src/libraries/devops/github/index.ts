// List of Commands for "yutools.github" extension:
// 1. Authenticate with GitHub (auth)
// 2. Open repository in the browser (browse)
// 3. Manage gists (create, update, delete, list)
// 4. Manage issues (create, update, comment, close, list)
// 5. Manage pull requests (create, update, merge, comment, list)
// 6. Manage repositories (create, clone, fork, delete, list)
// 7. View and manage organizations
// 8. Manage GitHub Projects (list, create, update, delete)
// 9. Manage releases (create, list, delete)
// 10. Manage labels (list, create, delete)
// 11. Search for repositories, issues, and pull requests
// 12. View notifications and statuses across repositories
// 13. Manage secrets (list, create, delete)
// 14. Manage SSH keys (list, add, remove)
// 15. Manage GitHub Actions workflows (list, view details, rerun)
// 16. Manage GitHub Actions caches
// 17. Manage variables for GitHub Actions
// 18. View info about repository rulesets
// 19. Manage aliases for gh CLI

// Implemented Commands (Important management operations for GitHub):
// 1. Authenticate with GitHub (auth)
// 2. Manage repositories (create, clone, fork, delete, list)
// 3. Manage issues (create, update, comment, close, list)
// 4. Manage pull requests (create, update, merge, comment, list)
// 5. Open repository in the browser (browse)

import * as vscode from 'vscode';
import { github_repoDelete } from './github_repoDelete';
import { github_auth } from './github_auth';
import { github_repoCreate } from './github_repoCreate';
import { github_repoClone } from './github_repoClone';
import { github_repoList } from './github_repoList';
import { github_browse } from './github_browse';
import { github_issueCreate } from './github_issueCreate';
import { github_prCreate } from './github_prCreate';
import { github_listIssues } from './github_listIssues';

export async function register_github_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(github_auth);
  context.subscriptions.push(github_repoCreate);
  context.subscriptions.push(github_repoClone);
  context.subscriptions.push(github_repoList);
  context.subscriptions.push(github_browse);
  context.subscriptions.push(github_issueCreate);
  context.subscriptions.push(github_prCreate);
  context.subscriptions.push(github_listIssues);
  context.subscriptions.push(github_repoDelete);
}
