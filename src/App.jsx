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
const VIDEO_REWARD = 0.30;
const MAX_VIDEOS = 15;
const TAP_REWARD = 0.05;
const TAPS_PER_REWARD = 3;
const TAP_DAILY_CAP = 3.00;
const REFERRAL_BONUS = 2.00;
const REFERRAL_PERCENT = 0.10;
const WITHDRAWAL_THRESHOLD = 18.00;
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
  "Chiamaka_NG","Ebuka_NG","Uzoma_NG","Nneka_NG","Ikenna_NG","Obiakor_NG",
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
  "Adama_CI","Moussa_CI","Aminata_CI","Mariam_CI","Fatoumata_CI","Kadidja_CI",
  "Chukwuemeka_NG","Adaora_NG","Chukwuebuka_NG","Oluwaseun_NG","Oluwafemi_NG",
  "Oluwakemi_NG","Oluwatobiloba_NG","Oluwasegun_NG","Oluwabunmi_NG","Oluwatoyin_NG",
  "Kwabena_GH","Kwadwo_GH","Kwasi_GH","Kofi_GH","Kojo_GH","Kweku_GH","Kwame_GH",
  "Abioye_NG","Adegoke_NG","Adeniyi_NG","Adeola_NG","Aderonke_NG","Adetola_NG",
  "Adetunde_NG","Adewunmi_NG","Adeyemi_NG","Adeyinka_NG","Adisa_NG","Afolabi_NG",
  "Samuel_KE","Joseph_KE","Peter_KE","Paul_KE","James_KE","John_KE","Mark_KE",
  "Luke_KE","Matthew_KE","Stephen_KE","Philip_KE","Andrew_KE","Thomas_KE",
  "Okonkwo_NG","Okafor_NG","Okeke_NG","Obi_NG","Eze_NG","Nwosu_NG","Agu_NG",
  "Nwachukwu_NG","Igwe_NG","Onwudiwe_NG","Oduya_NG","Odunayo_NG","Odunola_NG",
];

const POPUP_AMOUNTS = [12,15,18,22,25,27,30,33,35,39,42,45,47,50,55,60,65,70,75,80,85,90,95,100,110,120];

function generateReferralCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getRandomPopup() {
  const name = POPUP_NAMES[Math.floor(Math.random() * POPUP_NAMES.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  const amount = POPUP_AMOUNTS[Math.floor(Math.random() * POPUP_AMOUNTS.length)];
  const decimals = [".00", ".50", ".25", ".75", ".30", ".80"];
  const dec = decimals[Math.floor(Math.random() * decimals.length)];
  return { username: `${name}${num}`, amount: `${amount}${dec}` };
}

function formatAmount(usd, country, showLocal) {
  if (!showLocal || !country || country.code === "OT") return `$${usd.toFixed(2)}`;
  const local = usd * country.rate;
  return `${country.symbol}${local.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

// ============================================================
// GLOBAL STYLES
// ============================================================
const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; }
  @keyframes slideUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes coinPop {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-70px) scale(1.5); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.2); }
    50% { box-shadow: 0 0 40px rgba(255,215,0,0.5); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const GOLD = "#FFD700";

// ============================================================
// REUSABLE COMPONENTS
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
        background: disabled ? "linear-gradient(135deg,#333,#222)" : "linear-gradient(135deg,#FFD700,#B8860B)",
        color: disabled ? "#666" : "#000",
        border: "none", borderRadius: 14,
        padding: "15px 0", fontSize: 15, fontWeight: "bold",
        cursor: disabled ? "not-allowed" : "pointer", width: "100%",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "all 0.15s",
        boxShadow: disabled ? "none" : "0 6px 24px rgba(255,215,0,0.3)",
        letterSpacing: 0.5, fontFamily: "'Trebuchet MS', sans-serif",
        ...style,
      }}
    >{children}</button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "linear-gradient(145deg,#1a1a1a,#111)",
      border: "1px solid rgba(255,215,0,0.12)",
      borderRadius: 18, padding: 20, ...style,
    }}>{children}</div>
  );
}

// ============================================================
// LIVE EARNINGS POPUP — shows for everyone
// ============================================================
function LivePopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    setPopup(getRandomPopup());
    setVisible(true);
    setTimeout(() => setVisible(false), 4000);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(show, 2000);
    const interval = setInterval(show, 4 * 60 * 1000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  if (!visible || !popup) return null;

  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(135deg,#1a1a1a,#222)",
      border: "1px solid rgba(255,215,0,0.35)",
      borderRadius: 50, padding: "10px 18px",
      display: "flex", alignItems: "center", gap: 8,
      zIndex: 9999, animation: "slideUp 0.4s ease",
      boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
      whiteSpace: "nowrap", maxWidth: "90vw",
    }}>
      <span style={{ fontSize: 18 }}>💰</span>
      <span style={{ fontSize: 12, color: "#ccc" }}>
        <span style={{ color: GOLD, fontWeight: "bold" }}>{popup.username}</span>
        {" just received "}
        <span style={{ color: "#4ade80", fontWeight: "bold" }}>${popup.amount}</span>
        {"! 🎉"}
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
      icon: "🎬", title: "Watch Videos & Get Paid",
      desc: "This is not a joke — every single video you watch on Dollarbag IQ puts real money into your account. Advertisers pay us to show you videos, and we pass that money directly to you. No skills needed. No experience required. Just press play, watch the video to the end, and the cash lands in your wallet. You can watch up to 15 videos every single day — that is $4.50 daily just from watching alone.",
    },
    {
      icon: "👆", title: "Tap Your Screen & Get Paid",
      desc: "Yes, we are serious. Every time you tap a button on your screen, you earn money. Every 3 taps earns you $0.05. Keep tapping and watch your balance grow. People are earning up to $3.00 every single day just from tapping their phone. You can do it while watching TV, sitting in traffic, or relaxing at home. Your finger is a money-making machine on Dollarbag IQ.",
    },
    {
      icon: "👥", title: "Refer Friends & Both Get Paid",
      desc: "Here is where it gets really exciting. Share your unique referral code with a friend. The moment they sign up using your code, you BOTH receive $2.00 instantly — just for joining. But it does not stop there. You continue to earn 10% of everything your friend earns on Dollarbag IQ — for life. The more people you invite, the more passive income you earn without doing anything extra.",
    },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'Trebuchet MS', sans-serif" }}>
      <LivePopup />
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg,#1a1200 0%,#0a0a0a 60%)",
        padding: "50px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,215,0,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 60, marginBottom: 8 }}>💰</div>
        <h1 style={{
          fontSize: 34, fontWeight: "900", margin: "0 0 8px",
          background: "linear-gradient(90deg,#FFD700,#FFF8DC,#FFD700)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1,
        }}>DOLLARBAG IQ</h1>
        <p style={{ color: "rgba(255,215,0,0.7)", fontSize: 13, marginBottom: 16, letterSpacing: 2 }}>
          WATCH · TAP · EARN REAL MONEY
        </p>
        <p style={{
          color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75,
          maxWidth: 360, margin: "0 auto 24px",
        }}>
          Dollarbag IQ is the leading platform that pays you <strong style={{ color: GOLD }}>real money</strong> just for watching videos and completing simple tasks. We earn from advertisers and share the revenue directly with you.
        </p>
        <div style={{ display: "flex", gap: 12, maxWidth: 360, margin: "0 auto 16px" }}>
          <GoldButton onClick={onRegister} style={{ flex: 1 }}>Create Free Account</GoldButton>
          <button onClick={onLogin} style={{
            flex: 1, background: "transparent", color: GOLD,
            border: `1px solid ${GOLD}`, borderRadius: 14,
            padding: "15px 0", fontSize: 15, fontWeight: "bold", cursor: "pointer",
            fontFamily: "'Trebuchet MS', sans-serif",
          }}>Log In</button>
        </div>
        <p style={{ color: "#4ade80", fontSize: 13 }}>
          🔥 Users earn up to <strong>$4.00+ daily</strong> from watching and tapping
        </p>
      </div>

      {/* Features */}
      <div style={{ padding: "20px 20px 40px" }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: "linear-gradient(145deg,#151515,#0f0f0f)",
            border: "1px solid rgba(255,215,0,0.1)",
            borderRadius: 18, padding: 22, marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>{f.icon}</div>
              <h3 style={{ color: GOLD, fontSize: 15, fontWeight: "bold" }}>{f.title}</h3>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.75 }}>{f.desc}</p>
          </div>
        ))}

        {/* Earning Summary */}
        <div style={{
          background: "linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02))",
          border: "1px solid rgba(255,215,0,0.25)", borderRadius: 18, padding: 22, marginBottom: 24,
        }}>
          <p style={{ color: GOLD, fontWeight: "bold", fontSize: 15, marginBottom: 14, textAlign: "center" }}>
            💵 Your Daily Earning Potential
          </p>
          {[
            ["🎬 Watch 15 Videos", "$4.50"],
            ["👆 Tap to Earn (daily cap)", "$3.00"],
            ["👥 Referral Bonuses", "Unlimited"],
          ].map(([label, val]) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 10, marginBottom: 10,
            }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{label}</span>
              <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 13 }}>{val}</span>
            </div>
          ))}
          <p style={{ color: GOLD, fontWeight: "bold", fontSize: 17, textAlign: "center", marginTop: 8 }}>
            Minimum $4.00+ every single day 🚀
          </p>
        </div>

        <GoldButton onClick={onRegister}>Start Earning Now — It Is Free</GoldButton>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 12 }}>
          Already have an account?{" "}
          <span onClick={onLogin} style={{ color: GOLD, cursor: "pointer" }}>Log In here</span>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// AUTH SCREEN
// ============================================================
function AuthScreen({ mode, onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [referralInput, setReferralInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const inputStyle = {
    width: "100%", background: "#1a1a1a",
    border: "1px solid rgba(255,215,0,0.2)", borderRadius: 12,
    padding: "14px 16px", color: "#fff", fontSize: 14, outline: "none",
    fontFamily: "'Trebuchet MS', sans-serif",
  };

  async function handleSubmit() {
    setError(""); setInfo("");
    if (!email || !password) return setError("Please fill in your email and password.");
    if (mode === "register" && (!fullName || !country)) return setError("Please fill in all fields including your country.");
    setLoading(true);

    try {
      if (mode === "register") {
        // 1. Sign up with Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;

        const userId = data?.user?.id;
        if (!userId) throw new Error("Registration failed. Please try again.");

        const countryObj = AFRICAN_COUNTRIES.find(c => c.code === country);
        const myCode = generateReferralCode();

        // 2. Create profile immediately
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: userId,
          full_name: fullName.trim(),
          email: email.trim(),
          country_code: country,
          country_name: countryObj?.name || "Other",
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

        if (profileError) {
          console.error("Profile error:", profileError);
          throw new Error("Account created but profile setup failed. Please log in.");
        }

        // 3. Handle referral bonus
        if (referralInput.trim().length === 5) {
          const code = referralInput.trim().toUpperCase();
          const { data: referrer } = await supabase
            .from("profiles").select("id,balance,total_referrals,referral_earnings")
            .eq("referral_code", code).single();

          if (referrer && referrer.id !== userId) {
            // Give referrer $2
            await supabase.from("profiles").update({
              balance: Number((referrer.balance || 0) + REFERRAL_BONUS).toFixed(4),
              total_referrals: (referrer.total_referrals || 0) + 1,
              referral_earnings: Number((referrer.referral_earnings || 0) + REFERRAL_BONUS).toFixed(4),
            }).eq("id", referrer.id);

            // Give new user $2
            await supabase.from("profiles").update({
              balance: REFERRAL_BONUS,
              referred_by: referrer.id,
            }).eq("id", userId);

            // Log referral
            await supabase.from("referrals").insert({
              referrer_id: referrer.id,
              referee_id: userId,
            });
          }
        }

        setInfo("Account created! Please check your email and click the verification link from Supabase, then log in.");
        setLoading(false);
        setTimeout(() => onSwitch(), 3000);

      } else {
        // LOGIN
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(), password,
        });
        if (loginError) {
          if (loginError.message.includes("Email not confirmed")) {
            setError("Please check your email inbox and click the verification link sent by Supabase before logging in.");
          } else {
            throw loginError;
          }
          setLoading(false);
          return;
        }
        onSuccess(data.user);
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      padding: "40px 24px", fontFamily: "'Trebuchet MS', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>💰</div>
        <h2 style={{
          fontSize: 26, fontWeight: "900", margin: 0,
          background: "linear-gradient(90deg,#FFD700,#FFF8DC)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>DOLLARBAG IQ</h2>
        <p style={{ color: "rgba(255,215,0,0.6)", marginTop: 6, fontSize: 13 }}>
          {mode === "register" ? "Create your free account and start earning" : "Welcome back — log in to your account"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
            <input style={inputStyle} placeholder="Referral Code (optional — get $2 bonus)"
              value={referralInput} onChange={e => setReferralInput(e.target.value.toUpperCase())} maxLength={5} />
          </>
        )}

        {mode === "login" && (
          <div style={{
            background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: 12, padding: "12px 14px",
          }}>
            <p style={{ color: "rgba(255,215,0,0.8)", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
              📧 Please check your email inbox and click the verification link sent by Supabase before logging in. Check your spam folder if you cannot find it.
            </p>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}
        {info && (
          <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ color: "#4ade80", fontSize: 13, margin: 0 }}>{info}</p>
          </div>
        )}

        <GoldButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : mode === "register" ? "Create Account — Start Earning Free" : "Log In to My Account"}
        </GoldButton>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
          {mode === "register" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={onSwitch} style={{ color: GOLD, cursor: "pointer", fontWeight: "bold" }}>
            {mode === "register" ? "Log In" : "Sign Up Free"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function MainApp({ user }) {
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocal, setShowLocal] = useState(true);

  const country = AFRICAN_COUNTRIES.find(c => c.code === profile?.country_code) || AFRICAN_COUNTRIES[AFRICAN_COUNTRIES.length - 1];

  async function fetchProfile() {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error) {
      console.error("Fetch profile error:", error);
      // Try to create profile if missing
      const countryObj = AFRICAN_COUNTRIES[0];
      const myCode = generateReferralCode();
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email,
        country_code: "NG",
        country_name: countryObj.name,
        currency_symbol: countryObj.symbol,
        currency_rate: countryObj.rate,
        referral_code: myCode,
        balance: 0,
        tap_earned_today: 0,
        videos_watched_today: 0,
        last_reset_date: new Date().toISOString().split("T")[0],
        total_referrals: 0,
        referral_earnings: 0,
        has_withdrawn: false,
      });
      const { data: retryData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (retryData) {
        await checkDailyReset(retryData);
        setProfile(retryData);
      }
    } else if (data) {
      await checkDailyReset(data);
    }
    setLoading(false);
  }

  async function checkDailyReset(data) {
    const today = new Date().toISOString().split("T")[0];
    if (data.last_reset_date !== today) {
      const { data: updated } = await supabase.from("profiles").update({
        tap_earned_today: 0,
        videos_watched_today: 0,
        last_reset_date: today,
      }).eq("id", user.id).select().single();
      setProfile(updated || { ...data, tap_earned_today: 0, videos_watched_today: 0, last_reset_date: today });
    } else {
      setProfile(data);
    }
  }

  useEffect(() => { fetchProfile(); }, []);

  function updateProfileLocally(updates) {
    setProfile(prev => ({ ...prev, ...updates }));
  }

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ fontSize: 56, marginBottom: 16, animation: "pulse 1.5s ease infinite" }}>💰</div>
      <p style={{ color: GOLD, fontSize: 16, fontFamily: "'Trebuchet MS', sans-serif" }}>Loading your wallet...</p>
    </div>
  );

  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "earn", icon: "💵", label: "Earn" },
    { id: "referral", icon: "👥", label: "Refer" },
    { id: "wallet", icon: "💳", label: "Wallet" },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingBottom: 80, fontFamily: "'Trebuchet MS', sans-serif" }}>
      <LivePopup />
      {tab === "home" && <HomeTab profile={profile} country={country} showLocal={showLocal} setShowLocal={setShowLocal} onEarn={() => setTab("earn")} onRefer={() => setTab("referral")} />}
      {tab === "earn" && <EarnTab profile={profile} userId={user.id} country={country} showLocal={showLocal} onUpdate={fetchProfile} updateLocal={updateProfileLocally} />}
      {tab === "referral" && <ReferralTab profile={profile} userId={user.id} country={country} showLocal={showLocal} />}
      {tab === "wallet" && <WalletTab profile={profile} userId={user.id} country={country} showLocal={showLocal} onUpdate={fetchProfile} />}

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "#0f0f0f", borderTop: "1px solid rgba(255,215,0,0.12)",
        display: "flex", padding: "8px 0", zIndex: 100,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0",
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? GOLD : "rgba(255,255,255,0.35)", fontWeight: tab === t.id ? "bold" : "normal", fontFamily: "'Trebuchet MS', sans-serif" }}>
              {t.label}
            </span>
            {tab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HOME TAB
// ============================================================
function HomeTab({ profile, country, showLocal, setShowLocal, onEarn, onRefer }) {
  const bal = profile?.balance || 0;

  return (
    <div style={{ padding: "24px 20px", color: "#fff" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 2 }}>Welcome back,</p>
          <h2 style={{ color: GOLD, fontSize: 20, fontWeight: "bold" }}>
            {profile?.full_name?.split(" ")[0] || "Friend"} 👋
          </h2>
        </div>
        <div style={{ fontSize: 34 }}>💰</div>
      </div>

      {/* Balance Card */}
      <div style={{
        background: "linear-gradient(135deg,#1a1200,#2a1f00)",
        border: "1px solid rgba(255,215,0,0.3)",
        borderRadius: 22, padding: "26px 22px", marginBottom: 16,
        textAlign: "center", animation: "glow 3s ease infinite",
      }}>
        <p style={{ color: "rgba(255,215,0,0.5)", fontSize: 11, letterSpacing: 2, marginBottom: 6 }}>TOTAL BALANCE</p>

        {/* Currency Switch */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <button onClick={() => setShowLocal(!showLocal)} style={{
            background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)",
            borderRadius: 20, padding: "4px 14px", color: GOLD, fontSize: 11,
            cursor: "pointer", fontFamily: "'Trebuchet MS', sans-serif",
          }}>
            {showLocal && country.code !== "OT" ? `Switch to USD` : `Switch to ${country.currency || "Local"}`}
          </button>
        </div>

        <h1 style={{ fontSize: 48, fontWeight: "900", color: GOLD, marginBottom: 4 }}>
          {showLocal && country.code !== "OT"
            ? `${country.symbol}${Math.floor(bal * country.rate).toLocaleString()}`
            : `$${bal.toFixed(2)}`}
        </h1>
        {showLocal && country.code !== "OT" && (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>≈ ${bal.toFixed(2)} USD</p>
        )}
        {(!showLocal || country.code === "OT") && country.code !== "OT" && (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            ≈ {country.symbol}{Math.floor(bal * country.rate).toLocaleString()} {country.currency}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { icon: "🎬", label: "Videos Today", val: `${profile?.videos_watched_today || 0}/${MAX_VIDEOS}` },
          { icon: "👥", label: "My Referrals", val: profile?.total_referrals || 0 },
          { icon: "👆", label: "Tap Earned Today", val: formatAmount(profile?.tap_earned_today || 0, country, showLocal) },
          { icon: "💸", label: "Referral Income", val: formatAmount(profile?.referral_earnings || 0, country, showLocal) },
        ].map(item => (
          <Card key={item.label} style={{ textAlign: "center", padding: 14 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ color: GOLD, fontWeight: "bold", fontSize: 17 }}>{item.val}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginTop: 3 }}>{item.label}</div>
          </Card>
        ))}
      </div>

      <GoldButton onClick={onEarn} style={{ marginBottom: 12 }}>🎬 Start Earning Now</GoldButton>
      <button onClick={onRefer} style={{
        width: "100%", background: "transparent",
        border: "1px solid rgba(255,215,0,0.25)", borderRadius: 14,
        padding: "14px 0", color: GOLD, fontSize: 14,
        fontWeight: "bold", cursor: "pointer", fontFamily: "'Trebuchet MS', sans-serif",
      }}>
        👥 Invite Friends — You Both Earn {formatAmount(REFERRAL_BONUS, country, showLocal)}
      </button>
    </div>
  );
}

// ============================================================
// EARN TAB
// ============================================================
function EarnTab({ profile, userId, country, showLocal, onUpdate, updateLocal }) {
  const [tapCount, setTapCount] = useState(0);
  const [tapPops, setTapPops] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "info" });

  function showMsg(text, type = "info") {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "info" }), 3000);
  }

  // ---- TAP ----
  async function handleTap() {
    const tapToday = profile?.tap_earned_today || 0;
    if (tapToday >= TAP_DAILY_CAP) {
      return showMsg("You have reached the $3.00 daily tap limit. Come back tomorrow!", "warn");
    }
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount % TAPS_PER_REWARD === 0) {
      const id = Date.now();
      setTapPops(p => [...p, id]);
      setTimeout(() => setTapPops(p => p.filter(x => x !== id)), 900);

      const newBal = Number(((profile?.balance || 0) + TAP_REWARD).toFixed(4));
      const newTapToday = Number(Math.min((tapToday + TAP_REWARD), TAP_DAILY_CAP).toFixed(4));

      // Update locally immediately
      updateLocal({ balance: newBal, tap_earned_today: newTapToday });

      // Save to Supabase in background
      supabase.from("profiles").update({
        balance: newBal,
        tap_earned_today: newTapToday,
      }).eq("id", userId).then(async ({ error }) => {
        if (error) console.error("Tap save error:", error);
        // Give 10% to referrer
        if (profile?.referred_by) {
          const { data: ref } = await supabase.from("profiles")
            .select("balance,referral_earnings").eq("id", profile.referred_by).single();
          if (ref) {
            await supabase.from("profiles").update({
              balance: Number((ref.balance || 0) + TAP_REWARD * REFERRAL_PERCENT).toFixed(4),
              referral_earnings: Number((ref.referral_earnings || 0) + TAP_REWARD * REFERRAL_PERCENT).toFixed(4),
            }).eq("id", profile.referred_by);
          }
        }
      });
    }
  }

  // ---- VIDEO ----
  async function handleWatchVideo() {
    if ((profile?.videos_watched_today || 0) >= MAX_VIDEOS) {
      return showMsg("You have watched all 15 videos for today. Come back tomorrow!", "warn");
    }
    setVideoLoading(true);
    await new Promise(r => setTimeout(r, 3500));
    setVideoLoading(false);

    const newWatched = (profile?.videos_watched_today || 0) + 1;
    const newBal = Number(((profile?.balance || 0) + VIDEO_REWARD).toFixed(4));

    updateLocal({ balance: newBal, videos_watched_today: newWatched });

    await supabase.from("profiles").update({
      balance: newBal,
      videos_watched_today: newWatched,
    }).eq("id", userId);

    if (profile?.referred_by) {
      const { data: ref } = await supabase.from("profiles")
        .select("balance,referral_earnings").eq("id", profile.referred_by).single();
      if (ref) {
        await supabase.from("profiles").update({
          balance: Number((ref.balance || 0) + VIDEO_REWARD * REFERRAL_PERCENT).toFixed(4),
          referral_earnings: Number((ref.referral_earnings || 0) + VIDEO_REWARD * REFERRAL_PERCENT).toFixed(4),
        }).eq("id", profile.referred_by);
      }
    }

    showMsg(`+${formatAmount(VIDEO_REWARD, country, showLocal)} added to your wallet! 🎉`, "success");
  }

  const videosLeft = MAX_VIDEOS - (profile?.videos_watched_today || 0);
  const tapCapReached = (profile?.tap_earned_today || 0) >= TAP_DAILY_CAP;

  return (
    <div style={{ padding: "24px 20px", color: "#fff" }}>
      <h2 style={{ color: GOLD, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>Earn Money</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>2 ways to earn real cash right now</p>

      {msg.text && (
        <div style={{
          background: msg.type === "success" ? "rgba(74,222,128,0.1)" : msg.type === "warn" ? "rgba(251,191,36,0.1)" : "rgba(255,215,0,0.1)",
          border: `1px solid ${msg.type === "success" ? "rgba(74,222,128,0.3)" : msg.type === "warn" ? "rgba(251,191,36,0.3)" : "rgba(255,215,0,0.3)"}`,
          borderRadius: 12, padding: "12px 16px", marginBottom: 16,
          color: msg.type === "success" ? "#4ade80" : msg.type === "warn" ? "#fbbf24" : GOLD,
          fontSize: 13, textAlign: "center",
        }}>{msg.text}</div>
      )}

      {/* Watch & Earn */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>🎬</span>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Watch & Earn</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              {formatAmount(VIDEO_REWARD, country, showLocal)} per video · {videosLeft} videos left today
            </p>
          </div>
          <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 14 }}>{formatAmount(VIDEO_REWARD, country, showLocal)}</span>
        </div>
        <div style={{ background: "#222", borderRadius: 6, height: 5, marginBottom: 14 }}>
          <div style={{
            background: "linear-gradient(90deg,#FFD700,#B8860B)", height: "100%", borderRadius: 6,
            width: `${((profile?.videos_watched_today || 0) / MAX_VIDEOS) * 100}%`, transition: "width 0.4s",
          }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, textAlign: "center", marginBottom: 14 }}>
          {profile?.videos_watched_today || 0}/{MAX_VIDEOS} watched today
        </p>
        <GoldButton onClick={handleWatchVideo} disabled={videoLoading || videosLeft === 0}>
          {videoLoading ? "⏳ Loading Video Ad..." : videosLeft === 0 ? "✅ All Done for Today!" : `▶ Watch Video — Earn ${formatAmount(VIDEO_REWARD, country, showLocal)}`}
        </GoldButton>
      </Card>

      {/* Tap & Earn */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>👆</span>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Tap & Earn</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              Every 3 taps = {formatAmount(TAP_REWARD, country, showLocal)} · Daily cap {formatAmount(TAP_DAILY_CAP, country, showLocal)}
            </p>
          </div>
          <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 14 }}>
            {formatAmount(profile?.tap_earned_today || 0, country, showLocal)}
          </span>
        </div>

        <div style={{ textAlign: "center", position: "relative", padding: "10px 0 16px" }}>
          {tapPops.map(id => (
            <div key={id} style={{
              position: "absolute", top: "30%", left: "50%",
              transform: "translate(-50%,-50%)",
              color: "#4ade80", fontWeight: "bold", fontSize: 20,
              animation: "coinPop 0.9s ease forwards",
              pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap",
            }}>+{formatAmount(TAP_REWARD, country, showLocal)}</div>
          ))}
          <button
            onClick={handleTap}
            disabled={tapCapReached}
            style={{
              width: 130, height: 130, borderRadius: "50%",
              background: tapCapReached
                ? "linear-gradient(135deg,#2a2a2a,#1a1a1a)"
                : "linear-gradient(135deg,#FFD700,#B8860B)",
              border: "none", fontSize: 48, cursor: tapCapReached ? "not-allowed" : "pointer",
              boxShadow: tapCapReached ? "none" : "0 10px 40px rgba(255,215,0,0.4)",
              transition: "transform 0.08s", display: "inline-flex",
              alignItems: "center", justifyContent: "center",
            }}
            onMouseDown={e => { if (!tapCapReached) e.currentTarget.style.transform = "scale(0.91)"; }}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => { if (!tapCapReached) e.currentTarget.style.transform = "scale(0.91)"; }}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
          >👆</button>
        </div>

        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center" }}>
          {tapCapReached
            ? "Daily tap limit reached. Come back tomorrow!"
            : `Tap count: ${tapCount} · Next reward in ${TAPS_PER_REWARD - (tapCount % TAPS_PER_REWARD)} taps`}
        </p>
      </Card>
    </div>
  );
}

// ============================================================
// REFERRAL TAB
// ============================================================
function ReferralTab({ profile, userId, country, showLocal }) {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    supabase.from("referrals")
      .select("referee_id, created_at")
      .eq("referrer_id", userId)
      .then(({ data }) => { if (data) setReferrals(data); });
  }, [userId]);

  function copyCode() {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function shareWhatsApp() {
    const amount = formatAmount(REFERRAL_BONUS, country, showLocal);
    const msg = `🤑 I am making real money on Dollarbag IQ!\n\nWatch videos, tap your screen and earn real cash daily. Join with my code *${profile?.referral_code}* and we BOTH get ${amount} instantly!\n\nJoin here 👉 https://dollarbag-iq-rho.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  }

  return (
    <div style={{ padding: "24px 20px", color: "#fff" }}>
      <h2 style={{ color: GOLD, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>Refer & Earn</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>
        Invite friends and you BOTH earn {formatAmount(REFERRAL_BONUS, country, showLocal)} instantly
      </p>

      {/* Code Card */}
      <Card style={{ marginBottom: 16, textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 10 }}>Your Unique Referral Code</p>
        <div style={{
          background: "#0a0a0a", borderRadius: 14, padding: "18px 20px",
          border: "1px dashed rgba(255,215,0,0.4)", marginBottom: 16,
          letterSpacing: 10, fontSize: 30, fontWeight: "900", color: GOLD,
        }}>
          {profile?.referral_code || "------"}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={copyCode} style={{
            flex: 1, background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,215,0,0.1)",
            border: `1px solid ${copied ? "rgba(74,222,128,0.4)" : "rgba(255,215,0,0.3)"}`,
            borderRadius: 12, padding: "12px 0",
            color: copied ? "#4ade80" : GOLD,
            fontWeight: "bold", fontSize: 13, cursor: "pointer", fontFamily: "'Trebuchet MS', sans-serif",
          }}>
            {copied ? "✅ Copied!" : "📋 Copy Code"}
          </button>
          <button onClick={shareWhatsApp} style={{
            flex: 1, background: "rgba(37,211,102,0.12)",
            border: "1px solid rgba(37,211,102,0.3)",
            borderRadius: 12, padding: "12px 0", color: "#25d366",
            fontWeight: "bold", fontSize: 13, cursor: "pointer", fontFamily: "'Trebuchet MS', sans-serif",
          }}>
            📲 WhatsApp
          </button>
        </div>
      </Card>

      {/* Stats */}
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: GOLD, fontWeight: "bold", marginBottom: 14 }}>Your Referral Earnings</p>
        {[
          ["Total People Referred", profile?.total_referrals || 0],
          ["Referral Bonuses Earned", formatAmount((profile?.total_referrals || 0) * REFERRAL_BONUS, country, showLocal)],
          ["10% Lifetime Commission", formatAmount(Math.max(0, (profile?.referral_earnings || 0) - ((profile?.total_referrals || 0) * REFERRAL_BONUS)), country, showLocal)],
          ["Total Referral Income", formatAmount(profile?.referral_earnings || 0, country, showLocal)],
        ].map(([label, val]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 10, marginBottom: 10,
          }}>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{label}</span>
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>{val}</span>
          </div>
        ))}
      </Card>

      {/* How it works */}
      <Card>
        <p style={{ color: GOLD, fontWeight: "bold", marginBottom: 14 }}>How It Works</p>
        {[
          ["1️⃣", `Share your code with friends and family`],
          ["2️⃣", `Your friend signs up using your referral code`],
          ["3️⃣", `You BOTH receive ${formatAmount(REFERRAL_BONUS, country, showLocal)} in your wallets instantly`],
          ["4️⃣", `You earn 10% of everything they earn — forever`],
        ].map(([num, text]) => (
          <div key={num} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18 }}>{num}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ============================================================
// WALLET TAB
// ============================================================
function WalletTab({ profile, userId, country, showLocal, onUpdate }) {
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [noReferralPopup, setNoReferralPopup] = useState(false);
  const [accountDetails, setAccountDetails] = useState("");
  const [accountName, setAccountName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const balance = profile?.balance || 0;
  const canWithdraw = balance >= WITHDRAWAL_THRESHOLD;
  const showButton = balance >= WITHDRAWAL_SHOW;

  function handleWithdrawClick() {
    if (!canWithdraw) return;
    if (!profile?.total_referrals || profile.total_referrals < 1) {
      setNoReferralPopup(true);
      return;
    }
    setShowWithdrawForm(true);
  }

  async function submitWithdrawal() {
    if (!accountDetails.trim() || !accountName.trim()) return;
    setLoading(true);
    await supabase.from("withdrawals").insert({
      user_id: userId,
      amount: balance,
      account_details: accountDetails.trim(),
      account_name: accountName.trim(),
      country: profile?.country_name || "Unknown",
      status: "pending",
    });
    await supabase.from("profiles").update({ has_withdrawn: true }).eq("id", userId);
    setLoading(false);
    setSubmitted(true);
    onUpdate();
  }

  const inputStyle = {
    width: "100%", background: "#1a1a1a",
    border: "1px solid rgba(255,215,0,0.2)", borderRadius: 12,
    padding: "14px 16px", color: "#fff", fontSize: 14, outline: "none",
    marginBottom: 12, fontFamily: "'Trebuchet MS', sans-serif",
  };

  const thresholdLocal = formatAmount(WITHDRAWAL_THRESHOLD, country, showLocal);
  const balanceDisplay = showLocal && country.code !== "OT"
    ? `${country.symbol}${Math.floor(balance * country.rate).toLocaleString()}`
    : `$${balance.toFixed(2)}`;

  return (
    <div style={{ padding: "24px 20px", color: "#fff" }}>
      <h2 style={{ color: GOLD, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>My Wallet</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>Your earnings and withdrawals</p>

      {/* Balance */}
      <div style={{
        background: "linear-gradient(135deg,#1a1200,#2a1f00)",
        border: "1px solid rgba(255,215,0,0.3)",
        borderRadius: 22, padding: "28px 24px", marginBottom: 20, textAlign: "center",
      }}>
        <p style={{ color: "rgba(255,215,0,0.5)", fontSize: 11, letterSpacing: 2, marginBottom: 6 }}>AVAILABLE BALANCE</p>
        <h1 style={{ fontSize: 50, fontWeight: "900", color: GOLD, marginBottom: 4 }}>{balanceDisplay}</h1>
        {showLocal && country.code !== "OT" && (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 16 }}>≈ ${balance.toFixed(2)} USD</p>
        )}

        {/* Progress bar */}
        {!canWithdraw && (
          <>
            <div style={{ background: "#1a1a1a", borderRadius: 8, height: 6, marginBottom: 8, marginTop: 10 }}>
              <div style={{
                background: "linear-gradient(90deg,#FFD700,#B8860B)",
                height: "100%", borderRadius: 8,
                width: `${Math.min((balance / WITHDRAWAL_THRESHOLD) * 100, 100)}%`,
                transition: "width 0.5s",
              }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
              {formatAmount(WITHDRAWAL_THRESHOLD - balance, country, showLocal)} more needed to withdraw
            </p>
          </>
        )}
      </div>

      {/* Withdraw Button */}
      {showButton && (
        <div style={{ marginBottom: 20 }}>
          <GoldButton onClick={handleWithdrawClick} disabled={!canWithdraw}>
            {canWithdraw ? "💳 Withdraw My Earnings" : `🔒 Withdrawal unlocks at ${thresholdLocal}`}
          </GoldButton>
          {!canWithdraw && (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 8 }}>
              Keep earning! You need {formatAmount(WITHDRAWAL_THRESHOLD - balance, country, showLocal)} more.
            </p>
          )}
        </div>
      )}

      {/* Earnings Breakdown */}
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: GOLD, fontWeight: "bold", marginBottom: 14 }}>Earnings Breakdown</p>
        {[
          ["🎬 Video Earnings Today", formatAmount((profile?.videos_watched_today || 0) * VIDEO_REWARD, country, showLocal)],
          ["👆 Tap Earnings Today", formatAmount(profile?.tap_earned_today || 0, country, showLocal)],
          ["👥 Total Referral Income", formatAmount(profile?.referral_earnings || 0, country, showLocal)],
          ["💰 Total Balance", balanceDisplay],
        ].map(([label, val]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 10, marginBottom: 10,
          }}>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{label}</span>
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>{val}</span>
          </div>
        ))}
      </Card>

      {/* No Referral Popup */}
      {noReferralPopup && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 24,
        }}>
          <div style={{
            background: "linear-gradient(145deg,#1a1a1a,#111)",
            border: "1px solid rgba(255,215,0,0.25)",
            borderRadius: 22, padding: 28, maxWidth: 350, textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🔗</div>
            <h3 style={{ color: GOLD, fontSize: 19, marginBottom: 14 }}>One Last Step</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.8, marginBottom: 22 }}>
              You need to invite at least one friend before your first withdrawal. This helps us to maintain the Blockchain and reduce fraud. Don't worry, after this, we will not ask you to refer someone before withdrawal again. It only happens on your first withdrawal.
            </p>
            <GoldButton onClick={() => setNoReferralPopup(false)}>OK, I Will Invite a Friend</GoldButton>
          </div>
        </div>
      )}

      {/* Withdraw Form */}
      {showWithdrawForm && !submitted && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            background: "linear-gradient(145deg,#1a1a1a,#111)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: "22px 22px 0 0", padding: 28, width: "100%", maxWidth: 430,
          }}>
            <h3 style={{ color: GOLD, fontSize: 20, marginBottom: 6 }}>Withdraw Earnings</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>
              Withdrawing {balanceDisplay} to your {profile?.country_name} account
            </p>
            <input style={inputStyle} placeholder="Mobile Money / Bank Account Number"
              value={accountDetails} onChange={e => setAccountDetails(e.target.value)} />
            <input style={inputStyle} placeholder="Account Holder Full Name"
              value={accountName} onChange={e => setAccountName(e.target.value)} />
            <GoldButton onClick={submitWithdrawal} disabled={loading || !accountDetails || !accountName}>
              {loading ? "Submitting..." : "Submit Withdrawal Request"}
            </GoldButton>
            <button onClick={() => setShowWithdrawForm(false)} style={{
              width: "100%", background: "none", border: "none",
              color: "rgba(255,255,255,0.3)", marginTop: 12,
              cursor: "pointer", fontSize: 14, fontFamily: "'Trebuchet MS', sans-serif",
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 24,
        }}>
          <div style={{
            background: "linear-gradient(145deg,#1a1a1a,#111)",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: 22, padding: 32, maxWidth: 340, textAlign: "center",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: "#4ade80", fontSize: 20, marginBottom: 14 }}>Request Submitted!</h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, marginBottom: 22 }}>
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
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Inject global styles
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);

    // Check existing session
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setUser(data.session.user);
        setScreen("app");
      }
      setChecking(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setScreen("app");
      } else {
        setUser(null);
        setScreen("landing");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Trebuchet MS', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>💰</div>
        <p style={{ color: GOLD, fontSize: 16 }}>Loading Dollarbag IQ...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#0a0a0a" }}>
      {screen === "landing" && (
        <LandingPage
          onLogin={() => setScreen("login")}
          onRegister={() => setScreen("register")}
        />
      )}
      {screen === "register" && (
        <AuthScreen
          mode="register"
          onSuccess={u => { setUser(u); setScreen("app"); }}
          onSwitch={() => setScreen("login")}
        />
      )}
      {screen === "login" && (
        <AuthScreen
          mode="login"
          onSuccess={u => { setUser(u); setScreen("app"); }}
          onSwitch={() => setScreen("register")}
        />
      )}
      {screen === "app" && user && <MainApp user={user} />}
    </div>
  );
}
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
