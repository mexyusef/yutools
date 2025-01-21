import * as vscode from "vscode";
import {
  addSetMember, connectAndTestRedis, createKey, disconnectRedis, listKeys,
  listSetMembers,
  paginateKeys,
  searchKeysFast,
  setRedisConnectionString
} from "./redis/redis_library";
import { register_db_sqlite_quicksnip_commands } from "./sqlite/commands/quick-snip-commands";
import { register_db_sqlite_password_commands } from "./sqlite/commands/password-commands";

// Create, fetch, delete keys, or perform operations on sets as needed.
// Disconnect: When done, run: YUTools: Disconnect from Redis

export function register_databases_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(connectAndTestRedis);
  context.subscriptions.push(setRedisConnectionString);
  context.subscriptions.push(searchKeysFast);
  context.subscriptions.push(disconnectRedis);
  context.subscriptions.push(paginateKeys);

  context.subscriptions.push(createKey);
  context.subscriptions.push(addSetMember);
  context.subscriptions.push(listSetMembers);
  context.subscriptions.push(listKeys);

  // register_db_sqlite_quicksnip_commands(context);
  // register_db_sqlite_password_commands(context);
}
