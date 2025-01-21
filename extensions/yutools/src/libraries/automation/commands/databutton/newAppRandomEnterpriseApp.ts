import * as vscode from 'vscode';
import { GLHFLLMClient } from "@/libraries/ai/glhf/glhf";
import { getClient } from "../clientManager";
import { readPromptFromFile } from "@/libraries/prompts/collections/readPromptFromFile";
import { glhfSettings } from "@/libraries/ai/config";
import { click, type, waitForElement } from "../..";

const promptFilePath = 'C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\prompts\\collections\\prompt.web-quick2.md';

export async function newAppRandomEnterpriseApp() {
  const client = getClient();
  const llm = new GLHFLLMClient();
  const filePrompt = await readPromptFromFile(promptFilePath);
  let llmResponse: string = '';
  try {
    llmResponse = await llm.createCompletion({
      messages: [
        { role: 'system', content: glhfSettings.getConfig().systemPrompt as string },
        { role: 'user', content: filePrompt },
      ],
    }) as string;
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to query LLM: ${error}`);
    return;
  }
  const prompt = llmResponse.trim();

  // https://databutton.com/home
  // <button type="button" class="db--c-jczqew db--c-jczqew-kopEqi-size-large db--c-jczqew-jPgZO-intent-smart"><div class="db--c-cCAOEf db--c-cCAOEf-iaKLpG-intent-smart"></div><div class="db--c-jBDafv db--c-jBDafv-gDobpQ-size-large"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><g clip-path="url(#clip0_8926_6884)"><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M11.698 7.702l-1.05.482c-.974.446-1.461.67-1.969.757-.45.078-.909.078-1.358 0-.508-.088-.995-.311-1.97-.757l-1.049-.482c-1.88-.861-2.82-1.292-3.112-1.888a1.862 1.862 0 01.001-1.64c.293-.596 1.234-1.025 3.116-1.883l1.055-.482c.97-.442 1.456-.664 1.961-.751a3.972 3.972 0 011.354 0c.505.087.99.309 1.96.751l1.056.482c1.882.858 2.823 1.287 3.116 1.882.254.518.255 1.124.001 1.641-.292.596-1.232 1.027-3.112 1.888z"></path><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M8.68 11.941a3.97 3.97 0 01-1.36 0c-.507-.088-.994-.311-1.968-.758l-1.05-.48C2.422 9.84 1.482 9.41 1.19 8.813A1.86 1.86 0 011 8V5m14 3V5"></path><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M1 8v3c0 .279.064.557.19.814.291.596 1.232 1.027 3.112 1.888l1.05.482c.974.446 1.461.67 1.969.757.45.079.909.079 1.358 0 .241-.041.478-.114.763-.226M15 10.5V8"></path><path fill="currentColor" d="M8.647 6.985l-1.17-.562.274-.515-2.09-1.005-.838.244-1.17-.562 6.035-1.77.951.457-1.992 3.713zm.129-2.994l-1.646.484 1.101.53.545-1.014z"></path><path stroke="currentColor" stroke-width="1.5" d="M12.5 9.5v3m0 3v-3m0 0h3m-3 0h-3"></path></g><defs><clipPath id="clip0_8926_6884"><path fill="#fff" d="M0 0H16V16H0z"></path></clipPath></defs></svg>New App...</div></button>

  // Step 1: Click the "New App" button
  await waitForElement(client, 'button:has-text("New App")', 60_000);
  await click(client, 'button:has-text("New App")');
  console.log(`Clicked the "New App" button. Waiting for the dialog to appear...`);

  // <div class="db--c-dhzjXW db--c-iUUdCu db--c-dhzjXW-jroWjL-direction-horizontal">
  //   <div class="db--c-dhzjXW db--c-dhzjXW-jroWjL-direction-horizontal db--c-dhzjXW-knmidH-justifyContent-space-between db--c-dhzjXW-ilcYjlF-css">
  //     <div class="db--c-dhzjXW db--c-dhzjXW-jroWjL-direction-horizontal db--c-dhzjXW-ikASTRQ-css">
  //       <h5 id="headlessui-dialog-title-:r6:" data-headlessui-state="open" class="db--c-irKUQU db--c-irKUQU-bCKMOf-weight-bold db--c-irKUQU-byOZOm-color-dark">What can we help you build today?</h5>
  //     </div>
  //     <button type="button" class="db--c-jczqew db--c-jczqew-htMQwM-size-medium db--c-jczqew-jMIuBg-intent-plain db--c-jczqew-ibyOZOm-css">
  //       <div class="db--c-cCAOEf db--c-cCAOEf-ibPCDO-intent-plain"></div>
  //       <div class="db--c-jBDafv db--c-jBDafv-eSwvPn-size-medium">
  //         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  //           <path d="M12.5 3.5L8 8M8 8L3.5 12.5M8 8L12.5 12.5M8 8L3.5 3.5" stroke="currentColor" stroke-width="1.5"></path>
  //         </svg>
  //       </div>
  //     </button>
  //   </div>
  //   <div class="db--c-jeXHDZ">
  //     <form class="PJLV PJLV-iiUlqfE-css">
  //       <div class="db--c-dhzjXW db--c-dhzjXW-kqFZpo-direction-vertical db--c-dhzjXW-bcJqsD-gap-20px">
  //         <div class="db--c-dhzjXW db--c-dhzjXW-kqFZpo-direction-vertical db--c-dhzjXW-eSwvPn-gap-6px">
  //           <div class="db--c-jHwrNp db--c-dIEVUo db--c-jHwrNp-ifGHEql-css" data-value="">
  //             <textarea rows="1" name="prompt" placeholder="Describe the app you want to build" maxlength="150" class="db--c-hgglmS db--c-jHwrNp db--c-hgglmS-idTnfBl-css"></textarea>
  //           </div>
  //         </div>
  //         <label class="db--c-kMMQOR db--c-fGsWOh">
  //           <div class="db--c-dhzjXW db--c-dhzjXW-jroWjL-direction-horizontal db--c-dhzjXW-gDobpQ-gap-10px">
  //             <p class="db--c-kCRUpp db--c-kCRUpp-bCKMOf-weight-bold db--c-kCRUpp-byOZOm-color-dark">SELECT UI Library</p>
  //             <div class="db--c-jKOUQW">
  //               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" class="db--c-bHwuwj">
  //                 <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7.99998C7.5 8.00466 7.49715 8.00888 7.49279 8.01062L7.98463 7.81388C9.72846 7.11635 9.89283 4.74038 8.32408 3.76669C7.71895 3.39109 6.96683 3.31602 6.29774 3.57337L6.26206 3.5871C5.35109 3.93748 4.75 4.8127 4.75 5.78872V6.49999H6.25V5.78872C6.25 5.43335 6.46886 5.11468 6.80054 4.98711L6.83623 4.97338C7.06259 4.88632 7.32302 4.91079 7.53305 5.04115C8.08374 5.38296 7.99982 6.19226 7.42755 6.42117L6.93571 6.61791C6.37057 6.84396 6 7.39131 6 7.99998H7.5Z" fill="currentColor"></path>
  //                 <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 6 10.5)" fill="currentColor"></circle>
  //                 <rect x="0.75" y="0.75" width="12.5" height="12.5" rx="6.25" stroke="currentColor" stroke-width="1.5"></rect>
  //               </svg>
  //             </div>
  //           </div>
  //           <div class="db--c-dhzjXW db--c-dhzjXW-jroWjL-direction-horizontal db--c-dhzjXW-iSZeJd-gap-4 db--c-dhzjXW-iLVrSC-css">
  //             <div class="db--c-iBPviJ">
  //               <input type="radio" name="mode" id="easy-mode" class="db--c-kJNwD db--c-kJNwD-kfIrOU-checked-true">
  //               <label for="easy-mode" class="db--c-eCiHFA">Prebuilt components (Shadcn)</label>
  //             </div>
  //             <div class="db--c-iBPviJ">
  //               <input type="radio" name="mode" id="full-control" class="db--c-kJNwD db--c-kJNwD-fsGIOz-checked-false">
  //               <label for="full-control" class="db--c-eCiHFA">Full flexibility (Tailwind)</label>
  //             </div>
  //           </div>
  //         </label>
  //         <div class="db--c-dhzjXW db--c-dhzjXW-jroWjL-direction-horizontal db--c-dhzjXW-bZmKkd-justifyContent-flex-end">
  //           <button type="submit" class="db--c-jczqew db--c-jczqew-htMQwM-size-medium db--c-jczqew-jPgZO-intent-smart">
  //             <div class="db--c-cCAOEf db--c-cCAOEf-iaKLpG-intent-smart"></div>
  //             <div class="db--c-jBDafv db--c-jBDafv-eSwvPn-size-medium">
  //               <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  //                 <g clip-path="url(#clip0_985_18127)">
  //                   <path d="M14.7591 5.06678L0.999986 2.25118L4.14227 7.91156M14.7591 5.06678L4.25116 14.3847L4.14227 7.91156M14.7591 5.06678L4.14227 7.91156" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
  //                 </g>
  //                 <defs>
  //                   <clipPath id="clip0_985_18127">
  //                     <rect width="16" height="16" fill="white"></rect>
  //                   </clipPath>
  //                 </defs>
  //               </svg> Build
  //             </div>
  //           </button>
  //         </div>
  //       </div>
  //     </form>
  //   </div>
  // </div>

  // Step 2: Wait for the dialog to appear
  await waitForElement(client, 'div[role="dialog"]', 60_000);
  console.log(`Dialog appeared. Waiting for the textarea and "Build" button...`);

  // <textarea rows="1" name="prompt" placeholder="Describe the app you want to build" maxlength="150" class="db--c-hgglmS db--c-jHwrNp db--c-hgglmS-idTnfBl-css"></textarea>
  await type(client, 'textarea[name="prompt"]', prompt);
  console.log(`Filled in the textarea with the prompt: "${prompt}"`);

  // Step 4: Select a UI library (e.g., "Prebuilt components (Shadcn)")
  await click(client, 'input[id="easy-mode"]');
  console.log(`Selected "Prebuilt components (Shadcn)"`);

  // <button>Build
  // Step 5: Click the "Build" button
  await click(client, 'button:has-text("Build")');
  console.log(`Clicked the "Build" button.`);
}