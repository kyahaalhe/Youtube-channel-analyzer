const BACKEND_URL =  "https://romantic-optimism-production-2854.up.railway.app";

let currentVideoCount = 8;
let currentChannelId = "";

async function analyzeChannel() {
  const input = document.getElementById("channelInput").value.trim();
  if (!input) { alert("Channel name likho"); return; }

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");

  try {
    const searchRes = await fetch(`${BACKEND_URL}/api/search-channel?q=${encodeURIComponent(input)}`);
    const searchData = await searchRes.json();
    if (searchData.error) throw new Error(searchData.error);
    if (!searchData.items || searchData.items.length === 0) throw new Error("Channel nahi mila");

    currentChannelId = searchData.items[0].id.channelId;

    const chanRes = await fetch(`${BACKEND_URL}/api/channel-details?id=${currentChannelId}`);
    const chanData = await chanRes.json();
    if (!chanData.items?.length) throw new Error("Channel details nahi mile");

    const channel = chanData.items[0];
    document.getElementById("channelImage").src = channel.snippet.thumbnails?.high?.url || "";
    document.getElementById("channelName").innerText = channel.snippet.title || "N/A";
    document.getElementById("subs").innerText = Number(channel.statistics.subscriberCount || 0).toLocaleString();
    document.getElementById("views").innerText = Number(channel.statistics.viewCount || 0).toLocaleString();
    document.getElementById("videos").innerText = Number(channel.statistics.videoCount || 0).toLocaleString();

    const vidRes = await fetch(`${BACKEND_URL}/api/channel-videos?channelId=${currentChannelId}&maxResults=${currentVideoCount}`);
    const vidData = await vidRes.json();
    if (!vidData.items) throw new Error("Videos nahi mile");

    const videos = vidData.items;
    let videosHTML = "";
    let category = "general";

    videos.forEach(video => {
      const title = (video.snippet.title || "").toLowerCase();
      if (title.includes("minecraft") || title.includes("pubg") || title.includes("gaming") || title.includes("free fire")) category = "gaming";
      else if (title.includes("anime") || title.includes("naruto") || title.includes("one piece")) category = "anime";
      else if (title.includes("tech") || title.includes("iphone") || title.includes("ai")) category = "tech";
      else if (title.includes("funny") || title.includes("meme")) category = "comedy";
    });

    videos.forEach((video, index) => {
      const title = video.snippet.title || "";
      const lowerTitle = title.toLowerCase();
      const thumbnail = video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || "";

      let performance = index < 2 ? "🔥 High Performance" : index < 5 ? "👍 Good Performance" : "⚠️ Low Performance";
      let reason = "", thumbIdea = "", trend = "", aiUpgrade = "";

      if (category === "gaming") {
        if (lowerTitle.includes("challenge")) { reason = "Challenge gaming videos bohot viral hoti hain."; thumbIdea = "Big reaction face + challenge text + arrows."; trend = "Audience challenge & funny gameplay prefer karti hai."; aiUpgrade = "Zoom effects + funny edits use karo."; }
        else if (lowerTitle.includes("survival")) { reason = "Survival series strong engagement deti hai."; thumbIdea = "Dark survival scene + monster + glow text."; trend = "Minecraft survival trending hai."; aiUpgrade = "Episode cliffhangers add karo."; }
        else { reason = "Normal gameplay ab average perform karta hai."; thumbIdea = "Explosion + weapon + bold text."; trend = "Challenge & funny gaming trending hai."; aiUpgrade = "Funny moments + edits add karo."; }
      } else if (category === "anime") {
        if (lowerTitle.includes("edit")) { reason = "Anime edits Shorts me viral hoti hain."; thumbIdea = "Glow eyes + emotional anime face."; trend = "Anime edits trending hain."; aiUpgrade = "Beat sync editing use karo."; }
        else { reason = "Anime fights & power scaling popular hain."; thumbIdea = "Aura + fight scene + power text."; trend = "Anime battles trending hain."; aiUpgrade = "Comparison videos banao."; }
      } else if (category === "tech") {
        if (lowerTitle.includes("ai")) { reason = "AI content fastest growing category hai."; thumbIdea = "Robot + shocked face + glow text."; trend = "AI tools viral ho rahe hain."; aiUpgrade = "Fast cuts + transitions use karo."; }
        else { reason = "Tech reviews stable performance deti hain."; thumbIdea = "Product + bold comparison text."; trend = "Mobile tricks trending hain."; aiUpgrade = "Comparison format use karo."; }
      } else if (category === "comedy") {
        if (lowerTitle.includes("meme")) { reason = "Memes highly shareable content hain."; thumbIdea = "Funny face + meme text."; trend = "Relatable memes viral hain."; aiUpgrade = "Subtitles + sound effects add karo."; }
        else { reason = "POV comedy perform better karti hai."; thumbIdea = "Funny expression + bold text."; trend = "Relatable humor trending hai."; aiUpgrade = "Short punchlines use karo."; }
      } else {
        reason = "Short-form engaging content best perform karta hai."; thumbIdea = "Strong hook + emotional face."; trend = "Shorts algorithm dominate karta hai."; aiUpgrade = "Better thumbnail + hook improve karo.";
      }

      videosHTML += `
        <div class="video-card bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <img src="${thumbnail}" class="w-full">
          <div class="p-5">
            <div class="video-title text-lg font-bold mb-3">${title}</div>
            <div class="text-cyan-400 text-sm mb-2">${performance}</div>
            <div class="text-zinc-300 text-sm mb-3">${reason}</div>
            <div class="text-purple-400 text-sm mb-2">${thumbIdea}</div>
            <div class="text-green-400 text-sm mb-2">${trend}</div>
            <div class="text-cyan-400 text-sm">${aiUpgrade}</div>
          </div>
        </div>`;
    });

    let finalAdvice = "", ideas = "";
    if (category === "gaming") { finalAdvice = "Gaming me challenge aur survival content zyada viral hota hai."; ideas = "• Minecraft Hardcore<br>• Funny Squad Videos<br>• Impossible Challenges<br>• Horror Survival"; }
    else if (category === "anime") { finalAdvice = "Anime edits aur fights high engagement laati hain."; ideas = "• Anime Edits<br>• Anime Battles<br>• Power Scaling<br>• Explained Videos"; }
    else if (category === "tech") { finalAdvice = "AI tools aur mobile tricks fastest growing niche hain."; ideas = "• AI Tools<br>• Mobile Tricks<br>• Comparisons<br>• Reviews"; }
    else if (category === "comedy") { finalAdvice = "Relatable comedy Shorts best perform karte hain."; ideas = "• POV Comedy<br>• Memes<br>• School Humor<br>• Relatable Skits"; }
    else { finalAdvice = "Shorts + strong hook = best growth strategy."; ideas = "• Shorts<br>• Reactions<br>• Trends<br>• Challenges"; }

    videosHTML += `
      <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500 rounded-3xl p-8">
        <h2 class="text-3xl font-black text-cyan-400 mb-6">Final AI Advice</h2>
        <div class="text-zinc-300 leading-8 text-lg mb-8">${finalAdvice}</div>
        <div class="bg-black border border-zinc-800 rounded-3xl p-6">
          <h3 class="text-2xl font-bold text-purple-400 mb-4">Best Video Ideas</h3>
          <div class="text-zinc-300 leading-8">${ideas}</div>
        </div>
      </div>`;

    document.getElementById("videosContainer").innerHTML = videosHTML;
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");

  } catch (err) {
    console.log(err);
    alert("Error: " + err.message);
    document.getElementById("loading").classList.add("hidden");
  }
}

function filterVideos() {
  const search = document.getElementById("videoSearch").value.toLowerCase();
  document.querySelectorAll(".video-card").forEach(card => {
    const title = card.querySelector(".video-title").innerText.toLowerCase();
    card.style.display = title.includes(search) ? "block" : "none";
  });
}

document.getElementById("analyzeBtn").addEventListener("click", analyzeChannel);
document.getElementById("showMoreBtn").addEventListener("click", () => { currentVideoCount += 8; analyzeChannel(); });
