export function cleanUpPromptFromPrefix(prompt: string): string {
	// if (prompt.startsWith(lens_prefix1)) {
	//   return prompt.substring(lens_prefix1.length).trimStart();
	// } else if (prompt.startsWith(lens_prefix2)) {
	//   return prompt.substring(lens_prefix2.length).trimStart();
	// } else if (prompt.startsWith(lens_prefix3)) {
	//   return prompt.substring(lens_prefix3.length).trimStart();
	// } else if (prompt.startsWith(lens_prefix4)) {
	//   return prompt.substring(lens_prefix4.length).trimStart();
	// } else if (prompt.startsWith(lens_prefix5)) {
	//   return prompt.substring(lens_prefix5.length).trimStart();
	// } else if (prompt.startsWith(lens_prefix6)) {
	//   return prompt.substring(lens_prefix6.length).trimStart();
	// }
	return prompt.trimStart();
}
