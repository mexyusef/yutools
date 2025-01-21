/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { themeColors, widgetThemeMap } from './widgetThemeMap.js';

export function registerWidgetTheme(widgetId: string, theme: string): string {
	widgetThemeMap[widgetId] = theme;
	return theme;
}

export function getThemeColor(theme: string): string {
	return themeColors[theme] || themeColors.cyan;
}

export function getRGBA(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getDefaultTheme(widgetId: string): string {
	return widgetThemeMap[widgetId] || 'cyan';
}
