export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html) => {
    // Convert render-blocking CSS <link> to non-blocking
    // Since styles are already inlined via inlineSSRStyles, the <link> tags
    // are only needed for hydration, not for initial paint
    html.head = html.head.map((chunk) =>
      chunk.replace(
        /<link rel="stylesheet" href="(\/_nuxt\/[^"]+\.css)"([^>]*)>/g,
        '<link rel="stylesheet" href="$1"$2 media="print" onload="this.media=\'all\'">'
      )
    );
  });
});
