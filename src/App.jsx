import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================
// SUPABASE CONFIG
// ============================================================
const SUPABASE_URL = "https://muhvzfkqabfskzxubtfw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aHZ6ZmtxYWJmc2t6eHVidGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDQyNzYsImV4cCI6MjA5MjE4MDI3Nn0.a7J66JFRtMZUaP0JWuzhXo2KYUR0rQxEyP0s8roFJ8A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// CONSTANTS
// ============================================================
const VIDEO_REWARD = 0.05;
const MAX_VIDEOS = 15;
const TAP_REWARD = 0.005;
const TAPS_PER_REWARD = 3;
const TAP_DAILY_CAP = 3.00;
const WALK_REWARD = 0.003;
const WALK_INTERVAL_SECS = 15;
const REFERRAL_BONUS = 2.00;
const REFERRAL_PERCENT = 0.10;
const WITHDRAWAL_THRESHOLD = 15.00;
const WITHDRAWAL_SHOW = 14.00;

const AFRICAN_COUNTRIES = [
  { name: "Nigeria", code: "NG", currency: "NGN", symbol: "₦", rate: 1650 },
  { name: "Ghana", code: "GH", currency: "GHS", symbol: "₵", rate: 15.2 },
  { name: "Kenya", code: "KE", currency: "KES", symbol: "KSh", rate: 129 },
  { name: "South Africa", code: "ZA", currency: "ZAR", symbol: "R", rate: 18.5 },
  { name: "Uganda", code: "UG", currency: "UGX", symbol: "USh", rate: 3750 },
  { name: "Tanzania", code: "TZ", currency: "TZS", symbol: "TSh", rate: 2650 },
  { name: "Zambia", code: "ZM", currency: "ZMW", symbol: "ZK", rate: 27 },
  { name: "Zimbabwe", code: "ZW", currency: "ZWL", symbol: "Z$", rate: 322 },
  { name: "Cameroon", code: "CM", currency: "XAF", symbol: "FCFA", rate: 615 },
  { name: "Senegal", code: "SN", currency: "XOF", symbol: "CFA", rate: 615 },
  { name: "Ethiopia", code: "ET", currency: "ETB", symbol: "Br", rate: 57 },
  { name: "Rwanda", code: "RW", currency: "RWF", symbol: "RF", rate: 1280 },
  { name: "Ivory Coast", code: "CI", currency: "XOF", symbol: "CFA", rate: 615 },
  { name: "Other", code: "OT", currency: "USD", symbol: "$", rate: 1 },
];

// 200+ African-style usernames for popups
const POPUP_NAMES = [
  "Emeka_NG","Chidi_NG","Amara_GH","Fatima_NG","Kwame_GH","Aisha_KE","Tunde_NG",
  "Yemi_NG","Blessing_NG","Kofi_GH","Ngozi_NG","Seun_NG","Ade_NG","Bola_NG",
  "Chinwe_NG","Ifeanyi_NG","Obinna_NG","Nkechi_NG","Uche_NG","Chioma_NG",
  "Sade_NG","Rotimi_NG","Funke_NG","Gbenga_NG","Tobi_NG","Lola_NG","Dayo_NG",
  "Tola_NG","Kemi_NG","Wale_NG","Femi_NG","Deji_NG","Seyi_NG","Bukola_NG",
  "Rashida_GH","Abena_GH","Ama_GH","Akosua_GH","Adjoa_GH","Efua_GH","Yaa_GH",
  "Akua_GH","Adwoa_GH","Araba_GH","Esi_GH","Maame_GH","Afua_GH","Afia_GH",
  "Nana_GH","Kojo_GH","Kweku_GH","Kwabena_GH","Yaw_GH","Fiifi_GH","Kobina_GH",
  "Wanjiku_KE","Kamau_KE","Njeri_KE","Mwangi_KE","Akinyi_KE","Otieno_KE",
  "Wambui_KE","Kariuki_KE","Mutua_KE","Nduta_KE","Wairimu_KE","Gitau_KE",
  "Zawadi_TZ","Baraka_TZ","Amani_TZ","Furaha_TZ","Imani_TZ","Neema_TZ",
  "Pendo_TZ","Rehema_TZ","Salama_TZ","Tumaini_TZ","Upendo_TZ","Zuri_TZ",
  "Thabo_ZA","Lerato_ZA","Sipho_ZA","Nomsa_ZA","Bongani_ZA","Lindiwe_ZA",
  "Mandla_ZA","Nandi_ZA","Sandile_ZA","Zanele_ZA","Lungelo_ZA","Nhlanhla_ZA",
  "Chukwu_NG","Obiora_NG","Adaeze_NG","Amaechi_NG","Ifeoma_NG","Onyeka_NG",
  "Chiamaka_NG","Chukwuemeka_NG","Ebuka_NG","Uzoma_NG","Nneka_NG","Ikenna_NG",
  "Musa_NG","Ibrahim_NG","Abdullahi_NG","Abubakar_NG","Halima_NG","Zainab_NG",
  "Hauwa_NG","Bilkisu_NG","Ramatu_NG","Sadiya_NG","Asiya_NG","Mariam_NG",
  "Kolade_NG","Olumide_NG","Ayoola_NG","Adewale_NG","Adebayo_NG","Adesola_NG",
  "Victor_NG","Emmanuel_NG","Grace_NG","Miracle_NG","Favour_NG","Promise_NG",
  "Precious_NG","Goodluck_NG","Godswill_NG","Sunday_NG","Monday_NG","Friday_NG",
  "Daniel_KE","David_KE","Mary_KE","Grace_KE","Faith_KE","Hope_KE","Joy_KE",
  "Peace_KE","Mercy_KE","Charity_KE","Patience_KE","Prudence_KE","Wisdom_KE",
  "Prosper_GH","Fortune_GH","Success_GH","Victor_GH","Godwin_GH","Godfred_GH",
  "Akwasi_GH","Kwamena_GH","Agyemang_GH","Asante_GH","Boateng_GH","Mensah_GH",
  "Oumar_SN","Mamadou_SN","Fatou_SN","Aminata_SN","Mariama_SN","Rokhaya_SN",
  "Aissatou_SN","Ndéye_SN","Binta_SN","Khady_SN","Coumba_SN","Maguette_SN",
  "Jean_CM","Pierre_CM","Marie_CM","Agnes_CM","Celestine_CM","Therese_CM",
  "Alphonse_CM","Patrice_CM","Modeste_CM","Fidele_CM","Parfait_CM","Blaise_CM",
  "Abebe_ET","Tigist_ET","Yonas_ET","Hana_ET","Dawit_ET","Selam_ET","Biruk_ET",
  "Tsehay_ET","Meron_ET","Bemnet_ET","Robel_ET","Eyerusalem_ET","Lidya_ET",
  "Eric_RW","Patrick_RW","Sandrine_RW","Nadine_RW","Diane_RW","Claudine_RW",
  "Innocent_RW","Celestin_RW","Faustin_RW","Alphonse_RW","Beatrice_RW",
  "Adama_CI","Moussa_CI","Aminata_CI","Mariam_CI","Fatoumata_CI","Kadidjatou_CI",
];

const POPUP_AMOUNTS = [12, 15, 18, 22, 25, 27, 30, 33, 35, 39, 42, 45, 47, 50, 55, 60, 65, 70, 75, 80];

function generateReferralCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getRandomPopup() {
  const name = POPUP_NAMES[Math.floor(Math.random() * POPUP_NAMES.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  const amount = POPUP_AMOUNTS[Math.floor(Math.random() * POPUP_AMOUNTS.length)];
  return { username: `${name}${num}`, amount };
}

// ============================================================
// STYLES
// ============================================================
const S = {
  app: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    fontFamily: "'Trebuchet MS', sans-serif",
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  },
  gold: "#FFD700",
  goldDim: "#B8960C",
  goldGlow: "rgba(255,215,0,0.3)",
};

// ============================================================
// COMPONENTS
// ============================================================

function GoldButton({ onClick, children, style = {}, disabled = false }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: disabled
          ? "linear-gradient(135deg, #444, #333)"
          : "linear-gradient(135deg, #FFD700, #B8860B)",
        color: disabled ? "#888" : "#000",
        border: "none",
        borderRadius: 14,
        padding: "15px 0",
        fontSize: 16,
        fontWeight: "bold",
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "all 0.15s",
        boxShadow: disabled ? "none" : "0 6px 24px rgba(255,215,0,0.35)",
        letterSpacing: 0.5,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #1a1a1a, #111)",
      border: "1px solid rgba(255,215,0,0.15)",
      borderRadius: 18,
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

function LivePopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    const p = getRandomPopup();
    setPopup(p);
    setVisible(true);
    setTimeout(() => setVisible(false), 3500);
  }, []);

  useEffect(() => {
    show();
    const interval = setInterval(show, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!popup || !visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 90,
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(135deg, #1a1a1a, #222)",
      border: "1px solid rgba(255,215,0,0.4)",
      borderRadius: 50,
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      zIndex: 9999,
      animation: "slideUp 0.4s ease",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 20 }}>💰</span>
      <span style={{ fontSize: 13, color: "#ccc" }}>
        <span style={{ color: S.gold, fontWeight: "bold" }}>{popup.username}</span>
        {" just received "}
        <span style={{ color: "#4ade80", fontWeight: "bold" }}>${popup.amount}.00</span>
        {"!"}
      </span>
    </div>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage({ onLogin, onRegister }) {
  const features = [
    {
      icon: "🎬",
      title: "Watch Videos & Get Paid",
      desc: "This is not a joke — every single video you watch on Dollarbag IQ puts real money into your account. Advertisers pay us to show you videos, and we pass that money directly to you. No skills needed. No experience required. You just press play, watch the video to the end, and the cash lands in your wallet. You can watch up to 15 videos every single day — that is $0.75 daily just from watching alone.",
    },
    {
      icon: "👆",
      title: "Tap Your Screen & Get Paid",
      desc: "Yes, we are serious. Every time you tap a button on your screen, you earn money. Every 3 taps earns you $0.005. Keep tapping and watch your balance climb. People are earning up to $3.00 every single day just from tapping their phone. You can do it while watching TV, sitting in traffic, or relaxing at home. Your finger is a money-making machine on Dollarbag IQ.",
    },
    {
      icon: "🚶",
      title: "Walk Around & Get Paid",
      desc: "Your daily movement is now worth money. Dollarbag IQ tracks your walking using your phone and pays you $0.003 for every 15 seconds you walk. Whether you are walking to the market, going to school, strolling around your neighbourhood, or just pacing in your room — every step pays. Available every day from 6am to 6pm so you can earn while going about your normal life.",
    },
    {
      icon: "👥",
      title: "Refer Friends & Both Get Paid",
      desc: "Here is where it gets really exciting. Share your unique referral code with a friend. When they sign up using your code, you BOTH receive $2.00 instantly — just for joining. But it does not stop there. You continue to earn 10% of everything your friend earns on Dollarbag IQ — for life. The more friends you invite, the more passive income you earn without doing anything extra.",
    },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'Trebuchet MS', sans-serif" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #1a1200 0%, #0a0a0a 60%)",
        padding: "50px 24px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 56, marginBottom: 8 }}>💰</div>
        <h1 style={{
          fontSize: 36, fontWeight: "900", margin: "0 0 8px",
          background: "linear-gradient(90deg, #FFD700, #FFF8DC, #FFD700)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.1,
        }}>
          DOLLARBAG IQ
        </h1>
        <p style={{ color: "rgba(255,215,0,0.7)", fontSize: 14, marginBottom: 20, letterSpacing: 2 }}>
          WATCH · TAP · WALK · EARN
        </p>
        <p style={{
          color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7,
          maxWidth: 360, margin: "0 auto 28px",
        }}>
          Dollarbag IQ is the leading platform that pays you <strong style={{ color: S.gold }}>real money</strong> just for watching videos and completing simple tasks online. We earn from advertisers and share the revenue directly with you.
        </p>
        <div style={{ display: "flex", gap: 12, maxWidth: 360, margin: "0 auto" }}>
          <GoldButton onClick={onRegister} style={{ flex: 1 }}>Create Account</GoldButton>
          <button onClick={onLogin} style={{
            flex: 1, background: "transparent", color: S.gold,
            border: `1px solid ${S.gold}`, borderRadius: 14,
            padding: "15px 0", fontSize: 16, fontWeight: "bold", cursor: "pointer",
          }}>Log In</button>
        </div>
        <p style={{ color: "#4ade80", fontSize: 13, marginTop: 16 }}>
          🔥 Users earn up to <strong>$2.50+ daily</strong> from watching, tapping and walking
        </p>
      </div>

      {/* Features */}
      <div style={{ padding: "0 20px 40px" }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: "linear-gradient(145deg, #151515, #0f0f0f)",
            border: "1px solid rgba(255,215,0,0.1)",
            borderRadius: 18, padding: 22, marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))",
                border: "1px solid rgba(255,215,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>{f.icon}</div>
              <h3 style={{ margin: 0, fontSize: 16, color: S.gold, fontWeight: "bold" }}>{f.title}</h3>
            </div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
          </div>
        ))}

        {/* Earning summary */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.03))",
          border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: 18, padding: 22, marginBottom: 24, textAlign: "center",
        }}>
          <p style={{ color: S.gold, fontWeight: "bold", fontSize: 16, margin: "0 0 12px" }}>💵 Daily Earning Potential</p>
          {[
            ["🎬 Watch 15 Videos", "$0.75"],
            ["👆 Tap to Earn (daily cap)", "$3.00"],
            ["🚶 Walk & Earn", "Unlimited"],
            ["👥 Referral Bonuses", "Unlimited"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{label}</span>
              <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 14 }}>{val}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,215,0,0.2)", marginTop: 10, paddingTop: 10 }}>
            <span style={{ color: S.gold, fontWeight: "bold", fontSize: 18 }}>Minimum $2.50+ per day 🚀</span>
          </div>
        </div>

        <GoldButton onClick={onRegister}>Start Earning Now — It's Free</GoldButton>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 12 }}>
          Already have an account?{" "}
          <span onClick={onLogin} style={{ color: S.gold, cursor: "pointer" }}>Log In here</span>
        </p>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

// ============================================================
// AUTH
// ============================================================
function AuthScreen({ mode, onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [referralInput, setReferralInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    if (!email || !password) return setError("Please fill in all required fields.");
    if (mode === "register" && (!fullName || !country)) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      if (mode === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        const userId = data.user?.id;
        const myCode = generateReferralCode();
        const countryObj = AFRICAN_COUNTRIES.find(c => c.code === country);

        // Create profile
        await supabase.from("profiles").insert({
          id: userId,
          full_name: fullName,
          email,
          country_code: country,
          country_name: countryObj?.name || "",
          currency_symbol: countryObj?.symbol || "$",
          currency_rate: countryObj?.rate || 1,
          referral_code: myCode,
          balance: 0,
          tap_earned_today: 0,
          videos_watched_today: 0,
          last_reset_date: new Date().toISOString().split("T")[0],
          total_referrals: 0,
          referral_earnings: 0,
          has_withdrawn: false,
        });

        // Handle referral
        if (referralInput.trim()) {
          const code = referralInput.trim().toUpperCase();
          const { data: referrer } = await supabase
            .from("profiles").select("id, balance, total_referrals, referral_earnings")
            .eq("referral_code", code).single();
          if (referrer) {
            // Give referrer $2
            await supabase.from("profiles").update({
              balance: (referrer.balance || 0) + REFERRAL_BONUS,
              total_referrals: (referrer.total_referrals || 0) + 1,
              referral_earnings: (referrer.referral_earnings || 0) + REFERRAL_BONUS,
            }).eq("id", referrer.id);
            // Give new user $2
            await supabase.from("profiles").update({
              balance: REFERRAL_BONUS,
              referred_by: referrer.id,
            }).eq("id", userId);
            // Log referral
            await supabase.from("referrals").insert({ referrer_id: referrer.id, referee_id: userId });
          }
        }
        onSuccess(data.user);
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        onSuccess(data.user);
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  const inputStyle = {
    width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,215,0,0.2)",
    borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 15,
    outline: "none", boxSizing: "border-box", fontFamily: "'Trebuchet MS', sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "40px 24px", fontFamily: "'Trebuchet MS', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>💰</div>
        <h2 style={{
          fontSize: 28, fontWeight: "900", margin: 0,
          background: "linear-gradient(90deg, #FFD700, #FFF8DC)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>DOLLARBAG IQ</h2>
        <p style={{ color: "rgba(255,215,0,0.6)", marginTop: 6, fontSize: 14 }}>
          {mode === "register" ? "Create your free account" : "Welcome back"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {mode === "register" && (
          <input style={inputStyle} placeholder="Full Name" value={fullName}
            onChange={e => setFullName(e.target.value)} />
        )}
        <input style={inputStyle} placeholder="Email Address" type="email" value={email}
          onChange={e => setEmail(e.target.value)} />
        <input style={inputStyle} placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)} />
        {mode === "register" && (
          <>
            <select style={{ ...inputStyle, appearance: "none" }} value={country}
              onChange={e => setCountry(e.target.value)}>
              <option value="">Select Your Country</option>
              {AFRICAN_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            <input style={inputStyle} placeholder="Referral Code (optional)" value={referralInput}
              onChange={e => setReferralInput(e.target.value.toUpperCase())} maxLength={5} />
          </>
        )}
        {error && <p style={{ color: "#f87171", fontSize: 13, margin: 0, textAlign: "center" }}>{error}</p>}
        <GoldButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : mode === "register" ? "Create Account & Start Earning" : "Log In"}
        </GoldButton>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
          {mode === "register" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={onSwitch} style={{ color: S.gold, cursor: "pointer", fontWeight: "bold" }}>
            {mode === "register" ? "Log In" : "Sign Up Free"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP (after login)
// ============================================================
function MainApp({ user }) {
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data) {
      // Reset daily counters if new day
      const today = new Date().toISOString().split("T")[0];
      if (data.last_reset_date !== today) {
        await supabase.from("profiles").update({
          tap_earned_today: 0,
          videos_watched_today: 0,
          last_reset_date: today,
        }).eq("id", user.id);
        data.tap_earned_today = 0;
        data.videos_watched_today = 0;
        data.last_reset_date = today;
      }
      setProfile(data);
    }
    setLoading(false);
  }

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
        <p style={{ color: S.gold, fontSize: 16 }}>Loading your wallet...</p>
      </div>
    </div>
  );

  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "earn", icon: "💵", label: "Earn" },
    { id: "referral", icon: "👥", label: "Refer" },
    { id: "wallet", icon: "💳", label: "Wallet" },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingBottom: 80 }}>
      <LivePopup />
      {tab === "home" && <HomeTab profile={profile} onEarn={() => setTab("earn")} onRefer={() => setTab("referral")} />}
      {tab === "earn" && <EarnTab profile={profile} userId={user.id} onUpdate={fetchProfile} />}
      {tab === "referral" && <ReferralTab profile={profile} userId={user.id} onUpdate={fetchProfile} />}
      {tab === "wallet" && <WalletTab profile={profile} userId={user.id} onUpdate={fetchProfile} />}

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "#111", borderTop: "1px solid rgba(255,215,0,0.15)",
        display: "flex", padding: "8px 0",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "6px 0",
          }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? S.gold : "rgba(255,255,255,0.4)", fontWeight: tab === t.id ? "bold" : "normal" }}>
              {t.label}
            </span>
            {tab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: S.gold }} />}
          </button>
        ))}
      </div>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.05)} }
        @keyframes coinPop { 0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-60px) scale(1.4)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(255,215,0,0.3)}50%{box-shadow:0 0 40px rgba(255,215,0,0.6)} }
      `}</style>
    </div>
  );
}

// ============================================================
// HOME TAB
// ============================================================
function HomeTab({ profile, onEarn, onRefer }) {
  const country = AFRICAN_COUNTRIES.find(c => c.code === profile?.country_code);
  const localBalance = profile ? (profile.balance * (country?.rate || 1)).toFixed(0) : 0;

  return (
    <div style={{ padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>Welcome back,</p>
          <h2 style={{ color: S.gold, fontSize: 20, fontWeight: "bold", margin: "2px 0 0" }}>
            {profile?.full_name?.split(" ")[0] || "Friend"} 👋
          </h2>
        </div>
        <div style={{ fontSize: 36 }}>💰</div>
      </div>

      {/* Balance Card */}
      <div style={{
        background: "linear-gradient(135deg, #1a1200, #2a1f00)",
        border: "1px solid rgba(255,215,0,0.3)",
        borderRadius: 22, padding: "28px 24px", marginBottom: 20,
        textAlign: "center", position: "relative", overflow: "hidden",
        animation: "glow 3s ease-in-out infinite",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,215,0,0.08), transparent)" }} />
        <p style={{ color: "rgba(255,215,0,0.6)", fontSize: 13, margin: "0 0 6px", letterSpacing: 2 }}>TOTAL BALANCE</p>
        <h1 style={{ fontSize: 48, fontWeight: "900", margin: "0 0 6px", color: S.gold }}>
          ${(profile?.balance || 0).toFixed(2)}
        </h1>
        {country && country.code !== "OT" && (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>
            ≈ {country.symbol}{Number(localBalance).toLocaleString()} {country.currency}
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "🎬", label: "Videos Today", val: `${profile?.videos_watched_today || 0}/${MAX_VIDEOS}` },
          { icon: "👥", label: "Referrals", val: profile?.total_referrals || 0 },
          { icon: "💵", label: "Tap Earned Today", val: `$${(profile?.tap_earned_today || 0).toFixed(2)}` },
          { icon: "🏆", label: "Referral Earnings", val: `$${(profile?.referral_earnings || 0).toFixed(2)}` },
        ].map(item => (
          <Card key={item.label} style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ color: S.gold, fontWeight: "bold", fontSize: 18 }}>{item.val}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 3 }}>{item.label}</div>
          </Card>
        ))}
      </div>

      {/* CTA Buttons */}
      <GoldButton onClick={onEarn} style={{ marginBottom: 12 }}>🎬 Start Earning Now</GoldButton>
      <button onClick={onRefer} style={{
        width: "100%", background: "transparent",
        border: "1px solid rgba(255,215,0,0.3)", borderRadius: 14,
        padding: "14px 0", color: S.gold, fontSize: 15,
        fontWeight: "bold", cursor: "pointer",
      }}>
        👥 Invite Friends — Both Earn $2.00
      </button>
    </div>
  );
}

// ============================================================
// EARN TAB
// ============================================================
function EarnTab({ profile, userId, onUpdate }) {
  const [tapCount, setTapCount] = useState(0);
  const [tapPops, setTapPops] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [walkActive, setWalkActive] = useState(false);
  const [walkSecs, setWalkSecs] = useState(0);
  const walkRef = useRef(null);
  const [msg, setMsg] = useState("");

  const hour = new Date().getHours();
  const walkAllowed = hour >= 6 && hour < 18;

  function showMsg(text) { setMsg(text); setTimeout(() => setMsg(""), 2500); }

  // TAP HANDLER
  async function handleTap() {
    if ((profile?.tap_earned_today || 0) >= TAP_DAILY_CAP) {
      return showMsg("You have reached the $3.00 daily tap limit. Come back tomorrow!");
    }
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount % TAPS_PER_REWARD === 0) {
      const id = Date.now();
      setTapPops(p => [...p, id]);
      setTimeout(() => setTapPops(p => p.filter(x => x !== id)), 1000);
      const newEarned = (profile.tap_earned_today || 0) + TAP_REWARD;
      const newBalance = (profile.balance || 0) + TAP_REWARD;
      await supabase.from("profiles").update({
        balance: newBalance,
        tap_earned_today: Math.min(newEarned, TAP_DAILY_CAP),
      }).eq("id", userId);
      // Give 10% to referrer
      if (profile.referred_by) {
        const { data: ref } = await supabase.from("profiles").select("balance, referral_earnings").eq("id", profile.referred_by).single();
        if (ref) {
          await supabase.from("profiles").update({
            balance: (ref.balance || 0) + TAP_REWARD * REFERRAL_PERCENT,
            referral_earnings: (ref.referral_earnings || 0) + TAP_REWARD * REFERRAL_PERCENT,
          }).eq("id", profile.referred_by);
        }
      }
      onUpdate();
    }
  }

  // VIDEO HANDLER
  async function handleWatchVideo() {
    if ((profile?.videos_watched_today || 0) >= MAX_VIDEOS) {
      return showMsg("You have watched all 15 videos for today. Come back tomorrow!");
    }
    setVideoLoading(true);
    // Simulate ad (replace with real AppLovin SDK)
    await new Promise(r => setTimeout(r, 3000));
    setVideoLoading(false);
    const newWatched = (profile.videos_watched_today || 0) + 1;
    const newBalance = (profile.balance || 0) + VIDEO_REWARD;
    await supabase.from("profiles").update({
      balance: newBalance,
      videos_watched_today: newWatched,
    }).eq("id", userId);
    if (profile.referred_by) {
      const { data: ref } = await supabase.from("profiles").select("balance, referral_earnings").eq("id", profile.referred_by).single();
      if (ref) {
        await supabase.from("profiles").update({
          balance: (ref.balance || 0) + VIDEO_REWARD * REFERRAL_PERCENT,
          referral_earnings: (ref.referral_earnings || 0) + VIDEO_REWARD * REFERRAL_PERCENT,
        }).eq("id", profile.referred_by);
      }
    }
    showMsg(`+$${VIDEO_REWARD.toFixed(2)} added to your wallet! 🎉`);
    onUpdate();
  }

  // WALK HANDLER
  function toggleWalk() {
    if (!walkAllowed) return showMsg("Walk & Earn is only available from 6am to 6pm. See you then!");
    if (walkActive) {
      clearInterval(walkRef.current);
      setWalkActive(false);
      setWalkSecs(0);
      showMsg("Walk session ended. Great job!");
    } else {
      setWalkActive(true);
      walkRef.current = setInterval(async () => {
        setWalkSecs(s => {
          const next = s + 1;
          if (next % WALK_INTERVAL_SECS === 0) {
            supabase.from("profiles").select("balance, referred_by").eq("id", userId).single().then(({ data }) => {
              if (data) {
                supabase.from("profiles").update({ balance: (data.balance || 0) + WALK_REWARD }).eq("id", userId);
                if (data.referred_by) {
                  supabase.from("profiles").select("balance, referral_earnings").eq("id", data.referred_by).single().then(({ data: ref }) => {
                    if (ref) supabase.from("profiles").update({
                      balance: (ref.balance || 0) + WALK_REWARD * REFERRAL_PERCENT,
                      referral_earnings: (ref.referral_earnings || 0) + WALK_REWARD * REFERRAL_PERCENT,
                    }).eq("id", data.referred_by);
                  });
                }
                onUpdate();
              }
            });
          }
          return next;
        });
      }, 1000);
    }
  }

  useEffect(() => () => clearInterval(walkRef.current), []);

  const videosLeft = MAX_VIDEOS - (profile?.videos_watched_today || 0);
  const tapCapReached = (profile?.tap_earned_today || 0) >= TAP_DAILY_CAP;

  return (
    <div style={{ padding: "24px 20px" }}>
      <h2 style={{ color: S.gold, fontSize: 22, fontWeight: "bold", margin: "0 0 6px" }}>Earn Money</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>3 ways to earn real cash right now</p>

      {msg && (
        <div style={{
          background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: 12, padding: "12px 16px", marginBottom: 16,
          color: S.gold, fontSize: 14, textAlign: "center",
        }}>{msg}</div>
      )}

      {/* Watch & Earn */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 24 }}>🎬</span>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Watch & Earn</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>$0.05 per video · {videosLeft} videos left today</p>
          </div>
          <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 15 }}>$0.05</span>
        </div>
        <div style={{ background: "#222", borderRadius: 8, height: 6, marginBottom: 14 }}>
          <div style={{
            background: "linear-gradient(90deg, #FFD700, #B8860B)",
            height: "100%", borderRadius: 8,
            width: `${((profile?.videos_watched_today || 0) / MAX_VIDEOS) * 100}%`,
            transition: "width 0.4s",
          }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "0 0 14px", textAlign: "center" }}>
          {profile?.videos_watched_today || 0}/{MAX_VIDEOS} watched today
        </p>
        <GoldButton
          onClick={handleWatchVideo}
          disabled={videoLoading || videosLeft === 0}
        >
          {videoLoading ? "⏳ Loading Video Ad..." : videosLeft === 0 ? "✅ All Done for Today!" : "▶ Watch Video — Earn $0.05"}
        </GoldButton>
      </Card>

      {/* Tap & Earn */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 24 }}>👆</span>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Tap & Earn</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>Every 3 taps = $0.005 · Daily cap $3.00</p>
          </div>
          <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 15 }}>${(profile?.tap_earned_today || 0).toFixed(3)}</span>
        </div>
        <div style={{ textAlign: "center", position: "relative", marginBottom: 14 }}>
          {tapPops.map(id => (
            <div key={id} style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#4ade80", fontWeight: "bold", fontSize: 18,
              animation: "coinPop 0.8s ease forwards",
              pointerEvents: "none", zIndex: 10,
            }}>+$0.005</div>
          ))}
          <button
            onClick={handleTap}
            disabled={tapCapReached}
            style={{
              width: 120, height: 120, borderRadius: "50%",
              background: tapCapReached
                ? "linear-gradient(135deg, #333, #222)"
                : "linear-gradient(135deg, #FFD700, #B8860B)",
              border: "none", fontSize: 44, cursor: tapCapReached ? "not-allowed" : "pointer",
              boxShadow: tapCapReached ? "none" : "0 8px 32px rgba(255,215,0,0.4)",
              transition: "transform 0.08s",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseDown={e => { if (!tapCapReached) e.currentTarget.style.transform = "scale(0.92)"; }}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => { if (!tapCapReached) e.currentTarget.style.transform = "scale(0.92)"; }}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
          >
            👆
          </button>
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textAlign: "center", margin: 0 }}>
          {tapCapReached ? "Daily tap limit reached. Come back tomorrow!" : `Tap count: ${tapCount} · Next reward in ${TAPS_PER_REWARD - (tapCount % TAPS_PER_REWARD)} taps`}
        </p>
      </Card>

      {/* Walk & Earn */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 24 }}>🚶</span>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Walk & Earn</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>$0.003 every 15 secs · 6am–6pm only</p>
          </div>
          <span style={{ color: walkAllowed ? "#4ade80" : "#f87171", fontWeight: "bold", fontSize: 13 }}>
            {walkAllowed ? "ACTIVE" : "CLOSED"}
          </span>
        </div>
        {walkActive && (
          <div style={{
            background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 14, textAlign: "center",
          }}>
            <span style={{ color: "#4ade80", fontWeight: "bold" }}>
              🟢 Walking... {walkSecs}s · +${(Math.floor(walkSecs / WALK_INTERVAL_SECS) * WALK_REWARD).toFixed(3)} earned this session
            </span>
          </div>
        )}
        <GoldButton
          onClick={toggleWalk}
          disabled={!walkAllowed}
          style={walkActive ? { background: "linear-gradient(135deg, #ef4444, #b91c1c)", color: "#fff" } : {}}
        >
          {!walkAllowed ? "⏰ Available 6am–6pm" : walkActive ? "⏹ Stop Walking" : "🚶 Start Walking — Earn Now"}
        </GoldButton>
      </Card>
    </div>
  );
}

// ============================================================
// REFERRAL TAB
// ============================================================
function ReferralTab({ profile, userId, onUpdate }) {
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.from("referrals").select("referee_id, profiles!referee_id(full_name, balance)")
      .eq("referrer_id", userId).then(({ data }) => { if (data) setReferrals(data); });
  }, [userId]);

  function copyCode() {
    navigator.clipboard.writeText(profile?.referral_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const msg = `🤑 I am making real money on Dollarbag IQ! Watch videos, tap and walk to earn cash daily. Join with my code *${profile?.referral_code}* and we BOTH get $2.00 instantly!\n\nDownload here: https://dollarbagiq.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  }

  return (
    <div style={{ padding: "24px 20px" }}>
      <h2 style={{ color: S.gold, fontSize: 22, fontWeight: "bold", margin: "0 0 6px" }}>Refer & Earn</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>
        Invite friends and you BOTH earn $2.00 instantly
      </p>

      {/* Referral Code Card */}
      <Card style={{ marginBottom: 16, textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "0 0 10px" }}>Your Unique Referral Code</p>
        <div style={{
          background: "#0a0a0a", borderRadius: 14, padding: "16px 20px",
          border: "1px dashed rgba(255,215,0,0.4)", marginBottom: 16,
          letterSpacing: 8, fontSize: 28, fontWeight: "900", color: S.gold,
        }}>
          {profile?.referral_code || "XXXXX"}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={copyCode} style={{
            flex: 1, background: copied ? "rgba(74,222,128,0.2)" : "rgba(255,215,0,0.1)",
            border: `1px solid ${copied ? "rgba(74,222,128,0.4)" : "rgba(255,215,0,0.3)"}`,
            borderRadius: 12, padding: "12px 0", color: copied ? "#4ade80" : S.gold,
            fontWeight: "bold", fontSize: 14, cursor: "pointer",
          }}>
            {copied ? "✅ Copied!" : "📋 Copy Code"}
          </button>
          <button onClick={shareWhatsApp} style={{
            flex: 1, background: "rgba(37,211,102,0.15)",
            border: "1px solid rgba(37,211,102,0.3)",
            borderRadius: 12, padding: "12px 0", color: "#25d366",
            fontWeight: "bold", fontSize: 14, cursor: "pointer",
          }}>
            📲 Share on WhatsApp
          </button>
        </div>
      </Card>

      {/* Earnings breakdown */}
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: S.gold, fontWeight: "bold", margin: "0 0 14px" }}>Your Referral Earnings</p>
        {[
          ["Total Referrals", profile?.total_referrals || 0],
          ["Referral Bonuses", `$${((profile?.total_referrals || 0) * REFERRAL_BONUS).toFixed(2)}`],
          ["Lifetime 10% Cut", `$${((profile?.referral_earnings || 0) - ((profile?.total_referrals || 0) * REFERRAL_BONUS)).toFixed(2)}`],
          ["Total Referral Income", `$${(profile?.referral_earnings || 0).toFixed(2)}`],
        ].map(([label, val]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10, marginBottom: 10,
          }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{label}</span>
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>{val}</span>
          </div>
        ))}
      </Card>

      {/* How it works */}
      <Card>
        <p style={{ color: S.gold, fontWeight: "bold", margin: "0 0 14px" }}>How Referral Works</p>
        {[
          ["1️⃣", "Share your unique code with friends and family"],
          ["2️⃣", "Your friend signs up using your referral code"],
          ["3️⃣", "You BOTH receive $2.00 in your wallets instantly"],
          ["4️⃣", "You earn 10% of everything they earn — forever"],
        ].map(([num, text]) => (
          <div key={num} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20 }}>{num}</span>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ============================================================
// WALLET TAB
// ============================================================
function WalletTab({ profile, userId, onUpdate }) {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [accountDetails, setAccountDetails] = useState("");
  const [accountName, setAccountName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [noReferralPopup, setNoReferralPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const balance = profile?.balance || 0;
  const country = AFRICAN_COUNTRIES.find(c => c.code === profile?.country_code);
  const localBalance = (balance * (country?.rate || 1)).toFixed(0);
  const canWithdraw = balance >= WITHDRAWAL_THRESHOLD;
  const showButton = balance >= WITHDRAWAL_SHOW;

  function handleWithdrawClick() {
    if (!canWithdraw) return;
    if (!profile?.total_referrals || profile.total_referrals === 0) {
      setNoReferralPopup(true);
      return;
    }
    setShowWithdraw(true);
  }

  async function submitWithdrawal() {
    if (!accountDetails || !accountName) return;
    setLoading(true);
    await supabase.from("withdrawals").insert({
      user_id: userId,
      amount: balance,
      account_details: accountDetails,
      account_name: accountName,
      country: profile?.country_name,
      status: "pending",
    });
    await supabase.from("profiles").update({ has_withdrawn: true }).eq("id", userId);
    setLoading(false);
    setSubmitted(true);
    onUpdate();
  }

  const inputStyle = {
    width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,215,0,0.2)",
    borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14,
    outline: "none", boxSizing: "border-box", marginBottom: 12,
    fontFamily: "'Trebuchet MS', sans-serif",
  };

  return (
    <div style={{ padding: "24px 20px" }}>
      <h2 style={{ color: S.gold, fontSize: 22, fontWeight: "bold", margin: "0 0 6px" }}>My Wallet</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>Your earnings and withdrawals</p>

      {/* Balance */}
      <div style={{
        background: "linear-gradient(135deg, #1a1200, #2a1f00)",
        border: "1px solid rgba(255,215,0,0.3)",
        borderRadius: 22, padding: "28px 24px", marginBottom: 20, textAlign: "center",
      }}>
        <p style={{ color: "rgba(255,215,0,0.6)", fontSize: 12, margin: "0 0 6px", letterSpacing: 2 }}>AVAILABLE BALANCE</p>
        <h1 style={{ fontSize: 52, fontWeight: "900", margin: "0 0 6px", color: S.gold }}>
          ${balance.toFixed(2)}
        </h1>
        {country && country.code !== "OT" && (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 16px" }}>
            ≈ {country.symbol}{Number(localBalance).toLocaleString()} {country.currency}
          </p>
        )}
        {/* Progress to threshold */}
        {!canWithdraw && (
          <>
            <div style={{ background: "#222", borderRadius: 8, height: 8, marginBottom: 8 }}>
              <div style={{
                background: "linear-gradient(90deg, #FFD700, #B8860B)",
                height: "100%", borderRadius: 8,
                width: `${Math.min((balance / WITHDRAWAL_THRESHOLD) * 100, 100)}%`,
                transition: "width 0.4s",
              }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>
              ${(WITHDRAWAL_THRESHOLD - balance).toFixed(2)} more to reach withdrawal threshold
            </p>
          </>
        )}
      </div>

      {/* Withdrawal button */}
      {showButton && (
        <div style={{ marginBottom: 20 }}>
          <GoldButton
            onClick={handleWithdrawClick}
            disabled={!canWithdraw}
            style={!canWithdraw ? { opacity: 0.5 } : {}}
          >
            {canWithdraw ? "💳 Withdraw My Earnings" : `🔒 Withdrawal unlocks at $${WITHDRAWAL_THRESHOLD}`}
          </GoldButton>
          {!canWithdraw && (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 8 }}>
              Keep earning! You need ${(WITHDRAWAL_THRESHOLD - balance).toFixed(2)} more.
            </p>
          )}
        </div>
      )}

      {/* Earnings breakdown */}
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: S.gold, fontWeight: "bold", margin: "0 0 14px" }}>Earnings Breakdown</p>
        {[
          ["🎬 Video Earnings", `$${((profile?.videos_watched_today || 0) * VIDEO_REWARD).toFixed(2)} today`],
          ["👆 Tap Earnings", `$${(profile?.tap_earned_today || 0).toFixed(2)} today`],
          ["👥 Referral Income", `$${(profile?.referral_earnings || 0).toFixed(2)} total`],
        ].map(([label, val]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10, marginBottom: 10,
          }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{label}</span>
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>{val}</span>
          </div>
        ))}
      </Card>

      {/* No Referral Popup */}
      {noReferralPopup && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 24,
        }}>
          <div style={{
            background: "linear-gradient(145deg, #1a1a1a, #111)",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: 22, padding: 28, maxWidth: 360, textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
            <h3 style={{ color: S.gold, fontSize: 20, margin: "0 0 14px" }}>One Last Step</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px" }}>
              You need to invite at least one friend before your first withdrawal. This helps us to maintain the Blockchain and reduce fraud. Don't worry, after this, we will not ask you to refer someone before withdrawal again. It only happens on your first withdrawal.
            </p>
            <GoldButton onClick={() => setNoReferralPopup(false)}>
              OK, I Will Invite a Friend
            </GoldButton>
          </div>
        </div>
      )}

      {/* Withdraw Form */}
      {showWithdraw && !submitted && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "linear-gradient(145deg, #1a1a1a, #111)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: "22px 22px 0 0", padding: 28, width: "100%", maxWidth: 430,
          }}>
            <h3 style={{ color: S.gold, fontSize: 20, margin: "0 0 6px" }}>Withdraw Earnings</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 20px" }}>
              Withdrawing ${balance.toFixed(2)} to your {profile?.country_name} account
            </p>
            <input style={inputStyle} placeholder="Account / Mobile Money Number" value={accountDetails}
              onChange={e => setAccountDetails(e.target.value)} />
            <input style={inputStyle} placeholder="Account Holder Full Name" value={accountName}
              onChange={e => setAccountName(e.target.value)} />
            <GoldButton onClick={submitWithdrawal} disabled={loading || !accountDetails || !accountName}>
              {loading ? "Submitting..." : "Submit Withdrawal Request"}
            </GoldButton>
            <button onClick={() => setShowWithdraw(false)} style={{
              width: "100%", background: "none", border: "none",
              color: "rgba(255,255,255,0.3)", marginTop: 12, cursor: "pointer", fontSize: 14,
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 24,
        }}>
          <div style={{
            background: "linear-gradient(145deg, #1a1a1a, #111)",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: 22, padding: 32, maxWidth: 360, textAlign: "center",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: "#4ade80", fontSize: 20, margin: "0 0 14px" }}>Request Submitted!</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px" }}>
              Thank you! Our team will carefully review your account. If there are no issues, you will receive your payment within 2 to 14 business days.
            </p>
            <GoldButton onClick={() => setSubmitted(false)}>Done</GoldButton>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ROOT
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) { setUser(data.session.user); setScreen("app"); }
    });
  }, []);

  return (
    <div style={S.app}>
      {screen === "landing" && (
        <LandingPage
          onLogin={() => setScreen("login")}
          onRegister={() => setScreen("register")}
        />
      )}
      {screen === "register" && (
        <AuthScreen mode="register" onSuccess={u => { setUser(u); setScreen("app"); }} onSwitch={() => setScreen("login")} />
      )}
      {screen === "login" && (
        <AuthScreen mode="login" onSuccess={u => { setUser(u); setScreen("app"); }} onSwitch={() => setScreen("register")} />
      )}
      {screen === "app" && user && <MainApp user={user} />}
    </div>
  );
}
