import { main_file_templates } from '../../../constants';
import { openAddressInBrowser } from '../../../handlers/networkutils';

export function previewProjectOnBrowser(framework: string) {
	const alamat = main_file_templates[framework]["url"].replace('__PORT__', String(main_file_templates[framework]["port"]));
	openAddressInBrowser(alamat);
}
