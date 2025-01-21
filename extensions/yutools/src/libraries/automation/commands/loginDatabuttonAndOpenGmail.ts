import * as vscode from 'vscode';
import { BrowserClient} from '../core/BrowserClient';
import { navigate, type, click } from '..';
import { getEmailFromQuickPick } from '../accounts/getEmailFromQuickPick';
import { ACCOUNT_DATABUTTON } from '../accounts/constants';
import { setClient } from './clientManager';

// https://databutton.com/complete-sign-in?next=/home&apiKey=AIzaSyAdgR9BGfQrV2fzndXZLZYgiRtpydlq8ug&oobCode=8MkU_JurnVGy0XKUN3QvB7AJ6C77cm3QwiAbRZulafoAAAGUMhp8hw&mode=signIn&lang=en

export async function loginDatabuttonAndOpenGmail() {
  const client = new BrowserClient('chromium');
  await client.launch({
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false
  });
  setClient(client);
  try {
    // // Prompt the user for their email
    // const email = await vscode.window.showInputBox({
    //   prompt: 'Enter your email for Databutton login',
    //   placeHolder: 'mail@example.com',
    // });
    // // If the user cancels the input box, exit the function
    // if (!email) {
    //   vscode.window.showWarningMessage('No email entered. Exiting...');
    //   return;
    // }

    const username = await getEmailFromQuickPick(ACCOUNT_DATABUTTON);
    if (!username) return;

    // Navigate to the Databutton login page
    await navigate(client, 'https://databutton.com/login?next=/home');

    // Wait for the login form to load
    await client.waitForSelector('form input[type="email"]', 50000);

    // Fill in the email input field
    await type(client, 'form input[type="email"]', username);

    // Click the "Sign In or Up" button
    await click(client, 'form button[type="submit"]');

    // Wait for the login process to complete (adjust timeout as needed)
    await client.waitForSelector('body', 60_000);

    // // Open Gmail in the same browser
    // await navigate(client, 'https://mail.google.com/mail/u/0/#inbox');

    vscode.window.showInformationMessage('Logged in and opened Gmail successfully!');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to log in or open Gmail: ${error}`);
  // } finally {
  //   await client.close();
  }
}
// data button system message
// <div class="w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#636575] overflow-y-auto">
//   <div style="overflow-anchor: none; flex: 0 0 auto; position: relative; visibility: hidden; width: 100%; height: 7085.84px;">
//     <div style="position: absolute; width: 100%; left: 0px; top: 0px; visibility: visible;">
//       <div class="ChatMessageContainer pl-4 pr-2 group flex flex-col pb-4" data-message-id="d8ea4698-aee1-4b54-ae3c-1edb5b9ca8c3">
//         <div class="">
//           <div class="flex flex-col align-end">
//             <div class="flex flex-wrap gap-2 mb-2 ml-auto justify-end max-w-[160px]"></div>
//             <div class="whitespace-pre-wrap break-anywhere bg-zinc-800 p-3 rounded-lg overflow-auto text-base leading-[22px] max-w-[80%] ml-auto jus">
//               <div>### APPLICATION OVERVIEW #### Application Title: E-ComTrade #### Purpose: E-ComTrade is an enterprise-grade web application designed to serve as a comprehensive e-commerce platform. It caters ...Implement complete error handling and detailed documentation in comments - Implement proper logging using Morgan and Winston - Set up monitoring using Prometheus and Grafana for tracking performance metrics - Follow security best practices outlined in the Security Implementation section - Include automated tests; both unit tests and end-to-end tests - Use Docker for containerization - Include Kubernetes configuration for automated scaling and deployment ### CONSTRAINTS - Must be scalable to 100K+ users - Must handle 1000+ requests/second - Must maintain sub-200ms response times - Must achieve 99.9% uptime - Must include automated scaling and service mesh configuration for resilience and fault tolerance</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div style="position: absolute; width: 100%; left: 0px; top: 5658px; visibility: visible;">
//       <div class="ChatMessageContainer pl-4 pr-2 group flex flex-col pb-4" data-message-id="b920d10d-016c-4bd8-b053-84256a158a1d" data-message-edit-id="6b2db90c-2902-41f5-a3bc-5c60fa20f4ad" data-langsmith-url="https://smith.langchain.com/o/07dc8052-707c-4664-8a5f-5eced8dc82a0/projects/p/317fcedd-e28d-49b8-a2f9-888a8de6ba1e/r/99577e84-80da-4098-928f-c94abc61de2c?poll=true">
//         <div class="flex items-center shrink-0 gap-2 mb-2">
//           <div class="flex items-center gap-2 pl-2 shrink-0">
//             <img alt="lovable logo" loading="lazy" width="20" height="20" decoding="async" data-nimg="1" src="/img/lovable-logo.svg" style="color: transparent;">
//             <span class="callout whitespace-nowrap">Lovable</span>
//           </div>
//           <span class="text-xs flex-shrink text-nowrap overflow-hidden text-ellipsis text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">22:33 on Jan 04, 2025</span>
//           <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground h-7 px-1 rounded-md py-1 aspect-square ml-auto" type="button" id="radix-:r4b:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
//             <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-4 w-4" fill="currentColor">
//               <path d="M207.86-432Q188-432 174-446.14t-14-34T174.14-514t34-14T242-513.86t14 34T241.86-446t-34 14m272 0Q460-432 446-446.14t-14-34T446.14-514t34-14T514-513.86t14 34T513.86-446t-34 14m272 0Q732-432 718-446.14t-14-34T718.14-514t34-14T786-513.86t14 34T785.86-446t-34 14"></path>
//             </svg>
//           </button>
//         </div>
//         <div class="pl-2">
//           <div class="overflow-auto text-base leading-[22px] text-left flex flex-col gap-2" style="overflow-wrap: anywhere;">
//             <div class="prose prose-markdown prose-zinc prose-invert max-w-full PromptBox_customProse__C94Rw  prose-h1:text-xl prose-h1:font-bold prose-h1:mb-2 prose-h2:text-lg prose-h2:font-bold prose-h3:font-bold prose-h3:text-base prose-li:my-0 prose-ul:my-2 prose-ol:my-2 prose-pre:my-2 prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:bg-background">
//               <p>I notice that this is a very large and complex application request. While I can help you build this e-commerce platform, I recommend breaking it down into smaller, manageable pieces that we can implement step by step. This approach will help us:</p>
//               <ol>
//                 <li>Ensure each component works perfectly before moving to the next</li>
//                 <li>Make the development process more manageable</li>
//                 <li>Allow for easier testing and debugging</li>
//                 <li>Enable quick iterations based on feedback</li>
//               </ol>
//               <p>For the first version, I suggest we focus on these core features:</p>
//               <ol>
//                 <li>Basic product listing and details page</li>
//                 <li>Shopping cart functionality</li>
//                 <li>User authentication (login/register)</li>
//                 <li>Basic admin panel for product management</li>
//               </ol>
//               <p>Let me create a beautiful and functional foundation that we can build upon. I'll draw inspiration from modern e-commerce platforms like Shopify and Amazon while keeping the UI clean and professional.</p>
//               <p>Design Elements:</p>
//               <ul>
//                 <li>Color Scheme: Professional blues and grays with accent colors</li>
//                 <li>Typography: Clean, modern sans-serif fonts</li>
//                 <li>Layout: Responsive grid system with smooth transitions</li>
//                 <li>Components: Polished cards, buttons, and forms with subtle shadows</li>
//               </ul>
//             </div>
//             <button class="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none shadow-sm hover:text-accent-foreground h-auto callout p-3 my-2 flex w-full gap-2 rounded-lg cursor-pointer bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200 ease-in-out items-start">
//               <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-5 w-5 text-muted-foreground" fill="currentColor">
//                 <path d="m166-482 176 176q9 9 8.5 21t-9.5 21-21.5 9-21.5-9L101-461q-5-5-7-10t-2-11 2-11 7-10l200-200q9-9 21.5-9t21.5 9 9 21.5-9 21.5zm628 0L618-658q-9-9-8.5-21t9.5-21 21.5-9 21.5 9l197 197q5 5 7 10t2 11-2 11-7 10L659-261q-9 9-21 8.5t-21-9.5-9-21.5 9-21.5z"></path>
//               </svg>
//               <div class="flex flex-col text-left overflow-hidden w-full gap-1">
//                 <span class="truncate text-zinc-300">Edit #1 • Implement E-ComTrade application features</span>
//                 <span class="text-muted-foreground truncate">Click to view code</span>
//               </div>
//               <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-5 w-5 text-muted-foreground" fill="currentColor">
//                 <path d="M530-481 353-658q-9-9-8.5-21t9.5-21 21.5-9 21.5 9l198 198q5 5 7 10t2 11-2 11-7 10L396-261q-9 9-21 8.5t-21-9.5-9-21.5 9-21.5z"></path>
//               </svg>
//             </button>
//             <div class="prose prose-markdown prose-zinc prose-invert max-w-full PromptBox_customProse__C94Rw  prose-h1:text-xl prose-h1:font-bold prose-h1:mb-2 prose-h2:text-lg prose-h2:font-bold prose-h3:font-bold prose-h3:text-base prose-li:my-0 prose-ul:my-2 prose-ol:my-2 prose-pre:my-2 prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:bg-background">
//               <p>I've created a beautiful and responsive foundation for the e-commerce platform with a modern design, featuring a hero section, featured products grid, category showcase, and newsletter signup. The next steps would be to implement authentication, product listing pages, and shopping cart functionality.</p>
//               <p>If there's knowledge, context or custom instructions you want to include in every edit in this project, set it below.</p>
//               <p>If your project requires backend functionality, you can use the Supabase menu on the top right to connect your project to Supabase.</p>
//             </div>
//             <div class="flex justify-between flex-row items-stretch">
//               <div class="flex gap-2 flex-wrap flex-1 max-w-full overflow-hidden">
//                 <span class="justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none border border-input bg-muted shadow-sm hover:bg-accent hover:border-accent hover:text-accent-foreground h-7 rounded-md px-2 py-1 flex gap-1 items-center overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer flex items-center gap-1">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle">
//                     <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
//                   </svg>
//                   <span class="truncate">Learn more about Supabase</span>
//                 </span>
//                 <button class="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none border border-input bg-muted shadow-sm hover:bg-accent hover:border-accent hover:text-accent-foreground h-7 rounded-md px-2 py-1 whitespace-nowrap gap-1" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r5d:" data-state="closed">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-5 w-5 text-muted-foreground" fill="currentColor">
//                     <path d="M220-262q-14-8-22.5-21.88Q189-297.75 189-315v-204L89-574q-8-5-12-11.53-4-6.52-4-14.5 0-7.97 4-14.47T89-626l361-198q7-4 14.21-5.5 7.2-1.5 14.79-1.5t14.79 1.5Q501-828 508-824l396 215q8 5 12 11.97 4 6.96 4 15.03v269q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37v-252l-91 46v204q0 17.25-8.5 31.12Q752-270 738-262L508-136q-7 4-14.21 5.5-7.2 1.5-14.79 1.5t-14.79-1.5Q457-132 450-136zm259-166 315-172-315-169-313 169zm0 240 230-127v-168L508-375q-7 4-14 5.5t-15 1.5-14.5-1.5T451-375L249-485v170zm0-150"></path>
//                   </svg>Manage knowledge </button>
//               </div>
//               <div class="flex flex-row gap-1 ml-2">
//                 <a class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground h-7 px-1 rounded-md py-1 aspect-square gap-1" href="https://preview--tradejourney-platform.lovable.app/" target="_blank" rel="noreferrer" data-state="closed">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-5 w-5 text-zinc-300" fill="currentColor">
//                     <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h249q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H180v600h600v-249q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v249q0 24-18 42t-42 18zm600-617L403-360q-9 9-21 8.5t-21-9.5-9-21 9-21l377-377H549q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h261q12.75 0 21.38 8.62Q840-822.75 840-810v261q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37z"></path>
//                   </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

// data button user message
// textarea, button Attach + input#file-upload, button Select, button type=button
// <form class="p-2 flex flex-col gap-2 rounded-xl bg-zinc-800 group focus-within:bg-zinc-700 transition-colors duration-150 border border-border mr-2 md:mr-0 ml-2 mb-2 mt-4">
//   <textarea class="flex w-full rounded-md px-2 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 placeholder-shown:whitespace-nowrap placeholder-shown:text-ellipsis resize-none text-base leading-snug focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[200px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#636575] bg-transparent focus:bg-transparent" id="chatinput" placeholder="Ask Lovable..." rows="1" style="height: 37px;"></textarea>
//   <div class="flex gap-1">

//     <button class="whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0" type="button">
//       <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-4 w-4" fill="currentColor">
//         <path d="M180-120q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h379q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H180v600h600v-378q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v378q0 24.75-17.62 42.37Q804.75-120 780-120zm520-579h-51q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h51v-51q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v51h51q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5h-51v51q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37zM449-307l-82-108q-5-6-12-6t-12 6l-84 109q-6 8-1.5 16t13.5 8h419q8.5 0 12.75-8t-.75-16L588-458q-5-6-12-6t-12 6zm31-173"></path>
//       </svg>Attach </button>
//     <input id="file-upload" class="hidden" accept="image/jpeg,.jpg,.jpeg,image/png,.png" multiple="" tabindex="-1" type="file" style="display: none;">

//     <button type="button" aria-pressed="false" data-state="off" class="rounded-md text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-transparent hidden md:flex items-center justify-center gap-1 px-1 py-0.5 h-fit">
//       <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-4 w-4" fill="currentColor">
//         <path d="M450-72v-45q-137-14-228-105T117-450H72q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32Q59.25-510 72-510h45q14-137 105-228t228-105v-45q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v45q137 14 228 105t105 228h45q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5h-45q-14 137-105 228T510-117v45q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63Q450-59.25 450-72m30-104q125 0 214.5-89.5T784-480t-89.5-214.5T480-784t-214.5 89.5T176-480t89.5 214.5T480-176m0-154q-63 0-106.5-43.5T330-480t43.5-106.5T480-630t106.5 43.5T630-480t-43.5 106.5T480-330m0-60q38 0 64-26t26-64-26-64-64-26-64 26-26 64 26 64 64 26m0-90"></path>
//       </svg>Select </button>

//     <button type="button" class="ml-auto disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-150" id="chatinput-send-message-button" disabled="">
//       <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-6 w-6" fill="currentColor">
//         <path d="M450-514v152q0 13 8.5 21.5T480-332t21.5-8.5T510-362v-152l53 53q9 9 21 9t21-9 9-21-9-21L501-607q-9-9-21-9t-21 9L355-503q-9 9-9 21t9 21 21 9 21-9zm30 434q-82 0-155-31.5t-127.5-86-86-127.5T80-480q0-83 31.5-156t86-127T325-848.5 480-880q83 0 156 31.5T763-763t85.5 127T880-480q0 82-31.5 155T763-197.5t-127 86T480-80"></path>
//       </svg>
//     </button>

//   </div>
// </form>
