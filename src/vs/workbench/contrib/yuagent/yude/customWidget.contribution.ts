/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { ICustomWidgetService, CustomWidgetService } from './customWidgetService';
// import './customWidgetCommands';

registerSingleton(ICustomWidgetService, CustomWidgetService, InstantiationType.Delayed);
