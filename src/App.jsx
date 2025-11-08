import { useState, useEffect, useRef } from "react";
import proposal from "../src/assets/proposal.mov";
import song1 from "../src/assets/song1.mp3";
import song2 from "../src/assets/song2.mp3";
import song3 from "../src/assets/song3.mp3";
import song4 from "../src/assets/song4.mp3";
import song5 from "../src/assets/song5.mp3";
import piano from "../src/assets/soft_piano.mp3";


export default function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentSong, setCurrentSong] = useState(null);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const progressInterval = useRef(null);
  const [messageMode, setMessageMode] = useState(false);

  const [proposalMode, setProposalMode] = useState(false);
  const [proposalStage, setProposalStage] = useState("video");
  const [noCount, setNoCount] = useState(0);
  const [showBackButton, setShowBackButton] = useState(false);
  const [letterMode, setLetterMode] = useState(false);
  const [letterText, setLetterText] = useState("");
  const pianoRef = useRef(null);

  const [authenticated, setAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  const [mood, setMood] = useState("");
  const [giftMessage, setGiftMessage] = useState(null);

  const [gameMode, setGameMode] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);

  const terminalBackup = useRef([]);
  const terminalRef = useRef(null);

 const moods = [
  "Dreamy — lost in thoughts of you.",
  "Peaceful — my heart feels safe in your presence.",
  "Playful — smiling at every memory of us.",
  "Melancholic — missing the warmth of your voice.",
  "Romantic — drowning in the beauty of our love.",
];


  const gifts = [
  "💌 You are my favorite kind of forever.",
  "🌙 The moon feels shy when you smile.",
  "💖 In your eyes, I found my home.",
  "🌹 Every heartbeat whispers your name.",
  "✨ You make ordinary moments feel magical.",
  "🌸 My world blooms in your presence.",
  "💞 You’re the calm to my chaos.",
  "🌼 Even silence feels sweet when shared with you.",
  "💫 You are the poem I never knew how to write.",
  "🕊️ My heart rests safely in your love.",
  "🌻 You make my soul smile effortlessly.",
  "🌧️ Even the rain feels jealous of our touch.",
  "🔥 You’re the warmth I never want to lose.",
  "🍃 Your love is my favorite kind of peace.",
  "🌷 I could live inside your laughter forever.",
  "💐 The universe paused when I met you.",
  "🌈 You color my world in shades of love.",
  "🎶 Every love song makes sense with you in mind.",
  "💍 You’re not just part of my life — you are it.",
  "🌺 My heart has learned your rhythm.",
  "💤 I dream in your voice every night.",
  "🌙 You’re my favorite goodnight and my sweetest good morning.",
  "💓 My love for you grows in quiet ways every day.",
  "🌻 The sun feels warmer when you’re near.",
  "💗 You are the wish I didn’t know my heart made.",
  "🍯 You sweeten every corner of my life.",
  "🌌 My soul recognizes yours — it always did.",
  "💫 You are my once in a lifetime kind of miracle.",
  "🌼 Love feels like breathing when I’m with you.",
  "🕊️ You make loving easy and being loved effortless.",
  "🌹 If hearts could write, mine would spell your name endlessly.",
  "💞 You’re the peace I prayed for and the chaos I adore.",
  "🌸 Every second with you is a memory I protect fiercely.",
  "💖 I fall in love with you in a new way every day.",
  "🌙 You light up my darkest hours without even trying.",
  "🫶 Your touch feels like home and destiny at once.",
  "🌺 You are love made visible.",
  "💫 I could spend lifetimes just tracing your smile.",
  "🌻 The stars envy how you outshine them effortlessly.",
  "🌼 Even time slows down when I’m with you.",
  "💐 You are my favorite reason to stay hopeful.",
  "🌷 You make love feel both infinite and simple.",
  "💌 Every heartbeat is a soft echo of your name.",
  "✨ You turned my ‘someday’ into ‘always.’",
  "🕊️ My favorite view will always be you.",
  "🌸 Love feels like breathing when I see you.",
  "💞 Every path I take somehow leads back to you.",
  "🌙 Your presence feels like poetry written on my soul.",
  "💖 You’re the quiet I crave and the warmth I need.",
  "🌹 I loved you before I even knew what love was."
];


  const gameQuestions = [
    { q: "Where did we first meet murugaa?", a: "school" },
    { q: "What’s our anniversary date lakshu? (DD/MM/YYYY)", a: "05/03/2020" },
    { q: "What’s my favorite word for you?", a: "mama" },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Chellakuttyyy💖";
    if (hour < 18) return "Good afternoon, Thangakuttyyy🤍";
    return "Good evening, Vairakuttyyy🤎";
  };

  const bootLines = [
    "Initializing LoveOS v3.5...",
    getGreeting(),
    "Type 'help' to discover available commands.",
  ];

  useEffect(() => {
    setHistory(bootLines);
    setMood(moods[Math.floor(Math.random() * moods.length)]);
    document.body.style.overflow = "hidden";

    const giftInterval = setInterval(() => {
      setGiftMessage(gifts[Math.floor(Math.random() * gifts.length)]);
      setTimeout(() => setGiftMessage(null), 6000);
    }, 45000);

    return () => {
      document.body.style.overflow = "auto";
      clearInterval(giftInterval);
    };
  }, []);

  useEffect(() => {
    const el = terminalRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [history, typing]);

  useEffect(() => {
      if (letterMode) {
        const el = terminalRef.current || document.querySelector(".letter-scroll");
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }, [letterText]);


  const typeWriterEffect = (text, callback) => {
    let i = 0;
    setTyping(true);
    let current = "";
    const interval = setInterval(() => {
      current += text[i];
      setHistory((prev) => {
        const newHist = [...prev];
        newHist[newHist.length - 1] = current;
        return newHist;
      });
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(false);
        callback();
      }
    }, 15);
  };

  const handleCommand = (cmd) => {
    const command = cmd.trim().toLowerCase();
    let response = "";

    // 🎮 Game Mode Input
    if (gameMode) {
      const correct = gameQuestions[gameIndex].a;
      if (command === correct) {
        setGameScore((p) => p + 1);
        response = "Correct Murugatchimii!";
      } else {
        response = "Ada loosu papa! ithan answer uh: " + correct;
      }

      if (gameIndex + 1 < gameQuestions.length) {
        setGameIndex((i) => i + 1);
        response += `\n${gameQuestions[gameIndex + 1].q}`;
      } else {
        response += `\n------------------------------------------\n💖 Game mudinchh muru! Ithan un markkuuu ${gameScore}/${gameQuestions.length}\n------------------------------------------`;
        setGameMode(false);
        setGameIndex(0);
        setGameScore(0);
      }

      setHistory((prev) => [...prev, `ms@loveos:~$ ${cmd}`, " ", ""]);
      typeWriterEffect(response, () => {});
      return;
    }

    if (command === "help") {
      response =
        "Commands:\n" +
        "  timeline       - revisit our love story\n" +
        "  propose me     - enter proposal mode\n" +
        "  time           - time since we first met\n" +
        "  songs          - Our favorite songs\n" +
        "  love you       - Try saying 'love you'\n" +
        "  message        - drop a message for your love\n" +
        "  letter         - view the love letter\n" +
        "  credits        - view developer dedication\n" +
        "  gift           - receive a love gift\n" +
        "  game           - play our love quiz\n" +
        "  clear          - clear terminal";
    }

    // 🌸 Timeline
    else if (command === "timeline") {
      response =
        "------------------------------------------\n LoveOS Journey Timeline\n------------------------------------------\n2019 – Saw you for the first time.\n2020 – Friendship turned into comfort.\n2021 – We became each other's safe space.\n2022 – Faced storms, yet held on stronger.\n2023 – Distance tested us, but love stood tall.\n2024 – Still writing our story...\n------------------------------------------";
    }

    // ❤️ Songs
    else if (command === "songs") {
      response =
        "------------------------------------------\n Songs we love 💗\n------------------------------------------\n 1. Adi Penne\n 2. Sidu Sidu\n 3. Anbenum\n 4. Nilayo\n 5. Until I Found You\n------------------------------------------\nType 'play <number>' to listen 🎧";
    }

        // 💬 Message Command
    else if (command === "message") {
      response = "Do you like to say something to MurugalakshmiShigivahan?\nDrop the message below and press Enter 💌";

      setHistory((prev) => [...prev, `ms@loveos:~$ ${cmd}`, " ", ""]);
      typeWriterEffect(response, () => {
        // Activate message mode after showing prompt
        setMessageMode(true);
      });
      return;
    }

      // 💌 Love Letter Command (Letter-by-Letter Typing)
    else if (command === "letter") {
  terminalBackup.current = [...history];
  setLetterMode(true);
  setLetterText("");
  setHistory([]);

  const letterContent = `
[Decrypting hidden file: love_letter.sys 💌]

My dearest MurugalakshmiShigivahan,

புரிந்துக்கொள்ளும் வரை எதையும் ரசிக்கவில்லை 
புரிந்துக்கொண்டபின் உன்னை தவிர எதையும் ரசிக்கமுடியவில்லை 

From the moment our paths crossed, my world transformed in ways I never imagined possible.

The day I met you, I realized love exists

Since then, every moment with you has been a beautiful chapter in my life story.

From our silly jokes to deep conversations, every memory with you is a treasure I hold close to my heart.

You are my confidante, my rock, and my greatest joy.

In your presence, I find a peace I've never known before.

With you, I've discovered a love that is patient, kind, and unwavering.

As we continue this journey together, I promise to cherish and support you through all of life's ups and downs.

You are my forever and always.

ஆகாயம் முழுவதும் அலைந்து பார்த்தேன் 
வெண்ணிலா  ஒன்றுதான் 
ஆனால் பூலோகம் கொண்டதோ இரண்டு என்பேன் 
அவளும் அவள் நிழலும் 

Forever yours,
MurugalakshmiShigivahan  💗
`;

  // 🎵 Start piano music
  if (pianoRef.current) {
    pianoRef.current.pause();
    pianoRef.current.currentTime = 0;
  }
  const audio = new Audio(piano);
  audio.volume = 0.3;
  audio.loop = true;
  audio.play();
  pianoRef.current = audio;

  // ✍️ Letter typing animation
  setTyping(true);
  let i = 0;
  const interval = setInterval(() => {
    setLetterText((prev) => prev + letterContent.charAt(i));
    i++;

    // Auto-scroll
    const el = document.querySelector(".letter-scroll");
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });

    if (i >= letterContent.length) {
      clearInterval(interval);
      setTyping(false);

      // 🎵 Fade out piano gracefully
      const fadeOutDuration = 3500; // 3.5 seconds
      const startVolume = audio.volume;
      const startTime = performance.now();

      const fadeOut = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / fadeOutDuration, 1);
        audio.volume = startVolume * (1 - progress);
        if (progress < 1) {
          requestAnimationFrame(fadeOut);
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      };

      requestAnimationFrame(fadeOut);

      // 🧩 Safety stop for mobile browsers
      setTimeout(() => {
        if (!audio.paused) audio.pause();
      }, fadeOutDuration + 1000);

      // ⏳ Delay showing return button (5 seconds after typing ends)
      setTimeout(() => {
        setShowBackButton(true);
      }, 6000);
    }
  }, 100);
  return;
}



    // 🕊 Return from Letter Mode
    else if (command === "return" && letterMode) {
      setLetterMode(false);
      setLetterText("");
      setHistory(terminalBackup.current);
      return;
    }

    // ▶️ Play Song
    else if (command.startsWith("play ")) {
      const index = parseInt(command.split(" ")[1]);
      const songs = [song1, song2, song3, song4, song5];
      const titles = [
        "Adi Penne",
        "Sidu Sidu",
        "Anbenum",
        "Nilayo",
        "Until I Found You",
      ];

      if (index >= 1 && index <= 5) {
        if (window.currentAudio) {
          window.currentAudio.pause();
          clearInterval(progressInterval.current);
        }

        const audio = new Audio(songs[index - 1]);
        audio.volume = 1;
        audio.play();
        window.currentAudio = audio;
        setCurrentSong(titles[index - 1]);
        setIsPlaying(true);

        progressInterval.current = setInterval(() => {
          if (audio.duration) {
            setProgress({
              current: audio.currentTime,
              duration: audio.duration,
            });
          }
        }, 1000);

        audio.onended = () => {
          clearInterval(progressInterval.current);
          setProgress({ current: 0, duration: audio.duration || 0 });
          setIsPlaying(false);
          // ✅ Keep currentSong name shown after ending
        };

        response = `Now playing: ${titles[index - 1]} 💞\n------------------------------------------`;
      } else {
        response = "Eh papa (1–5) number kula choose panuga.";
      }
    }

    // 🕰 Time Command
    else if (command === "time") {
      const firstMeet = new Date("2019-03-05T08:32:00+05:30");
      const now = new Date();

      const diffMs = now - firstMeet;
      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const totalMonths = Math.floor(totalDays / 30.4375);
      const totalYears = Math.floor(totalDays / 365.25);

      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.4375);
      const days = Math.floor((totalDays % 365.25) % 30.4375);

      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      response =
        `💗 Time since we met (March 5, 2019)\n` +
        "------------------------------------------\n" +
        `→ ${years} years, ${months} months, ${days} days\n` +
        `→ ${hours} hours, ${minutes} minutes, ${seconds} seconds\n\n` +
        `Total:\n→ ${totalYears} years\n→ ${totalMonths} months\n→ ${totalDays} days\n→ ${totalHours} hours\n→ ${totalMinutes} minutes\n→ ${totalSeconds} seconds\n` +
        "------------------------------------------\nEvery heartbeat since then counts 💞";
    }

    // 🎁 Gift
    else if (command === "gift") {
      response = `🎁 ${gifts[Math.floor(Math.random() * gifts.length)]}`;
    }

    // 🌍 Translate Love
    else if (command === "love you") {
      response =
        "\nEnglish — Love you Murugalakshmi\nSpanish — Te amo Murugalakshmi\nFrench — Je t’aime Murugalakshmi\nGerman — Ich liebe dich Murugalakshmi\nItalian — Ti amo Murugalakshmi\nPortuguese — Eu te amo Murugalakshmi\nRussian — Я люблю тебя, Murugalakshmi\nJapanese — 愛してる Murugalakshmi\nKorean — 사랑해 Murugalakshmi\nHindi — मैं तुमसे प्यार करता हूँ, Murugalakshmi\nTamil — நான் உன்னை காதலிக்கிறேன் முருகலட்சுமி 💗\nArabic — أحبك Murugalakshmi\nGreek — Σ' αγαπώ Murugalakshmi\nTurkish — Seni seviyorum Murugalakshmi\nChinese — 我爱你 Murugalakshmi\nThai — รักคุณ Murugalakshmi\nFilipino — Mahal kita Murugalakshmi\nDutch — Ik hou van jou Murugalakshmi\nPolish — Kocham cię Murugalakshmi\nBengali — আমি তোমায় ভালোবাসি Murugalakshmi\nMalay — Saya cinta padamu Murugalakshmi\n------------------------------------------";
    }

    // 💖 Credits
    else if (command === "credits") {
      response =
        "------------------------------------------\n💗 LoveOS v3.5.4\nDeveloped by: MurugalakshmiShigivahan \nDedicated to: MurugalakshmiShigivahan\nSince: March 25, 2020\nPowered by: Infinite Love\n------------------------------------------";
    }

    // 🎮 Game
    else if (command === "game") {
      setGameMode(true);
      response =
        "💘 Love Quiz 💘\n------------------------------------------\n" +
        gameQuestions[0].q +
        "\n(Answer Sollunga paapommm😜)";
    }

    // 💍 Proposal
    else if (command === "propose me") {
      terminalBackup.current = [...history];
      setProposalMode(true);
      setProposalStage("video");
      return;
    }

    // Clear Terminal
    else if (command === "clear") {
      setHistory(bootLines);
      return;
    }

    // Invalid Command
    else {
      response = `'${command}' purilaye dii. Type 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, `ms@loveos:~$ ${cmd}`, " ", ""]);
    typeWriterEffect(response, () => {});
  };

    const handleKeyDown = (e) => {
      if (messageMode && e.key === "Enter" && input.trim()) {
  const messageContent = input.trim();
  setInput("");
  setMessageMode(false);
  setHistory((prev) => [...prev, `💌 Sending message: "${messageContent}"`, " "]);

  // Send to Web3Forms
  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: "c30539ed-e4de-4a7a-98d4-19797b04d110", 
      name: "Hecker",
      subject: "Message from LoveOS Terminal",
      message: messageContent,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setHistory((prev) => [
          ...prev,
          "💗 Message sent successfully to your aathukar! He’ll feel it in his heart soon.",
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          "❌ Message failed to send. Maybe LoveOS is shy right now.",
        ]);
      }
    })
    .catch(() => {
      setHistory((prev) => [
        ...prev,
        "⚠️ Connection error. Try again, love.",
      ]);
    });

  return;
}
    
    if (typing) return; // Disable input while typing output

    // When pressing Enter — execute command
    if (e.key === "Enter" && input.trim()) {
      handleCommand(input);
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1); // reset index
      setInput("");
    }

    // When pressing Up Arrow — go back in history
    else if (e.key === "ArrowUp") {
      if (commandHistory.length === 0) return;
      e.preventDefault(); // prevent caret moving to start
      const newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    }

    // When pressing Down Arrow — go forward in history
    else if (e.key === "ArrowDown") {
      if (commandHistory.length === 0) return;
      e.preventDefault();
      const newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.min(commandHistory.length - 1, historyIndex + 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex] || "");
    }

    // Optional: clear history if Escape pressed
    else if (e.key === "Escape") {
      setInput("");
      setHistoryIndex(-1);
    }
  };


  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  // 🔒 Password Lock Before Boot
  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0d] text-white font-mono">
        <p className="text-pink-400 mb-2">LoveOS v3.5 Locked 🔒</p>
        <p>Enter password to continue 💗</p>
        <input
          type="password"
          className="mt-3 px-3 py-1 rounded bg-[#111] text-pink-300 border border-pink-600 outline-none focus:ring-2 focus:ring-pink-500"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (enteredPassword === "muruga") {
                setAuthenticated(true);
              } else {
                setPasswordAttempts((n) => n + 1);
                setEnteredPassword("");
                if (passwordAttempts >= 4) {
                 alert("Too many wrong attempts 💔 Redirecting...");
                window.location.href = "https://www.google.com/";
                }
              }
            }
          }}
        />
        <p className="mt-2 text-pink-600 text-sm">
          {passwordAttempts > 0 &&
            `Wrong password. Attempts: ${passwordAttempts }/ 5`}
        </p>
      </div>
    );
  }

  // 💍 Proposal Mode Preserved
  if (proposalMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0d] text-white font-mono overflow-hidden relative px-4">
        {/* 🎬 Video Stage */}
        {proposalStage === "video" && (
          <video
            src={proposal}
            autoPlay
            playsInline
            className="w-full max-w-3xl h-auto rounded-md object-contain"
            onEnded={() => setProposalStage("question")}
          />
        )}

        {/* 💬 Question Stage */}
        {proposalStage === "question" && (
          <div className="text-center mt-6 flex flex-col items-center justify-center">
            <p className="text-base sm:text-lg md:text-xl mb-6">
              Will you accept my proposal?
            </p>
            <div className="relative flex justify-center items-center gap-8">
              <div className="relative flex justify-center items-center gap-6">
                <button
                  onClick={() => {
                    setProposalStage("heart");
                    setTimeout(() => setShowBackButton(true), 6000);
                  }}
                  className="px-8 py-3 bg-pink-600 rounded-lg text-white font-bold text-lg sm:text-xl hover:bg-pink-700 transition origin-center"
                >
                  YES 💗
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💗 Heart Stage */}
        {proposalStage === "heart" && (
          <div className="flex flex-col items-center justify-center text-center w-full animate-fadeIn relative h-full p-5">
            <div className="text-[90px] sm:text-[120px] md:text-[150px] text-pink-400 animate-softPulse drop-shadow-[0_0_15px_#ff7ab5] mb-4">
              💗
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-pink-300 italic text-xs sm:text-sm md:text-base">
                Murugalakshmi ❤️ Shigivahan
              </p>
              <p className="text-pink-300 italic text-xs sm:text-sm md:text-base">
                since Mar 25 2020
              </p>
            </div>

            <p className="text-pink-400 text-xs sm:text-sm md:text-base mb-16 px-4">
              we have already been in love in the past and will continue forever my love
            </p>

            {showBackButton && (
              <div className="absolute bottom-6 flex justify-center w-full">
                <button
                  onClick={() => {
                    setProposalMode(false);
                    setProposalStage("video");
                    setNoCount(0);
                    setShowBackButton(false);
                    setHistory(terminalBackup.current);
                  }}
                  className="px-5 py-2 border border-pink-500 text-pink-400 rounded-xl hover:bg-pink-800/20 transition text-sm sm:text-base animate-fadeIn"
                >
                  Back to Terminal
                </button>
              </div>
            )}
          </div>
        )}

        <style>{`
          @keyframes softPulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px #ff7ab5); }
            50% { transform: scale(1.08); filter: drop-shadow(0 0 25px #ff7ab5); }
          }
          .animate-softPulse { animation: softPulse 2s infinite ease-in-out; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 1.2s ease-in-out forwards; }
        `}</style>
      </div>
    );
  }

  // 💌 Letter Mode Screen
    if (letterMode) {
      return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-[#0b0b0d] via-[#111] to-[#0b0b0d] text-pink-100 font-mono px-3 py-5 overflow-hidden animate-heartbeat">
          
          {/* Header */}
          <header className="w-full max-w-5xl text-pink-400 text-sm sm:text-base tracking-wide text-center mb-3">
            ╔═══ Decrypting love_letter.sys 💌 ═══╗
          </header>

          {/* Letter Window */}
          <div className="w-full max-w-5xl border-[2.5px] border-pink-800 bg-gradient-to-b from-[#121212] via-[#151515] to-[#121212] rounded-xl shadow-[0_0_25px_rgba(255,150,200,0.1)] p-6 sm:p-8 flex flex-col h-[75vh] sm:h-[80vh] relative overflow-hidden">
            <div
              className="overflow-y-auto hide-scrollbar flex-1 text-left text-pink-200 whitespace-pre-wrap leading-relaxed tracking-wide pr-2 text-sm sm:text-base letter-scroll"
              style={{ scrollBehavior: "smooth" }}
            >
              {letterText && letterText.trim() !== "" ? letterText : "Decrypting... 💗"}
            </div>

            {/* Back Button */}
            {!typing && showBackButton &&(
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    if (pianoRef.current) {
                      pianoRef.current.pause();
                    }
                    setLetterMode(false);
                    setLetterText("");
                    setHistory(terminalBackup.current);
                  }}
                  className="px-6 py-2 border border-pink-500 text-pink-300 rounded-xl hover:bg-pink-800/20 transition-all text-sm sm:text-base animate-glow"
                >
                  Return to Terminal
                </button>
              </div>
            )}
          </div>

          <footer className="text-xs sm:text-sm text-pink-600 italic mt-4 text-center select-none">
            “Some words are written not in ink, but in heartbeat signals.”
          </footer>

          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

            @keyframes glow {
              0%, 100% { text-shadow: 0 0 8px #ff8fcf, 0 0 20px #ff8fcf; }
              50% { text-shadow: 0 0 12px #ffb6e6, 0 0 30px #ffb6e6; }
            }
            .animate-glow {
              animation: glow 2s ease-in-out infinite;
            }

            @keyframes heartbeat {
              0%, 100% { opacity: 0.95; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.01); }
            }
            .animate-heartbeat {
              animation: heartbeat 4s ease-in-out infinite;
            }
          `}</style>
        </div>
      );
    }

  // 💻 Main Terminal
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#0b0b0d] text-white font-mono px-3 py-5 overflow-hidden">
      {/* Header */}
      <header className="relative w-full max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between text-pink-400 text-sm sm:text-base mb-3 tracking-wide select-none px-2 text-center sm:text-left">
        <div className="w-full sm:w-auto mb-1 sm:mb-0">
          ╔═══ LoveOS Terminal v3.5 ═══╗
          <div className="text-xs text-pink-300 italic mt-1">{mood}</div>
        </div>

        {/* 🎵 Song Player */}
        {currentSong && (
          <div className="w-full sm:w-auto flex flex-col sm:items-end items-center mt-1 sm:mt-0 text-[11px] sm:text-xs md:text-sm text-pink-300 leading-tight">
            <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 text-pink-400 flex-wrap">
              <span className="text-[#ff8fcf] animate-softPulse">♪</span>
              <span className="truncate max-w-[160px] sm:max-w-[200px] md:max-w-[250px] text-center sm:text-right">
                {currentSong}
              </span>
              <button
                onClick={() => {
                    if (window.currentAudio) {
                      const audio = window.currentAudio;

                      if (isPlaying) {
                        audio.pause();
                        setIsPlaying(false);
                        clearInterval(progressInterval.current);
                      } else {
                        // Replay the song if it's at the end
                        if (audio.currentTime >= audio.duration - 1) {
                          audio.currentTime = 0;
                        }
                        audio.play();
                        setIsPlaying(true);

                        // Restart progress tracking
                        clearInterval(progressInterval.current);
                        progressInterval.current = setInterval(() => {
                          if (audio.duration) {
                            setProgress({
                              current: audio.currentTime,
                              duration: audio.duration,
                            });
                          }
                        }, 1000);
                      }
                    }
                  }}
                className="text-pink-500 hover:text-pink-300 transition ml-1"
              >
                {isPlaying ? "⏸" : "▶︎"}
              </button>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-1 mt-0.5 text-white font-mono">
              <span>
                [
                {Array.from({ length: 10 })
                  .map((_, i) =>
                    i < (progress.current / progress.duration) * 10 ? "■" : "□"
                  )
                  .join("")}
                ]
              </span>
              <span className="text-gray-300 whitespace-nowrap">
                {formatTime(progress.current)} / {formatTime(progress.duration)}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Terminal Window */}
      <div className="w-full max-w-5xl border-[2.5px] border-pink-800 bg-gradient-to-b from-[#121212] via-[#151515] to-[#121212] rounded-xl shadow-[0_0_25px_rgba(255,150,200,0.1)] p-4 sm:p-6 flex flex-col h-[75vh] sm:h-[80vh]">
        <div
          ref={terminalRef}
          className="overflow-y-auto hide-scrollbar flex-1 pr-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {history.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap leading-snug ${
                !line.startsWith("ms@loveos") && line.trim() !== ""
                  ? "mb-2"
                  : ""
              }`}
            >
              {line === getGreeting() ? (
                <span className="text-[#89a0ff] animate-pulse">{line}</span>
              ) : line.startsWith("ms@loveos") ? (
                <>
                  <span className="text-[#89a0ff]">{line.split("$")[0]}</span>
                  <span className="text-pink-400">
                    $ {line.split("$")[1]}
                  </span>
                </>
              ) : (
                <span className="text-white">{line}</span>
              )}
            </div>
          ))}

          {!typing && (
            <div className="flex items-center mt-2">
              <span className="text-[#89a0ff]">ms@loveos:</span>
              <span className="text-pink-400 ml-1">~$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 ml-2 bg-transparent border-none outline-none focus:ring-0 text-white placeholder-gray-500 text-sm sm:text-base"
                placeholder="Type a command..."
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer & Gift Popup */}
      <footer className="text-xs sm:text-sm text-pink-600 italic mt-4 text-center select-none">
        “Love isn’t coded, it’s compiled in the heart.”
      </footer>

      {giftMessage && (
        <div className="absolute bottom-20 bg-pink-900/60 px-4 py-2 rounded-xl text-pink-200 text-xs sm:text-sm animate-fadeIn">
          {giftMessage}
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes softPulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
            filter: drop-shadow(0 0 6px #ff7ab5);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
            filter: drop-shadow(0 0 15px #ff7ab5);
          }
        }
        .animate-softPulse { animation: softPulse 1.8s ease-in-out infinite; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-in-out forwards; }
      `}</style>
    </div>
  );
}
