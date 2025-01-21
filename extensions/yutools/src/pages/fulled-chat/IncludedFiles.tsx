import React from "react";
import * as vscode from "vscode";
import { getBasename } from "./helpers";

const IncludedFiles = ({ files }: { files: vscode.Uri[] }) => {
	return (
		files.length !== 0 && (
			<div className="text-xs my-2">
				{files.map((filename, i) => (
					<div key={i} className="flex">
						<button
							type="button"
							className="btn btn-secondary pointer-events-none"
							onClick={() => {
								// TODO: Redirect to the document filename.fsPath
							}}
						>
							-{" "}
							<span className="text-gray-100">
								{getBasename(filename.fsPath)}
							</span>
						</button>
					</div>
				))}
			</div>
		)
	);
};

export default IncludedFiles;
