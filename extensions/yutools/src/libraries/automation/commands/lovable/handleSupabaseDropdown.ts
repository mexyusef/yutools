import * as vscode from 'vscode';
import { waitForSelector } from '../../actions/waitForSelector';
import { click } from '../../actions/click';
import { screenshot } from '../../actions/screenshot';
import { getClient } from '../clientManager';

// <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none bg-muted callout hover:bg-primary/20 border border-zinc-700 h-7 rounded-md px-2 py-1 gap-1.5 flex-shrink-0" id="supabase-dropdown-menu-button" type="button" aria-haspopup="menu" aria-expanded="false" data-state="closed"><img src="/icons/supabase_logo.svg" class="h-4 w-auto" alt="Supabase"><span class="hidden md:flex">Supabase</span></button>

// https://supabase.com/dashboard/sign-up
// https://supabase.com/dashboard/sign-in

// <form id="signIn-form" method="POST" data-sentry-component="Form" data-sentry-source-file="Form.tsx">
//   <div class="flex flex-col gap-4">
//     <div class="text-sm grid gap-2 md:grid md:grid-cols-12" data-sentry-component="FormLayout" data-sentry-source-file="FormLayout.tsx">
//       <div class="flex flex-row space-x-2 justify-between col-span-12">
//         <label class="block text-foreground-light text-sm break-all" for="email">Email</label>
//       </div>
//       <div class="col-span-12">
//         <div class="">
//           <div class="relative">
//             <input data-size="medium" autocomplete="email" id="email" name="email" placeholder="you@example.com" type="email" class="peer/input block box-border w-full rounded-md shadow-sm transition-all text-foreground focus-visible:shadow-md outline-none focus:ring-current focus:ring-2 focus-visible:border-foreground-muted focus-visible:ring-background-control placeholder-foreground-muted group bg-foreground/[.026] border border-control text-sm px-4 py-2" value="">
//           </div>
//         </div>
//         <p data-state="hide" class="
//         text-red-900
//         transition-all
//         data-show:mt-2
//         data-show:animate-slide-down-normal
//         data-hide:animate-slide-up-normal
//        text-sm"></p>
//       </div>
//     </div>
//     <div class="relative">
//       <div class="text-sm grid gap-2 md:grid md:grid-cols-12" data-sentry-component="FormLayout" data-sentry-source-file="FormLayout.tsx">
//         <div class="flex flex-row space-x-2 justify-between col-span-12">
//           <label class="block text-foreground-light text-sm break-all" for="password">Password</label>
//         </div>
//         <div class="col-span-12">
//           <div class="">
//             <div class="relative">
//               <input data-size="medium" autocomplete="current-password" id="password" name="password" placeholder="••••••••" type="password" class="peer/input block box-border w-full rounded-md shadow-sm transition-all text-foreground focus-visible:shadow-md outline-none focus:ring-current focus:ring-2 focus-visible:border-foreground-muted focus-visible:ring-background-control placeholder-foreground-muted group bg-foreground/[.026] border border-control text-sm px-4 py-2" value="">
//             </div>
//           </div>
//           <p data-state="hide" class="
//         text-red-900
//         transition-all
//         data-show:mt-2
//         data-show:animate-slide-down-normal
//         data-hide:animate-slide-up-normal
//        text-sm"></p>
//         </div>
//       </div>
//       <a class="absolute top-0 right-0 text-sm text-foreground-lighter" href="/dashboard/forgot-password">Forgot Password?</a>
//     </div>
//     <div class="self-center">
//       <div>
//         <iframe aria-hidden="true" data-hcaptcha-widget-id="0pmsi7w3tiy" data-hcaptcha-response="" src="https://newassets.hcaptcha.com/captcha/v1/b4956db/static/hcaptcha.html#frame=checkbox-invisible" style="display: none;"></iframe>
//         <textarea id="g-recaptcha-response-0pmsi7w3tiy" name="g-recaptcha-response" style="display: none;"></textarea>
//         <textarea id="h-captcha-response-0pmsi7w3tiy" name="h-captcha-response" style="display: none;"></textarea>
//       </div>
//     </div>
//     <div class="flex items-center relative" data-sentry-component="LastSignInWrapper" data-sentry-source-file="LastSignInWrapper.tsx">
//       <div class="w-full">
//         <button data-size="large" type="submit" form="signIn-form" class="relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-400 dark:bg-brand-500 hover:bg-brand/80 dark:hover:bg-brand/50 text-foreground border-brand-500/75 dark:border-brand/30 hover:border-brand-600 dark:hover:border-brand focus-visible:outline-brand-600 data-[state=open]:bg-brand-400/80 dark:data-[state=open]:bg-brand-500/80 data-[state=open]:outline-brand-600 w-full flex items-center justify-center text-base px-4 py-2 h-[42px]">
//           <span class="truncate">Sign In</span>
//         </button>
//       </div>
//     </div>
//   </div>
// </form>

export async function handleSupabaseDropdown() {
  const client = getClient();
  try {
    // Click the Supabase button
    await click(client, '#supabase-dropdown-menu-button');
    console.log('Supabase button clicked.');

    // Wait for the dropdown to appear
    await waitForSelector(client, '.flex.flex-col.gap-2', 10_000); // Dropdown container
    console.log('Supabase dropdown is visible.');

    // Example: Click the "Connect to Supabase" button in the dropdown
    await click(client, 'button img[alt="Connect to Supabase"]');
    console.log('Clicked "Connect to Supabase" in the dropdown.');

    vscode.window.showInformationMessage('Supabase dropdown handled successfully!');
  } catch (error) {
    await screenshot(client, 'c:\\hapus\\gagal_lovable_supabase_connect_screenshot.png');
    vscode.window.showErrorMessage(`Supabase dropdown failed: ${error}`);
  }
}