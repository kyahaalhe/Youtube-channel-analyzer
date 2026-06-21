const BACKEND_URL = "https://romantic-optimism-production-2854.up.railway.app";

let currentVideoCount = 8;
let currentChannelId = "";

function deepAnalyzeVideo(video) {
  const title = (video.snippet?.title || "").toLowerCase();
  const description = (video.snippet?.description || "").toLowerCase();
  const tags = (video.snippet?.tags || []).join(" ").toLowerCase();
  const fullText = title + " " + description + " " + tags;

  const views = parseInt(video.statistics?.viewCount || 0);
  const likes = parseInt(video.statistics?.likeCount || 0);
  const comments = parseInt(video.statistics?.commentCount || 0);
  const duration = video.contentDetails?.duration || "";

  const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(durationMatch?.[1] || 0);
  const minutes = parseInt(durationMatch?.[2] || 0);
  const seconds = parseInt(durationMatch?.[3] || 0);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const isShort = totalSeconds <= 60;
  const isLong = totalSeconds > 600;

  const engagementRate = views > 0 ? ((likes + comments) / views * 100).toFixed(2) : 0;

  let performance = "";
  let performanceColor = "";
  if (views >= 100000) { performance = "🔥 Viral Video"; performanceColor = "text-red-400"; }
  else if (views >= 10000) { performance = "🔥 High Performance"; performanceColor = "text-orange-400"; }
  else if (views >= 1000) { performance = "👍 Good Performance"; performanceColor = "text-yellow-400"; }
  else if (views >= 100) { performance = "📊 Average Performance"; performanceColor = "text-blue-400"; }
  else { performance = "⚠️ Low Performance"; performanceColor = "text-zinc-400"; }

  let viralReason = "";
  if (views >= 10000) {
    if (fullText.includes("challenge")) viralReason = "Challenge format ne audience ko engage kiya — log khud try karna chahte the.";
    else if (fullText.includes("vs") || fullText.includes("versus")) viralReason = "VS format ne debate create ki — log apni side lene ke liye comments karte hain.";
    else if (fullText.includes("funny") || fullText.includes("comedy") || fullText.includes("meme")) viralReason = "Comedy content highly shareable hota hai — logon ne apne doston ko share kiya.";
    else if (fullText.includes("tutorial") || fullText.includes("how to") || fullText.includes("kaise")) viralReason = "Tutorial ne kisi problem ka solution diya — search traffic se views aaye.";
    else if (fullText.includes("secret") || fullText.includes("exposed") || fullText.includes("hidden")) viralReason = "Curiosity trigger hua — mystery title ne click-through rate badhai.";
    else if (isShort) viralReason = "Short format ne algorithm boost diya — YouTube Shorts recommend karta raha.";
    else if (engagementRate > 5) viralReason = `High engagement rate (${engagementRate}%) ne algorithm ko signal diya ki ye video valuable hai.`;
    else viralReason = `${views.toLocaleString()} views mile — strong thumbnail aur title ka kaam kiya.`;
  } else {
    if (views < 100) viralReason = "Views bohot kam hain — title aur thumbnail weak lag raha hai, SEO improve karo.";
    else if (engagementRate < 1) viralReason = "Views hain magar engagement nahi — audience video dekh ke chali jaati hai, hook improve karo.";
    else viralReason = "Average performance — niche audience tak pahuncha magar broader reach nahi mili.";
  }

  let thumbIdea = "";
  if (fullText.includes("gaming") || fullText.includes("pubg") || fullText.includes("minecraft")) thumbIdea = "Action gameplay screenshot + bold game name + shocked/excited face overlay.";
  else if (fullText.includes("anime")) thumbIdea = "Anime character close-up + glow/aura effect + emotional expression.";
  else if (fullText.includes("tech") || fullText.includes("phone") || fullText.includes("iphone")) thumbIdea = "Product clean shot + comparison text + rating badge.";
  else if (fullText.includes("funny") || fullText.includes("comedy")) thumbIdea = "Funny expression + bold meme-style text + bright background.";
  else if (fullText.includes("tutorial") || fullText.includes("how to")) thumbIdea = "Before/After split + step number + clear result shown.";
  else if (isShort) thumbIdea = "Vertical eye-catching frame + bold text first 3 words + action shot.";
  else thumbIdea = "Strong emotional face + bold contrasting text + clean background.";

  let trend = "";
  if (isShort) trend = "Shorts format 2024-25 me fastest growing — algorithm heavily promote karta hai.";
  else if (fullText.includes("ai")) trend = "AI content abhi peak trending pe hai — is niche me growth fastest hai.";
  else if (fullText.includes("challenge")) trend = "Challenge videos har season me trending rehti hain — timeless format hai.";
  else if (fullText.includes("vs")) trend = "Comparison/VS content high debate generate karta hai — evergreen hai.";
  else if (isLong) trend = "Long form content loyal audience banata hai magar short form se zyada compete karna padta hai.";
  else trend = "Is type ka content stable perform karta hai — consistency se growth hoti hai.";

  let aiTip = "";
  if (views < 1000) {
    if (!isShort) aiTip = "Shorts banao is topic pe — same content 60 seconds me compress karo, zyada reach milegi.";
    else aiTip = "Hook pehle 2 seconds me lagao — seedha point pe aao, koi intro mat rakho.";
  } else if (engagementRate < 2) {
    aiTip = "End screen pe call-to-action lagao — 'Comment karo tumhara kya opinion hai' — engagement badhegi.";
  } else if (views >= 10000) {
    aiTip = "Is video ka Part 2 banao ya same topic pe series shuru karo — audience already interested hai.";
  } else {
    aiTip = "Title me numbers use karo (Top 5, 3 Ways) — CTR improve hoti hai numbered titles se.";
  }

  return {
    views: views.toLocaleString(),
    likes: likes.toLocaleString(),
    comments: comments.toLocaleString(),
    engagementRate,
    duration: isShort ? "⚡ Short" : isLong ? "📹 Long Form" : "🎬 Medium",
    performance,
    performanceColor,
    viralReason,
    thumbIdea,
    trend,
    aiTip
  };
}

function detectCategory(videos) {
  let scores = { gaming: 0, anime: 0, tech: 0, comedy: 0, education: 0, vlog: 0 };
  videos.forEach(v => {
    const t = (v.snippet?.title || "").toLowerCase();
    if (t.includes("gaming") || t.includes("pubg") || t.includes("minecraft") || t.includes("free fire")) scores.gaming++;
    if (t.includes("anime") || t.includes("naruto") || t.includes("one piece")) scores.anime++;
    if (t.includes("tech") || t.includes("iphone") || t.includes("ai") || t.includes("review")) scores.tech++;
    if (t.includes("funny") || t.includes("meme") || t.includes("comedy")) scores.comedy++;
    if (t.includes("tutorial") || t.includes("how to") || t.includes("kaise")) scores.education++;
    if (t.includes("vlog") || t.includes("day in")) scores.vlog++;
  });
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function getFinalAdvice(category) {
  const advice = {
    gaming: { text: "Gaming me challenge, funny moments aur unique gameplay zyada viral hoti hai — boring walkthroughs avoid karo.", ideas: "• Impossible Challenges<br>• Funny Fail Compilations<br>• Squad Videos<br>• Horror Game Reactions<br>• World Record Attempts" },
    anime: { text: "Anime edits, power scaling aur theories high engagement laati hain — beat sync editing use karo.", ideas: "• Anime Power Rankings<br>• Best Fight Scenes Edit<br>• Character Theories<br>• Anime vs Anime<br>• Upcoming Anime Preview" },
    tech: { text: "Honest reviews aur AI tools fastest growing tech content hai — comparison format best kaam karta hai.", ideas: "• Budget vs Flagship Phone<br>• Top 5 AI Tools 2025<br>• Hidden Phone Features<br>• Tech Under 5000rs<br>• Honest Unboxing" },
    comedy: { text: "Relatable aur shareable comedy Shorts me best perform karti hai — real life situations use karo.", ideas: "• POV Videos<br>• Relatable School/Office Memes<br>• Expectation vs Reality<br>• Pakistani Parent Jokes<br>• Types of People" },
    education: { text: "Educational content evergreen hota hai — SEO optimize karo aur specific problems solve karo.", ideas: "• Step by Step Tutorials<br>• Beginners Complete Guide<br>• Common Mistakes to Avoid<br>• Quick Tips Series<br>• Case Studies" },
    vlog: { text: "Authentic aur entertaining vlogs loyal community banate hain — real moments share karo.", ideas: "• Day in My Life<br>• Travel Vlogs<br>• Challenge Vlogs<br>• Behind the Scenes<br>• Monthly Recap" },
    general: { text: "Shorts + strong hook + trending topics = best growth strategy — consistent raho.", ideas: "• Trending Challenges<br>• Reaction Videos<br>• Q&A Sessions<br>• Collaborations<br>• Top 10 Lists" }
  };
  return advice[category] || advice.general;
}

async function analyzeChannel() {
  const input = document.getElementById("channelInput").value.trim();
  if (!input) { alert("Channel name likho"); return; }

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");

  try {
    const searchRes = await fetch(`${BACKEND_URL}/api/search-channel?q=${encodeURIComponent(input)}`);
    const searchData = await searchRes.json();
    if (searchData.error) throw new Error(searchData.error);
    if (!searchData.items?.length) throw new Error("Channel nahi mila");
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

    const videoIds = vidData.items.map(v => v.id.videoId).join(",");
    const detailRes = await fetch(`${BACKEND_URL}/api/video-details?ids=${videoIds}`);
    const detailData = await detailRes.json();
    if (!detailData.items) throw new Error("Video details nahi mile");

    const videos = detailData.items;
    const category = detectCategory(videos);
    let videosHTML = "";

    videos.forEach((video) => {
      const title = video.snippet?.title || "";
      const thumbnail = video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url || "";
      const videoId = video.id;
      const a = deepAnalyzeVideo(video);

      videosHTML += `
        <div class="video-card bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <a href="https://youtube.com/watch?v=${videoId}" target="_blank">
            <img src="${thumbnail}" class="w-full hover:opacity-80 transition-opacity">
          </a>
          <div class="p-5">
            <div class="video-title text-lg font-bold mb-3">${title}</div>
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="bg-black rounded-xl p-2 text-center">
                <div class="text-zinc-400 text-xs">Views</div>
                <div class="text-white font-bold text-sm">${a.views}</div>
              </div>
              <div class="bg-black rounded-xl p-2 text-center">
                <div class="text-zinc-400 text-xs">Likes</div>
                <div class="text-white font-bold text-sm">${a.likes}</div>
              </div>
              <div class="bg-black rounded-xl p-2 text-center">
                <div class="text-zinc-400 text-xs">Comments</div>
                <div class="text-white font-bold text-sm">${a.comments}</div>
              </div>
            </div>
            <div class="flex gap-2 mb-3 flex-wrap">
              <span class="${a.performanceColor} font-bold text-sm">${a.performance}</span>
              <span class="text-zinc-500 text-sm">${a.duration}</span>
              <span class="text-zinc-500 text-sm">Engagement: ${a.engagementRate}%</span>
            </div>
            <div class="text-zinc-300 text-sm mb-2"><span class="text-yellow-400 font-bold">📊 Kyu perform kiya:</span> ${a.viralReason}</div>
            <div class="text-purple-400 text-sm mb-2"><span class="text-white font-bold">🖼️ Thumbnail Idea:</span> ${a.thumbIdea}</div>
            <div class="text-green-400 text-sm mb-2"><span class="text-white font-bold">📈 Trend:</span> ${a.trend}</div>
            <div class="text-cyan-400 text-sm"><span class="text-white font-bold">🤖 AI Tip:</span> ${a.aiTip}</div>
          </div>
        </div>`;
    });

    const advice = getFinalAdvice(category);
    videosHTML += `
      <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500 rounded-3xl p-8">
        <h2 class="text-3xl font-black text-cyan-400 mb-6">🤖 Final AI Advice</h2>
        <div class="text-zinc-300 leading-8 text-lg mb-8">${advice.text}</div>
        <div class="bg-black border border-zinc-800 rounded-3xl p-6">
          <h3 class="text-2xl font-bold text-purple-400 mb-4">💡 Best Video Ideas</h3>
          <div class="text-zinc-300 leading-8">${advice.ideas}</div>
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
