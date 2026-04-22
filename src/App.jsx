import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://muhvzfkqabfskzxubtfw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aHZ6ZmtxYWJmc2t6eHVidGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDQyNzYsImV4cCI6MjA5MjE4MDI3Nn0.a7J66JFRtMZUaP0JWuzhXo2KYUR0rQxEyP0s8roFJ8A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VIDEO_REWARD = 0.30;
const MAX_VIDEOS = 15;
const TAP_REWARD = 0.05;
const TAPS_PER_REWARD = 3;
const TAP_DAILY_CAP = 3.00;
const REFERRAL_BONUS = 2.00;
const REFERRAL_PERCENT = 0.10;
const WITHDRAWAL_THRESHOLD = 18.00;
const WITHDRAWAL_SHOW = 14.00;
const GOLD = "#FFD700";

const COUNTRIES = [
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
  "Emeka_NG4821","Chidi_NG3302","Amara_GH7743","Fatima_NG9021","Kwame_GH5512",
  "Aisha_KE3341","Tunde_NG8821","Yemi_NG4401","Blessing_NG7732","Kofi_GH2291",
  "Ngozi_NG5543","Seun_NG8812","Ade_NG3321","Bola_NG7741","Chinwe_NG4432",
  "Ifeanyi_NG9981","Obinna_NG3312","Nkechi_NG7721","Uche_NG4453","Chioma_NG8832",
  "Sade_NG3341","Rotimi_NG7712","Funke_NG4421","Gbenga_NG9931","Tobi_NG3352",
  "Lola_NG7723","Dayo_NG4412","Tola_NG8843","Kemi_NG3361","Wale_NG7714",
  "Femi_NG4431","Deji_NG9941","Seyi_NG3372","Bukola_NG7725","Rashida_GH4412",
  "Abena_GH8852","Ama_GH3381","Akosua_GH7736","Adjoa_GH4442","Efua_GH9951",
  "Yaa_GH3391","Akua_GH7747","Adwoa_GH4452","Araba_GH8861","Esi_GH3312",
  "Maame_GH7758","Afua_GH4461","Afia_GH9971","Nana_GH3321","Kojo_GH7769",
  "Kweku_GH4471","Kwabena_GH8881","Yaw_GH3331","Fiifi_GH7712","Kobina_GH4481",
  "Wanjiku_KE9991","Kamau_KE3341","Njeri_KE7723","Mwangi_KE4491","Akinyi_KE8812",
  "Otieno_KE3351","Wambui_KE7734","Kariuki_KE4412","Mutua_KE9921","Nduta_KE3361",
  "Zawadi_TZ7745","Baraka_TZ4422","Amani_TZ8831","Furaha_TZ3371","Imani_TZ7756",
  "Thabo_ZA4432","Lerato_ZA9941","Sipho_ZA3381","Nomsa_ZA7767","Bongani_ZA4442",
  "Lindiwe_ZA8851","Mandla_ZA3391","Nandi_ZA7712","Sandile_ZA4452","Zanele_ZA9961",
  "Chukwu_NG3312","Obiora_NG7723","Adaeze_NG4462","Amaechi_NG8871","Ifeoma_NG3321",
  "Musa_NG7732","Ibrahim_NG4472","Abdullahi_NG9981","Halima_NG3331","Zainab_NG7743",
  "Victor_NG4482","Emmanuel_NG8891","Grace_NG3341","Miracle_NG7754","Favour_NG4412",
  "Precious_NG9921","Goodluck_NG3351","Sunday_NG7765","Daniel_KE4422","David_KE8831",
  "Mary_KE3361","Faith_KE7776","Hope_KE4432","Joy_KE9941","Peace_KE3371",
  "Prosper_GH7787","Fortune_GH4442","Success_GH8851","Victor_GH3381","Akwasi_GH7712",
  "Oumar_SN4491","Mamadou_SN9921","Fatou_SN3312","Aminata_SN7723","Mariama_SN4432",
  "Jean_CM8841","Pierre_CM3351","Marie_CM7752","Agnes_CM4462","Celestine_CM9971",
  "Abebe_ET3321","Tigist_ET7732","Yonas_ET4442","Hana_ET8851","Dawit_ET3361",
  "Eric_RW7763","Patrick_RW4472","Sandrine_RW9981","Nadine_RW3371","Diane_RW7774",
  "Adama_CI4482","Moussa_CI8891","Aminata_CI3381","Mariam_CI7712","Fatoumata_CI4412",
  "Olumide_NG9921","Ayoola_NG3331","Adewale_NG7742","Adebayo_NG4452","Ebuka_NG3351",
  "Kwabena_GH4412","Kwadwo_GH8831","Kwasi_GH3341","Mensah_GH7752","Boateng_GH4462",
  "Samuel_KE9971","Joseph_KE3321","Peter_KE7732","Paul_KE4442","James_KE8851",
  "Okonkwo_NG3361","Okafor_NG7763","Okeke_NG4472","Eze_NG9981","Nwosu_NG3371",
];

const POPUP_AMOUNTS = [
  "12.00","15.50","18.25","22.00","25.75","27.30","30.00","33.50",
  "35.80","39.00","42.25","45.00","47.75","50.00","55.30","60.00",
  "65.50","70.00","75.25","80.00","85.50","90.00","95.75","100.00",
];

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getPopup() {
  const name = POPUP_NAMES[Math.floor(Math.random() * POPUP_NAMES.length)];
  const amount = POPUP_AMOUNTS[Math.floor(Math.random() * POPUP_AMOUNTS.length)];
  return { name, amount };
}

function fmt(usd, country, local) {
  if (!local || !country || country.code === "OT") return `$${Number(usd).toFixed(2)}`;
  return `${country.symbol}${Math.floor(usd * country.rate).toLocaleString()}`;
}

function todayStr() { return new Date().toISOString().split("T")[0]; }

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#0a0a0a;font-family:'Trebuchet MS',sans-serif;}
@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(24px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes coinPop{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-70px) scale(1.6)}}
@keyframes glow{0%,100%{box-shadow:0 0 18px rgba(255,215,0,.2)}50%{box-shadow:0 0 38px rgba(255,215,0,.5)}}
`;

function Btn({ children, onClick, disabled, style = {} }) {
  const [p, setP] = useState(false);
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseDown={() => !disabled && setP(true)} onMouseUp={() => setP(false)}
      onTouchStart={() => !disabled && setP(true)} onTouchEnd={() => setP(false)}
      style={{
        width: "100%", border: "none", borderRadius: 14, padding: "15px 0",
        fontSize: 15, fontWeight: "bold", cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Trebuchet MS',sans-serif",
        background: disabled ? "linear-gradient(135deg,#333,#222)" : "linear-gradient(135deg,#FFD700,#B8860B)",
        color: disabled ? "#666" : "#000",
        boxShadow: disabled ? "none" : "0 6px 24px rgba(255,215,0,.3)",
        transform: p ? "scale(.97)" : "scale(1)", transition: "all .15s", ...style,
      }}>{children}</button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "linear-gradient(145deg,#1a1a1a,#111)", border: "1px solid rgba(255,215,0,.12)", borderRadius: 18, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, type = "text", maxLength }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength}
      style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,215,0,.2)", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'Trebuchet MS',sans-serif" }}
    />
  );
}

function LivePopup() {
  const [item, setItem] = useState(null);
  const [show, setShow] = useState(false);
  const fire = useCallback(() => {
    setItem(getPopup()); setShow(true);
    setTimeout(() => setShow(false), 4500);
  }, []);
  useEffect(() => {
    const t = setTimeout(fire, 3000);
    const iv = setInterval(fire, 4 * 60 * 1000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [fire]);
  if (!show || !item) return null;
  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
      background: "linear-gradient(135deg,#1c1c1c,#242424)", border: "1px solid rgba(255,215,0,.35)",
      borderRadius: 50, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8,
      zIndex: 9999, animation: "slideUp .4s ease", boxShadow: "0 8px 32px rgba(0,0,0,.7)",
      whiteSpace: "nowrap", maxWidth: "92vw",
    }}>
      <span style={{ fontSize: 18 }}>💰</span>
      <span style={{ fontSize: 12, color: "#ccc" }}>
        <strong style={{ color: GOLD }}>{item.name}</strong>{" just received "}
        <strong style={{ color: "#4ade80" }}>${item.amount}</strong>!
      </span>
    </div>
  );
}

function Landing({ goLogin, goRegister }) {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <LivePopup />
      <div style={{ background: "linear-gradient(160deg,#1a1200,#0a0a0a 60%)", padding: "50px 24px 36px", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>💰</div>
        <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(90deg,#FFD700,#FFF8DC,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          DOLLARBAG IQ
        </h1>
        <p style={{ color: "rgba(255,215,0,.65)", fontSize: 12, letterSpacing: 2, marginBottom: 16 }}>WATCH · TAP · EARN REAL MONEY</p>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, lineHeight: 1.75, maxWidth: 360, margin: "0 auto 24px" }}>
          Dollarbag IQ is the leading platform that pays you <strong style={{ color: GOLD }}>real money</strong> for watching videos and completing simple tasks. We earn from advertisers and share the revenue directly with you.
        </p>
        <div style={{ display: "flex", gap: 12, maxWidth: 360, margin: "0 auto 14px" }}>
          <Btn onClick={goRegister} style={{ flex: 1 }}>Create Free Account</Btn>
          <button onClick={goLogin} style={{ flex: 1, background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Trebuchet MS',sans-serif" }}>Log In</button>
        </div>
        <p style={{ color: "#4ade80", fontSize: 13 }}>🔥 Users earn up to <strong>$4.00+ daily</strong></p>
      </div>
      <div style={{ padding: "20px 20px 40px" }}>
        {[
          { icon: "🎬", title: "Watch Videos & Get Paid", text: "Every single video you watch on Dollarbag IQ puts real money into your account. Advertisers pay us to show you videos and we pass that money directly to you. No skills needed. Just press play, watch to the end, and the cash lands in your wallet. Watch up to 15 videos every single day." },
          { icon: "👆", title: "Tap Your Screen & Get Paid", text: "Every time you tap a button on your screen, you earn money. Every 3 taps earns you $0.05. Keep tapping and watch your balance grow. People are earning up to $3.00 every single day just from tapping their phone. Do it while watching TV, sitting in traffic, or relaxing at home." },
          { icon: "👥", title: "Refer Friends & Both Get Paid", text: "Share your unique referral code with a friend. The moment they sign up using your code, you BOTH receive $2.00 instantly. You also continue to earn 10% of everything your friend earns on Dollarbag IQ — for life. The more people you invite, the more passive income you earn." },
        ].map((f, i) => (
          <div key={i} style={{ background: "linear-gradient(145deg,#151515,#0f0f0f)", border: "1px solid rgba(255,215,0,.1)", borderRadius: 18, padding: 20, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{f.icon}</div>
              <h3 style={{ color: GOLD, fontSize: 15, fontWeight: "bold" }}>{f.title}</h3>
            </div>
            <p style={{ color: "rgba(255,255,255,.58)", fontSize: 13, lineHeight: 1.75 }}>{f.text}</p>
          </div>
        ))}
        <div style={{ background: "rgba(255,215,0,.07)", border: "1px solid rgba(255,215,0,.22)", borderRadius: 18, padding: 22, marginBottom: 22, textAlign: "center" }}>
          <p style={{ color: GOLD, fontWeight: "bold", fontSize: 15, marginBottom: 14 }}>💵 Daily Earning Potential</p>
          {[["🎬 Watch 15 Videos", "$4.50"], ["👆 Tap to Earn (daily cap)", "$3.00"], ["👥 Referral Bonuses", "Unlimited"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "rgba(255,255,255,.55)", fontSize: 13 }}>{l}</span>
              <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 13 }}>{v}</span>
            </div>
          ))}
          <p style={{ color: GOLD, fontWeight: "bold", fontSize: 17, marginTop: 10 }}>Minimum $4.00+ every day 🚀</p>
        </div>
        <Btn onClick={goRegister}>Start Earning Now — It Is Free</Btn>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: 12, marginTop: 12 }}>
          Already have an account?{" "}<span onClick={goLogin} style={{ color: GOLD, cursor: "pointer" }}>Log In here</span>
        </p>
      </div>
    </div>
  );
}

function Auth({ mode, onSuccess, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [country, setCountry] = useState("");
  const [refCode, setRefCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  async function submit() {
    setErr(""); setInfo("");
    if (!email.trim() || !pass.trim()) return setErr("Please enter your email and password.");
    if (mode === "register" && (!name.trim() || !country)) return setErr("Please fill in all fields including your country.");
    setLoading(true);
    try {
      if (mode === "register") {
        const { data, error: e } = await supabase.auth.signUp({ email: email.trim(), password: pass });
        if (e) throw e;
        const uid = data?.user?.id;
        if (!uid) throw new Error("Registration failed. Please try again.");
        const c = COUNTRIES.find(x => x.code === country) || COUNTRIES[0];
        const code = generateCode();
        const { error: pe } = await supabase.from("profiles").upsert({
          id: uid, full_name: name.trim(), email: email.trim(),
          country_code: c.code, country_name: c.name,
          currency_symbol: c.symbol, currency_rate: c.rate,
          referral_code: code, balance: 0, tap_earned_today: 0,
          videos_watched_today: 0, last_reset_date: todayStr(),
          total_referrals: 0, referral_earnings: 0, has_withdrawn: false,
        });
        if (pe) throw new Error("Profile setup failed: " + pe.message);
        if (refCode.trim().length === 5) {
          const rc = refCode.trim().toUpperCase();
          const { data: ref } = await supabase.from("profiles").select("id,balance,total_referrals,referral_earnings").eq("referral_code", rc).single();
          if (ref && ref.id !== uid) {
            await supabase.from("profiles").update({ balance: Number(ref.balance || 0) + REFERRAL_BONUS, total_referrals: Number(ref.total_referrals || 0) + 1, referral_earnings: Number(ref.referral_earnings || 0) + REFERRAL_BONUS }).eq("id", ref.id);
            await supabase.from("profiles").update({ balance: REFERRAL_BONUS, referred_by: ref.id }).eq("id", uid);
            await supabase.from("referrals").insert({ referrer_id: ref.id, referee_id: uid });
          }
        }
        setInfo("Account created! Please check your email and click the verification link from Supabase, then log in.");
        setTimeout(() => onSwitch(), 3500);
      } else {
        const { data, error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
        if (e) {
          if (e.message.includes("Email not confirmed")) setErr("Please check your email inbox and click the verification link sent by Supabase before logging in. Check your spam folder too.");
          else throw e;
          setLoading(false); return;
        }
        onSuccess(data.user);
      }
    } catch (e) { setErr(e.message || "Something went wrong. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "40px 24px", color: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>💰</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(90deg,#FFD700,#FFF8DC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DOLLARBAG IQ</h2>
        <p style={{ color: "rgba(255,215,0,.55)", fontSize: 13, marginTop: 6 }}>
          {mode === "register" ? "Create your free account and start earning" : "Welcome back"}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "register" && <TextInput placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />}
        <TextInput placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextInput placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        {mode === "register" && (
          <>
            <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,215,0,.2)", borderRadius: 12, padding: "14px 16px", color: country ? "#fff" : "#666", fontSize: 14, outline: "none", fontFamily: "'Trebuchet MS',sans-serif", appearance: "none" }}>
              <option value="">Select Your Country</option>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
            <TextInput placeholder="Referral Code (optional — get $2.00 bonus)" value={refCode} onChange={e => setRefCode(e.target.value.toUpperCase())} maxLength={5} />
          </>
        )}
        {mode === "login" && (
          <div style={{ background: "rgba(255,215,0,.06)", border: "1px solid rgba(255,215,0,.18)", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ color: "rgba(255,215,0,.75)", fontSize: 12, lineHeight: 1.65 }}>📧 Please check your email inbox and click the verification link sent by Supabase before logging in. Check your spam folder if you cannot find it.</p>
          </div>
        )}
        {err && <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 12, padding: "12px 14px" }}><p style={{ color: "#f87171", fontSize: 13 }}>{err}</p></div>}
        {info && <div style={{ background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 12, padding: "12px 14px" }}><p style={{ color: "#4ade80", fontSize: 13 }}>{info}</p></div>}
        <Btn onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : mode === "register" ? "Create Account — Start Earning Free" : "Log In to My Account"}
        </Btn>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,.35)", fontSize: 13 }}>
          {mode === "register" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={onSwitch} style={{ color: GOLD, cursor: "pointer", fontWeight: "bold" }}>{mode === "register" ? "Log In" : "Sign Up Free"}</span>
        </p>
      </div>
    </div>
  );
}

function MainApp({ user }) {
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocal, setShowLocal] = useState(true);
  const country = COUNTRIES.find(c => c.code === profile?.country_code) || COUNTRIES[0];

  async function loadProfile() {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error || !data) {
      const c = COUNTRIES[0];
      await supabase.from("profiles").upsert({
        id: user.id, full_name: user.user_metadata?.full_name || "User", email: user.email,
        country_code: c.code, country_name: c.name, currency_symbol: c.symbol, currency_rate: c.rate,
        referral_code: generateCode(), balance: 0, tap_earned_today: 0, videos_watched_today: 0,
        last_reset_date: todayStr(), total_referrals: 0, referral_earnings: 0, has_withdrawn: false,
      });
      const { data: d2 } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(d2);
    } else {
      if (data.last_reset_date !== todayStr()) {
        const { data: d2 } = await supabase.from("profiles").update({ tap_earned_today: 0, videos_watched_today: 0, last_reset_date: todayStr() }).eq("id", user.id).select().single();
        setProfile(d2 || data);
      } else setProfile(data);
    }
    setLoading(false);
  }

  useEffect(() => { loadProfile(); }, []);
  function patch(u) { setProfile(p => ({ ...p, ...u })); }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>💰</div>
        <p style={{ color: GOLD, fontSize: 16 }}>Loading your wallet...</p>
      </div>
    </div>
  );

  const TABS = [{ id: "home", icon: "🏠", label: "Home" }, { id: "earn", icon: "💵", label: "Earn" }, { id: "referral", icon: "👥", label: "Refer" }, { id: "wallet", icon: "💳", label: "Wallet" }];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingBottom: 80, color: "#fff" }}>
      <LivePopup />
      {tab === "home" && <Home profile={profile} country={country} showLocal={showLocal} setShowLocal={setShowLocal} goEarn={() => setTab("earn")} goRefer={() => setTab("referral")} />}
      {tab === "earn" && <Earn profile={profile} uid={user.id} country={country} showLocal={showLocal} patch={patch} />}
      {tab === "referral" && <Refer profile={profile} country={country} showLocal={showLocal} />}
      {tab === "wallet" && <Wallet profile={profile} uid={user.id} country={country} showLocal={showLocal} reload={loadProfile} />}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#0f0f0f", borderTop: "1px solid rgba(255,215,0,.12)", display: "flex", padding: "8px 0", zIndex: 100 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0", fontFamily: "'Trebuchet MS',sans-serif" }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? GOLD : "rgba(255,255,255,.3)", fontWeight: tab === t.id ? "bold" : "normal" }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD }} />}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Home({ profile, country, showLocal, setShowLocal, goEarn, goRefer }) {
  const bal = profile?.balance || 0;
  const balDisplay = showLocal && country.code !== "OT" ? `${country.symbol}${Math.floor(bal * country.rate).toLocaleString()}` : `$${bal.toFixed(2)}`;
  return (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12, marginBottom: 2 }}>Welcome back,</p>
          <h2 style={{ color: GOLD, fontSize: 20, fontWeight: "bold" }}>{profile?.full_name?.split(" ")[0] || "Friend"} 👋</h2>
        </div>
        <span style={{ fontSize: 34 }}>💰</span>
      </div>
      <div style={{ background: "linear-gradient(135deg,#1a1200,#2a1f00)", border: "1px solid rgba(255,215,0,.28)", borderRadius: 22, padding: "26px 22px", marginBottom: 16, textAlign: "center", animation: "glow 3s ease infinite" }}>
        <p style={{ color: "rgba(255,215,0,.45)", fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>TOTAL BALANCE</p>
        <button onClick={() => setShowLocal(s => !s)} style={{ background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.22)", borderRadius: 20, padding: "4px 14px", color: GOLD, fontSize: 11, cursor: "pointer", marginBottom: 12, fontFamily: "'Trebuchet MS',sans-serif" }}>
          {showLocal && country.code !== "OT" ? "Switch to USD" : `Switch to ${country.currency}`}
        </button>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: GOLD, marginBottom: 4 }}>{balDisplay}</h1>
        {showLocal && country.code !== "OT" ? <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13 }}>≈ ${bal.toFixed(2)} USD</p> : country.code !== "OT" && <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13 }}>≈ {country.symbol}{Math.floor(bal * country.rate).toLocaleString()} {country.currency}</p>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { icon: "🎬", label: "Videos Today", val: `${profile?.videos_watched_today || 0}/${MAX_VIDEOS}` },
          { icon: "👥", label: "My Referrals", val: profile?.total_referrals || 0 },
          { icon: "👆", label: "Tap Earned Today", val: fmt(profile?.tap_earned_today || 0, country, showLocal) },
          { icon: "💸", label: "Referral Income", val: fmt(profile?.referral_earnings || 0, country, showLocal) },
        ].map(item => (
          <Card key={item.label} style={{ textAlign: "center", padding: 14 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ color: GOLD, fontWeight: "bold", fontSize: 17 }}>{item.val}</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 10, marginTop: 3 }}>{item.label}</div>
          </Card>
        ))}
      </div>
      <Btn onClick={goEarn} style={{ marginBottom: 12 }}>🎬 Start Earning Now</Btn>
      <button onClick={goRefer} style={{ width: "100%", background: "transparent", border: "1px solid rgba(255,215,0,.22)", borderRadius: 14, padding: "14px 0", color: GOLD, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Trebuchet MS',sans-serif" }}>
        👥 Invite Friends — You Both Earn {fmt(REFERRAL_BONUS, country, showLocal)}
      </button>
    </div>
  );
}

function Earn({ profile, uid, country, showLocal, patch }) {
  const [taps, setTaps] = useState(0);
  const [pops, setPops] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  function flash(text, type = "ok") { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 3000); }

  async function tap() {
    const tapToday = profile?.tap_earned_today || 0;
    if (tapToday >= TAP_DAILY_CAP) return flash("You have reached the $3.00 daily tap limit. Come back tomorrow!", "warn");
    const n = taps + 1; setTaps(n);
    if (n % TAPS_PER_REWARD === 0) {
      const id = Date.now();
      setPops(p => [...p, id]);
      setTimeout(() => setPops(p => p.filter(x => x !== id)), 900);
      const newBal = Number(((profile?.balance || 0) + TAP_REWARD).toFixed(4));
      const newTap = Number(Math.min(tapToday + TAP_REWARD, TAP_DAILY_CAP).toFixed(4));
      patch({ balance: newBal, tap_earned_today: newTap });
      await supabase.from("profiles").update({ balance: newBal, tap_earned_today: newTap }).eq("id", uid);
      if (profile?.referred_by) {
        const { data: ref } = await supabase.from("profiles").select("balance,referral_earnings").eq("id", profile.referred_by).single();
        if (ref) await supabase.from("profiles").update({ balance: Number((ref.balance || 0) + TAP_REWARD * REFERRAL_PERCENT).toFixed(4), referral_earnings: Number((ref.referral_earnings || 0) + TAP_REWARD * REFERRAL_PERCENT).toFixed(4) }).eq("id", profile.referred_by);
      }
    }
  }

  async function watchVideo() {
    if ((profile?.videos_watched_today || 0) >= MAX_VIDEOS) return flash("You have watched all 15 videos today. Come back tomorrow!", "warn");
    setVideoLoading(true);
    await new Promise(r => setTimeout(r, 3500));
    setVideoLoading(false);
    const newWatched = (profile?.videos_watched_today || 0) + 1;
    const newBal = Number(((profile?.balance || 0) + VIDEO_REWARD).toFixed(4));
    patch({ balance: newBal, videos_watched_today: newWatched });
    await supabase.from("profiles").update({ balance: newBal, videos_watched_today: newWatched }).eq("id", uid);
    if (profile?.referred_by) {
      const { data: ref } = await supabase.from("profiles").select("balance,referral_earnings").eq("id", profile.referred_by).single();
      if (ref) await supabase.from("profiles").update({ balance: Number((ref.balance || 0) + VIDEO_REWARD * REFERRAL_PERCENT).toFixed(4), referral_earnings: Number((ref.referral_earnings || 0) + VIDEO_REWARD * REFERRAL_PERCENT).toFixed(4) }).eq("id", profile.referred_by);
    }
    flash(`+${fmt(VIDEO_REWARD, country, showLocal)} added to your wallet! 🎉`, "ok");
  }

  const videosLeft = MAX_VIDEOS - (profile?.videos_watched_today || 0);
  const tapDone = (profile?.tap_earned_today || 0) >= TAP_DAILY_CAP;
  const msgColor = msg.type === "ok" ? "#4ade80" : "#fbbf24";

  return (
    <div style={{ padding: "24px 20px" }}>
      <h2 style={{ color: GOLD, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>Earn Money</h2>
      <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginBottom: 18 }}>2 ways to earn real cash right now</p>
      {msg.text && <div style={{ background: `${msgColor}18`, border: `1px solid ${msgColor}44`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: msgColor, fontSize: 13, textAlign: "center" }}>{msg.text}</div>}

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>🎬</span>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Watch & Earn</span>
            </div>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>{fmt(VIDEO_REWARD, country, showLocal)} per video · {videosLeft} left today</p>
          </div>
          <span style={{ color: "#4ade80", fontWeight: "bold" }}>{fmt(VIDEO_REWARD, country, showLocal)}</span>
        </div>
        <div style={{ background: "#222", borderRadius: 6, height: 5, marginBottom: 14 }}>
          <div style={{ background: "linear-gradient(90deg,#FFD700,#B8860B)", height: "100%", borderRadius: 6, width: `${((profile?.videos_watched_today || 0) / MAX_VIDEOS) * 100}%`, transition: "width .4s" }} />
        </div>
        <p style={{ color: "rgba(255,255,255,.22)", fontSize: 11, textAlign: "center", marginBottom: 14 }}>{profile?.videos_watched_today || 0}/{MAX_VIDEOS} watched today</p>
        <Btn onClick={watchVideo} disabled={videoLoading || videosLeft === 0}>
          {videoLoading ? "⏳ Loading Video Ad..." : videosLeft === 0 ? "✅ All Done for Today!" : `▶ Watch Video — Earn ${fmt(VIDEO_REWARD, country, showLocal)}`}
        </Btn>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>👆</span>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Tap & Earn</span>
            </div>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>Every 3 taps = {fmt(TAP_REWARD, country, showLocal)} · Cap {fmt(TAP_DAILY_CAP, country, showLocal)}/day</p>
          </div>
          <span style={{ color: "#4ade80", fontWeight: "bold" }}>{fmt(profile?.tap_earned_today || 0, country, showLocal)}</span>
        </div>
        <div style={{ textAlign: "center", position: "relative", padding: "10px 0 16px" }}>
          {pops.map(id => (
            <div key={id} style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%,-50%)", color: "#4ade80", fontWeight: "bold", fontSize: 20, animation: "coinPop .9s ease forwards", pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap" }}>
              +{fmt(TAP_REWARD, country, showLocal)}
            </div>
          ))}
          <button onClick={tap} disabled={tapDone}
            onMouseDown={e => { if (!tapDone) e.currentTarget.style.transform = "scale(.91)"; }}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => { if (!tapDone) e.currentTarget.style.transform = "scale(.91)"; }}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
            style={{ width: 128, height: 128, borderRadius: "50%", border: "none", fontSize: 46, cursor: tapDone ? "not-allowed" : "pointer", background: tapDone ? "linear-gradient(135deg,#2a2a2a,#1a1a1a)" : "linear-gradient(135deg,#FFD700,#B8860B)", boxShadow: tapDone ? "none" : "0 10px 40px rgba(255,215,0,.4)", transition: "transform .08s", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>👆</button>
        </div>
        <p style={{ color: "rgba(255,255,255,.28)", fontSize: 12, textAlign: "center" }}>
          {tapDone ? "Daily limit reached. Come back tomorrow!" : `Tap count: ${taps} · ${TAPS_PER_REWARD - (taps % TAPS_PER_REWARD)} more taps to earn`}
        </p>
      </Card>
    </div>
  );
}

function Refer({ profile, country, showLocal }) {
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(profile?.referral_code || "").catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  function whatsapp() {
    const m = `🤑 I am making real money on Dollarbag IQ!\n\nWatch videos and tap to earn real cash daily. Join with my code *${profile?.referral_code}* and we BOTH get ${fmt(REFERRAL_BONUS, country, showLocal)} instantly!\n\nJoin here 👉 https://dollarbag-iq-rho.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(m)}`);
  }
  return (
    <div style={{ padding: "24px 20px" }}>
      <h2 style={{ color: GOLD, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>Refer & Earn</h2>
      <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginBottom: 20 }}>Invite friends and you BOTH earn {fmt(REFERRAL_BONUS, country, showLocal)} instantly</p>
      <Card style={{ marginBottom: 16, textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12, marginBottom: 10 }}>Your Unique Referral Code</p>
        <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "18px 20px", border: "1px dashed rgba(255,215,0,.4)", marginBottom: 16, letterSpacing: 10, fontSize: 30, fontWeight: 900, color: GOLD }}>
          {profile?.referral_code || "- - - - -"}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={copy} style={{ flex: 1, background: copied ? "rgba(74,222,128,.12)" : "rgba(255,215,0,.08)", border: `1px solid ${copied ? "rgba(74,222,128,.4)" : "rgba(255,215,0,.25)"}`, borderRadius: 12, padding: "12px 0", color: copied ? "#4ade80" : GOLD, fontWeight: "bold", fontSize: 13, cursor: "pointer", fontFamily: "'Trebuchet MS',sans-serif" }}>
            {copied ? "✅ Copied!" : "📋 Copy Code"}
          </button>
          <button onClick={whatsapp} style={{ flex: 1, background: "rgba(37,211,102,.1)", border: "1px solid rgba(37,211,102,.28)", borderRadius: 12, padding: "12px 0", color: "#25d366", fontWeight: "bold", fontSize: 13, cursor: "pointer", fontFamily: "'Trebuchet MS',sans-serif" }}>📲 WhatsApp</button>
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: GOLD, fontWeight: "bold", marginBottom: 14 }}>Your Referral Earnings</p>
        {[
          ["Total People Referred", profile?.total_referrals || 0],
          ["Referral Bonuses", fmt((profile?.total_referrals || 0) * REFERRAL_BONUS, country, showLocal)],
          ["10% Lifetime Commission", fmt(Math.max(0, (profile?.referral_earnings || 0) - (profile?.total_referrals || 0) * REFERRAL_BONUS), country, showLocal)],
          ["Total Referral Income", fmt(profile?.referral_earnings || 0, country, showLocal)],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,.05)", paddingBottom: 10, marginBottom: 10 }}>
            <span style={{ color: "rgba(255,255,255,.42)", fontSize: 13 }}>{l}</span>
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>{v}</span>
          </div>
        ))}
      </Card>
      <Card>
        <p style={{ color: GOLD, fontWeight: "bold", marginBottom: 14 }}>How It Works</p>
        {[
          ["1️⃣", "Share your unique code with friends and family"],
          ["2️⃣", "Your friend signs up using your referral code"],
          ["3️⃣", `You BOTH receive ${fmt(REFERRAL_BONUS, country, showLocal)} in your wallets instantly`],
          ["4️⃣", "You earn 10% of everything they earn — forever"],
        ].map(([n, t]) => (
          <div key={n} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>{n}</span>
            <span style={{ color: "rgba(255,255,255,.58)", fontSize: 13, lineHeight: 1.6 }}>{t}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function Wallet({ profile, uid, country, showLocal, reload }) {
  const [form, setForm] = useState(false);
  const [noRef, setNoRef] = useState(false);
  const [acct, setAcct] = useState("");
  const [acctName, setAcctName] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const bal = profile?.balance || 0;
  const canWithdraw = bal >= WITHDRAWAL_THRESHOLD;
  const showBtn = bal >= WITHDRAWAL_SHOW;
  const balDisplay = showLocal && country.code !== "OT" ? `${country.symbol}${Math.floor(bal * country.rate).toLocaleString()}` : `$${bal.toFixed(2)}`;

  function clickWithdraw() {
    if (!canWithdraw) return;
    if (!profile?.total_referrals || profile.total_referrals < 1) { setNoRef(true); return; }
    setForm(true);
  }

  async function submit() {
    if (!acct.trim() || !acctName.trim()) return;
    setLoading(true);
    await supabase.from("withdrawals").insert({ user_id: uid, amount: bal, account_details: acct.trim(), account_name: acctName.trim(), country: profile?.country_name || "Unknown", status: "pending" });
    await supabase.from("profiles").update({ has_withdrawn: true }).eq("id", uid);
    setLoading(false); setDone(true); reload();
  }

  return (
    <div style={{ padding: "24px 20px" }}>
      <h2 style={{ color: GOLD, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>My Wallet</h2>
      <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginBottom: 20 }}>Your earnings and withdrawals</p>
      <div style={{ background: "linear-gradient(135deg,#1a1200,#2a1f00)", border: "1px solid rgba(255,215,0,.28)", borderRadius: 22, padding: "28px 24px", marginBottom: 20, textAlign: "center" }}>
        <p style={{ color: "rgba(255,215,0,.45)", fontSize: 11, letterSpacing: 2, marginBottom: 6 }}>AVAILABLE BALANCE</p>
        <h1 style={{ fontSize: 50, fontWeight: 900, color: GOLD, marginBottom: 4 }}>{balDisplay}</h1>
        {showLocal && country.code !== "OT" && <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginBottom: 14 }}>≈ ${bal.toFixed(2)} USD</p>}
        {!canWithdraw && (
          <>
            <div style={{ background: "#1a1a1a", borderRadius: 8, height: 6, margin: "14px 0 8px" }}>
              <div style={{ background: "linear-gradient(90deg,#FFD700,#B8860B)", height: "100%", borderRadius: 8, width: `${Math.min((bal / WITHDRAWAL_THRESHOLD) * 100, 100)}%`, transition: "width .5s" }} />
            </div>
            <p style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>{fmt(WITHDRAWAL_THRESHOLD - bal, country, showLocal)} more needed to withdraw</p>
          </>
        )}
      </div>
      {showBtn && (
        <div style={{ marginBottom: 20 }}>
          <Btn onClick={clickWithdraw} disabled={!canWithdraw}>
            {canWithdraw ? "💳 Withdraw My Earnings" : `🔒 Unlocks at ${fmt(WITHDRAWAL_THRESHOLD, country, showLocal)}`}
          </Btn>
          {!canWithdraw && <p style={{ textAlign: "center", color: "rgba(255,255,255,.22)", fontSize: 12, marginTop: 8 }}>Keep earning! {fmt(WITHDRAWAL_THRESHOLD - bal, country, showLocal)} more to go.</p>}
        </div>
      )}
      <Card>
        <p style={{ color: GOLD, fontWeight: "bold", marginBottom: 14 }}>Earnings Breakdown</p>
        {[
          ["🎬 Video Earnings Today", fmt((profile?.videos_watched_today || 0) * VIDEO_REWARD, country, showLocal)],
          ["👆 Tap Earnings Today", fmt(profile?.tap_earned_today || 0, country, showLocal)],
          ["👥 Total Referral Income", fmt(profile?.referral_earnings || 0, country, showLocal)],
          ["💰 Total Balance", balDisplay],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,.05)", paddingBottom: 10, marginBottom: 10 }}>
            <span style={{ color: "rgba(255,255,255,.42)", fontSize: 13 }}>{l}</span>
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>{v}</span>
          </div>
        ))}
      </Card>

      {noRef && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div style={{ background: "linear-gradient(145deg,#1a1a1a,#111)", border: "1px solid rgba(255,215,0,.22)", borderRadius: 22, padding: 28, maxWidth: 340, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🔗</div>
            <h3 style={{ color: GOLD, fontSize: 19, marginBottom: 14 }}>One Last Step</h3>
            <p style={{ color: "rgba(255,255,255,.68)", fontSize: 14, lineHeight: 1.8, marginBottom: 22 }}>
              You need to invite at least one friend before your first withdrawal. This helps us to maintain the Blockchain and reduce fraud. Don't worry, after this, we will not ask you to refer someone before withdrawal again. It only happens on your first withdrawal.
            </p>
            <Btn onClick={() => setNoRef(false)}>OK, I Will Invite a Friend</Btn>
          </div>
        </div>
      )}

      {form && !done && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "linear-gradient(145deg,#1a1a1a,#111)", border: "1px solid rgba(255,215,0,.18)", borderRadius: "22px 22px 0 0", padding: 28, width: "100%", maxWidth: 430 }}>
            <h3 style={{ color: GOLD, fontSize: 20, marginBottom: 6 }}>Withdraw Earnings</h3>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 13, marginBottom: 20 }}>Withdrawing {balDisplay} to your {profile?.country_name} account</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <TextInput placeholder="Mobile Money / Bank Account Number" value={acct} onChange={e => setAcct(e.target.value)} />
              <TextInput placeholder="Account Holder Full Name" value={acctName} onChange={e => setAcctName(e.target.value)} />
            </div>
            <Btn onClick={submit} disabled={loading || !acct || !acctName}>{loading ? "Submitting..." : "Submit Withdrawal Request"}</Btn>
            <button onClick={() => setForm(false)} style={{ width: "100%", background: "none", border: "none", color: "rgba(255,255,255,.28)", marginTop: 12, cursor: "pointer", fontSize: 14, fontFamily: "'Trebuchet MS',sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}

      {done && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div style={{ background: "linear-gradient(145deg,#1a1a1a,#111)", border: "1px solid rgba(74,222,128,.28)", borderRadius: 22, padding: 32, maxWidth: 330, textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: "#4ade80", fontSize: 20, marginBottom: 14 }}>Request Submitted!</h3>
            <p style={{ color: "rgba(255,255,255,.62)", fontSize: 14, lineHeight: 1.75, marginBottom: 22 }}>
              Thank you! Our team will carefully review your account. If there are no issues, you will receive your payment within 2 to 14 business days.
            </p>
            <Btn onClick={() => setDone(false)}>Done</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) { setUser(data.session.user); setScreen("app"); }
      else setScreen("landing");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) { setUser(session.user); setScreen("app"); }
      else { setUser(null); setScreen("landing"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (screen === "loading") return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>💰</div>
        <p style={{ color: GOLD, fontSize: 16, fontFamily: "'Trebuchet MS',sans-serif" }}>Loading Dollarbag IQ...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#0a0a0a" }}>
      {screen === "landing" && <Landing goLogin={() => setScreen("login")} goRegister={() => setScreen("register")} />}
      {screen === "register" && <Auth mode="register" onSuccess={u => { setUser(u); setScreen("app"); }} onSwitch={() => setScreen("login")} />}
      {screen === "login" && <Auth mode="login" onSuccess={u => { setUser(u); setScreen("app"); }} onSwitch={() => setScreen("register")} />}
      {screen === "app" && user && <MainApp user={user} />}
    </div>
  );
}

