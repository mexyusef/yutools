for below HTML, im typing to textarea with:
await type(client, `textarea[placeholder="${bolt_text_area_placeholder}"]`, prompt);
but have not click the button with right arrow below which actually to send the prompt
```
<div class="relative select-none">
  <textarea class="w-full pl-4 pt-4 pr-16 focus:outline-none resize-none text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm" placeholder="How can Bolt help you today?" translate="no" style="min-height: 76px; max-height: 200px; height: 76px; overflow-y: hidden;"></textarea>
  <button class="absolute flex justify-center items-center top-[18px] right-[22px] p-1 bg-accent-500 hover:brightness-94 color-white rounded-md w-[34px] h-[34px] transition-theme disabled:cursor-not-allowed" style="opacity: 1; transform: none;">
    <div class="text-lg">
      <div class="i-ph:arrow-right"></div>
    </div>
  </button>
</div>
```