// import React from "react";
import * as vscode from "vscode";
import { getBasename } from "./helpers";

const FilesSelector = ({
	files,
	setFiles,
}: {
	files: vscode.Uri[];
	setFiles: (files: vscode.Uri[]) => void;
}) => {
	return (
		files.length !== 0 && (
			<div className="my-2">
				Include files:
				{files.map((filename, i) => (
					<div key={i} className="flex">
						<button
							type="button"
							onClick={() => {
								let file_index = files.indexOf(filename);
								setFiles([
									...files.slice(0, file_index),
									...files.slice(file_index + 1, Infinity),
								]);
							}}
						>
							-{" "}
							<span className="text-gray-500">
								{getBasename(filename.fsPath)}
							</span>
						</button>
					</div>
				))}
			</div>
		)
	);
};

export default FilesSelector;
