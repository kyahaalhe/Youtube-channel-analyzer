const BACKEND_URL = "https://youtube-channel-analyzer.up.railway.app";

let currentVideoCount = 8;
let currentChannelId = "";

// =========================
// VIDEO CATEGORY DETECT
// =========================
function detectVideoCategory(fullText) {
  if (fullText.includes("minecraft") || fullText.includes("pubg") || fullText.includes("free fire") || fullText.includes("gaming") || fullText.includes("gameplay") || fullText.includes("fortnite") || fullText.includes("gta") || fullText.includes("cod") || fullText.includes("game")) return "gaming";
  if (fullText.includes("anime") || fullText.includes("naruto") || fullText.includes("one piece") || fullText.includes("dragon ball") || fullText.includes("demon slayer") || fullText.includes("manga")) return "anime";
  if (fullText.includes("iphone") || fullText.includes("android") || fullText.includes("samsung") || fullText.includes("tech") || fullText.includes("laptop") || fullText.includes("gadget") || fullText.includes("unboxing") || fullText.includes("review") || fullText.includes("ai tool")) return "tech";
  if (fullText.includes("funny") || fullText.includes("comedy") || fullText.includes("meme") || fullText.includes("prank") || fullText.includes("lol") || fullText.includes("joke") || fullText.includes("hasna")) return "comedy";
  if (fullText.includes("tutorial") || fullText.includes("how to") || fullText.includes("kaise") || fullText.includes("sikho") || fullText.includes("learn") || fullText.includes("course") || fullText.includes("guide")) return "education";
  if (fullText.includes("vlog") || fullText.includes("day in my life") || fullText.includes("routine") || fullText.includes("travel") || fullText.includes("trip")) return "vlog";
  if (fullText.includes("music") || fullText.includes("song") || fullText.includes("rap") || fullText.includes("beat") || fullText.includes("cover")) return "music";
  if (fullText.includes("cook") || fullText.includes("recipe") || fullText.includes("food") || fullText.includes("khana") || fullText.includes("biryani")) return "food";
  return "general";
}

// =========================
// DEEP VIDEO ANALYSIS
// =========================
function deepAnalyzeVideo(video) {
  const title = video.snippet?.title || "";
  const titleLower = title.toLowerCase();
  const description = (video.snippet?.description || "").toLowerCase();
  const tags = (video.snippet?.tags || []).join(" ").toLowerCase();
  const fullText = titleLower + " " + description + " " + tags;

  const views = parseInt(video.statistics?.viewCount || 0);
  const likes = parseInt(video.statistics?.likeCount || 0);
  const comments = parseInt(video.statistics?.commentCount || 0);
  const duration = video.contentDetails?.duration || "";

  const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const totalSeconds = parseInt(durationMatch?.[1] || 0) * 3600 + parseInt(durationMatch?.[2] || 0) * 60 + parseInt(durationMatch?.[3] || 0);
  const isShort = totalSeconds > 0 && totalSeconds <= 60;
  const isLong = totalSeconds > 600;
  const engagementRate = views > 0 ? ((likes + comments) / views * 100).toFixed(2) : 0;

  const videoCategory = detectVideoCategory(fullText);

  // PERFORMANCE
  let performance = "", performanceColor = "";
  if (views >= 1000000) { performance = "🔥 Mega Viral"; performanceColor = "text-red-500"; }
  else if (views >= 100000) { performance = "🔥 Viral Video"; performanceColor = "text-red-400"; }
  else if (views >= 10000) { performance = "🔥 High Performance"; performanceColor = "text-orange-400"; }
  else if (views >= 1000) { performance = "👍 Good Performance"; performanceColor = "text-yellow-400"; }
  else if (views >= 100) { performance = "📊 Average Performance"; performanceColor = "text-blue-400"; }
  else { performance = "⚠️ Low Performance"; performanceColor = "text-zinc-400"; }

  // =========================
  // ALAG ALAG WAJAH - CATEGORY + STATS
  // =========================
  let viralReason = "";

  if (videoCategory === "gaming") {
    if (views >= 100000) {
      if (fullText.includes("challenge")) viralReason = `Is gaming challenge ne ${views.toLocaleString()} views liye kyunki challenge format audience ko excite karta hai — log khud try karna chahte hain aur share karte hain.`;
      else if (fullText.includes("funny") || fullText.includes("fail")) viralReason = `Funny gaming moments ne ${views.toLocaleString()} views liye — comedy + gaming combination bohot shareable hoti hai.`;
      else if (isShort) viralReason = `Gaming Short ne ${views.toLocaleString()} views liye — YouTube algorithm Shorts ko heavily push karta hai gaming niche me.`;
      else viralReason = `Is gaming video ne ${views.toLocaleString()} views liye — strong gameplay aur engaging editing ne audience retain ki.`;
    } else if (views >= 1000) {
      viralReason = `${views.toLocaleString()} views aaye — decent gaming content hai magar challenge ya funny moments add karne se zyada viral ho sakti thi.`;
    } else {
      viralReason = `Sirf ${views.toLocaleString()} views — gaming me competition bohot hai, unique angle chahiye tha jaise impossible challenge ya world record attempt.`;
    }
  }

  else if (videoCategory === "anime") {
    if (views >= 100000) {
      if (fullText.includes("edit")) viralReason = `Anime edit ne ${views.toLocaleString()} views liye — beat sync editing + emotional moments = perfect viral formula.`;
      else if (fullText.includes("vs") || fullText.includes("vs")) viralReason = `Anime comparison ne ${views.toLocaleString()} views liye — fans apni favourite character defend karne ke liye comments karte hain.`;
      else viralReason = `Is anime video ne ${views.toLocaleString()} views liye — anime community bohot passionate hai aur good content jaldi share hoti hai.`;
    } else if (views >= 1000) {
      viralReason = `${views.toLocaleString()} views mile — anime content hai magar trending anime cover nahi ki ya beat sync editing use nahi ki.`;
    } else {
      viralReason = `Sirf ${views.toLocaleString()} views — anime me trending characters aur power scaling videos zyada viral hoti hain, woh try karo.`;
    }
  }

  else if (videoCategory === "tech") {
    if (views >= 100000) {
      if (fullText.includes("vs")) viralReason = `Tech comparison ne ${views.toLocaleString()} views liye — log buying decision ke liye comparison videos dhundte hain, high search intent tha.`;
      else if (fullText.includes("hidden") || fullText.includes("secret") || fullText.includes("trick")) viralReason = `Hidden tech trick ne ${views.toLocaleString()} views liye — "ye kisi ne nahi bataya" angle bohot strong CTR deta hai.`;
      else viralReason = `Is tech video ne ${views.toLocaleString()} views liye — tech audience high value hai aur helpful content jaldi share hoti hai.`;
    } else if (views >= 1000) {
      viralReason = `${views.toLocaleString()} views mile — tech content hai magar honest review ya shocking comparison angle nahi tha jo zyada views deta.`;
    } else {
      viralReason = `Sirf ${views.toLocaleString()} views — tech me budget options aur hidden features jaise topics zyada search hote hain, woh try karo.`;
    }
  }

  else if (videoCategory === "comedy") {
    if (views >= 100000) {
      if (fullText.includes("prank")) viralReason = `Prank video ne ${views.toLocaleString()} views liye — prank content highly shareable hota hai aur WhatsApp pe bhi viral hota hai.`;
      else if (fullText.includes("meme")) viralReason = `Meme video ne ${views.toLocaleString()} views liye — relatable memes log screenshots lete hain aur share karte hain.`;
      else viralReason = `Comedy video ne ${views.toLocaleString()} views liye — shareable funny content hamesha viral hota hai.`;
    } else if (views >= 1000) {
      viralReason = `${views.toLocaleString()} views mile — comedy content hai magar relatable angle aur strong punchline nahi tha.`;
    } else {
      viralReason = `Sirf ${views.toLocaleString()} views — comedy me POV aur relatable situations zyada viral hoti hain, next video me try karo.`;
    }
  }

  else if (videoCategory === "education") {
    if (views >= 100000) {
      viralReason = `Educational video ne ${views.toLocaleString()} views liye — log is topic ko search kar rahe the aur tumhari video best answer thi.`;
    } else if (views >= 1000) {
      viralReason = `${views.toLocaleString()} views mile — helpful content hai magar SEO title optimize karo taake zyada log search me dhundh sakein.`;
    } else {
      viralReason = `Sirf ${views.toLocaleString()} views — educational content me specific problem solve karo jo log actively search karte hain.`;
    }
  }

  else if (videoCategory === "vlog") {
    if (views >= 100000) {
      viralReason = `Vlog ne ${views.toLocaleString()} views liye — authentic personal content se audience ne connect kiya aur subscribe kiya.`;
    } else if (views >= 1000) {
      viralReason = `${views.toLocaleString()} views mile — vlog dekha gaya magar interesting moments highlight karo aur catchy title rakho.`;
    } else {
      viralReason = `Sirf ${views.toLocaleString()} views — vlog me unique experience ya interesting story honi chahiye jo baaki vlogs se alag ho.`;
    }
  }

  else {
    if (views >= 10000) viralReason = `${views.toLocaleString()} views mile — content ne audience ko engage kiya, engagement rate ${engagementRate}% rahi.`;
    else if (views >= 1000) viralReason = `${views.toLocaleString()} views mile — content theek hai magar hook aur thumbnail improve karo.`;
    else viralReason = `Sirf ${views.toLocaleString()} views — strong hook aur better thumbnail se zyada reach milti.`;
  }

  // Engagement specific reason add karo
  if (parseFloat(engagementRate) > 8) viralReason += ` Engagement rate ${engagementRate}% exceptional hai — audience bohot active hai.`;
  else if (parseFloat(engagementRate) < 1 && views > 500) viralReason += ` Engagement rate sirf ${engagementRate}% hai — audience watch kar ke chali jaati hai, end screen pe CTA lagao.`;

  // =========================
  // THUMBNAIL - CATEGORY KE HISAAB SE
  // =========================
  let thumbIdea = "";
  if (videoCategory === "gaming") {
    if (fullText.includes("challenge")) thumbIdea = "😱 Shocked gamer face + challenge text in fire letters + game screenshot background.";
    else if (fullText.includes("fail")) thumbIdea = "😂 Laughing face + FAIL text big + fail moment screenshot.";
    else thumbIdea = "🎮 Action gameplay moment + bold game name + character face close-up.";
  } else if (videoCategory === "anime") {
    if (fullText.includes("edit")) thumbIdea = "✨ Anime character with glow/aura effect + dramatic pose + dark cinematic background.";
    else if (fullText.includes("vs")) thumbIdea = "⚔️ Both characters facing each other + VS text in middle + power effects.";
    else thumbIdea = "💥 Most powerful moment screenshot + character name bold + dramatic effects.";
  } else if (videoCategory === "tech") {
    if (fullText.includes("vs")) thumbIdea = "📱 Both products side by side + VS text + winner badge on one side.";
    else if (fullText.includes("hidden") || fullText.includes("trick")) thumbIdea = "🤫 Shocked face + phone screenshot + 'Ye Feature Tumhe Pata Tha?' text.";
    else thumbIdea = "📦 Product clean white background + price tag + honest rating badge.";
  } else if (videoCategory === "comedy") {
    thumbIdea = "😂 Most funny expression from video + bold punchline text + bright yellow/red background.";
  } else if (videoCategory === "education") {
    thumbIdea = "✅ Before/After result + step number badge + clear outcome shown in thumbnail.";
  } else if (videoCategory === "vlog") {
    thumbIdea = "📸 Best candid moment + location name + genuine happy expression — no heavy editing.";
  } else {
    thumbIdea = "😮 Strong emotional face + bold question or statement + high contrast colors.";
  }

  // =========================
  // TREND - VIDEO KE HISAAB SE
  // =========================
  let trend = "";
  if (isShort) trend = "⚡ Shorts 2025 me still fastest growing format — algorithm ne is video ko push kiya hoga.";
  else if (videoCategory === "gaming" && fullText.includes("challenge")) trend = "🎮 Gaming challenges timeless trend hain — har season me viral hoti hain.";
  else if (videoCategory === "anime" && fullText.includes("edit")) trend = "🎌 Anime edits TikTok aur YouTube Shorts pe #1 trending format hai.";
  else if (videoCategory === "tech" && fullText.includes("ai")) trend = "🤖 AI content 2025 me peak trending pe hai — is niche me aao jaldi.";
  else if (videoCategory === "comedy") trend = "😂 Comedy content hamesha shareable hota hai — WhatsApp viral potential highest hai.";
  else if (isLong) trend = "📹 Long form content loyal subscribers banata hai — magar Shorts se zyada compete karna padta hai.";
  else trend = "📈 Is type ka content stable perform karta hai — consistency se growth hogi.";

  // =========================
  // AI TIP - STATS KE HISAAB SE
  // =========================
  let aiTip = "";
  if (views < 100) {
    aiTip = `🚨 Views bohot kam hain (${views.toLocaleString()}) — thumbnail aur title A/B test karo. Pehle 2 seconds me strong hook lagao.`;
  } else if (views < 1000 && !isShort) {
    aiTip = `📱 Is topic pe Short banao — same content 60 seconds me compress karo, algorithm 10x zyada push karta hai.`;
  } else if (parseFloat(engagementRate) < 1 && views > 200) {
    aiTip = `💬 Engagement sirf ${engagementRate}% hai — video ke andar question pucho aur end me 'Comment karo' clearly bolo.`;
  } else if (views >= 10000 && views < 100000) {
    aiTip = `🔁 Is video ka Part 2 ya series banao — ${views.toLocaleString()} views matlab audience interested hai, aur dena chahte hain.`;
  } else if (views >= 100000) {
    aiTip = `⭐ Ye tumhara best performing video hai — is topic pe aur videos banao aur is style ko replicate karo baki videos me.`;
  } else {
    aiTip = `📝 Title me power words use karo jaise "Shocking", "Secret", "Never Seen Before" — CTR improve hoti hai.`;
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
    aiTip,
    videoCategory
  };
}

// =========================
// CHANNEL CATEGORY
// =========================
function detectChannelCategory(videos) {
  let scores = { gaming: 0, anime: 0, tech: 0, comedy: 0, education: 0, vlog: 0, music: 0, food: 0, general: 0 };
  videos.forEach(v => {
    const fullText = (v.snippet?.title || "").toLowerCase() + " " + (v.snippet?.description || "").toLowerCase() + " " + (v.snippet?.tags || []).join(" ").toLowerCase();
    const cat = detectVideoCategory(fullText);
    scores[cat] = (scores[cat] || 0) + 1;
  });
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

// =========================
// FINAL ADVICE
// =========================
function getFinalAdvice(category) {
  const advice = {
    gaming: { text: "Tumhara channel gaming niche me hai! Challenge videos, funny fails aur unique gameplay zyada viral hoti hai. Boring walkthroughs avoid karo aur apna unique style develop karo.", ideas: "• Impossible Challenges<br>• Funny Fail Compilations<br>• 1v1 Squad Videos<br>• Horror Game Reactions<br>• World Record Attempts" },
    anime: { text: "Tumhara channel anime niche me hai! Beat sync edits, power scaling aur trending anime pe theories high engagement laati hain.", ideas: "• Anime Power Rankings<br>• Best Fight Scenes Edit<br>• Character Theories<br>• Anime vs Anime Battles<br>• Upcoming Anime Preview" },
    tech: { text: "Tumhara channel tech niche me hai! Honest reviews aur budget vs flagship comparisons fastest growing tech content hai.", ideas: "• Budget vs Flagship Phone<br>• Top 5 AI Tools 2025<br>• Hidden Phone Features<br>• Tech Under 5000rs<br>• Brutally Honest Reviews" },
    comedy: { text: "Tumhara channel comedy niche me hai! Relatable POV videos aur Shorts best perform karti hain — real life situations use karo.", ideas: "• POV Videos<br>• Relatable School/Office Memes<br>• Expectation vs Reality<br>• Pakistani Parent Jokes<br>• Types of People" },
    education: { text: "Tumhara channel education niche me hai! Specific problems solve karo jo log actively search karte hain — SEO title optimize karo.", ideas: "• Step by Step Tutorials<br>• Beginners Complete Guide<br>• Top 10 Mistakes to Avoid<br>• Quick Tips Series<br>• Real Case Studies" },
    vlog: { text: "Tumhara channel vlog niche me hai! Authentic moments share karo aur audience se personally connect karo — consistency key hai.", ideas: "• Day in My Life<br>• Travel Vlogs<br>• Challenge Vlogs<br>• Behind the Scenes<br>• Monthly Recap" },
    general: { text: "Shorts + strong hook + trending topics = best growth strategy. Ek specific niche choose karo aur usmein consistent raho.", ideas: "• Trending Challenges<br>• Reaction Videos<br>• Q&A Sessions<br>• Collaborations<br>• Top 10 Lists" }
  };
  return advice[category] || advice.general;
}

// =========================
// ANALYZE CHANNEL
// =========================
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

    const videoIds = vidData.items.map(v => v.id.videoId).filter(Boolean).join(",");
    const detailRes = await fetch(`${BACKEND_URL}/api/video-details?ids=${videoIds}`);
    const detailData = await detailRes.json();
    if (!detailData.items) throw new Error("Video details nahi mile");

    const videos = detailData.items;
    const channelCategory = detectChannelCategory(videos);
    let videosHTML = "";

    videos.forEach((video) => {
      const title = video.snippet?.title || "";
      const thumbnail = video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url || "";
      const videoId = video.id;
      const a = deepAnalyzeVideo(video);

      videosHTML += `
        <div class="video-card bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <a href="https://youtube.com/watch?v=${videoId}" target="_blank">
            <img src="${thumbnail}" class="w-full hover:opacity-80 transition-opacity cursor-pointer">
          </a>
          <div class="p-5">
            <div class="video-title text-lg font-bold mb-3">${title}</div>

            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="bg-black rounded-xl p-2 text-center">
                <div class="text-zinc-400 text-xs">👁️ Views</div>
                <div class="text-white font-bold text-sm">${a.views}</div>
              </div>
              <div class="bg-black rounded-xl p-2 text-center">
                <div class="text-zinc-400 text-xs">👍 Likes</div>
                <div class="text-white font-bold text-sm">${a.likes}</div>
              </div>
              <div class="bg-black rounded-xl p-2 text-center">
                <div class="text-zinc-400 text-xs">💬 Comments</div>
                <div class="text-white font-bold text-sm">${a.comments}</div>
              </div>
            </div>

            <div class="flex gap-2 mb-4 flex-wrap">
              <span class="${a.performanceColor} font-bold text-sm">${a.performance}</span>
              <span class="text-zinc-500 text-sm">${a.duration}</span>
              <span class="text-zinc-500 text-sm">⚡ ${a.engagementRate}% Engagement</span>
            </div>

            <div class="space-y-2">
              <div class="bg-zinc-800 rounded-xl p-3 text-sm"><span class="text-yellow-400 font-bold">📊 Performance Wajah:</span> <span class="text-zinc-300">${a.viralReason}</span></div>
              <div class="bg-zinc-800 rounded-xl p-3 text-sm"><span class="text-purple-400 font-bold">🖼️ Thumbnail Idea:</span> <span class="text-zinc-300">${a.thumbIdea}</span></div>
              <div class="bg-zinc-800 rounded-xl p-3 text-sm"><span class="text-green-400 font-bold">📈 Trend:</span> <span class="text-zinc-300">${a.trend}</span></div>
              <div class="bg-zinc-800 rounded-xl p-3 text-sm"><span class="text-cyan-400 font-bold">🤖 AI Tip:</span> <span class="text-zinc-300">${a.aiTip}</span></div>
            </div>
          </div>
        </div>`;
    });

    const advice = getFinalAdvice(channelCategory);
    videosHTML += `
      <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500 rounded-3xl p-8">
        <h2 class="text-3xl font-black text-cyan-400 mb-6">🤖 Final AI Advice</h2>
        <div class="text-zinc-300 leading-8 text-lg mb-8">${advice.text}</div>
        <div class="bg-black border border-zinc-800 rounded-3xl p-6">
          <h3 class="text-2xl font-bold text-purple-400 mb-4">💡 Best Video Ideas for Your Channel</h3>
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
