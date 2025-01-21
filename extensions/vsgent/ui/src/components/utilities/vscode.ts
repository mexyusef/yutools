import { WebviewMessage } from "@shared/WebviewMessage";
import type { WebviewApi } from "vscode-webview";

/**
 * A utility class that wraps the `acquireVsCodeApi()` function to facilitate
 * message passing and state management between a webview and the VS Code extension.
 *
 * This wrapper also enables the webview to run in a web browser-based development server
 * by using native browser features to simulate `acquireVsCodeApi()` functionality.
 */
class VSCodeAPIWrapper {
  private readonly vsCodeApi: WebviewApi<unknown> | undefined;

  constructor() {
    // Initialize the API if running in a VS Code environment or supported browser context.
    if (typeof acquireVsCodeApi === "function") {
      this.vsCodeApi = acquireVsCodeApi();
    }
  }

  /**
   * Sends a message to the VS Code extension host or logs to the console if running
   * in a web browser.
   *
   * @param message The data to send, which must be JSON serializable.
   */
  public postMessage(message: WebviewMessage): void {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    } else {
      console.log("Webview message:", message);
    }
  }

  /**
   * Retrieves the persistent state stored for the webview.
   *
   * @returns The current state or `undefined` if no state has been set.
   * @remarks When run in a web browser, the state is retrieved from `localStorage`.
   */
  public getState(): unknown | undefined {
    if (this.vsCodeApi) {
      return this.vsCodeApi.getState();
    } else {
      const state = localStorage.getItem("vscodeState");
      return state ? JSON.parse(state) : undefined;
    }
  }

  /**
   * Sets the persistent state for the webview.
   *
   * @param newState The new state to persist. Must be a JSON serializable object.
   * @returns The newly set state.
   * @remarks When run in a web browser, the state is stored in `localStorage`.
   */
  public setState<T extends unknown | undefined>(newState: T): T {
    if (this.vsCodeApi) {
      return this.vsCodeApi.setState(newState);
    } else {
      localStorage.setItem("vscodeState", JSON.stringify(newState));
      return newState;
    }
  }
}

// Exporting the singleton instance of VSCodeAPIWrapper to prevent multiple initializations.
export const vscode = new VSCodeAPIWrapper();
