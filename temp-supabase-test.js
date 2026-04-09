const { createClient } = require("./lib/supabase/client");
(async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
    console.log("OK", { length: data && data.length, error });
  } catch (e) {
    console.error("ERR", e && e.message ? e.message : e);
  }
})();