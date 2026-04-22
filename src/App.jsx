import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://muhvzfkqabfskzxubtfw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aHZ6ZmtxYWJmc2t6eHVidGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDQyNzYsImV4cCI6MjA5MjE4MDI3Nn0.a7J66JFRtMZUaP0JWuzhXo2KYUR0rQxEyP0s8roFJ8A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VIDEO_REWARD_MIN = 0.04;
const VIDEO_REWARD_MAX = 0.10;
const MAX_VIDEOS = 25;
const TAP_REWARD = 0.01;
const TAPS_PER_REWARD = 3;
const QUIZ_DAILY_MAX = 30;
const QUIZ_REWARD_SIMPLE_MIN = 0.04;
const QUIZ_REWARD_SIMPLE_MAX = 0.06;
const QUIZ_REWARD_LOGIC_MIN = 0.07;
const QUIZ_REWARD_LOGIC_MAX = 0.10;
const REFERRAL_BONUS = 2.00;
const REFERRAL_PERCENT = 0.10;
const WITHDRAWAL_THRESHOLD = 18.00;
const WITHDRAWAL_SHOW = 14.00;
const GOLD = "#FFD700";
const QUIZ_TIME_LIMIT = 20;

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
  "Wanjiku_KE9991","Kamau_KE3341","Njeri_KE7723","Mwangi_KE4491","Akinyi_KE8812",
  "Thabo_ZA4432","Lerato_ZA9941","Sipho_ZA3381","Nomsa_ZA7767","Bongani_ZA4442",
  "Chukwu_NG3312","Obiora_NG7723","Adaeze_NG4462","Ibrahim_NG4472","Halima_NG3331",
  "Victor_NG4482","Emmanuel_NG8891","Grace_NG3341","Miracle_NG7754","Favour_NG4412",
  "Prosper_GH7787","Fortune_GH4442","Success_GH8851","Akwasi_GH7712","Mensah_GH4462",
  "Oumar_SN4491","Mamadou_SN9921","Fatou_SN3312","Aminata_SN7723","Mariama_SN4432",
  "Abebe_ET3321","Tigist_ET7732","Yonas_ET4442","Hana_ET8851","Dawit_ET3361",
  "Adama_CI4482","Moussa_CI8891","Fatoumata_CI4412","Olumide_NG9921","Ebuka_NG3351",
  "Samuel_KE9971","Joseph_KE3321","Peter_KE7732","Paul_KE4442","James_KE8851",
  "Okonkwo_NG3361","Okafor_NG7763","Nwosu_NG3371","Sandile_ZA4452","Zanele_ZA9961",
];
const POPUP_AMOUNTS = ["12.00","15.50","18.25","22.00","25.75","27.30","30.00","33.50","35.80","39.00","42.25","45.00","47.75","50.00","55.30","60.00","65.50","70.00","75.25","80.00"];

const SIMPLE_QUESTIONS = [
  { q: "10 + 4 = ?", options: ["12","14","16","18"], answer: 1 },
  { q: "34 - 6 = ?", options: ["26","28","30","32"], answer: 1 },
  { q: "3 × 3 = ?", options: ["6","9","12","15"], answer: 1 },
  { q: "50 ÷ 5 = ?", options: ["8","10","12","15"], answer: 1 },
  { q: "15 + 23 = ?", options: ["35","38","40","42"], answer: 1 },
  { q: "7 × 8 = ?", options: ["54","56","58","60"], answer: 1 },
  { q: "100 - 37 = ?", options: ["53","63","73","83"], answer: 1 },
  { q: "48 ÷ 6 = ?", options: ["6","7","8","9"], answer: 2 },
  { q: "25 + 75 = ?", options: ["90","95","100","105"], answer: 2 },
  { q: "9 × 9 = ?", options: ["72","81","90","99"], answer: 1 },
  { q: "144 ÷ 12 = ?", options: ["10","11","12","13"], answer: 2 },
  { q: "67 + 33 = ?", options: ["90","95","100","105"], answer: 2 },
  { q: "8 × 7 = ?", options: ["48","54","56","64"], answer: 2 },
  { q: "200 - 75 = ?", options: ["115","125","135","145"], answer: 1 },
  { q: "36 ÷ 4 = ?", options: ["7","8","9","10"], answer: 2 },
  { q: "12 × 12 = ?", options: ["124","134","144","154"], answer: 2 },
  { q: "55 + 45 = ?", options: ["90","95","100","110"], answer: 2 },
  { q: "81 ÷ 9 = ?", options: ["7","8","9","10"], answer: 2 },
  { q: "6 × 11 = ?", options: ["60","64","66","70"], answer: 2 },
  { q: "250 - 125 = ?", options: ["115","125","135","145"], answer: 1 },
  { q: "17 + 28 = ?", options: ["43","45","47","49"], answer: 1 },
  { q: "72 ÷ 8 = ?", options: ["7","8","9","10"], answer: 2 },
  { q: "4 × 15 = ?", options: ["55","60","65","70"], answer: 1 },
  { q: "90 - 45 = ?", options: ["40","45","50","55"], answer: 1 },
  { q: "13 + 19 = ?", options: ["30","32","34","36"], answer: 1 },
  { q: "5 × 14 = ?", options: ["65","70","75","80"], answer: 1 },
  { q: "120 ÷ 10 = ?", options: ["10","11","12","13"], answer: 2 },
  { q: "88 - 44 = ?", options: ["40","44","48","52"], answer: 1 },
  { q: "7 × 6 = ?", options: ["36","40","42","48"], answer: 2 },
  { q: "99 + 11 = ?", options: ["100","105","110","115"], answer: 2 },
  { q: "150 ÷ 5 = ?", options: ["25","30","35","40"], answer: 1 },
  { q: "23 + 47 = ?", options: ["60","65","70","75"], answer: 2 },
  { q: "8 × 9 = ?", options: ["63","70","72","81"], answer: 2 },
  { q: "500 - 250 = ?", options: ["200","225","250","275"], answer: 2 },
  { q: "64 ÷ 8 = ?", options: ["6","7","8","9"], answer: 2 },
  { q: "11 × 11 = ?", options: ["111","121","131","141"], answer: 1 },
  { q: "45 + 55 = ?", options: ["90","95","100","105"], answer: 2 },
  { q: "96 ÷ 12 = ?", options: ["6","7","8","9"], answer: 2 },
  { q: "6 × 9 = ?", options: ["48","54","56","60"], answer: 1 },
  { q: "75 - 38 = ?", options: ["33","35","37","39"], answer: 2 },
  { q: "14 × 5 = ?", options: ["60","65","70","75"], answer: 2 },
  { q: "56 ÷ 7 = ?", options: ["6","7","8","9"], answer: 2 },
  { q: "33 + 67 = ?", options: ["90","95","100","110"], answer: 2 },
  { q: "9 × 11 = ?", options: ["88","99","100","110"], answer: 1 },
  { q: "180 ÷ 9 = ?", options: ["18","20","22","24"], answer: 1 },
  { q: "77 - 29 = ?", options: ["44","46","48","50"], answer: 2 },
  { q: "13 × 4 = ?", options: ["48","50","52","56"], answer: 2 },
  { q: "84 ÷ 7 = ?", options: ["10","11","12","13"], answer: 2 },
  { q: "29 + 51 = ?", options: ["70","75","80","85"], answer: 2 },
  { q: "15 × 6 = ?", options: ["80","85","90","95"], answer: 2 },
];

const LOGIC_QUESTIONS = [
  { q: "David has 9 apples. He gives 2 to his sister and eats 4. How many apples does David have left?", options: ["2","3","4","5"], answer: 1 },
  { q: "A shop has 20 eggs. They sell 7 in the morning and 5 in the afternoon. How many eggs are left?", options: ["6","7","8","9"], answer: 2 },
  { q: "Mary is 3 years older than John. John is 12 years old. How old is Mary?", options: ["13","14","15","16"], answer: 2 },
  { q: "A bus has 30 seats. 18 people are seated. How many empty seats are there?", options: ["10","11","12","13"], answer: 2 },
  { q: "Tom buys 3 books at $4 each. How much does he spend in total?", options: ["$9","$10","$12","$15"], answer: 2 },
  { q: "A farmer has 5 rows of corn with 8 plants in each row. How many plants are there in total?", options: ["35","40","45","50"], answer: 1 },
  { q: "Peter walks 2km to school and back home every day. How far does he walk in 5 days?", options: ["15km","18km","20km","22km"], answer: 2 },
  { q: "A box has 4 layers. Each layer has 6 oranges. How many oranges are in the box?", options: ["20","22","24","26"], answer: 2 },
  { q: "Sarah has $50. She buys a bag for $23 and a pen for $5. How much money does she have left?", options: ["$20","$22","$24","$26"], answer: 1 },
  { q: "A class has 40 students. 15 are boys. How many are girls?", options: ["20","23","25","27"], answer: 2 },
  { q: "John earns $15 per day. How much does he earn in 6 days?", options: ["$80","$85","$90","$95"], answer: 2 },
  { q: "A chicken lays 2 eggs every day. How many eggs will it lay in 2 weeks?", options: ["24","26","28","30"], answer: 2 },
  { q: "A market woman has 60 tomatoes. She sells 35 and gives 5 to her neighbor. How many are left?", options: ["15","18","20","22"], answer: 2 },
  { q: "If a bag of rice costs $12 and you buy 4 bags, how much do you pay?", options: ["$44","$46","$48","$50"], answer: 2 },
  { q: "A school library has 200 books. 75 are borrowed. How many books remain?", options: ["115","120","125","130"], answer: 2 },
  { q: "Amaka is twice the age of her brother. Her brother is 9. How old is Amaka?", options: ["15","16","17","18"], answer: 3 },
  { q: "A trader buys 50 oranges for $10 and sells them for $15. What is his profit?", options: ["$3","$4","$5","$6"], answer: 2 },
  { q: "There are 7 days in a week. How many days are in 8 weeks?", options: ["54","56","58","60"], answer: 1 },
  { q: "A car travels 60km per hour. How far will it travel in 3 hours?", options: ["160km","170km","180km","190km"], answer: 2 },
  { q: "Efe has 24 sweets. She shares them equally among 6 friends. How many sweets does each friend get?", options: ["3","4","5","6"], answer: 1 },
  { q: "A water tank holds 100 litres. It is already 40% full. How many litres are in the tank?", options: ["30","35","40","45"], answer: 2 },
  { q: "A man has 3 sons. Each son has 2 daughters. How many granddaughters does the man have?", options: ["4","5","6","7"], answer: 2 },
  { q: "Kemi buys 5 pencils at 50 cents each. How much does she spend?", options: ["$2.00","$2.25","$2.50","$2.75"], answer: 2 },
  { q: "A tree is 10 metres tall and grows 2 metres every year. How tall will it be in 5 years?", options: ["18m","19m","20m","21m"], answer: 2 },
  { q: "A mother has 4 children. She buys each child 3 oranges. How many oranges does she buy?", options: ["10","11","12","13"], answer: 2 },
  { q: "A shop opens at 8am and closes at 6pm. How many hours is the shop open?", options: ["8","9","10","11"], answer: 2 },
  { q: "James has $100. He spends $35 on food and $20 on transport. How much is left?", options: ["$40","$43","$45","$47"], answer: 2 },
  { q: "A boat carries 8 people. How many trips to carry 40 people?", options: ["4","5","6","7"], answer: 1 },
  { q: "Ada scores 75 in maths and 85 in English. What is her total score?", options: ["150","155","160","165"], answer: 2 },
  { q: "A market woman sells 12 tomatoes on Monday, 15 on Tuesday and 8 on Wednesday. Total?", options: ["33","35","37","39"], answer: 1 },
  { q: "Chidi has 6 bags of rice. Each bag weighs 5kg. What is the total weight?", options: ["25kg","28kg","30kg","32kg"], answer: 2 },
  { q: "A school has 5 classrooms with 35 students each. How many students are in the school?", options: ["165","170","175","180"], answer: 2 },
  { q: "Ngozi buys a dress for $45 and shoes for $30. She pays $100. How much change?", options: ["$20","$23","$25","$27"], answer: 2 },
  { q: "A goat farmer has 30 goats and sells one third. How many goats are left?", options: ["15","18","20","22"], answer: 2 },
  { q: "A builder lays 50 bricks per hour. How many bricks in 8 hours?", options: ["350","375","400","425"], answer: 2 },
  { q: "Tunde has twice as many mangoes as Bola. Bola has 15. How many does Tunde have?", options: ["25","28","30","32"], answer: 2 },
  { q: "A phone costs $200 and is on 25% sale. How much does it cost after discount?", options: ["$140","$145","$150","$155"], answer: 2 },
  { q: "A family eats 2 loaves of bread per day. How many in 2 weeks?", options: ["24","26","28","30"], answer: 2 },
  { q: "There are 12 months in a year. How many months in 4 years?", options: ["44","46","48","50"], answer: 2 },
  { q: "A girl reads 20 pages every day. How many pages in 2 weeks?", options: ["260","270","280","290"], answer: 2 },
  { q: "Emeka is 5 years older than his sister who is 11. How old is Emeka?", options: ["14","15","16","17"], answer: 2 },
  { q: "A bus travels 80km in 2 hours. How far in 5 hours at the same speed?", options: ["180km","190km","200km","210km"], answer: 2 },
  { q: "Grace saves $10 every week. How much will she save in 6 months?", options: ["$230","$240","$250","$260"], answer: 1 },
  { q: "A restaurant serves 45 for lunch and 60 for dinner. How many customers in total?", options: ["95","100","105","110"], answer: 2 },
  { q: "Biodun has 5 times as many books as Tolu. Tolu has 8 books. How many does Biodun have?", options: ["35","38","40","42"], answer: 2 },
  { q: "A well is 25 metres deep. A rope is 18 metres long. How many metres short is the rope?", options: ["5","6","7","8"], answer: 2 },
  { q: "Kofi buys 4 shirts at $8 each and gets a $5 discount. How much does he pay?", options: ["$25","$27","$29","$31"], answer: 1 },
  { q: "A village has 200 houses. Each house has 5 people. How many people in the village?", options: ["800","900","1000","1100"], answer: 2 },
  { q: "A worker earns $120 per week, spends $45 on food and $30 on rent. How much does he save?", options: ["$40","$43","$45","$47"], answer: 2 },
  { q: "If a dozen eggs costs $3, how much do 4 dozen eggs cost?", options: ["$10","$11","$12","$13"], answer: 2 },
  { q: "Aisha runs 3km every morning. How many km does she run in April (30 days)?", options: ["85km","88km","90km","92km"], answer: 2 },
  { q: "A shop bought goods for $500 and sold them for $650. What is the profit?", options: ["$130","$140","$150","$160"], answer: 2 },
  { q: "A mother divides 48 biscuits equally among her 6 children. How many does each child get?", options: ["6","7","8","9"], answer: 2 },
  { q: "Yemi is 14. Her father is 3 times her age. How old is her father?", options: ["38","40","42","44"], answer: 2 },
  { q: "A fish pond has 80 fish. 25 are harvested and 10 new ones are added. How many fish now?", options: ["60","63","65","67"], answer: 2 },
  { q: "A tailor sews 4 dresses per day. How many dresses in 3 weeks?", options: ["78","82","84","88"], answer: 2 },
  { q: "Temi has $80. She spends half on clothes and a quarter on food. How much is left?", options: ["$15","$18","$20","$22"], answer: 2 },
  { q: "A bag of rice lasts a family 10 days. How many bags do they need for 2 months?", options: ["5","6","7","8"], answer: 1 },
  { q: "David earns $200 per month and spends $150. How much does he save in a year?", options: ["$500","$550","$600","$650"], answer: 2 },
  { q: "Fatima buys 3 kg of tomatoes at $2/kg and 2 kg of onions at $1.50/kg. Total?", options: ["$8","$9","$10","$11"], answer: 1 },
  { q: "A rectangular field is 20m long and 15m wide. What is the area?", options: ["250m²","275m²","300m²","325m²"], answer: 2 },
  { q: "Mama Ngozi bakes 24 cakes and sells them for $3 each. How much does she make?", options: ["$62","$68","$72","$78"], answer: 2 },
  { q: "If a car uses 8 litres of fuel per 100km, how much fuel for 250km?", options: ["18L","19L","20L","21L"], answer: 2 },
  { q: "A trader has $1000. He spends 30% on stock and 20% on rent. How much is left?", options: ["$450","$475","$500","$525"], answer: 2 },
  { q: "3 men can build a wall in 6 days. How many days will 1 man take?", options: ["12","15","18","21"], answer: 2 },
  { q: "A school bell rings every 45 minutes. How many times does it ring in 6 hours?", options: ["6","7","8","9"], answer: 2 },
  { q: "Kola scored 60%, 75% and 85% in three tests. What is his average score?", options: ["70%","73%","75%","78%"], answer: 1 },
  { q: "A lorry carries 5 tonnes per trip. How many trips to carry 35 tonnes?", options: ["5","6","7","8"], answer: 2 },
  { q: "A football team scores 2 goals per match. How many goals in 15 matches?", options: ["25","28","30","32"], answer: 2 },
  { q: "A company has 6 departments with 12 workers each. How many workers in total?", options: ["66","68","70","72"], answer: 3 },
  { q: "If a packet of sugar costs $2.50, how much do 6 packets cost?", options: ["$13","$14","$15","$16"], answer: 2 },
  { q: "A school runs from 8am to 2pm. How long is the school day?", options: ["5hrs","6hrs","7hrs","8hrs"], answer: 1 },
  { q: "A student gets $2 pocket money every school day. How much in 4 weeks of school?", options: ["$35","$38","$40","$42"], answer: 2 },
  { q: "A market has 5 stalls. Each earns $80 per day. Total earnings per day?", options: ["$350","$375","$400","$425"], answer: 2 },
  { q: "A baby weighs 3kg at birth and gains 0.5kg every month. Weight at 6 months?", options: ["5.5kg","6.0kg","6.5kg","7.0kg"], answer: 1 },
  { q: "A trader makes $5 profit on each item. Profit from selling 30 items?", options: ["$140","$145","$150","$155"], answer: 2 },
  { q: "A farmer plants 6 seeds in each hole. He has 8 holes. How many seeds total?", options: ["42","44","46","48"], answer: 3 },
  { q: "A supermarket sells 150 items Saturday and half that Sunday. Weekend total?", options: ["210","215","220","225"], answer: 3 },
];

function weightedReward(min, max) {
  const r = Math.random();
  if (r < 0.75) return Number((min + Math.random() * 0.015).toFixed(4));
  if (r < 0.92) return Number((min + 0.015 + Math.random() * 0.015).toFixed(4));
  return Number((max - 0.01 + Math.random() * 0.01).toFixed(4));
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getPopup() {
  return {
    name: POPUP_NAMES[Math.floor(Math.random() * POPUP_NAMES.length)],
    amount: POPUP_AMOUNTS[Math.floor(Math.random() * POPUP_AMOUNTS.length)],
  };
}

function fmt(usd, country, local) {
  if (!local || !country || country.code === "OT") return `$${Number(usd).toFixed(2)}`;
  return `${country.symbol}${Math.floor(usd * country.rate).toLocaleString()}`;
}

function todayStr() { return new Date().toISOString().split("T")[0]; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDailyQuiz() {
  const sl = shuffle(LOGIC_QUESTIONS);
  const ss = shuffle(SIMPLE_QUESTIONS);
  const quiz = [];
  let li = 0, si = 0;
  for (let i = 0; i < 30; i++) {
    if ((i + 1) % 5 === 3 || (i + 1) % 5 === 0) {
      quiz.push({ ...sl[li % sl.length], type: "logic" });
      li++;
    } else {
      quiz.push({ ...ss[si % ss.length], type: "simple" });
      si++;
    }
  }
  return quiz;
}

function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.referrerPolicy = "no-referrer-when-downgrade";
    s.onload = resolve;
    s.onerror = resolve;
    document.head.appendChild(s);
  });
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#0a0a0a;font-family:'Trebuchet MS',sans-serif;}
@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(24px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes coinPop{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-70px) scale(1.6)}}
@keyframes glow{0%,100%{box-shadow:0 0 18px rgba(255,215,0,.2)}50%{box-shadow:0 0 38px rgba(255,215,0,.5)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.toggle-track{width:52px;height:28px;border-radius:14px;cursor:pointer;position:relative;transition:background .3s;}
.toggle-thumb{width:22px;height:22px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:left .3s;}
`;

function Btn({ children, onClick, disabled, style = {} }) {
  const [p, setP] = useState(false);
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseDown={() => !disabled && setP(true)} onMouseUp={() => setP(false)}
      onTouchStart={() => !disabled && setP(true)} onTouchEnd={() => setP(false)}
      style={{ width: "100%", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: "bold", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Trebuchet MS',sans-serif", background: disabled ? "linear-gradient(135deg,#333,#222)" : "linear-gradient(135deg,#FFD700,#B8860B)", color: disabled ? "#666" : "#000", boxShadow: disabled ? "none" : "0 6px 24px rgba(255,215,0,.3)", transform: p ? "scale(.97)" : "scale(1)", transition: "all .15s", ...style }}>
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: "linear-gradient(145deg,#1a1a1a,#111)", border: "1px solid rgba(255,215,0,.12)", borderRadius: 18, padding: 20, ...style }}>{children}</div>;
}

function TextInput({ placeholder, value, onChange, type = "text", maxLength }) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength} style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,215,0,.2)", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'Trebuchet MS',sans-serif" }} />;
}

function CurrencyToggle({ showLocal, setShowLocal, country }) {
  if (!country || country.code === "OT") return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
      <span style={{ color: !showLocal ? GOLD : "rgba(255,255,255,.4)", fontSize: 12, fontWeight: "bold" }}>USD</span>
      <div className="toggle-track" style={{ background: showLocal ? GOLD : "rgba(255,255,255,.2)" }} onClick={() => setShowLocal(s => !s)}>
        <div className="toggle-thumb" style={{ left: showLocal ? "27px" : "3px" }} />
      </div>
      <span style={{ color: showLocal ? GOLD : "rgba(255,255,255,.4)", fontSize: 12, fontWeight: "bold" }}>{country.currency}</span>
    </div>
  );
}

function LivePopup() {
  const [item, setItem] = useState(null);
  const [show, setShow] = useState(false);
  const fire = useCallback(() => { setItem(getPopup()); setShow(true); setTimeout(() => setShow(false), 4500); }, []);
  useEffect(() => {
    const t = setTimeout(fire, 3000);
    const iv = setInterval(fire, 4 * 60 * 1000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [fire]);
  if (!show || !item) return null;
  return (
    <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#1c1c1c,#242424)", border: "1px solid rgba(255,215,0,.35)", borderRadius: 50, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, zIndex: 9999, animation: "slideUp .4s ease", boxShadow: "0 8px 32px rgba(0,0,0,.7)", whiteSpace: "nowrap", maxWidth: "92vw" }}>
      <span style={{ fontSize: 18 }}>💰</span>
      <span style={{ fontSize: 12, color: "#ccc" }}><strong style={{ color: GOLD }}>{item.name}</strong>{" just received "}<strong style={{ color: "#4ade80" }}>${item.amount}</strong>!</span>
    </div>
  );
}

// ── AD OVERLAY (Popunder + reward after 5s skip) ────────────
function AdOverlay({ onComplete }) {
  const [skipIn, setSkipIn] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Fire Adsterra popunder
    loadScript("https://pl29225596.profitablecpmratenetwork.com/e1/31/ce/e131ce5b3fc53dd97d215e7fd8fbd88d.js");
    const t = setInterval(() => {
      setSkipIn(s => {
        if (s <= 1) { clearInterval(t); setCanSkip(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.95)", zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 11, letterSpacing: 2, marginBottom: 24 }}>ADVERTISEMENT</p>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg,#FFD700,#B8860B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, marginBottom: 24, boxShadow: "0 10px 40px rgba(255,215,0,.4)" }}>🎬</div>
      <h3 style={{ color: "#fff", fontSize: 20, marginBottom: 8 }}>Video Ad Playing</h3>
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginBottom: 32, textAlign: "center" }}>Watch the ad to earn your reward. The ad has opened in a new window.</p>
      <button onClick={canSkip ? onComplete : undefined} style={{ background: canSkip ? "linear-gradient(135deg,#FFD700,#B8860B)" : "rgba(255,255,255,.1)", border: "none", borderRadius: 12, padding: "14px 32px", color: canSkip ? "#000" : "rgba(255,255,255,.5)", fontWeight: "bold", fontSize: 15, cursor: canSkip ? "pointer" : "not-allowed", fontFamily: "'Trebuchet MS',sans-serif", transition: "all .3s" }}>
        {canSkip ? "✓ Collect Reward" : `Skip in ${skipIn}s`}
      </button>
    </div>
  );
}

// ── LANDING ────────────────────────────────────────────────
function Landing({ goLogin, goRegister }) {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <LivePopup />
      <div style={{ background: "linear-gradient(160deg,#1a1200,#0a0a0a 60%)", padding: "50px 24px 36px", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>💰</div>
        <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(90deg,#FFD700,#FFF8DC,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DOLLARBAG IQ</h1>
        <p style={{ color: "rgba(255,215,0,.65)", fontSize: 12, letterSpacing: 2, marginBottom: 16 }}>WATCH · MINE · QUIZ · EARN</p>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, lineHeight: 1.75, maxWidth: 360, margin: "0 auto 24px" }}>
          Dollarbag IQ is the leading platform that pays you <strong style={{ color: GOLD }}>real money</strong> for watching videos and completing simple tasks. We earn from advertisers and share the revenue directly with you.
        </p>
        <div style={{ display: "flex", gap: 12, maxWidth: 360, margin: "0 auto 14px" }}>
          <Btn onClick={goRegister} style={{ flex: 1 }}>Create Free Account</Btn>
          <button onClick={goLogin} style={{ flex: 1, background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: "bold", cursor: "pointer", fontFamily: "'Trebuchet MS',sans-serif" }}>Log In</button>
        </div>
        <p style={{ color: "#4ade80", fontSize: 13 }}>🔥 Users earn up to <strong>$5.00+ daily</strong></p>
      </div>
      <div style={{ padding: "20px 20px 40px" }}>
        {[
          { icon: "🎬", title: "Watch Videos & Get Paid", text: "Every single video you watch on Dollarbag IQ puts real money into your account. Advertisers pay us to show you videos and we pass that money directly to you. No skills needed. Just press play, watch to the end, and the cash lands in your wallet. Watch up to 25 videos every single day." },
          { icon: "⛏️", title: "Mine Gold & Get Paid", text: "Every tap of your finger mines digital gold and converts it to real cash. The more you mine, the more you earn. Open the app, start mining and watch your balance grow. Mining is available every day from 8am to 10pm. It is that simple — tap and earn." },
          { icon: "🧮", title: "Answer Questions & Get Paid", text: "Answer simple maths questions and get paid for every correct answer. Questions like 10+4 or 3×3 — nothing complicated. We also have logic questions that make you think a little more and those pay even higher. Up to 30 questions every day." },
          { icon: "👥", title: "Refer Friends & Both Get Paid", text: "Share your unique referral code with a friend. The moment they sign up using your code, you BOTH receive $2.00 instantly. You also continue to earn 10% of everything your friend earns on Dollarbag IQ — for life." },
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
          {[["🎬 Watch 25 Videos", "Up to $2.50"], ["⛏️ Mine Gold", "Unlimited 8am–10pm"], ["🧮 Quiz (30 questions)", "Up to $3.00"], ["👥 Referral Bonuses", "Unlimited"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "rgba(255,255,255,.55)", fontSize: 13 }}>{l}</span>
              <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 13 }}>{v}</span>
            </div>
          ))}
          <p style={{ color: GOLD, fontWeight: "bold", fontSize: 17, marginTop: 10 }}>Minimum $5.00+ every day 🚀</p>
        </div>
        <Btn onClick={goRegister}>Start Earning Now — It Is Free</Btn>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: 12, marginTop: 12 }}>Already have an account?{" "}<span onClick={goLogin} style={{ color: GOLD, cursor: "pointer" }}>Log In here</span></p>
      </div>
    </div>
  );
}

// ── AUTH ───────────────────────────────────────────────────
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
        const { error: pe } = await supabase.from("profiles").upsert({ id: uid, full_name: name.trim(), email: email.trim(), country_code: c.code, country_name: c.name, currency_symbol: c.symbol, currency_rate: c.rate, referral_code: generateCode(), balance: 0, tap_earned_today: 0, videos_watched_today: 0, quiz_answered_today: 0, last_reset_date: todayStr(), total_referrals: 0, referral_earnings: 0, has_withdrawn: false });
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
        if (e) { if (e.message.includes("Email not confirmed")) setErr("Please check your email inbox and click the verification link sent by Supabase before logging in. Check your spam folder too."); else throw e; setLoading(false); return; }
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
        <p style={{ color: "rgba(255,215,0,.55)", fontSize: 13, marginTop: 6 }}>{mode === "register" ? "Create your free account and start earning" : "Welcome back"}</p>
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
            <div>
              <TextInput placeholder="Referral Code (optional)" value={refCode} onChange={e => setRefCode(e.target.value.toUpperCase())} maxLength={5} />
              <p style={{ color: "#4ade80", fontSize: 12, marginTop: 6, paddingLeft: 4 }}>💰 Enter a referral code and get $2.00 instantly</p>
            </div>
          </>
        )}
        {mode === "login" && <div style={{ background: "rgba(255,215,0,.06)", border: "1px solid rgba(255,215,0,.18)", borderRadius: 12, padding: "12px 14px" }}><p style={{ color: "rgba(255,215,0,.75)", fontSize: 12, lineHeight: 1.65 }}>📧 Please check your email inbox and click the verification link sent by Supabase before logging in. Check your spam folder if you cannot find it.</p></div>}
        {err && <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 12, padding: "12px 14px" }}><p style={{ color: "#f87171", fontSize: 13 }}>{err}</p></div>}
        {info && <div style={{ background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 12, padding: "12px 14px" }}><p style={{ color: "#4ade80", fontSize: 13 }}>{info}</p></div>}
        <Btn onClick={submit} disabled={loading}>{loading ? "Please wait..." : mode === "register" ? "Create Account — Start Earning Free" : "Log In to My Account"}</Btn>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,.35)", fontSize: 13 }}>{mode === "register" ? "Already have an account? " : "Don't have an account? "}<span onClick={onSwitch} style={{ color: GOLD, cursor: "pointer", fontWeight: "bold" }}>{mode === "register" ? "Log In" : "Sign Up Free"}</span></p>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────
function MainApp({ user }) {
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocal, setShowLocal] = useState(true);
  const country = COUNTRIES.find(c => c.code === profile?.country_code) || COUNTRIES[0];

  useEffect(() => {
    // Load passive ads
    loadScript("https://pl29225595.profitablecpmratenetwork.com/16/c9/ed/16c9edbca51d9c6e491ad9b2a74e2f5b.js");
  }, []);

  async function loadProfile() {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error || !data) {
      const c = COUNTRIES[0];
      await supabase.from("profiles").upsert({ id: user.id, full_name: user.user_metadata?.full_name || "User", email: user.email, country_code: c.code, country_name: c.name, currency_symbol: c.symbol, currency_rate: c.rate, referral_code: generateCode(), balance: 0, tap_earned_today: 0, videos_watched_today: 0, quiz_answered_today: 0, last_reset_date: todayStr(), total_referrals: 0, referral_earnings: 0, has_withdrawn: false });
      const { data: d2 } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(d2);
    } else {
      if (data.last_reset_date !== todayStr()) {
        const { data: d2 } = await supabase.from("profiles").update({ tap_earned_today: 0, videos_watched_today: 0, quiz_answered_today: 0, last_reset_date: todayStr() }).eq("id", user.id).select().single();
        setProfile(d2 || data);
      } else setProfile(data);
    }
    setLoading(false);
  }

  useEffect(() => { loadProfile(); }, []);
  function patch(u) { setProfile(p => ({ ...p, ...u })); }

  if (loading) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 56, marginBottom: 14 }}>💰</div><p style={{ color: GOLD, fontSize: 16 }}>Loading your wallet...</p></div></div>;

  const TABS = [{ id: "home", icon: "🏠", label: "Home" }, { id: "earn", icon: "💵", label: "Earn" }, { id: "referral", icon: "👥", label: "Refer" }, { id: "wallet", icon: "💳", label: "Wallet" }];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingBottom: 80, color: "#fff" }}>
      <LivePopup />
      {tab === "home" && <Home profile={profile} country={country} showLocal={showLocal} setShowLocal={setShowLocal} goEarn={() => setTab("earn")} goRefer={() => setTab("referral")} />}
      {tab === "earn" && <Earn profile={profile} uid={user.id} country={country} showLocal={showLocal} patch={patch} reload={loadProfile} />}
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

// ── HOME ───────────────────────────────────────────────────
function Home({ profile, country, showLocal, setShowLocal, goEarn, goRefer }) {
  const bal = profile?.balance || 0;
  const balDisplay = showLocal && country.code !== "OT" ? `${country.symbol}${Math.floor(bal * country.rate).toLocaleString()}` : `$${bal.toFixed(2)}`;

  // Adsterra banner
  useEffect(() => {
    const s1 = document.createElement("script");
    s1.innerHTML = `atOptions={'key':'0cf5aa3166a9e5ddba05cf2e9b92e5fb','format':'iframe','height':250,'width':300,'params':{}};`;
    const s2 = document.createElement("script");
    s2.src = "https://www.highperformanceformat.com/0cf5aa3166a9e5ddba05cf2e9b92e5fb/invoke.js";
    s2.async = true;
    const container = document.getElementById("adsterra-banner");
    if (container && !container.hasChildNodes()) {
      container.appendChild(s1);
      container.appendChild(s2);
    }
  }, []);

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
        <p style={{ color: "rgba(255,215,0,.45)", fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>TOTAL BALANCE</p>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: GOLD, marginBottom: 10 }}>{balDisplay}</h1>
        {showLocal && country.code !== "OT" && <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginBottom: 12 }}>≈ ${bal.toFixed(2)} USD</p>}
        <CurrencyToggle showLocal={showLocal} setShowLocal={setShowLocal} country={country} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { icon: "🎬", label: "Videos Today", val: `${profile?.videos_watched_today || 0}/${MAX_VIDEOS}` },
          { icon: "👥", label: "My Referrals", val: profile?.total_referrals || 0 },
          { icon: "⛏️", label: "Mine Gold", val: fmt(profile?.tap_earned_today || 0, country, showLocal) },
          { icon: "🧮", label: "Quiz Today", val: `${profile?.quiz_answered_today || 0}/${QUIZ_DAILY_MAX}` },
        ].map(item => (
          <Card key={item.label} style={{ textAlign: "center", padding: 14 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ color: GOLD, fontWeight: "bold", fontSize: 17 }}>{item.val}</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 10, marginTop: 3 }}>{item.label}</div>
          </Card>
        ))}
      </div>

      {/* Adsterra Banner */}
      <div id="adsterra-banner" style={{ textAlign: "center", marginBottom: 16, minHeight: 50 }} />

      <Btn onClick={goEarn} style={{ marginBottom: 12 }}>💵 Start Earning Now</Btn>
      <button onClick={goRefer} style={{ width: "100%", background: "transparent", border: "1px solid rgba(255,215,0,.22)", borderRadius: 14, padding: "14px 0", color: GOLD, fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "'Trebuchet MS',sans-serif" }}>
        👥 Invite Friends — You Both Earn {fmt(REFERRAL_BONUS, country, showLocal)}
      </button>
    </div>
  );
}

// ── EARN (VERTICAL) ────────────────────────────────────────
function Earn({ profile, uid, country, showLocal, patch, reload }) {
  const [taps, setTaps] = useState(0);
  const [pops, setPops] = useState([]);
  const [showAd, setShowAd] = useState(false);
  const [adReason, setAdReason] = useState("video");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [quiz, setQuiz] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT);
  const [showResult, setShowResult] = useState(null);
  const timerRef = useRef(null);
  const hour = new Date().getHours();
  const mineAllowed = hour >= 8 && hour < 22;

  useEffect(() => { setQuiz(buildDailyQuiz()); }, []);

  function flash(text, type = "ok") { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 3000); }

  // ── TAP ──
  async function tap() {
    if (!mineAllowed) return flash("Mine Gold is available from 8am to 10pm. Come back to continue mining!", "warn");
    const n = taps + 1; setTaps(n);
    if (n % TAPS_PER_REWARD === 0) {
      const id = Date.now();
      setPops(p => [...p, id]);
      setTimeout(() => setPops(p => p.filter(x => x !== id)), 900);
      const newBal = Number(((profile?.balance || 0) + TAP_REWARD).toFixed(4));
      const newTap = Number(((profile?.tap_earned_today || 0) + TAP_REWARD).toFixed(4));
      patch({ balance: newBal, tap_earned_today: newTap });
      await supabase.from("profiles").update({ balance: newBal, tap_earned_today: newTap }).eq("id", uid);
      if (profile?.referred_by) {
        const { data: ref } = await supabase.from("profiles").select("balance,referral_earnings").eq("id", profile.referred_by).single();
        if (ref) await supabase.from("profiles").update({ balance: Number((ref.balance || 0) + TAP_REWARD * REFERRAL_PERCENT).toFixed(4), referral_earnings: Number((ref.referral_earnings || 0) + TAP_REWARD * REFERRAL_PERCENT).toFixed(4) }).eq("id", profile.referred_by);
      }
    }
  }

  // ── VIDEO ──
  function watchVideo() {
    if ((profile?.videos_watched_today || 0) >= MAX_VIDEOS) return flash("You have watched all 25 videos for today. Come back tomorrow!", "warn");
    setAdReason("video");
    setShowAd(true);
  }

  async function onAdComplete() {
    setShowAd(false);
    if (adReason === "video") {
      const reward = weightedReward(VIDEO_REWARD_MIN, VIDEO_REWARD_MAX);
      const newWatched = (profile?.videos_watched_today || 0) + 1;
      const newBal = Number(((profile?.balance || 0) + reward).toFixed(4));
      patch({ balance: newBal, videos_watched_today: newWatched });
      await supabase.from("profiles").update({ balance: newBal, videos_watched_today: newWatched }).eq("id", uid);
      if (profile?.referred_by) {
        const { data: ref } = await supabase.from("profiles").select("balance,referral_earnings").eq("id", profile.referred_by).single();
        if (ref) await supabase.from("profiles").update({ balance: Number((ref.balance || 0) + reward * REFERRAL_PERCENT).toFixed(4), referral_earnings: Number((ref.referral_earnings || 0) + reward * REFERRAL_PERCENT).toFixed(4) }).eq("id", profile.referred_by);
      }
      flash(`+${fmt(reward, country, showLocal)} added to your wallet! 🎉`, "ok");
    } else {
      nextQuestion(qIndex + 1);
    }
  }

  // ── QUIZ TIMER ──
  useEffect(() => {
    if (selected !== null || showResult !== null) return;
    if ((profile?.quiz_answered_today || 0) >= QUIZ_DAILY_MAX) return;
    setTimeLeft(QUIZ_TIME_LIMIT);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(-1); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIndex, selected]);

  async function handleAnswer(idx) {
    clearInterval(timerRef.current);
    if (selected !== null) return;
    setSelected(idx);
    const q = quiz[qIndex % quiz.length];
    const correct = idx === q.answer;
    let reward = 0;
    const newQuiz = (profile?.quiz_answered_today || 0) + 1;
    if (correct) {
      reward = q.type === "logic" ? weightedReward(QUIZ_REWARD_LOGIC_MIN, QUIZ_REWARD_LOGIC_MAX) : weightedReward(QUIZ_REWARD_SIMPLE_MIN, QUIZ_REWARD_SIMPLE_MAX);
      const newBal = Number(((profile?.balance || 0) + reward).toFixed(4));
      patch({ balance: newBal, quiz_answered_today: newQuiz });
      await supabase.from("profiles").update({ balance: newBal, quiz_answered_today: newQuiz }).eq("id", uid);
      if (profile?.referred_by) {
        const { data: ref } = await supabase.from("profiles").select("balance,referral_earnings").eq("id", profile.referred_by).single();
        if (ref) await supabase.from("profiles").update({ balance: Number((ref.balance || 0) + reward * REFERRAL_PERCENT).toFixed(4), referral_earnings: Number((ref.referral_earnings || 0) + reward * REFERRAL_PERCENT).toFixed(4) }).eq("id", profile.referred_by);
      }
    } else {
      patch({ quiz_answered_today: newQuiz });
      await supabase.from("profiles").update({ quiz_answered_today: newQuiz }).eq("id", uid);
    }
    setShowResult({ correct, reward, correctAnswer: q.answer });
    setTimeout(() => {
      setShowResult(null); setSelected(null);
      const next = qIndex + 1;
      if (next % 5 === 0 && next < QUIZ_DAILY_MAX) { setAdReason("quiz"); setShowAd(true); }
      else nextQuestion(next);
    }, 2000);
  }

  function nextQuestion(next) {
    if (next >= quiz.length) setQuiz(buildDailyQuiz());
    setQIndex(next % QUIZ_DAILY_MAX);
    setSelected(null); setShowResult(null);
  }

  const videosLeft = MAX_VIDEOS - (profile?.videos_watched_today || 0);
  const quizLeft = QUIZ_DAILY_MAX - (profile?.quiz_answered_today || 0);
  const currentQ = quiz[qIndex % quiz.length];
  const msgColor = msg.type === "ok" ? "#4ade80" : "#fbbf24";

  return (
    <div style={{ padding: "24px 20px" }}>
      {showAd && <AdOverlay onComplete={onAdComplete} />}
      <h2 style={{ color: GOLD, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>Earn Money</h2>
      <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginBottom: 20 }}>Scroll down to see all 3 ways to earn</p>

      {msg.text && <div style={{ background: `${msgColor}18`, border: `1px solid ${msgColor}44`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: msgColor, fontSize: 13, textAlign: "center" }}>{msg.text}</div>}

      {/* ── WATCH & EARN ── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>🎬</span>
          <h3 style={{ color: GOLD, fontSize: 18, fontWeight: "bold" }}>Watch & Earn</h3>
        </div>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>Earn between $0.04 to $2.00 for each video</p>
            <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 13, flexShrink: 0, marginLeft: 8 }}>{videosLeft} left</span>
          </div>
          <div style={{ background: "#222", borderRadius: 6, height: 5, marginBottom: 6 }}>
            <div style={{ background: "linear-gradient(90deg,#FFD700,#B8860B)", height: "100%", borderRadius: 6, width: `${((profile?.videos_watched_today || 0) / MAX_VIDEOS) * 100}%`, transition: "width .4s" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,.22)", fontSize: 11, textAlign: "center", marginBottom: 14 }}>{profile?.videos_watched_today || 0}/{MAX_VIDEOS} watched today</p>
          <Btn onClick={watchVideo} disabled={videosLeft === 0}>
            {videosLeft === 0 ? "✅ All Done for Today!" : "▶ Watch Video & Earn"}
          </Btn>
        </Card>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: "rgba(255,215,0,.08)", margin: "24px 0" }} />

      {/* ── MINE GOLD ── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>⛏️</span>
          <h3 style={{ color: GOLD, fontSize: 18, fontWeight: "bold" }}>Mine Gold</h3>
        </div>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>Every 3 taps = {fmt(TAP_REWARD, country, showLocal)} · 8am–10pm daily</p>
            <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: 13, flexShrink: 0, marginLeft: 8 }}>{fmt(profile?.tap_earned_today || 0, country, showLocal)}</span>
          </div>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12, lineHeight: 1.6, marginBottom: 16, textAlign: "center" }}>
            Every tap of your finger mines digital gold and converts it to real cash. The more you mine, the more you earn!
          </p>
          <div style={{ textAlign: "center", position: "relative", padding: "8px 0 16px" }}>
            {pops.map(id => (
              <div key={id} style={{ position: "absolute", top: "10%", left: "50%", transform: "translate(-50%,-50%)", color: "#4ade80", fontWeight: "bold", fontSize: 20, animation: "coinPop .9s ease forwards", pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap" }}>
                +{fmt(TAP_REWARD, country, showLocal)}
              </div>
            ))}
            <button onClick={tap} disabled={!mineAllowed}
              onMouseDown={e => { if (mineAllowed) e.currentTarget.style.transform = "scale(.91)"; }}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onTouchStart={e => { if (mineAllowed) e.currentTarget.style.transform = "scale(.91)"; }}
              onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
              style={{ width: 130, height: 130, borderRadius: "50%", border: "none", fontSize: 48, cursor: mineAllowed ? "pointer" : "not-allowed", background: mineAllowed ? "linear-gradient(135deg,#FFD700,#B8860B)" : "linear-gradient(135deg,#2a2a2a,#1a1a1a)", boxShadow: mineAllowed ? "0 10px 40px rgba(255,215,0,.4)" : "none", transition: "transform .08s", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>⛏️</button>
          </div>
          <p style={{ color: "rgba(255,255,255,.28)", fontSize: 12, textAlign: "center" }}>
            {!mineAllowed ? "⏰ Mining available 8am to 10pm daily" : `Taps: ${taps} · ${TAPS_PER_REWARD - (taps % TAPS_PER_REWARD)} more to earn`}
          </p>
        </Card>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: "rgba(255,215,0,.08)", margin: "24px 0" }} />

      {/* ── MATHS QUIZ ── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>🧮</span>
            <h3 style={{ color: GOLD, fontSize: 18, fontWeight: "bold" }}>Maths Quiz</h3>
          </div>
          <span style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>{profile?.quiz_answered_today || 0}/{QUIZ_DAILY_MAX} today</span>
        </div>

        {quizLeft <= 0 ? (
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🎉</div>
            <h3 style={{ color: GOLD, marginBottom: 10 }}>All Done for Today!</h3>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: 14 }}>You have answered all 30 questions. Come back tomorrow!</p>
          </Card>
        ) : currentQ && (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>{currentQ.type === "logic" ? "🧠" : "🧮"}</span>
                <span style={{ color: currentQ.type === "logic" ? "#f59e0b" : "#4ade80", fontSize: 11, fontWeight: "bold" }}>
                  {currentQ.type === "logic" ? "LOGIC — Higher Reward!" : "MATHS"}
                </span>
              </div>
              <span style={{ color: timeLeft <= 5 ? "#ef4444" : "rgba(255,255,255,.4)", fontSize: 13, fontWeight: "bold" }}>{timeLeft}s</span>
            </div>
            <div style={{ background: "#222", borderRadius: 4, height: 4, marginBottom: 16, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, background: timeLeft > 10 ? "#4ade80" : timeLeft > 5 ? "#fbbf24" : "#ef4444", width: `${(timeLeft / QUIZ_TIME_LIMIT) * 100}%`, transition: "width 1s linear, background .3s" }} />
            </div>
            <p style={{ color: "#fff", fontSize: 15, lineHeight: 1.6, marginBottom: 16, fontWeight: "500" }}>{currentQ.q}</p>
            {showResult && (
              <div style={{ background: showResult.correct ? "rgba(74,222,128,.12)" : "rgba(248,113,113,.12)", border: `1px solid ${showResult.correct ? "rgba(74,222,128,.4)" : "rgba(248,113,113,.4)"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 14, textAlign: "center", animation: "fadeIn .3s ease" }}>
                {showResult.correct
                  ? <p style={{ color: "#4ade80", fontWeight: "bold" }}>✅ Correct! +{fmt(showResult.reward, country, showLocal)} earned!</p>
                  : <p style={{ color: "#f87171", fontWeight: "bold" }}>❌ Wrong! Correct answer: <strong>{currentQ.options[currentQ.answer]}</strong></p>}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {currentQ.options.map((opt, i) => {
                let bg = "rgba(255,255,255,.04)", border = "1px solid rgba(255,255,255,.08)", color = "#fff";
                if (selected !== null) {
                  if (i === currentQ.answer) { bg = "rgba(74,222,128,.15)"; border = "1px solid #4ade80"; color = "#4ade80"; }
                  else if (i === selected && selected !== currentQ.answer) { bg = "rgba(248,113,113,.15)"; border = "1px solid #f87171"; color = "#f87171"; }
                }
                return (
                  <button key={i} onClick={() => selected === null && handleAnswer(i)} style={{ background: bg, border, borderRadius: 12, padding: "14px 16px", textAlign: "left", fontSize: 14, color, cursor: selected !== null ? "default" : "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Trebuchet MS',sans-serif", transition: "all .2s" }}>
                    <span style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                      {["A","B","C","D"][i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── REFER ──────────────────────────────────────────────────
function Refer({ profile, country, showLocal }) {
  const [copied, setCopied] = useState(false);
  const waMessage = `🤑 I think you need to know this.\n\nI am making real money on Dollarbag IQ!\n\n*Watch videos*\n*Tap and earn*\n\nThey also ask simple maths questions and if you get any question correct, you will get paid!\n\nJoin with my code *${profile?.referral_code || "-----"}* and BOTH OF US will get $2.00 instantly!\n\nRegister here: https://tinyurl.com/dollarbag-iq`;

  function copyCode() { navigator.clipboard.writeText(waMessage).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  function whatsapp() { window.open(`https://wa.me/?text=${encodeURIComponent(waMessage)}`); }

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
          <button onClick={copyCode} style={{ flex: 1, background: copied ? "rgba(74,222,128,.12)" : "rgba(255,215,0,.08)", border: `1px solid ${copied ? "rgba(74,222,128,.4)" : "rgba(255,215,0,.25)"}`, borderRadius: 12, padding: "12px 0", color: copied ? "#4ade80" : GOLD, fontWeight: "bold", fontSize: 13, cursor: "pointer", fontFamily: "'Trebuchet MS',sans-serif" }}>
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

// ── WALLET ──────────────────────────────────────────────────
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
          ["🎬 Video Earnings Today", fmt((profile?.videos_watched_today || 0) * VIDEO_REWARD_MIN, country, showLocal)],
          ["⛏️ Mine Gold Today", fmt(profile?.tap_earned_today || 0, country, showLocal)],
          ["🧮 Quiz Earnings Today", fmt((profile?.quiz_answered_today || 0) * QUIZ_REWARD_SIMPLE_MIN, country, showLocal)],
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

// ── ROOT ───────────────────────────────────────────────────
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
