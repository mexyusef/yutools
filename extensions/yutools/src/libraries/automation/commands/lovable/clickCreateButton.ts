import { BrowserClient, click } from "../..";

// <form class="p-2 flex flex-col gap-2 rounded-xl bg-zinc-800 group focus-within:bg-zinc-700 transition-colors duration-150 border border-border w-full">

//   <textarea class="flex w-full rounded-md px-2 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 placeholder-shown:whitespace-nowrap placeholder-shown:text-ellipsis resize-none text-base leading-snug focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[200px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#636575] bg-transparent focus:bg-transparent" id="chatinput" placeholder="Ask Lovable to create an " rows="3" style="height: 78px;"></textarea>

//   <div class="flex gap-1 items-end flex-wrap">

//     <button class="whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0" type="button">
//       <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-4 w-4" fill="currentColor">
//         <path d="M180-120q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h379q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H180v600h600v-378q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v378q0 24.75-17.62 42.37Q804.75-120 780-120zm520-579h-51q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h51v-51q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v51h51q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5h-51v51q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37zM449-307l-82-108q-5-6-12-6t-12 6l-84 109q-6 8-1.5 16t13.5 8h419q8.5 0 12.75-8t-.75-16L588-458q-5-6-12-6t-12 6zm31-173"></path>
//       </svg>Attach </button>

//     <input id="file-upload" class="hidden" accept="image/jpeg,.jpg,.jpeg,image/png,.png" multiple="" tabindex="-1" type="file" style="display: none;">

//     <button class="whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center gap-1 px-1 py-0.5 h-fit focus-visible:ring-0" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r2p:" data-state="closed">
//       <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-4 w-4" fill="currentColor">
//         <path d="M480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34T80-480.5t31.5-155.66 86-126.84 127.34-85.5T480.5-880t155.66 31.5T763-763t85.5 127T880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80m-.27-60q142.38 0 241.19-99.5T820-480v-13q-6 26-27.41 43.5Q771.19-432 742-432h-80q-33 0-56.5-23.5T582-512v-40H422v-80q0-33 23.5-56.5T502-712h40v-22q0-16 13.5-40t30.5-29q-25-8-51.36-12.5Q508.29-820 480-820q-141 0-240.5 98.81T140-480h150q66 0 113 47t47 113v40H330v105q34 17 71.7 26t78.3 9"></path>
//       </svg>Public </button>

//     <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&amp;_svg]:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-150, ml-auto gap-1" id="chatinput-send-message-button" type="button" disabled="">
//           Create 
//           <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-5 w-5" fill="currentColor">
//         <path d="M685-452H190q-13 0-21.5-8.5T160-482t8.5-21.5T190-512h495L537-660q-9-9-8.5-21t9.5-21 21-9 21 9l199 199q5 5 7 10t2 11-2 11-7 10L581-263q-9 9-21 9t-21-9-9-21.5 9-21.5z"></path>
//       </svg>
//     </button>

//   </div>

// </form>

export async function clickCreateButton(client: BrowserClient) {
  try {
    // Wait for the "Create" button to be visible
    await client.waitForSelector('#chatinput-send-message-button:not([disabled])', 10_000);

    // Click the "Create" button
    await click(client, '#chatinput-send-message-button');
    console.log('Clicked the "Create" button.');
  } catch (error) {
    console.error(`Failed to click the "Create" button: ${error}`);
    throw error;
  }
}

// // Type text into the chat input
// await typeIntoChatInput(client, 'Ask Lovable to create an amazing feature!');
// // Click the "Create" button
// await clickCreateButton(client);