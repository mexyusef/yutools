import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react";

interface AnnouncementProps {
  hideAnnouncement: () => void;
}

/*
Update the latestAnnouncementId in VsGentProvider for new announcements to show to users.
*/
const Announcement = ({ hideAnnouncement }: AnnouncementProps) => {
  return (
    <div
      style={{
        backgroundColor: "var(--vscode-editor-inactiveSelectionBackground)",
        borderRadius: "3px",
        padding: "12px 16px",
        margin: "5px 15px 5px 15px",
        position: "relative",
      }}
    >
      <VSCodeButton
        appearance="icon"
        onClick={hideAnnouncement}
        style={{ position: "absolute", top: "8px", right: "8px" }}
      >
        <span className="codicon codicon-close"></span>
      </VSCodeButton>
      <h3 style={{ margin: "0 0 8px" }}>🎉{"  "}New in v1.0.0</h3>
      <ul style={{ margin: "0 0 8px", paddingLeft: "20px" }}>
        <li>
          Open in the editor to see how VsGent updates your workspace more clearly.
        </li>
        <li>
          New <code>analyze_project</code> tool to get a comprehensive overview of your project's source code.
        </li>
        <li>Provide feedback on tool usage like terminal commands and file edits.</li>
        <li>Updated max output tokens to 8192 for better coding efficiency.</li>
        <li>Added the ability to retry failed API requests for handling rate limits.</li>
        <li>Quality of life improvements like markdown rendering and theme support.</li>
      </ul>
      <p style={{ margin: "0" }}>
        Subscribe to my new YouTube channel to see how to get the most out of VsGent!{" "}
        <VSCodeLink href="https://youtube.com/@saoudrizwan" style={{ display: "inline" }}>
          https://youtube.com/@saoudrizwan
        </VSCodeLink>
      </p>
    </div>
  );
};

export default Announcement;
