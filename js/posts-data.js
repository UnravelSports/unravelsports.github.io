// Post metadata for UnravelSports site
// Categories: package (🌀), media (🎙️), research (🔬), projects (💻📱)

const postsData = [
  {
    id: "2025-06-30-efpi",
    filename: "2025-06-30-efpi.md",
    date: "2025-06-30",
    title: "🌀 EFPI: Elastic Formation and Position Identification",
    category: "package",
    categories: ["package", "research"],
    emoji: "🌀",
    excerpt: "The aim of 𝐄𝐅𝐏𝐈 is to easily assign a formation and associated position labels to segments of tracking data. These segments can be individual frames of a full game, possessions, periods or any (custom) time interval you want (e.g. every 5 minutes)",
    paperUrl: "https://arxiv.org/pdf/2506.23843",
    githubUrl: "https://github.com/UnravelSports/unravelsports",
    hideReadMore: true
  },
  {
    id: "2025-08-04-romania",
    filename: "2025-08-04-romania.md",
    date: "2025-08-04",
    title: "🎙️ An Introduction to Football Analytics: Federația Română de Fotbal",
    category: "media",
    emoji: "🎙️",
    excerpt: "Guest talk for the Romanian Football Federation introducing fundamental concepts in football analytics.",
    websiteUrl: "https://rawcdn.githack.com/UnravelSports/keynotes/main/html/20250804-Federatia-Romana-de-Fotbal.html",
    hideReadMore: true
  },
  {
    id: "2025-06-07-pydata-london",
    filename: "2025-06-07-pydata-london.md",
    date: "2025-06-07",
    title: "🎙️ Expected Possession Value using Graph Neural Networks at PyData London",
    category: "media",
    emoji: "🎙️",
    excerpt: "Presentation at PyData London 2025 on Graph Expected Possession Value using Graph Neural Networks.",
    youtubeUrl: "https://www.youtube.com/watch?v=PUXU3SokbW0",
    hideReadMore: true,
    featured: true
  },
  {
    id: "2025-04-30-aims-cameroon",
    filename: "2025-04-30-aims-cameroon.md",
    date: "2025-04-30",
    title: "🎙️ An Introduction to Football Analytics: Cameroon at the World Cup 2022",
    category: "media",
    emoji: "🎙️",
    excerpt: "Guest lecture at AIMS Cameroon introducing football analytics using Cameroon's World Cup 2022 performance as case study.",
    websiteUrl: "https://rawcdn.githack.com/UnravelSports/keynotes/main/html/20250430-AIMS-Cameroon.html",
    hideReadMore: true
  },
  {
    id: "2025-04-08-rice-university",
    filename: "2025-04-08-rice-university.md",
    date: "2025-04-08",
    title: "🎙️ Advanced Soccer Analytics, Open-Sourced: you don't have to reinvent the wheel!",
    category: "media",
    emoji: "🎙️",
    excerpt: "Guest lecture for Rice University Soccer Analytics Class on leveraging open-source tools and frameworks in soccer analytics.",
    websiteUrl: "https://rawcdn.githack.com/UnravelSports/keynotes/main/html/20250408-Rice-University.html",
    hideReadMore: true
  },
  {
    id: "2025-05-01-cdf",
    filename: "2025-05-01-cdf.md",
    date: "2025-05-01",
    title: "🔬 Common Data Format (CDF) — a Standardized Format for Match-Data in Football",
    category: "research",
    emoji: "🔬",
    excerpt: "Introducing a Common Data Format designed to standardize how football data is structured across different data providers.",
    paperUrl: "https://arxiv.org/pdf/2505.15820",
    websiteUrl: "https://www.cdf.football",
    hideReadMore: true
  },
  {
    id: "2024-12-12-pressing-intensity",
    filename: "2024-12-12-pressing-intensity.md",
    date: "2024-12-12",
    title: "🌀 Pressing Intensity: An Intuitive Measure for Pressing",
    category: "package",
    categories: ["package", "research"],
    emoji: "🌀",
    excerpt: "An intuitive measure for pressing that can be used by coaches, assistants and (data) analysts to identify and analyze pressing situations, compute advanced derived metrics (e.g. moving out from under pressure after receival), and analyze specific in-game situations related to pressing using positional tracking data.",
    paperUrl: "https://arxiv.org/pdf/2501.04712",
    githubUrl: "https://github.com/UnravelSports/unravelsports",
    hideReadMore: true,
    featured: true
  },
  {
    id: "2024-12-23-bside-rats-podcast",
    filename: "2024-12-23-bside-rats-podcast.md",
    date: "2024-12-23",
    title: "🎙️ BSide Rats Podcast: Een Tikkie naar het Zuiden",
    category: "media",
    emoji: "🎙️",
    excerpt: "Podcast discussion about football analytics, data science, and the journey into professional sports analytics.",
    articleUrl: "https://www.bsiderats.nl/nieuws/een-tikkie-naar-het-zuiden-podcast-255",
    spotifyUrl: "https://open.spotify.com/episode/2ChWNgmPPgY7QtNDSmczHe?si=70a97e8b3a76442c",
    hideReadMore: true
  },
  {
    id: "2024-08-24-unravelsports-package",
    filename: "2024-08-24-unravelsports-package.md",
    date: "2024-08-24",
    title: "🌀 𝚙𝚒𝚙 𝚒𝚗𝚜𝚝𝚊𝚕𝚕 𝚞𝚗𝚛𝚊𝚟𝚎𝚕𝚜𝚙𝚘𝚛𝚝𝚜",
    category: "package",
    emoji: "🌀",
    excerpt: "The unravelsports package aims to aid researchers, professionals and enthusiasts by turning raw sports data into meaningful information and actionable insights. It offers Graph Neural Network architecture, Pressing Intensity and Position Label detection.",
    githubUrl: "https://github.com/UnravelSports/unravelsports",
    hideReadMore: true,
    featured: true
  },
  {
    id: "2023-11-01-groundhopmap",
    filename: "2023-11-01-groundhopmap.md",
    date: "2023-11-01",
    title: "📱 GroundhopMap.com",
    category: "projects",
    emoji: "📱",
    excerpt: "Interactive map application for tracking football ground visits and stadium locations worldwide."
  },
  {
    id: "2023-04-06-pysport-eindhoven",
    filename: "2023-04-06-pysport-eindhoven.md",
    date: "2023-04-06",
    title: "🔬 PySport: Rendering Football Data in 3D with Rust and Bevy",
    category: "media",
    categories: ["media", "projects"],
    emoji: "💻",
    excerpt: "Using Rust and the Bevy game engine to render football tracking data in 3D for advanced visualization.",
    githubUrl: "https://github.com/UnravelSports/rs-football-3d",
    youtubeUrl: "https://www.youtube.com/watch?v=VwatoPOKIl8",
    hideReadMore: true,
    featured: true
  },
  {
    id: "2023-03-27-athletic-interview",
    filename: "2023-03-27-athletic-interview.md",
    date: "2023-03-27",
    title: "🎙️ The Athletic Interview: SSAC 2023 Research Paper on Counterattacks",
    category: "media",
    emoji: "🎙️",
    excerpt: "Interview with The Athletic about our presentation at the 2023 MIT Sloan Sports Analytics Conference.",
    articleUrl: "https://www.nytimes.com/athletic/4330768/2023/03/27/sloan-conference-counter-attack-bekkers/",
    hideReadMore: true,
    featured: true
  },
  {
    id: "2023-03-02-ssac23",
    filename: "2023-03-02-ssac23.md",
    date: "2023-03-02",
    title: "🔬 A Graph Neural Network deep-dive into successful counterattacks",
    category: "research",
    emoji: "🔬",
    excerpt: "Gender-specific Graph Neural Networks modeling the likelihood of counterattack success, trained on 20,863 frames of counterattacking sequences from MLS, NWSL and international women's soccer. Finalist at the 𝐌𝐈𝐓 𝐒𝐥𝐨𝐚𝐧 𝐒𝐩𝐨𝐫𝐭𝐬 𝐀𝐧𝐚𝐥𝐲𝐭𝐢𝐜𝐬 𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐞𝐬𝐞𝐚𝐫𝐜𝐡 𝐏𝐚𝐩𝐞𝐫 𝐂𝐨𝐦𝐩𝐞𝐭𝐢𝐭𝐢𝐨𝐧 𝟐𝟎𝟐𝟑.",
    paperUrl: "https://arxiv.org/pdf/2411.17450",
    githubUrl: "https://github.com/USSoccerFederation/ussf_ssac_23_soccer_gnn",
    youtubeUrl: "https://www.youtube.com/watch?v=3ozD-fvQmOg",
    hideReadMore: true
  },
  {
    id: "2022-07-11-player-id-matching-system",
    filename: "2022-07-11-player-id-matching-system.md",
    date: "2022-07-11",
    title: "💻 Designing a Player ID Matching System",
    category: "projects",
    emoji: "💻",
    excerpt: "Creating an open-source approach to Player ID matching across multiple data providers."
  },
  {
    id: "2022-03-06-tactics-board",
    filename: "2022-03-06-tactics-board.md",
    date: "2022-03-06",
    title: "📱 Interactive Digital Tactics Board",
    category: "projects",
    emoji: "📱",
    excerpt: "Multiplatform app for direct interaction with advanced analytics tools like Pitch Control and Expected Pass models."
  },
  {
    id: "2021-09-01-industria-podcast",
    filename: "2021-09-01-industria-podcast.md",
    date: "2021-09-01",
    title: "🎙️ Industria Podcast: Using data analytics in professional football",
    category: "media",
    emoji: "🎙️",
    excerpt: "Podcast discussion about using data analytics in professional football with a focus on Industrial Engineering applications.",
    spotifyUrl: "https://open.spotify.com/episode/4ewINyrgViN6VzmCvtP7CF",
    hideReadMore: true
  },
  {
    id: "2021-03-14-live-pitch-control",
    filename: "2021-03-14-live-pitch-control.md",
    date: "2021-03-14",
    title: "📱 Real Time Pitch Control Multi-Platform App",
    category: "projects",
    emoji: "📱",
    excerpt: "Real-time pitch control visualization app available on multiple platforms including Android and iOS."
  },
  {
    id: "2020-10-19-expected-coefficients",
    filename: "2020-10-19-expected-coefficients.md",
    date: "2020-10-19",
    title: "💻 Expected UEFA Coefficient Country Rank Model",
    category: "projects",
    emoji: "💻",
    excerpt: "Model to simulate the Expected UEFA Coefficient Country Rank for predicting national league performance."
  },
  {
    id: "2020-07-29-vice-interview",
    filename: "2020-07-29-vice-interview.md",
    date: "2020-07-29",
    title: "🎙️ VICE Interview: My Journey into Football Analytics",
    category: "media",
    emoji: "🎙️",
    excerpt: "Interview with VICE about my journey and career in football analytics.",
    articleUrl: "https://www.vice.com/nl/article/xg85vq/analist-amerikaanse-voetbalbond",
    hideReadMore: true
  },
  {
    id: "2020-04-06-data-visualizations",
    filename: "2020-04-06-data-visualizations.md",
    date: "2020-04-06",
    title: "💻 Custom Visualizations in R with ggplot",
    category: "projects",
    emoji: "💻",
    excerpt: "Custom data visualizations for automated post-match reports built using R's ggplot library."
  },
  {
    id: "2019-07-09-tracking-data-viztool",
    filename: "2019-07-09-tracking-data-viztool.md",
    date: "2019-07-09",
    title: "💻 FIFA Women's World Cup 2019 Tracking Data Tool",
    category: "projects",
    emoji: "💻",
    excerpt: "Interactive tool for visualizing tracking data from the 2019 FIFA Women's World Cup."
  },
  {
    id: "2017-07-10-pass-maps-v2",
    filename: "2017-07-10-pass-maps-v2.md",
    date: "2017-07-10",
    title: "💻 Pass Maps 2.0",
    category: "projects",
    emoji: "💻",
    excerpt: "Improving pass maps using cluster analysis to better represent players' actual passing positions within a team."
  },
  {
    id: "2017-01-04-expected-pass-model",
    filename: "2017-01-04-expected-pass-model.md",
    date: "2017-01-04",
    title: "💻 Expected Pass Model",
    category: "projects",
    emoji: "💻",
    excerpt: "Explanation of an Interactive Pass Expectation Visualization Tool and expected pass modeling."
  },
  {
    id: "2016-12-01-ssac-2017",
    filename: "2017-03-03-ssac-2017.md",
    date: "2017-03-03",
    title: "🔬 Flow motifs in soccer: What can passing behavior tell us?",
    category: "research",
    emoji: "🔬",
    excerpt: "Research on Network Motifs in football passing networks analyzing unique passing behaviors of players and teams. Accepted into the 𝐌𝐈𝐓 𝐒𝐥𝐨𝐚𝐧 𝐒𝐩𝐨𝐫𝐭𝐬 𝐀𝐧𝐚𝐥𝐲𝐭𝐢𝐜𝐬 𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐞𝐬𝐞𝐚𝐫𝐜𝐡 𝐏𝐚𝐩𝐞𝐫 𝐂𝐨𝐦𝐩𝐞𝐭𝐢𝐭𝐢𝐨𝐧 𝟐𝟎𝟏𝟕 and published in the Journal of Quantitative Sports in 2019.",
    paperUrl: "https://journals.sagepub.com/doi/full/10.3233/JSA-190290",
    hideReadMore: true
  }
];

// Category definitions with display names and counts
const categories = {
  featured: {
    name: "Featured",
    emoji: "⭐",
    description: "Highlighted posts and key contributions",
    count: 5
  },
  package: {
    name: "Python Package",
    emoji: "🌀",
    description: "Open-source Python tools for sports analytics",
    count: 3
  },
  media: {
    name: "Talks & Media",
    emoji: "🎙️",
    description: "Presentations, podcasts, and interviews",
    count: 9
  },
  research: {
    name: "Research",
    emoji: "🔬",
    description: "Academic papers and technical blogs",
    count: 5
  },
  projects: {
    name: "Tools & Projects",
    emoji: "💻",
    description: "Apps, visualizations, and interactive tools",
    count: 10
  }
};

// Helper functions
function getPostsByCategory(category) {
  return postsData.filter(post => {
    // Handle featured filter separately
    if (category === 'featured') {
      return post.featured === true;
    }
    // Support both single category and multiple categories
    if (post.categories && Array.isArray(post.categories)) {
      return post.categories.includes(category);
    }
    return post.category === category;
  });
}

function getLatestPosts(count = 6) {
  return postsData.slice(0, count);
}

function getPostById(id) {
  return postsData.find(post => post.id === id);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { postsData, categories, getPostsByCategory, getLatestPosts, getPostById };
}
