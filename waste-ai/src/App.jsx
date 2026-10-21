import { useState, useRef, useEffect, Fragment } from "react";
import {
  Upload, Cpu, Database, AlertTriangle, BarChart3, Leaf, History,
  CheckCircle2, Camera, CameraOff, SwitchCamera, Scan,
  Globe, Recycle, TreePine, Home, FlaskConical, BookOpen, Settings,
  Info, ChevronRight, ChevronDown, ChevronLeft, Trash2, Wind, Droplets, Package, Zap,
  ArrowRight, Target, ShieldCheck, Layers, Rocket, Users, Gauge,
  Thermometer, Lightbulb, FileText, X, Menu,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --soil:#1C2B1A; --bark:#263824; --moss:#2E4D2B; --fern:#3A6635; --leaf:#4E8A46;
    --sprout:#6FAF63; --dew:#9ED494; --mist:#C8ECC2; --parchment:#F2EEE5; --cream:#F9F6F0;
    --sand:#E6DAC6; --clay:#C2A47E; --amber:#B8793A; --rust:#8C4515; --sky:#6BA8C2;
    --river:#3E8FA8; --stone:#7A9178; --ash:#5D7060;
    --t-dark:#162316; --t-mid:#2E4E2E; --t-soft:#587258; --t-muted:#8AA888;
    --border:rgba(46,77,43,0.13); --border-s:rgba(46,77,43,0.26);
    --shadow:0 4px 24px rgba(28,43,26,0.10); --shadow-lg:0 8px 40px rgba(28,43,26,0.15);
  }

  html { scroll-behavior: smooth; }
  body { font-family:'DM Sans',sans-serif; background:var(--cream); color:var(--t-dark); min-height:100vh; font-size:15px; line-height:1.7; }
  h1,h2,h3,h4 { font-family:'Fraunces',Georgia,serif; line-height:1.2; color:var(--soil); }
  button:focus-visible, a:focus-visible, input:focus-visible { outline:2px solid var(--sprout); outline-offset:2px; }

  body::after {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:0.025;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }

  /* ── Top bar + dropdown menu ── */
  .topbar { background:rgba(28,43,26,.92); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-bottom:1px solid rgba(110,175,99,0.14); position:sticky; top:0; z-index:200; }
  .topbar-in { max-width:1340px; margin:0 auto; padding:0 2rem; height:68px; display:flex; align-items:center; justify-content:space-between; gap:1rem; }
  .logo-wrap { display:flex; align-items:center; gap:12px; cursor:pointer; background:none; border:none; text-align:left; }
  .logo-mark { width:42px; height:42px; background:linear-gradient(135deg,var(--fern),var(--leaf)); border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 10px rgba(78,138,70,0.35); flex-shrink:0; }
  .logo-eye { font-size:11px; color:var(--stone); letter-spacing:.04em; }
  .logo-nm { font-family:'Fraunces',serif; font-size:18px; color:var(--mist); letter-spacing:-.01em; line-height:1.1; }

  .nav-links { display:flex; align-items:center; gap:2px; }
  .nav-link { position:relative; display:flex; align-items:center; gap:7px; padding:9px 13px; border:none; background:transparent; color:var(--stone); font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500; cursor:pointer; border-radius:10px; transition:color .2s, background .2s; white-space:nowrap; }
  .nav-link:hover { color:var(--mist); background:rgba(110,175,99,.1); }
  .nav-link.cur { color:#fff; background:rgba(110,175,99,.16); }
  .nav-link.cur::after { content:''; position:absolute; left:14px; right:14px; bottom:-15px; height:3px; border-radius:3px 3px 0 0; background:linear-gradient(90deg,var(--sprout),var(--dew)); }
  .nav-link.cta { margin-left:8px; background:linear-gradient(135deg,var(--fern),var(--leaf)); color:#fff; box-shadow:0 3px 12px rgba(78,138,70,.4); }
  .nav-link.cta:hover { transform:translateY(-1px); box-shadow:0 5px 16px rgba(78,138,70,.5); }
  .nav-link.cta.cur::after { display:none; }
  .burger { display:none; align-items:center; gap:8px; padding:9px 14px; border-radius:11px; border:1px solid rgba(110,175,99,.3); background:rgba(110,175,99,.1); color:var(--dew); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500; }
  .burger:hover { background:rgba(110,175,99,.18); }
  .drawer-back { position:fixed; inset:68px 0 0 0; background:rgba(14,24,13,.55); backdrop-filter:blur(3px); z-index:150; animation:fadeIn .2s ease; }
  .drawer { position:absolute; left:0; right:0; top:100%; background:var(--soil); border-bottom:1px solid rgba(110,175,99,.2); box-shadow:0 18px 40px rgba(0,0,0,.35); padding:14px 1rem 18px; max-height:calc(100vh - 68px); overflow:auto; animation:fadeIn .2s ease; z-index:210; }
  .drawer-grid { max-width:1340px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:8px; }
  .drawer-item { display:flex; gap:12px; align-items:center; text-align:left; padding:11px 12px; border-radius:12px; border:1px solid rgba(110,175,99,.12); background:rgba(255,255,255,.03); cursor:pointer; font-family:'DM Sans',sans-serif; transition:background .2s, border-color .2s; }
  .drawer-item:hover { background:rgba(110,175,99,.12); border-color:rgba(110,175,99,.3); }
  .drawer-item.cur { background:rgba(110,175,99,.18); border-color:var(--sprout); }
  .drawer-ico { width:36px; height:36px; border-radius:10px; background:rgba(110,175,99,.14); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .drawer-t { font-weight:600; color:var(--mist); font-size:14px; line-height:1.3; }
  .drawer-d { font-size:12px; color:var(--stone); line-height:1.4; }

  .strip { background:var(--moss); padding:9px 2rem; text-align:center; }
  .strip p { font-size:12.5px; color:var(--dew); opacity:.9; }

  /* ── Hero ── */
  .hero { background:var(--soil); position:relative; overflow:hidden; padding:5.5rem 2rem 5rem; }
  .hero::before { content:''; position:absolute; inset:0; background:
      radial-gradient(ellipse 60% 80% at 85% 50%, rgba(58,102,53,.28) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 5% 90%, rgba(78,138,70,.16) 0%, transparent 65%); }
  .hero-in { max-width:1340px; margin:0 auto; position:relative; z-index:1; display:grid; grid-template-columns:1.05fr .95fr; gap:4rem; align-items:center; }
  .badge { display:inline-flex; align-items:center; gap:7px; background:rgba(110,175,99,.12); border:1px solid rgba(110,175,99,.24); border-radius:100px; padding:5px 14px 5px 9px; font-size:12px; color:var(--dew); margin-bottom:1.4rem; }
  .badge-dot { width:6px; height:6px; border-radius:50%; background:var(--sprout); }
  .hero-title { font-size:clamp(3rem,6vw,4.6rem); color:#fff; line-height:1; margin-bottom:.9rem; font-weight:600; letter-spacing:-.02em; }
  .hero-sub { font-family:'Fraunces',serif; font-size:clamp(1.05rem,1.6vw,1.3rem); color:var(--mist); font-weight:300; line-height:1.4; margin-bottom:1.1rem; max-width:560px; }
  .hero-desc { color:var(--stone); font-size:15px; line-height:1.85; max-width:520px; margin-bottom:2rem; }
  .cta-row { display:flex; gap:10px; flex-wrap:wrap; }
  .btn-p { background:linear-gradient(135deg,var(--fern),var(--leaf)); color:#fff; border:none; border-radius:11px; padding:12px 24px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:7px; box-shadow:0 4px 14px rgba(78,138,70,.4); transition:transform .15s, box-shadow .2s; }
  .btn-p:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(78,138,70,.5); }
  .btn-o { background:transparent; color:var(--mist); border:1px solid rgba(200,236,194,.22); border-radius:11px; padding:12px 24px; font-family:'DM Sans',sans-serif; font-size:13.5px; cursor:pointer; display:inline-flex; align-items:center; gap:7px; transition:all .2s; }
  .btn-o:hover { background:rgba(200,236,194,.07); border-color:rgba(200,236,194,.38); }

  .gap-panel { background:rgba(255,255,255,.04); border:1px solid rgba(110,175,99,.16); border-radius:20px; padding:1.7rem; }
  .gap-panel h3 { color:var(--mist); font-size:1.15rem; margin-bottom:.3rem; }
  .gap-panel > p { font-size:13px; color:var(--stone); margin-bottom:1.3rem; line-height:1.55; }
  .legend { display:flex; gap:16px; flex-wrap:wrap; font-size:12px; margin-bottom:1rem; color:var(--t-soft); }
  .legend span { display:inline-flex; align-items:center; gap:6px; }
  .legend i { width:10px; height:10px; border-radius:3px; display:inline-block; }
  .dark .legend { color:var(--stone); }

  /* ── Sections ── */
  .wrap { max-width:1340px; margin:0 auto; padding:4.5rem 2rem; }
  .wrap-alt { background:var(--parchment); }
  .wrap-dark { background:var(--soil); }
  .inner { max-width:1340px; margin:0 auto; padding:4.5rem 2rem; }
  .divider { height:1px; background:linear-gradient(90deg,transparent,var(--border-s),transparent); }
  .eyebrow { font-size:13px; font-weight:600; margin-bottom:.45rem; }
  .sec-title { font-size:clamp(1.55rem,2.8vw,2.1rem); margin-bottom:1.1rem; }
  .sec-title-light { color:var(--cream); }
  .sec-lead { font-size:15px; color:var(--t-soft); line-height:1.8; max-width:700px; margin-bottom:2.25rem; }
  .sub-title { font-size:1.2rem; margin:2.2rem 0 .9rem; }

  .sub-tabs { display:flex; gap:6px; margin-bottom:2rem; background:var(--parchment); border:1px solid var(--border); border-radius:13px; padding:5px; width:fit-content; max-width:100%; overflow-x:auto; }
  .sub-tab { display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; transition:all .2s; background:transparent; color:var(--t-soft); white-space:nowrap; }
  .sub-tab.on { background:var(--moss); color:var(--dew); box-shadow:0 2px 10px rgba(46,77,43,.25); }
  .sub-tab:not(.on):hover { background:var(--sand); color:var(--t-dark); }

  /* ── Cards ── */
  .card { background:#fff; border:1px solid var(--border); border-radius:20px; padding:1.9rem; position:relative; overflow:hidden; box-shadow:var(--shadow); }
  .card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--leaf),var(--dew),var(--sprout)); }
  .card-icon { width:48px; height:48px; border-radius:13px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; background:var(--mist); }
  .card-title { font-family:'Fraunces',serif; font-size:1.25rem; margin-bottom:.5rem; }
  .card-desc { font-size:13.5px; color:var(--t-soft); line-height:1.65; margin-bottom:1.25rem; }
  .g2 { display:grid; grid-template-columns:1fr .85fr; gap:1.4rem; }
  .g2e { display:grid; grid-template-columns:1fr 1fr; gap:1.4rem; }
  .g3 { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.2rem; }
  .gcol { display:flex; flex-direction:column; gap:1.25rem; }

  /* ── Camera ── */
  .cam-view { background:var(--bark); border-radius:14px; overflow:hidden; position:relative; min-height:235px; display:flex; align-items:center; justify-content:center; margin:1.1rem 0; }
  .cam-ph { text-align:center; padding:2rem; color:var(--stone); }
  .live-badge { position:absolute; top:11px; left:11px; background:rgba(20,38,20,.72); border:1px solid rgba(110,175,99,.38); border-radius:100px; padding:3px 11px; display:flex; align-items:center; gap:6px; font-size:11px; color:var(--dew); }
  .live-dot { width:7px; height:7px; border-radius:50%; background:var(--sprout); animation:pulse 1.4s ease-in-out infinite; }
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

  .btn-g { background:linear-gradient(135deg,var(--fern),var(--leaf)); color:#fff; border:none; border-radius:11px; padding:10px 20px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:7px; box-shadow:0 3px 12px rgba(78,138,70,.35); transition:transform .15s, box-shadow .2s; }
  .btn-g:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 5px 18px rgba(78,138,70,.45); }
  .btn-g:disabled { opacity:.45; cursor:not-allowed; }
  .btn-gh { background:var(--parchment); color:var(--t-mid); border:1px solid var(--border-s); border-radius:11px; padding:10px 17px; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:background .2s; }
  .btn-gh:hover { background:var(--sand); }
  .ctrl-row { display:flex; flex-wrap:wrap; gap:9px; align-items:center; margin-top:.9rem; }

  .res-box { background:linear-gradient(135deg,#eef7e9,#e0f3d6); border:1px solid rgba(78,138,70,.28); border-radius:14px; padding:1.2rem; margin-top:1.1rem; }
  .res-cls { font-family:'Fraunces',serif; font-size:1.15rem; color:var(--moss); margin-bottom:4px; text-transform:capitalize; }
  .res-conf { font-size:13px; color:var(--t-soft); }
  .err-box { background:#fff8f2; border:1px solid rgba(184,115,51,.28); border-radius:13px; padding:.9rem 1.1rem; margin-top:.9rem; color:var(--rust); font-size:13.5px; }
  .status { display:inline-flex; align-items:center; gap:8px; font-size:12.5px; border-radius:100px; padding:5px 13px; border:1px solid var(--border-s); background:#fff; color:var(--t-mid); }
  .status i { width:8px; height:8px; border-radius:50%; background:var(--clay); display:inline-block; }
  .status.online i { background:var(--sprout); }
  .status.offline { border-color:rgba(184,115,51,.4); background:#fff4e3; color:var(--rust); }
  .status.offline i { background:var(--amber); }
  .status-row { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:1.5rem; }
  .status-row small { font-size:12.5px; color:var(--t-soft); }
  .rel-note { display:flex; gap:9px; align-items:flex-start; border-radius:12px; padding:.85rem 1rem; margin-top:.9rem; font-size:12.8px; line-height:1.55; }
  .rel-note.warn { background:#fff4e3; border:1px solid rgba(184,115,51,.35); color:var(--rust); }
  .rel-note.info { background:rgba(107,168,194,.09); border:1px solid rgba(107,168,194,.25); color:var(--river); }

  .disposal-panel { background:linear-gradient(135deg,#eef9e8,#e5f5dc); border:1px solid rgba(78,138,70,.3); border-radius:16px; padding:1.4rem; margin-top:1.2rem; animation:fadeIn .35s ease; }
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .disposal-head { display:flex; align-items:center; gap:9px; margin-bottom:1rem; border-bottom:1px solid rgba(78,138,70,.18); padding-bottom:.85rem; }
  .disposal-head h4 { font-size:1rem; color:var(--moss); }
  .disposal-tag { display:inline-flex; align-items:center; gap:5px; background:var(--leaf); color:#fff; border-radius:8px; padding:3px 11px; font-size:11.5px; font-weight:600; margin-bottom:.9rem; }
  .disposal-steps { display:flex; flex-direction:column; gap:8px; }
  .dstep { display:flex; align-items:flex-start; gap:10px; background:#fff; border-radius:11px; padding:10px 13px; border:1px solid rgba(78,138,70,.14); font-size:13px; color:var(--t-mid); }
  .dstep-num { width:22px; height:22px; border-radius:50%; background:linear-gradient(135deg,var(--fern),var(--leaf)); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
  .disposal-tip { background:rgba(78,138,70,.07); border-radius:10px; padding:10px 13px; font-size:12.5px; color:var(--t-soft); margin-top:.85rem; display:flex; gap:8px; align-items:flex-start; }

  .history { background:var(--parchment); border:1px solid var(--border); border-radius:20px; padding:1.9rem; margin-top:1.5rem; }
  .history-head { display:flex; align-items:center; gap:9px; margin-bottom:1.1rem; }
  .history-title { font-size:1.15rem; }
  .hgrid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .hcard-item { background:#fff; border:1px solid var(--border); border-radius:14px; padding:1rem 1.1rem; box-shadow:0 2px 12px rgba(28,43,26,.06); }
  .hcard-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:.8rem; }
  .hl { font-size:11px; color:var(--t-muted); letter-spacing:.04em; }
  .hv { font-size:13.5px; color:var(--t-dark); }
  .hcls { font-family:'Fraunces',serif; font-size:.98rem; color:var(--moss); text-transform:capitalize; }
  .empty { background:#fff; border:1px dashed var(--border-s); border-radius:13px; padding:1.5rem; text-align:center; color:var(--t-muted); font-size:13px; }

  .setup-list { display:flex; flex-direction:column; gap:9px; margin-top:1.1rem; }
  .setup-item { background:var(--parchment); border:1px solid var(--border); border-radius:11px; padding:12px 15px; font-size:13px; color:var(--t-mid); display:flex; align-items:center; gap:9px; }
  .setup-dot { width:7px; height:7px; border-radius:50%; background:var(--leaf); flex-shrink:0; }

  .dgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1rem; }
  .dcard { background:#fff; border:1px solid var(--border); border-radius:16px; padding:1.35rem 1.4rem; position:relative; overflow:hidden; box-shadow:var(--shadow); }
  .dcard::after { content:''; position:absolute; bottom:0; left:0; width:100%; height:3px; background:linear-gradient(90deg,var(--dew),var(--sky)); }
  .dname { font-size:1.05rem; color:var(--soil); margin-bottom:6px; }
  .dinfo { font-size:13px; color:var(--t-soft); line-height:1.55; }
  .dtag { display:inline-block; margin-top:10px; background:var(--mist); color:var(--moss); font-size:11.5px; font-weight:600; border-radius:6px; padding:3px 9px; }

  .chip-wrap { display:flex; flex-wrap:wrap; gap:9px; }
  .chip { background:#fff; border:1px solid var(--border-s); border-radius:10px; padding:7px 14px; font-size:13px; color:var(--t-mid); }

  .stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:1rem; }
  .stat-card { background:#fff; border:1px solid var(--border); border-radius:16px; padding:1.5rem; box-shadow:var(--shadow); }
  .stat-num { font-family:'Fraunces',serif; font-size:2.3rem; font-weight:600; color:var(--moss); line-height:1; }
  .stat-unit { font-size:13px; color:var(--t-soft); margin-top:8px; line-height:1.5; }

  .class-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1rem; }
  .class-card { background:#fff; border:1px solid var(--border); border-radius:16px; padding:1.35rem; box-shadow:var(--shadow); }
  .class-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:.85rem; }

  .cgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:10px; }
  .ccard { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:1.1rem; display:flex; align-items:flex-start; gap:9px; }
  .cicon { width:30px; height:30px; background:rgba(255,255,255,.06); border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
  .ctxt { font-size:13px; color:var(--stone); line-height:1.5; }

  .tip { display:flex; gap:9px; align-items:flex-start; font-size:13px; color:var(--t-soft); padding:9px 0; border-bottom:1px solid var(--border); }
  .tip:last-child { border-bottom:none; }

  .footer { background:var(--soil); padding:2.5rem 2rem; text-align:center; }
  .spin { width:16px; height:16px; border:2px solid rgba(78,138,70,.22); border-top-color:var(--leaf); border-radius:50%; animation:spin .65s linear infinite; flex-shrink:0; }
  @keyframes spin{to{transform:rotate(360deg)}}

  input[type=file] { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--t-soft); margin-top:.85rem; display:block; max-width:100%; }
  .preview-lbl { font-size:12px; color:var(--t-muted); margin-bottom:7px; }
  .thumb { border:1px solid var(--border-s); border-radius:12px; overflow:hidden; width:220px; margin-top:.8rem; }
  .cam-thumb { border:1px solid var(--border); border-radius:9px; overflow:hidden; width:110px; margin-bottom:.9rem; }
  .loading-row { display:flex; align-items:center; gap:9px; padding:.9rem 0; color:var(--t-soft); font-size:13.5px; }
  .info-box { background:rgba(107,168,194,.09); border:1px solid rgba(107,168,194,.25); border-radius:13px; padding:1rem 1.15rem; font-size:13px; color:var(--river); display:flex; gap:9px; align-items:flex-start; line-height:1.6; }

  /* ── Tables ── */
  .tbl-wrap { overflow-x:auto; border:1px solid var(--border); border-radius:14px; background:#fff; box-shadow:var(--shadow); }
  .tbl { width:100%; border-collapse:collapse; font-size:13px; min-width:520px; }
  .tbl caption { text-align:left; padding:12px 14px 4px; font-size:12.5px; color:var(--t-soft); caption-side:top; }
  .tbl th { text-align:left; background:var(--parchment); color:var(--t-mid); font-weight:600; padding:10px 14px; font-size:12.5px; border-bottom:1px solid var(--border-s); }
  .tbl td { padding:10px 14px; border-bottom:1px solid var(--border); color:var(--t-dark); }
  .tbl tr:last-child td { border-bottom:none; }
  .tbl .num { text-align:right; font-variant-numeric:tabular-nums; }
  .tbl th.num { text-align:right; }
  .tbl tr.hi td { background:#f1f9ee; font-weight:600; }

  /* ── Bars ── */
  .hb { display:grid; grid-template-columns:96px 1fr 70px; gap:12px; align-items:center; font-size:13px; margin-bottom:7px; }
  .hb-lbl { color:var(--t-mid); }
  .hb-track { height:10px; background:var(--sand); border-radius:5px; overflow:hidden; }
  .hb-fill { height:100%; border-radius:5px; transition:width .6s cubic-bezier(.4,0,.2,1); }
  .hb-val { text-align:right; font-weight:600; color:var(--moss); font-variant-numeric:tabular-nums; }
  .pg { margin-bottom:1.1rem; }
  .pg-name { font-weight:600; font-size:13.5px; margin-bottom:6px; color:var(--soil); }
  .dark .pg-name { color:var(--mist); }
  .dark .hb-lbl { color:var(--stone); }
  .dark .hb-track { background:rgba(255,255,255,.09); }
  .dark .hb-val { color:var(--cream); }

  .callout { border-left:4px solid var(--amber); background:#fff8ee; padding:1rem 1.2rem; border-radius:0 12px 12px 0; font-size:13.5px; color:var(--t-mid); line-height:1.7; }
  .callout.green { border-color:var(--leaf); background:#eef7e9; }
  .callout strong { color:var(--soil); }

  .pipe { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .pipe-step { background:#fff; border:1px solid var(--border-s); border-radius:11px; padding:10px 14px; font-size:13px; color:var(--t-mid); font-weight:500; }

  .kv { display:grid; grid-template-columns:auto 1fr; gap:7px 14px; font-size:13px; margin-top:.4rem; }
  .kv dt { color:var(--t-muted); }
  .kv dd { color:var(--t-dark); }

  .tag { display:inline-block; font-size:11.5px; font-weight:600; border-radius:6px; padding:3px 9px; }
  .tag-paper { background:var(--mist); color:var(--moss); }
  .tag-sug { background:#f5e6d0; color:var(--rust); }
  .road-list { list-style:none; display:flex; flex-direction:column; gap:10px; margin-top:.9rem; }
  .road-list li { display:flex; gap:9px; font-size:13.3px; color:var(--t-mid); line-height:1.55; }
  .road-list li svg { flex-shrink:0; margin-top:4px; }

  .steps-num { list-style:none; counter-reset:s; display:flex; flex-direction:column; gap:10px; }
  .steps-num li { counter-increment:s; display:flex; gap:12px; align-items:flex-start; background:#fff; border:1px solid var(--border); border-radius:13px; padding:12px 15px; font-size:13.3px; color:var(--t-mid); }
  .steps-num li::before { content:counter(s); width:24px; height:24px; border-radius:50%; background:linear-gradient(135deg,var(--fern),var(--leaf)); color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .author { display:flex; gap:14px; align-items:flex-start; }
  .avatar { width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,var(--fern),var(--leaf)); color:#fff; font-family:'Fraunces',serif; font-size:1.1rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .author a { color:var(--river); font-size:13px; }

  .refs { list-style:none; display:flex; flex-direction:column; gap:10px; }
  .refs li { background:#fff; border:1px solid var(--border); border-radius:12px; padding:12px 15px; font-size:13px; color:var(--t-mid); line-height:1.6; }

  pre.code { background:var(--soil); color:var(--mist); padding:1.1rem 1.2rem; border-radius:12px; overflow:auto; font-size:12.5px; line-height:1.65; font-family:ui-monospace,Menlo,Consolas,monospace; margin-top:.9rem; }
  input[type=range] { width:100%; accent-color:var(--leaf); }

  .pagenav { display:flex; justify-content:space-between; gap:1rem; margin-top:3.5rem; padding-top:1.5rem; border-top:1px solid var(--border); flex-wrap:wrap; }
  .pn-btn { display:flex; align-items:center; gap:10px; background:#fff; border:1px solid var(--border-s); border-radius:13px; padding:12px 18px; cursor:pointer; font-family:'DM Sans',sans-serif; text-align:left; transition:background .2s, border-color .2s; }
  .pn-btn:hover { background:var(--mist); border-color:var(--leaf); }
  .pn-btn small { display:block; font-size:11.5px; color:var(--t-muted); }
  .pn-btn span { font-family:'Fraunces',serif; font-size:1rem; color:var(--soil); }
  .pn-next { margin-left:auto; text-align:right; }

  .explore { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1rem; }
  .explore button { background:#fff; border:1px solid var(--border); border-radius:16px; padding:1.3rem; text-align:left; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:var(--shadow); transition:border-color .2s, transform .2s; }
  .explore button:hover { border-color:var(--leaf); transform:translateY(-2px); }
  .explore h3 { font-size:1.05rem; margin:.7rem 0 .25rem; }
  .explore p { font-size:12.8px; color:var(--t-soft); line-height:1.55; }

  /* ── Page banner / breadcrumb ── */
  .banner { background:var(--parchment); border-bottom:1px solid var(--border); }
  .banner-in { max-width:1340px; margin:0 auto; padding:12px 2rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
  .crumbs { display:flex; align-items:center; gap:7px; font-size:12.5px; color:var(--t-muted); }
  .crumbs button { display:inline-flex; align-items:center; gap:5px; border:none; background:none; color:var(--t-soft); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:12.5px; }
  .crumbs button:hover { color:var(--fern); text-decoration:underline; }
  .crumbs span { color:var(--soil); font-weight:600; }
  .banner-step { display:flex; align-items:center; gap:12px; font-size:12px; color:var(--t-soft); font-variant-numeric:tabular-nums; }
  .banner-dots { display:flex; gap:6px; }
  .banner-dots button { width:8px; height:8px; padding:0; border-radius:100px; border:none; background:var(--sand); cursor:pointer; transition:width .25s, background .2s; }
  .banner-dots button:hover { background:var(--sprout); }
  .banner-dots button.on { width:24px; background:linear-gradient(90deg,var(--fern),var(--sprout)); }

  /* ── Page transition + polish ── */
  .page { animation:pageIn .45s ease; }
  @keyframes pageIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
  .eyebrow { display:inline-flex; align-items:center; font-size:11.5px; text-transform:uppercase; letter-spacing:.09em; padding:4px 12px; border-radius:100px; background:color-mix(in srgb, currentColor 11%, transparent); }
  .sec-title::after { content:''; display:block; width:52px; height:3px; border-radius:3px; margin-top:.75rem; background:linear-gradient(90deg,var(--leaf),var(--dew)); }
  .hero::after { content:''; position:absolute; inset:0; pointer-events:none; opacity:.5;
    background-image:linear-gradient(rgba(110,175,99,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(110,175,99,.07) 1px,transparent 1px);
    background-size:48px 48px; -webkit-mask-image:radial-gradient(ellipse 70% 80% at 50% 40%,#000 30%,transparent 80%); mask-image:radial-gradient(ellipse 70% 80% at 50% 40%,#000 30%,transparent 80%); }
  .hero-title { background:linear-gradient(120deg,#fff 35%,var(--dew)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .badge-dot { animation:pulse 1.8s ease-in-out infinite; }
  .gap-panel { backdrop-filter:blur(6px); box-shadow:0 18px 50px rgba(0,0,0,.25); }
  .stat-card, .class-card, .dcard { transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
  .stat-card:hover, .class-card:hover, .dcard:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); border-color:var(--border-s); }
  .stat-num { background:linear-gradient(120deg,var(--moss),var(--leaf)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .footer { border-top:3px solid transparent; border-image:linear-gradient(90deg,var(--fern),var(--dew),var(--fern)) 1; }

  @media(max-width:1180px){
    .nav-links { display:none; }
    .burger { display:inline-flex; }
  }

  @media(max-width:920px){
    .hero-in,.g2,.g2e { grid-template-columns:1fr; }
    .hero { padding:3.5rem 1.25rem 3rem; }
    .topbar-in { padding:0 1rem; }
    .logo-eye { display:none; }
    .wrap, .inner { padding:3rem 1.25rem; }
  }
  @media(max-width:640px){
    .hgrid { grid-template-columns:1fr; }
    .hb { grid-template-columns:78px 1fr 58px; gap:8px; }
    .burger .burger-cur { max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .banner-in { padding:10px 1.25rem; }
  }
  @media (prefers-reduced-motion: reduce){
    *, *::before, *::after { animation:none !important; transition:none !important; scroll-behavior:auto !important; }
  }
`;

/* ─── Paper data ─────────────────────────────────────────────────────── */
const PAPER_TITLE = "Cross-Dataset Generalization and Confidence Calibration in MobileNetV2-Based Waste Classification";

const MODELS = [
  { name:"Original",  tn:81.25, rw:46.89, ci:"45.27–48.56", conf:67.92, gap:21.02, p:"—" },
  { name:"Geometry",  tn:78.39, rw:46.56, ci:"44.83–48.20", conf:68.45, gap:21.90, p:"0.68" },
  { name:"Lighting",  tn:82.29, rw:46.47, ci:"44.83–48.09", conf:67.73, gap:21.26, p:"0.51" },
  { name:"WasteX",    tn:82.81, rw:47.70, ci:"45.94–49.40", conf:72.53, gap:24.83, p:"0.25" },
];

const HC_ERRORS = [
  { name:"Original", e70:664, e80:370, e90:121, e95:51 },
  { name:"Geometry", e70:679, e80:417, e90:189, e95:82 },
  { name:"Lighting", e70:702, e80:448, e90:207, e95:83 },
  { name:"WasteX",   e70:828, e80:572, e90:288, e95:134 },
];

const RECALL = [
  { cls:"Cardboard", v:[29.72,46.42,31.02,41.65] },
  { cls:"Glass",     v:[28.57,24.52,31.67,24.52] },
  { cls:"Metal",     v:[70.13,66.20,59.75,65.82] },
  { cls:"Paper",     v:[48.00,40.00,45.20,39.00] },
  { cls:"Plastic",   v:[56.35,59.93,58.96,59.72] },
  { cls:"Trash",     v:[22.63,15.76,30.30,30.51] },
];

const CALIB = [
  { name:"Original", T:"2.19 ± 0.06", before:21.07, after:3.94, afterSd:"0.89", brier:"0.663 ± 0.008", e80b:"110.9 ± 7.9",  e80a:"1.7 ± 1.2" },
  { name:"Geometry", T:"2.16 ± 0.07", before:22.04, after:3.21, afterSd:"0.84", brier:"0.661 ± 0.009", e80b:"125.8 ± 8.4",  e80a:"3.0 ± 1.9" },
  { name:"Lighting", T:"2.18 ± 0.10", before:21.29, after:3.53, afterSd:"0.84", brier:"0.676 ± 0.008", e80b:"134.9 ± 9.3",  e80a:"2.2 ± 1.9" },
  { name:"WasteX",   T:"2.51 ± 0.06", before:25.02, after:3.14, afterSd:"0.74", brier:"0.659 ± 0.009", e80b:"171.8 ± 11.1", e80a:"2.9 ± 1.4" },
];

const CLASS_MAP = [
  { tn:"Cardboard", tnN:403, rw:"Cardboard",          rwN:461 },
  { tn:"Glass",     tnN:501, rw:"Glass",              rwN:420 },
  { tn:"Metal",     tnN:410, rw:"Metal",              rwN:790 },
  { tn:"Paper",     tnN:594, rw:"Paper",              rwN:500 },
  { tn:"Plastic",   tnN:482, rw:"Plastic",            rwN:921 },
  { tn:"Trash",     tnN:137, rw:"Miscellaneous Trash",rwN:495 },
];

const REFS = [
  "Single, S., Iranmanesh, S., & Raad, R. (2023). RealWaste: a novel real-life data set for landfill waste classification using deep learning. Information, 14(12), 633.",
  "Yang, M., & Thung, G. (2016). Classification of trash for recyclability status. CS229 project report.",
  "Sandler, M., Howard, A., Zhu, M., Zhmoginov, A., & Chen, L. C. (2018). MobileNetV2: Inverted residuals and linear bottlenecks. IEEE/CVF CVPR, 4510–4520.",
  "Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of modern neural networks. ICML, 1321–1330.",
  "Ovadia, Y., et al. (2019). Can you trust your model's uncertainty? Evaluating predictive uncertainty under dataset shift. NeurIPS, 32.",
  "Minderer, M., et al. (2021). Revisiting the calibration of modern neural networks. NeurIPS, 34, 15682–15694.",
  "Howard, A. G., et al. (2017). MobileNets: Efficient convolutional neural networks for mobile vision applications. arXiv:1704.04861.",
  "Ravindrasekar, L., et al. (2026). Cross-domain waste classification using deep learning: addressing geographic generalization failure in Sri Lanka. MERCon 2026, 820–825.",
];

/* ─── Disposal data ──────────────────────────────────────────────────── */
const DISPOSAL_GUIDE = {
  cardboard: {
    color:"#B8793A", bg:"#FEF3E7", icon:"📦", label:"Cardboard",
    steps:[
      "Flatten and remove any tape or staples from the cardboard.",
      "Keep it dry — wet cardboard cannot be recycled efficiently.",
      "Place in the blue/yellow paper recycling bin.",
      "Large quantities can be taken to a cardboard collection point.",
    ],
    tip:"Cardboard can be recycled 5–7 times. Composting is a great second option for uncoated cardboard.",
  },
  glass: {
    color:"#3E8FA8", bg:"#E8F5FA", icon:"🫙", label:"Glass",
    steps:[
      "Rinse the glass item to remove food or liquid residue.",
      "Remove metal lids (recycle them separately).",
      "Place in the glass-only recycling bin — do not mix with other recyclables.",
      "Broken glass: wrap in newspaper, label 'BROKEN GLASS', place in landfill bin for safety.",
    ],
    tip:"Glass is infinitely recyclable without loss of quality. Never place ceramics, pyrex or light bulbs in glass bins.",
  },
  metal: {
    color:"#5D7070", bg:"#F0F4F4", icon:"🥫", label:"Metal / Cans",
    steps:[
      "Rinse cans and tins to remove food residue.",
      "Crush cans lightly to save space (optional).",
      "Place aluminium and steel cans in the recycling bin.",
      "Scrap metal (pipes, appliances) should go to a metal recycling facility.",
    ],
    tip:"Recycling one aluminium can saves enough energy to power a TV for 3 hours.",
  },
  paper: {
    color:"#6FAF63", bg:"#F0F8EE", icon:"📄", label:"Paper",
    steps:[
      "Separate clean paper from paper with food stains (the latter goes to compost/landfill).",
      "Shred sensitive documents before recycling.",
      "Bundle newspapers and magazines together.",
      "Place in the paper recycling bin or take to a paper bank.",
    ],
    tip:"One tonne of recycled paper saves 17 trees and 26,500 litres of water.",
  },
  plastic: {
    color:"#4E8A46", bg:"#EEF7EC", icon:"🧴", label:"Plastic",
    steps:[
      "Check the resin code (1–7) on the bottom of the item.",
      "Rinse containers to remove residue; labels can stay on.",
      "Codes 1 (PET) and 2 (HDPE) are widely accepted — place in recycling bin.",
      "Codes 3, 6, 7 are often not accepted; check your local council guidelines.",
      "Flexible plastics/bags: return to supermarket collection points.",
    ],
    tip:"Plastic recycling rates drop when items are contaminated with food. Rinse first, always.",
  },
  trash: {
    color:"#8C4515", bg:"#FFF4EE", icon:"🗑️", label:"General Waste / Trash",
    steps:[
      "First, double-check if any component can be separated for recycling.",
      "If truly mixed or contaminated waste, bag securely in a black bag.",
      "Place in the general (black) waste bin for landfill collection.",
      "For hazardous household waste (batteries, paint, chemicals) — take to a designated HHW facility.",
    ],
    tip:"Reducing waste at source is always better than disposal. Consider reusing or repairing before discarding.",
  },
};

const CLASSES = [
  { key:"cardboard", label:"Cardboard", icon:<Package size={18} color="#B8793A"/>,  desc:"Corrugated boxes, packaging material" },
  { key:"glass",     label:"Glass",     icon:<Droplets size={18} color="#3E8FA8"/>, desc:"Bottles, jars, containers" },
  { key:"metal",     label:"Metal",     icon:<Zap size={18} color="#5D7070"/>,      desc:"Cans, tins, foil, scrap" },
  { key:"paper",     label:"Paper",     icon:<BookOpen size={18} color="#6FAF63"/>, desc:"Newspapers, magazines, office paper" },
  { key:"plastic",   label:"Plastic",   icon:<Wind size={18} color="#4E8A46"/>,     desc:"Bottles, bags, packaging" },
  { key:"trash",     label:"Trash",     icon:<Trash2 size={18} color="#8C4515"/>,   desc:"General / mixed / contaminated waste" },
];

/* ─── Navigation (order = navbar order = prev/next order) ──────────── */
const NAV = [
  { id:"home",     label:"Home", short:"Home",             desc:"The WasteX paper at a glance",              icon:Home },
  { id:"classify", label:"Classify waste", short:"Classify",   desc:"Upload an image or use your camera",        icon:Scan },
  { id:"dataset",  label:"Datasets", short:"Datasets",         desc:"TrashNet, RealWaste and class mapping",     icon:Database },
  { id:"future",   label:"Future work", short:"Future",      desc:"Limitations and planned improvements",      icon:Rocket },
  { id:"method",   label:"Methodology", short:"Method",      desc:"Four models, training and calibration",     icon:Layers },
  { id:"results",  label:"Results", short:"Results",          desc:"Accuracy, confidence and calibration",      icon:BarChart3 },
  { id:"guide",    label:"Waste guide", short:"Guide",      desc:"How to dispose of each category",           icon:Recycle },
  { id:"team",     label:"Team & references", short:"Team",desc:"Authors, citation and key sources",         icon:Users },
  { id:"setup",    label:"Project setup", short:"Setup",    desc:"Run the app and backend locally",           icon:Settings },
];

/* ─── Small shared components ────────────────────────────────────────── */
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

function HBar({ label, value, max = 100, color = "linear-gradient(90deg,var(--fern),var(--sprout))", suffix = "%", digits = 2 }) {
  return (
    <div className="hb">
      <span className="hb-lbl">{label}</span>
      <div className="hb-track"><div className="hb-fill" style={{ width:`${Math.min(100, (value / max) * 100)}%`, background:color }}/></div>
      <span className="hb-val">{typeof value === "number" ? value.toFixed(digits) : value}{suffix}</span>
    </div>
  );
}

const C_SRC = "#6FAF63";
const C_TGT = "#D9944A";

function Legend({ items }) {
  return (
    <div className="legend">
      {items.map(i => <span key={i.label}><i style={{ background:i.color }}/>{i.label}</span>)}
    </div>
  );
}

function AccuracyGap() {
  return (
    <>
      <Legend items={[{ label:"TrashNet test accuracy", color:C_SRC }, { label:"RealWaste accuracy", color:C_TGT }]}/>
      {MODELS.map(m => (
        <div key={m.name} className="pg">
          <p className="pg-name">{m.name}</p>
          <HBar label="TrashNet" value={m.tn} color={C_SRC}/>
          <HBar label="RealWaste" value={m.rw} color={C_TGT}/>
        </div>
      ))}
    </>
  );
}

function PageBanner({ current, go }) {
  const i = NAV.findIndex(n => n.id === current);
  const n = NAV[i];
  return (
    <div className="banner">
      <div className="banner-in">
        <nav className="crumbs" aria-label="Breadcrumb">
          <button onClick={() => go("home")}><Home size={13}/>Home</button>
          <ChevronRight size={13}/>
          <span aria-current="page">{n.label}</span>
        </nav>
        <div className="banner-step">
          <span>{String(i + 1).padStart(2, "0")} / {String(NAV.length).padStart(2, "0")}</span>
          <div className="banner-dots">
            {NAV.map((m, k) => <button key={m.id} className={k === i ? "on" : ""} onClick={() => go(m.id)} aria-label={m.label} title={m.label}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageNav({ current, go }) {
  const i = NAV.findIndex(n => n.id === current);
  const prev = NAV[i - 1], next = NAV[i + 1];
  return (
    <div className="pagenav">
      {prev ? <button className="pn-btn" onClick={() => go(prev.id)}><ChevronLeft size={16} color="var(--fern)"/><div><small>Previous</small><span>{prev.label}</span></div></button> : <span/>}
      {next && <button className="pn-btn pn-next" onClick={() => go(next.id)}><div><small>Next</small><span>{next.label}</span></div><ChevronRight size={16} color="var(--fern)"/></button>}
    </div>
  );
}

function DisposalPanel({ predictedClass }) {
  const key = (predictedClass || "").toLowerCase().trim();
  const guide = DISPOSAL_GUIDE[key];
  if (!guide) return null;
  return (
    <div className="disposal-panel">
      <div className="disposal-head"><Recycle size={18} color="var(--fern)"/><h4>Disposal recommendation</h4></div>
      <div className="disposal-tag"><span>{guide.icon}</span>{guide.label}</div>
      <div className="disposal-steps">
        {guide.steps.map((s, i) => (
          <div key={i} className="dstep"><div className="dstep-num">{i + 1}</div><span>{s}</span></div>
        ))}
      </div>
      <div className="disposal-tip"><Leaf size={14} color="var(--leaf)" style={{ flexShrink:0, marginTop:2 }}/><span>{guide.tip}</span></div>
    </div>
  );
}

function ResultBlock({ cls, conf }) {
  const n = parseFloat(conf);
  const low = !isNaN(n) && n < 70;
  return (
    <>
      <div className="res-box">
        <p className="res-cls">Predicted class: {cls}</p>
        {conf && <p className="res-conf">Confidence: {conf}</p>}
      </div>
      {low ? (
        <div className="rel-note warn">
          <AlertTriangle size={15} style={{ flexShrink:0, marginTop:3 }}/>
          <span><strong>Low confidence — check this item manually.</strong> The paper recommends flagging uncertain predictions for human review. The 70% cut-off here is a simple rule of thumb, not a value from the paper.</span>
        </div>
      ) : (
        <div className="rel-note info">
          <Info size={15} style={{ flexShrink:0, marginTop:3 }}/>
          <span>Confidence is the raw softmax score. On real-world images the paper found these scores ran 21–25 percentage points above true accuracy, so a high value does not guarantee a correct label.</span>
        </div>
      )}
      <DisposalPanel predictedClass={cls}/>
    </>
  );
}

/* ─── Temperature scaling demo ───────────────────────────────────────── */
const DEMO_LOGITS = [3.4, 1.6, 1.0, 0.2, -0.4, -0.8];
const DEMO_LABELS = ["Plastic", "Paper", "Cardboard", "Metal", "Glass", "Trash"];

function TemperatureDemo() {
  const [T, setT] = useState(1);
  const z = DEMO_LOGITS.map(l => Math.exp(l / T));
  const s = z.reduce((a, b) => a + b, 0);
  const p = z.map(v => (v / s) * 100);
  return (
    <div className="card">
      <div className="card-icon"><Thermometer size={21} color="var(--fern)"/></div>
      <h3 className="card-title">Try temperature scaling</h3>
      <p className="card-desc">Temperature scaling divides the model's raw scores by a single number T before the softmax. The predicted class never changes — only how confident the model sounds. The paper fitted T between 2.16 and 2.51. These scores are made up for illustration, not real model output.</p>
      <label style={{ fontSize:13, color:"var(--t-mid)", fontWeight:600 }} htmlFor="tdemo">Temperature T = {T.toFixed(2)}</label>
      <input id="tdemo" type="range" min="0.5" max="5" step="0.05" value={T} onChange={e => setT(parseFloat(e.target.value))}/>
      <div style={{ marginTop:"1rem" }}>
        {DEMO_LABELS.map((l, i) => <HBar key={l} label={l} value={p[i]} digits={1} color={i === 0 ? "linear-gradient(90deg,var(--amber),#D9944A)" : "linear-gradient(90deg,var(--fern),var(--sprout))"}/>)}
      </div>
      <p style={{ fontSize:13, color:"var(--t-soft)", marginTop:".6rem" }}>Top-class confidence: <strong style={{ color:"var(--moss)" }}>{p[0].toFixed(1)}%</strong>{T === 1 ? " (uncalibrated)" : ""}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
const pageFromHash = () => {
  const h = window.location.hash.replace(/^#\/?/, "");
  return NAV.some(n => n.id === h) ? h : "home";
};

export default function App() {
  const [activePage,   setActivePage]   = useState(pageFromHash);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("upload");
  const [resTab,       setResTab]       = useState("accuracy");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl,   setPreviewUrl]   = useState("");
  const [result,       setResult]       = useState("");
  const [confidence,   setConfidence]   = useState("");
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [historyItems, setHistoryItems] = useState([]);

  const [cameraActive,  setCameraActive]  = useState(false);
  const [cameraError,   setCameraError]   = useState("");
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraResult,  setCameraResult]  = useState(null);
  const [facingMode,    setFacingMode]    = useState("environment");
  const [capturedThumb, setCapturedThumb] = useState("");
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const menuRef   = useRef(null);
  const [backend, setBackend] = useState("checking");

  const current = NAV.find(n => n.id === activePage);
  const CurIcon = current.icon;

  /* each page gets its own URL (#/results etc.), so back/forward and shared links work */
  function go(id) {
    setMenuOpen(false);
    if (id === activePage) return;
    setActivePage(id);
    window.location.hash = "/" + id;
  }

  useEffect(() => {
    const onHash = () => { setActivePage(pageFromHash()); setMenuOpen(false); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const n = NAV.find(x => x.id === activePage);
    document.title = activePage === "home" ? "WasteX" : `${n.label} · WasteX`;
  }, [activePage]);

  /* close mobile menu on outside click / Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey  = e => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  useEffect(() => { window.scrollTo({ top:0 }); }, [activePage]);

  /* ── API ── */
  async function checkBackend() {
    setBackend("checking");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    try {
      const r = await fetch(`${API_URL}/`, { signal:ctrl.signal });
      setBackend(r.ok ? "online" : "offline");
    } catch { setBackend("offline"); }
    finally { clearTimeout(timer); }
  }

  useEffect(() => { if (activePage === "classify") checkBackend(); }, [activePage]);

  async function sendToApi(fileOrBlob, name) {
    const fd = new FormData();
    fd.append("file", fileOrBlob, name);
    let r;
    try {
      r = await fetch(`${API_URL}/predict`, { method:"POST", body:fd });
    } catch {
      setBackend("offline");
      throw new Error(`Can't reach the backend at ${API_URL}. Make sure it is running (python app.py) and check the Flask terminal for an error message.`);
    }
    let d = null;
    try { d = await r.json(); } catch { /* non-JSON response */ }
    if (!r.ok) throw new Error((d && d.error) || `The backend returned an error (HTTP ${r.status}). Check the Flask terminal for details.`);
    setBackend("online");
    return {
      cls:  d.predicted_class || "No prediction returned",
      conf: d.confidence != null ? (d.confidence * 100).toFixed(2) + "%" : "",
    };
  }

  function addHistory(item) {
    setHistoryItems(p => [{ ...item, time:new Date().toLocaleString() }, ...p].slice(0, 6));
  }

  /* ── Upload ── */
  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(""); setConfidence(""); setError("");
  }

  async function handlePredict() {
    if (!selectedFile) { setError("Please upload an image first."); return; }
    setLoading(true); setError(""); setResult(""); setConfidence("");
    try {
      const { cls, conf } = await sendToApi(selectedFile, selectedFile.name);
      setResult(cls); setConfidence(conf);
      addHistory({ fileName:selectedFile.name, predictedClass:cls, confidence:conf, thumb:previewUrl });
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  /* ── Camera ── */
  async function startCamera(mode = facingMode) {
    setCameraError("");
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:mode, width:{ ideal:1280 }, height:{ ideal:720 } } });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
      setCameraActive(true);
    } catch { setCameraError("Camera access denied. Allow camera permissions and try again."); }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false); setCameraResult(null); setCapturedThumb("");
  }

  function switchCamera() {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  }

  useEffect(() => { if (activePage !== "classify" || activeSubTab !== "camera") stopCamera(); }, [activePage, activeSubTab]);
  useEffect(() => () => streamRef.current?.getTracks().forEach(t => t.stop()), []);

  async function captureAndClassify() {
    if (!videoRef.current || !canvasRef.current) return;
    setCameraLoading(true); setCameraError(""); setCameraResult(null);
    const v = videoRef.current, c = canvasRef.current;
    c.width = v.videoWidth || 640; c.height = v.videoHeight || 480;
    c.getContext("2d").drawImage(v, 0, 0);
    const thumb = c.toDataURL("image/jpeg", .5);
    setCapturedThumb(thumb);
    try {
      const blob = await new Promise(res => c.toBlob(res, "image/jpeg", .85));
      const { cls, conf } = await sendToApi(blob, "capture.jpg");
      setCameraResult({ predictedClass:cls, confidence:conf });
      addHistory({ fileName:"Camera capture", predictedClass:cls, confidence:conf, thumb });
    } catch (e) {
      setCameraError(e.message);
    } finally { setCameraLoading(false); }
  }

  /* ═══ RENDER ═════════════════════════════════════════════════════════ */
  return (
    <>
      <GlobalStyles />

      {/* Top bar with page navigation */}
      <header className="topbar">
        <div className="topbar-in">
          <button className="logo-wrap" onClick={() => go("home")} aria-label="WasteX home">
            <div className="logo-mark"><Leaf size={20} color="#C8ECC2"/></div>
            <div>
              <div className="logo-eye">Conference paper project</div>
              <div className="logo-nm">WasteX</div>
            </div>
          </button>

          <nav className="nav-links" aria-label="Site pages">
            {NAV.map(n => {
              const Icon = n.icon;
              return (
                <button key={n.id} className={`nav-link ${n.id === activePage ? "cur" : ""} ${n.id === "classify" ? "cta" : ""}`} onClick={() => go(n.id)} aria-current={n.id === activePage ? "page" : undefined}>
                  {(n.id === "classify" || n.id === "home") && <Icon size={14}/>}{n.short}
                </button>
              );
            })}
          </nav>

          <div ref={menuRef}>
            <button className="burger" aria-haspopup="true" aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={16}/> : <Menu size={16}/>}
              <span className="burger-cur">{current.label}</span>
            </button>
            {menuOpen && (
              <>
                <div className="drawer-back" onClick={() => setMenuOpen(false)}/>
                <nav className="drawer" aria-label="Site pages">
                  <div className="drawer-grid">
                    {NAV.map(n => {
                      const Icon = n.icon;
                      return (
                        <button key={n.id} className={`drawer-item ${n.id === activePage ? "cur" : ""}`} onClick={() => go(n.id)} aria-current={n.id === activePage ? "page" : undefined}>
                          <div className="drawer-ico"><Icon size={17} color="var(--dew)"/></div>
                          <div><div className="drawer-t">{n.label}</div><div className="drawer-d">{n.desc}</div></div>
                        </button>
                      );
                    })}
                  </div>
                </nav>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="strip">
        <p>Department of Data Science and Engineering, Manipal University Jaipur</p>
      </div>

      <main key={activePage} className="page">
      {activePage !== "home" && <PageBanner current={activePage} go={go}/>}

      {/* ══════════════ HOME ══════════════ */}
      {activePage === "home" && (
        <>
          <section className="hero">
            <div className="hero-in">
              <div>
                <div className="badge"><div className="badge-dot"/><span>Conference paper · MobileNetV2 · TrashNet → RealWaste</span></div>
                <h1 className="hero-title">WasteX</h1>
                <p className="hero-sub">{PAPER_TITLE}</p>
                <p className="hero-desc">
                  Waste classifiers score 80%+ on the benchmark they were trained on, then lose almost half their accuracy on real-world photos while still sounding sure of themselves. This paper measures that gap and shows how temperature scaling repairs the confidence.
                </p>
                <div className="cta-row">
                  <button className="btn-p" onClick={() => go("classify")}><Scan size={14}/>Try the classifier</button>
                  <button className="btn-o" onClick={() => go("results")}><BarChart3 size={14}/>See the results</button>
                </div>
              </div>

              <div className="gap-panel dark">
                <h3>The same models, two datasets</h3>
                <p>Accuracy of the four MobileNetV2 configurations on the dataset they were trained on versus an unseen one.</p>
                <AccuracyGap/>
              </div>
            </div>
          </section>

          <div className="divider"/>

          <section className="wrap-alt">
            <div className="inner">
              <p className="eyebrow" style={{ color:"var(--river)" }}>What we found</p>
              <h2 className="sec-title">Accuracy fell by half, and confidence did not</h2>
              <p className="sec-lead">Four results from training on TrashNet (2,527 images) and testing on RealWaste (3,587 images, six shared classes).</p>
              <div className="stats-grid">
                {[
                  { num:"46–48%", unit:"RealWaste accuracy, down from 78–83% on TrashNet. No model differed significantly from another (McNemar p ≥ 0.25)." },
                  { num:"21–25 pp", unit:"How far mean confidence exceeded accuracy before calibration. WasteX had the widest gap at 24.83 points." },
                  { num:"25% → 3.1%", unit:"Expected calibration error for WasteX after temperature scaling on a labelled calibration split." },
                  { num:"288", unit:"Errors made by WasteX at 90% confidence or higher, against 121 for the Original model." },
                ].map(s => (
                  <div key={s.num} className="stat-card">
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-unit">{s.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider"/>

          <section className="wrap">
            <div className="g2e">
              <div>
                <p className="eyebrow" style={{ color:"var(--fern)" }}>Abstract</p>
                <h2 className="sec-title">What the paper is about</h2>
                <p style={{ fontSize:14.5, color:"var(--t-mid)", lineHeight:1.85, marginBottom:"1rem" }}>
                  Most CNN waste classifiers are evaluated on a single benchmark using accuracy alone, which can hide how they behave when conditions change. We trained four MobileNetV2 models on TrashNet — a baseline, a geometry-augmentation model, a lighting-augmentation model, and WasteX, a fine-tuned model with combined augmentation — and tested them on the unseen RealWaste dataset.
                </p>
                <p style={{ fontSize:14.5, color:"var(--t-mid)", lineHeight:1.85, marginBottom:"1.2rem" }}>
                  WasteX reached the highest RealWaste accuracy (47.70%) but not by a statistically significant margin, and it was the most overconfident before calibration. Temperature scaling cut calibration error to about 3–4% for every model, so after scaling the models could not be separated by calibration. All results come from single training runs.
                </p>
                <div className="chip-wrap">
                  {["waste classification", "MobileNetV2", "cross-dataset generalization", "confidence calibration", "temperature scaling", "fine-tuning", "RealWaste", "TrashNet"].map(k => <span key={k} className="chip">{k}</span>)}
                </div>
              </div>

              <div className="gcol">
                <div className="card">
                  <div className="card-icon"><Target size={21} color="var(--fern)"/></div>
                  <h3 className="card-title">Three research questions</h3>
                  <div className="setup-list">
                    {[
                      "How much does performance drop when TrashNet-trained models meet RealWaste?",
                      "Do augmentation and fine-tuning improve cross-dataset generalization?",
                      "Does target-domain temperature scaling fix confidence under domain shift?",
                    ].map((q, i) => <div key={q} className="setup-item"><strong style={{ color:"var(--fern)" }}>RQ{i + 1}</strong>{q}</div>)}
                  </div>
                </div>
                <div className="card">
                  <div className="card-icon"><Lightbulb size={21} color="var(--amber)"/></div>
                  <h3 className="card-title">Contributions</h3>
                  <div className="setup-list">
                    {[
                      "Cross-dataset evaluation of four MobileNetV2 classifiers",
                      "Confidence analysis with ECE, Brier score and high-confidence errors",
                      "Held-out temperature scaling on a labelled RealWaste sample",
                      "Per-class recall showing where generalization is weakest",
                    ].map(t => <div key={t} className="setup-item"><div className="setup-dot"/>{t}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="divider"/>

          <section className="wrap-alt">
            <div className="inner">
              <p className="eyebrow" style={{ color:"var(--river)" }}>Why it matters</p>
              <h2 className="sec-title">Confidence scores decide what a smart bin does next</h2>
              <div className="callout green" style={{ maxWidth:820, marginBottom:"2.2rem" }}>
                In an automated sorter, a confidence score can decide whether an item is accepted or sent for inspection. If that score is inflated, wrong predictions slip through. <strong>Accuracy and calibration are separate properties and should be reported separately.</strong> Calibration here used labelled target-domain images, so it shows what is possible when some target labels exist, not a fully source-only deployment.
              </div>

              <h3 className="sub-title" style={{ marginTop:0 }}>Explore the site</h3>
              <div className="explore">
                {NAV.filter(n => n.id !== "home").map(n => {
                  const Icon = n.icon;
                  return (
                    <button key={n.id} onClick={() => go(n.id)}>
                      <Icon size={20} color="var(--fern)"/>
                      <h3>{n.label}</h3>
                      <p>{n.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ══════════════ CLASSIFY ══════════════ */}
      {activePage === "classify" && (
        <section className="wrap">
          <p className="eyebrow" style={{ color:"var(--fern)" }}>Live demo</p>
          <h2 className="sec-title">Classify waste</h2>
          <p className="sec-lead">Upload a photo or use your camera. The WasteX MobileNetV2 model predicts one of six categories and shows how to dispose of the item. Expect lower accuracy on cluttered, real-world photos — that is exactly what the paper measures.</p>

          <div className="status-row">
            <span className={`status ${backend}`} role="status">
              <i/>{backend === "checking" ? "Checking backend…" : backend === "online" ? "Backend connected" : "Backend not reachable"}
            </span>
            <button className="btn-gh" onClick={checkBackend} style={{ padding:"6px 13px", fontSize:12.5 }}>Check again</button>
            <small>{API_URL}</small>
          </div>

          <div className="sub-tabs">
            <button className={`sub-tab ${activeSubTab === "upload" ? "on" : ""}`} onClick={() => setActiveSubTab("upload")}><Upload size={14}/>Upload image</button>
            <button className={`sub-tab ${activeSubTab === "camera" ? "on" : ""}`} onClick={() => setActiveSubTab("camera")}><Camera size={14}/>Use camera</button>
          </div>

          {activeSubTab === "upload" && (
            <div className="g2">
              <div className="card">
                <div className="card-icon"><Upload size={21} color="var(--fern)"/></div>
                <h3 className="card-title">Image uploader</h3>
                <p className="card-desc">Choose a waste image to classify it into one of the six TrashNet categories.</p>
                <input type="file" accept="image/*" onChange={handleFileChange}/>
                {previewUrl && (
                  <div style={{ marginTop:"1rem" }}>
                    <p className="preview-lbl">Preview</p>
                    <div className="thumb"><img src={previewUrl} alt="Selected waste item" style={{ width:"100%", display:"block" }}/></div>
                  </div>
                )}
                <div className="ctrl-row">
                  <button className="btn-g" onClick={handlePredict} disabled={loading}>
                    {loading ? <><div className="spin"/>Predicting…</> : <><Scan size={14}/>Predict class</>}
                  </button>
                </div>
                {result && <ResultBlock cls={result} conf={confidence}/>}
                {error && <div className="err-box">{error}</div>}
              </div>

              <div className="gcol">
                <div className="card">
                  <div className="card-icon"><CheckCircle2 size={21} color="var(--fern)"/></div>
                  <h3 className="card-title">Tips for best results</h3>
                  {["Place waste on a plain neutral background", "Ensure even lighting — avoid harsh shadows", "Crop tightly so the item fills the frame", "Photograph one item at a time", "Glass and trash are the hardest classes — expect more mistakes there"].map(t => (
                    <div key={t} className="tip"><CheckCircle2 size={14} color="var(--leaf)" style={{ flexShrink:0, marginTop:3 }}/>{t}</div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-icon"><Info size={21} color="var(--river)"/></div>
                  <h3 className="card-title">Supported categories</h3>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:8 }}>
                    {["Cardboard", "Glass", "Metal", "Paper", "Plastic", "Trash"].map(c => (
                      <span key={c} style={{ background:"var(--mist)", color:"var(--moss)", borderRadius:7, padding:"4px 12px", fontSize:12.5, fontWeight:500 }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "camera" && (
            <div className="g2">
              <div className="card">
                <div className="card-icon"><Camera size={21} color="var(--fern)"/></div>
                <h3 className="card-title">Live camera</h3>
                <p className="card-desc">Point your camera at a waste item, then choose Classify waste to send the current frame to the model.</p>
                <div className="cam-view">
                  {!cameraActive && <div className="cam-ph"><CameraOff size={34} color="var(--stone)" style={{ margin:"0 auto 9px" }}/><p style={{ fontSize:13 }}>Camera not started</p></div>}
                  <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", maxHeight:290, objectFit:"cover", display:cameraActive ? "block" : "none", borderRadius:14 }}/>
                  {cameraActive && <div className="live-badge"><div className="live-dot"/>Live</div>}
                </div>
                <canvas ref={canvasRef} style={{ display:"none" }}/>
                <div className="ctrl-row">
                  {!cameraActive
                    ? <button className="btn-g" onClick={() => startCamera()}><Camera size={14}/>Start camera</button>
                    : <>
                        <button className="btn-g" onClick={captureAndClassify} disabled={cameraLoading}>
                          {cameraLoading ? <><div className="spin"/>Classifying…</> : <><Scan size={14}/>Classify waste</>}
                        </button>
                        <button className="btn-gh" onClick={switchCamera}><SwitchCamera size={13}/>Switch</button>
                        <button className="btn-gh" onClick={stopCamera}>Stop</button>
                      </>}
                </div>
                {cameraError && <div className="err-box">{cameraError}</div>}
              </div>

              <div className="gcol">
                <div className="card">
                  <div className="card-icon"><Recycle size={21} color="var(--fern)"/></div>
                  <h3 className="card-title">Classification result</h3>
                  {!cameraResult && !cameraLoading && <p style={{ fontSize:13, color:"var(--t-muted)", marginTop:8 }}>Start the camera and choose Classify waste to see the result here.</p>}
                  {cameraLoading && <div className="loading-row"><div className="spin"/>Analysing frame…</div>}
                  {cameraResult && !cameraLoading && (
                    <>
                      {capturedThumb && <div className="cam-thumb"><img src={capturedThumb} alt="Captured frame" style={{ width:"100%", display:"block" }}/></div>}
                      <ResultBlock cls={cameraResult.predictedClass} conf={cameraResult.confidence}/>
                    </>
                  )}
                </div>
                <div className="card">
                  <h3 className="card-title" style={{ fontSize:"1rem", marginBottom:".8rem" }}>Camera tips</h3>
                  {["Place waste on a plain, neutral background", "Ensure even lighting — avoid harsh shadows", "Hold the item close so it fills the frame", "Use the rear camera for sharper quality"].map(t => (
                    <div key={t} className="tip"><CheckCircle2 size={14} color="var(--leaf)" style={{ flexShrink:0, marginTop:3 }}/>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="history">
            <div className="history-head"><History size={17} color="var(--river)"/><h3 className="history-title">Prediction history</h3></div>
            {historyItems.length === 0
              ? <div className="empty">No predictions yet. Upload an image or start the camera to get your first result.</div>
              : <div className="hgrid">
                  {historyItems.map((item, i) => (
                    <div key={i} className="hcard-item">
                      <div className="hcard-top">
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          {item.thumb && <img src={item.thumb} alt="" style={{ width:42, height:42, borderRadius:9, objectFit:"cover", border:"1px solid var(--border)" }}/>}
                          <div><p className="hl">File</p><p className="hv" style={{ fontSize:12.5 }}>{item.fileName}</p></div>
                        </div>
                        <CheckCircle2 size={15} color="var(--leaf)"/>
                      </div>
                      <p className="hl">Predicted class</p>
                      <p className="hcls">{item.predictedClass}</p>
                      <div style={{ display:"flex", gap:18, marginTop:9 }}>
                        <div><p className="hl">Confidence</p><p className="hv">{item.confidence || "N/A"}</p></div>
                        <div><p className="hl">Time</p><p className="hv" style={{ fontSize:12 }}>{item.time}</p></div>
                      </div>
                    </div>
                  ))}
                </div>}
          </div>
          <PageNav current="classify" go={go}/>
        </section>
      )}

      {/* ══════════════ DATASETS ══════════════ */}
      {activePage === "dataset" && (
        <>
          <section className="wrap">
            <p className="eyebrow" style={{ color:"var(--amber)" }}>Data</p>
            <h2 className="sec-title">Two datasets, one shared label set</h2>
            <p className="sec-lead">Models learn from TrashNet and are then tested, without any retraining, on RealWaste. Only the six classes the two datasets share are used.</p>

            <div className="g2e">
              <div className="dcard">
                <h3 className="dname">TrashNet — training source</h3>
                <p className="dinfo">2,527 images in six classes: cardboard, glass, metal, paper, plastic and trash. Items are photographed in clean, staged conditions. Split per class into 70/15/15 with seed 42.</p>
                <dl className="kv" style={{ marginTop:"1rem" }}>
                  <dt>Training</dt><dd>1,766 images</dd>
                  <dt>Validation</dt><dd>377 images</dd>
                  <dt>Test</dt><dd>384 images</dd>
                </dl>
                <span className="dtag">Staged · controlled background</span>
              </div>
              <div className="dcard">
                <h3 className="dname">RealWaste — unseen evaluation set</h3>
                <p className="dinfo">Real-world landfill images with cluttered backgrounds. The full collection holds about 4,750 images in nine classes; we use the 3,587 images from the six classes that match TrashNet.</p>
                <dl className="kv" style={{ marginTop:"1rem" }}>
                  <dt>Calibration set</dt><dd>2,510 images (70%)</dd>
                  <dt>Held-out set</dt><dd>1,077 images (30%)</dd>
                  <dt>Repeats</dt><dd>100 random stratified splits</dd>
                </dl>
                <span className="dtag">Cluttered · real-world</span>
              </div>
            </div>

            <h3 className="sub-title">Class mapping and image counts</h3>
            <div className="tbl-wrap">
              <table className="tbl">
                <caption>Table I from the paper: how TrashNet classes map to RealWaste classes.</caption>
                <thead><tr><th>TrashNet class</th><th className="num">Images</th><th>RealWaste class</th><th className="num">Images</th></tr></thead>
                <tbody>
                  {CLASS_MAP.map(r => <tr key={r.tn}><td>{r.tn}</td><td className="num">{r.tnN}</td><td>{r.rw}</td><td className="num">{r.rwN}</td></tr>)}
                  <tr className="hi"><td>Total</td><td className="num">2,527</td><td>Total</td><td className="num">3,587</td></tr>
                </tbody>
              </table>
            </div>

            <div className="g2e" style={{ marginTop:"1.6rem" }}>
              <div className="card">
                <h3 className="card-title" style={{ fontSize:"1.05rem" }}>Class balance</h3>
                <Legend items={[{ label:"TrashNet", color:C_SRC }, { label:"RealWaste", color:C_TGT }]}/>
                {CLASS_MAP.map(r => (
                  <div key={r.tn} className="pg">
                    <p className="pg-name">{r.tn}</p>
                    <HBar label="TrashNet" value={r.tnN} max={950} suffix="" digits={0} color={C_SRC}/>
                    <HBar label="RealWaste" value={r.rwN} max={950} suffix="" digits={0} color={C_TGT}/>
                  </div>
                ))}
              </div>
              <div className="gcol">
                <div className="callout">
                  <strong>Read the trash row with caution.</strong> RealWaste's "Miscellaneous Trash" is a catch-all category, while TrashNet's trash class is small (137 images) and photographed under staged conditions. Trash results therefore mix visual domain shift with a difference in label definition.
                </div>
                <div className="card">
                  <div className="card-icon"><AlertTriangle size={21} color="var(--amber)"/></div>
                  <h3 className="card-title">Dataset limitations</h3>
                  <div className="setup-list">
                    {["TrashNet backgrounds are staged and don't reflect real-world clutter", "Trash is heavily under-represented in TrashNet (137 images)", "Only six categories, taken from three-quarters of RealWaste", "Only one target dataset, so conclusions need confirming elsewhere"].map(t => <div key={t} className="setup-item"><div className="setup-dot"/>{t}</div>)}
                  </div>
                </div>
              </div>
            </div>
            <PageNav current="dataset" go={go}/>
          </section>
        </>
      )}

      {/* ══════════════ FUTURE WORK ══════════════ */}
      {activePage === "future" && (
        <>
          <section className="wrap">
            <p className="eyebrow" style={{ color:"var(--river)" }}>What comes next</p>
            <h2 className="sec-title">Future improvements</h2>
            <p className="sec-lead">The first three groups follow directly from the limitations in the paper. The last two are our suggestions for taking WasteX from a study to a working sorting system.</p>

            <div className="g3">
              {[
                { icon:<FlaskConical size={21} color="var(--fern)"/>, title:"Strengthen the evidence", tag:"paper", items:[
                  "Train every model with several seeds and report means with confidence intervals",
                  "Run ablations, since WasteX changes augmentation, fine-tuning and training schedule at once",
                  "Rebuild the Geometry model with the same pixel scaling and dropout as the others for a fair comparison",
                ]},
                { icon:<Globe size={21} color="var(--river)"/>, title:"Close the domain gap", tag:"paper", items:[
                  "Evaluate on more target datasets beyond RealWaste",
                  "Train on merged datasets from different regions and conditions",
                  "Try domain-adaptation methods for the TrashNet-to-real-world shift",
                  "Harmonise class definitions, especially trash versus miscellaneous trash",
                ]},
                { icon:<Gauge size={21} color="var(--amber)"/>, title:"Make calibration deployable", tag:"paper", items:[
                  "Fit the temperature on source-domain data only and measure how much worse it performs",
                  "Study how few labelled target images are enough to fit T",
                  "Compare against per-bin temperature scaling and quantile-adaptive scaling",
                ]},
                { icon:<Target size={21} color="var(--rust)"/>, title:"Fix the weakest classes", tag:"sug", items:[
                  "Investigate why glass (24.5–31.7% recall) and trash (15.8–30.5%) fail, since the paper did not test the causes",
                  "Collect more cluttered, real-world training examples for those classes",
                  "Check for visual confusion between classes with a confusion matrix",
                ]},
                { icon:<ShieldCheck size={21} color="var(--leaf)"/>, title:"Ship it in the demo and the bin", tag:"sug", items:[
                  "Return temperature-scaled confidence from the Flask API (see Project setup)",
                  "Set a calibrated confidence threshold that sends uncertain items to human review",
                  "Test the MobileNetV2 model on an embedded smart-bin device",
                ]},
              ].map(g => (
                <div key={g.title} className="card">
                  <div className="card-icon">{g.icon}</div>
                  <h3 className="card-title">{g.title}</h3>
                  <span className={`tag ${g.tag === "paper" ? "tag-paper" : "tag-sug"}`}>{g.tag === "paper" ? "From the paper" : "Suggested"}</span>
                  <ul className="road-list">
                    {g.items.map(t => <li key={t}><ChevronRight size={13} color="var(--leaf)"/>{t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <div className="divider"/>

          <section className="wrap-alt">
            <div className="inner">
              <p className="eyebrow" style={{ color:"var(--amber)" }}>Be aware</p>
              <h2 className="sec-title">Limitations of the current study</h2>
              <div className="g2e">
                {[
                  ["Single training runs", "Accuracy differences of at most 1.2 points (McNemar p ≥ 0.25) cannot be told apart from noise."],
                  ["Not a pure augmentation test", "Geometry also changes pixel scaling ([0, 1] instead of [−1, 1]) and dropout (0.2 instead of 0.3)."],
                  ["Uneven class performance", "Glass and trash recall stayed between 15.76% and 31.67%. WasteX's macro-averaged recall was 43.54%."],
                  ["Target labels were used", "Temperature scaling used labelled RealWaste images. The 100 splits overlap, so their spread is not training variability."],
                  ["Discrimination is unchanged", "Scaling improves confidence reliability, not accuracy. Only one target dataset was used."],
                ].map(([t, d]) => (
                  <div key={t} className="ccard" style={{ background:"#fff", border:"1px solid var(--border)" }}>
                    <div className="cicon" style={{ background:"var(--sand)" }}><AlertTriangle size={13} color="var(--amber)"/></div>
                    <div><p style={{ fontWeight:600, color:"var(--soil)", fontSize:14 }}>{t}</p><p className="ctxt" style={{ color:"var(--t-soft)" }}>{d}</p></div>
                  </div>
                ))}
              </div>
              <PageNav current="future" go={go}/>
            </div>
          </section>
        </>
      )}

      {/* ══════════════ METHODOLOGY ══════════════ */}
      {activePage === "method" && (
        <section className="wrap">
          <p className="eyebrow" style={{ color:"var(--fern)" }}>How the study was run</p>
          <h2 className="sec-title">Methodology</h2>
          <p className="sec-lead">Four MobileNetV2 configurations were trained on TrashNet, tested on RealWaste, and then calibrated with a single temperature value.</p>

          <h3 className="sub-title" style={{ marginTop:0 }}>Architecture</h3>
          <div className="pipe">
            {["Image 224 × 224", "MobileNetV2 (ImageNet weights)", "Global average pooling", "Dropout (0.3; 0.2 for Geometry)", "Dense, 6 softmax outputs"].map((s, i, a) => (
              <Fragment key={s}><div className="pipe-step">{s}</div>{i < a.length - 1 && <ChevronRight size={16} color="var(--leaf)"/>}</Fragment>
            ))}
          </div>
          <p style={{ fontSize:13, color:"var(--t-soft)", marginTop:".8rem" }}>Pixel scaling happens inside each model: to [−1, 1], or to [0, 1] for Geometry.</p>

          <h3 className="sub-title">The four configurations</h3>
          <div className="g3">
            {[
              { n:"Original", d:"Frozen backbone, classification head only, single stage (up to 10 epochs). No augmentation beyond pixel scaling." },
              { n:"Geometry", d:"Random rotation (±36°), translation and zoom (10% each). No flips or shear. Also uses [0, 1] scaling and dropout 0.2." },
              { n:"Lighting", d:"Random brightness (±20% of the pixel range) and contrast (up to +20%)." },
              { n:"WasteX", d:"Two stages with combined augmentation: flip, rotation, translation, zoom and contrast. Stage 1 trains the head (lr 1e-3, up to 10 epochs). Stage 2 unfreezes the last 30 backbone layers (batch-norm stays frozen) at lr 1e-5 for up to 15 epochs.", hi:true },
            ].map(m => (
              <div key={m.n} className="card" style={m.hi ? { borderColor:"var(--leaf)", background:"#f6fbf3" } : null}>
                <h3 className="card-title">{m.n}</h3>
                <p className="card-desc" style={{ marginBottom:0 }}>{m.d}</p>
              </div>
            ))}
          </div>

          <div className="g2e" style={{ marginTop:"1.6rem" }}>
            <div className="card">
              <div className="card-icon"><Cpu size={21} color="var(--river)"/></div>
              <h3 className="card-title">Training details</h3>
              <div className="setup-list">
                {["Optimizer: Adam, learning rate 1e-3, batch size 32", "Loss: categorical cross-entropy", "Early stopping on validation loss (patience 3, best weights restored)", "TrashNet split 1,766 / 377 / 384, random seed 42", "Training itself was not seeded"].map(t => <div key={t} className="setup-item"><div className="setup-dot"/>{t}</div>)}
              </div>
            </div>
            <div className="card">
              <div className="card-icon"><BarChart3 size={21} color="var(--amber)"/></div>
              <h3 className="card-title">Evaluation metrics</h3>
              <div className="setup-list">
                {["Top-1 accuracy with 95% bootstrap intervals (2,000 resamples)", "Exact McNemar test on paired predictions", "Per-class recall", "Average confidence and the confidence–accuracy gap", "Expected Calibration Error (10 bins) and multiclass Brier score", "Count of high-confidence errors"].map(t => <div key={t} className="setup-item"><div className="setup-dot"/>{t}</div>)}
              </div>
            </div>
          </div>

          <h3 className="sub-title">Held-out temperature scaling</h3>
          <ol className="steps-num">
            {[
              "Split the RealWaste predictions by stratified sampling: 70% calibration (n = 2,510), 30% held-out evaluation (n = 1,077).",
              "Fit one temperature T > 0 on the calibration set by grid search over [0.5, 5.0] in steps of 0.01, choosing the value that minimises ECE.",
              "Divide the held-out logits by T. The predicted class does not change, so accuracy stays the same.",
              "Repeat on 100 random splits and report mean ± SD. Fitting T by negative log-likelihood instead gave nearly identical results.",
            ].map(t => <li key={t}>{t}</li>)}
          </ol>
          <PageNav current="method" go={go}/>
        </section>
      )}

      {/* ══════════════ RESULTS ══════════════ */}
      {activePage === "results" && (
        <section className="wrap">
          <p className="eyebrow" style={{ color:"var(--river)" }}>Findings</p>
          <h2 className="sec-title">Results</h2>
          <p className="sec-lead">All values come from the paper. Classification results are from single training runs; calibration results are mean ± SD over 100 held-out splits.</p>

          <div className="sub-tabs">
            {[["accuracy", "Accuracy", <Target size={14}/>], ["confidence", "Confidence", <Gauge size={14}/>], ["perclass", "Per class", <Layers size={14}/>], ["calibration", "Calibration", <Thermometer size={14}/>]].map(([id, l, ic]) => (
              <button key={id} className={`sub-tab ${resTab === id ? "on" : ""}`} onClick={() => setResTab(id)}>{ic}{l}</button>
            ))}
          </div>

          {resTab === "accuracy" && (
            <div className="g2e">
              <div className="gcol">
                <div className="tbl-wrap">
                  <table className="tbl">
                    <caption>Accuracy on TrashNet and RealWaste (n = 3,587 RealWaste images).</caption>
                    <thead><tr><th>Model</th><th className="num">TrashNet</th><th className="num">RealWaste</th><th className="num">95% CI</th><th className="num">McNemar p</th></tr></thead>
                    <tbody>
                      {MODELS.map(m => (
                        <tr key={m.name} className={m.name === "WasteX" ? "hi" : ""}>
                          <td>{m.name}</td><td className="num">{m.tn.toFixed(2)}%</td><td className="num">{m.rw.toFixed(2)}%</td><td className="num">{m.ci}</td><td className="num">{m.p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="callout">
                  Confidence intervals overlap (about ±1.6 points) and every test against Original gave p ≥ 0.25. <strong>The differences of up to 1.23 points are not evidence that any configuration improves cross-dataset accuracy.</strong>
                </div>
              </div>
              <div className="card"><AccuracyGap/></div>
            </div>
          )}

          {resTab === "confidence" && (
            <>
              <div className="g2e">
                <div className="card">
                  <h3 className="card-title" style={{ fontSize:"1.05rem" }}>Accuracy vs mean confidence on RealWaste</h3>
                  <Legend items={[{ label:"Accuracy", color:C_TGT }, { label:"Mean confidence", color:"#3E8FA8" }]}/>
                  {MODELS.map(m => (
                    <div key={m.name} className="pg">
                      <p className="pg-name">{m.name} <span style={{ fontWeight:400, color:"var(--t-soft)" }}>· gap {m.gap.toFixed(2)} pp</span></p>
                      <HBar label="Accuracy" value={m.rw} color={C_TGT}/>
                      <HBar label="Confidence" value={m.conf} color="#3E8FA8"/>
                    </div>
                  ))}
                </div>
                <div className="gcol">
                  <div className="callout">
                    Original, Geometry and Lighting were overconfident by about 21–22 points. <strong>WasteX had the highest mean confidence (72.53%) for only a marginal accuracy gain</strong>, giving the largest gap at 24.83 points.
                  </div>
                  <div className="tbl-wrap">
                    <table className="tbl">
                      <caption>Incorrect predictions above each confidence threshold, before calibration.</caption>
                      <thead><tr><th>Model</th><th className="num">≥70%</th><th className="num">≥80%</th><th className="num">≥90%</th><th className="num">≥95%</th></tr></thead>
                      <tbody>
                        {HC_ERRORS.map(r => (
                          <tr key={r.name} className={r.name === "WasteX" ? "hi" : ""}>
                            <td>{r.name}</td><td className="num">{r.e70}</td><td className="num">{r.e80}</td><td className="num">{r.e90}</td><td className="num">{r.e95}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {resTab === "perclass" && (
            <>
              <div className="tbl-wrap">
                <table className="tbl">
                  <caption>Per-class recall on the full RealWaste set. Darker green means higher recall.</caption>
                  <thead><tr><th>Category</th>{MODELS.map(m => <th key={m.name} className="num">{m.name}</th>)}</tr></thead>
                  <tbody>
                    {RECALL.map(r => (
                      <tr key={r.cls}>
                        <td>{r.cls}</td>
                        {r.v.map((v, i) => <td key={i} className="num" style={{ background:`rgba(78,138,70,${(v / 100) * 0.55})` }}>{v.toFixed(2)}%</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="callout" style={{ marginTop:"1.4rem", maxWidth:860 }}>
                Metal was recalled best (59.75–70.13%). Glass (24.52–31.67%) and trash (15.76–30.51%) were worst for every model. Geometry and WasteX improved cardboard recall over Original, but WasteX did not improve glass or paper. <strong>The configurations produced different error patterns rather than uniform gains.</strong>
              </div>
            </>
          )}

          {resTab === "calibration" && (
            <>
              <div className="g2e">
                <div className="card">
                  <h3 className="card-title" style={{ fontSize:"1.05rem" }}>Expected calibration error, before and after</h3>
                  <Legend items={[{ label:"Before scaling", color:C_TGT }, { label:"After scaling", color:C_SRC }]}/>
                  {CALIB.map(c => (
                    <div key={c.name} className="pg">
                      <p className="pg-name">{c.name} <span style={{ fontWeight:400, color:"var(--t-soft)" }}>· T = {c.T}</span></p>
                      <HBar label="Before" value={c.before} max={30} color={C_TGT}/>
                      <HBar label="After" value={c.after} max={30} color={C_SRC}/>
                    </div>
                  ))}
                </div>
                <TemperatureDemo/>
              </div>

              <div className="tbl-wrap" style={{ marginTop:"1.4rem" }}>
                <table className="tbl">
                  <caption>Held-out results over 100 splits (1,077 images each), mean ± SD.</caption>
                  <thead><tr><th>Model</th><th className="num">ECE after, %</th><th className="num">Brier after</th><th className="num">Errors ≥80% before</th><th className="num">Errors ≥80% after</th></tr></thead>
                  <tbody>
                    {CALIB.map(c => (
                      <tr key={c.name} className={c.name === "WasteX" ? "hi" : ""}>
                        <td>{c.name}</td><td className="num">{c.after.toFixed(2)} ± {c.afterSd}</td><td className="num">{c.brier}</td><td className="num">{c.e80b}</td><td className="num">{c.e80a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="callout green" style={{ marginTop:"1.4rem", maxWidth:860 }}>
                Temperature scaling cut ECE from about 21–25% to 3–4% and confident errors from 111–172 to 1.7–3.0 per split, without changing accuracy. The post-calibration ECE values overlap within about one standard deviation, <strong>so they should not be read as a ranking of models.</strong>
              </div>
            </>
          )}
          <PageNav current="results" go={go}/>
        </section>
      )}

      {/* ══════════════ WASTE GUIDE ══════════════ */}
      {activePage === "guide" && (
        <>
          <section className="wrap">
            <p className="eyebrow" style={{ color:"var(--leaf)" }}>Disposal reference</p>
            <h2 className="sec-title">Waste disposal guide</h2>
            <p className="sec-lead">The six categories the classifier can recognise, with disposal steps and recycling tips for each.</p>
            <div className="class-grid">
              {CLASSES.map(c => (
                <div key={c.key} className="class-card">
                  <div className="class-icon" style={{ background:DISPOSAL_GUIDE[c.key].bg }}>{c.icon}</div>
                  <h3 style={{ fontSize:"1rem", marginBottom:".3rem" }}>{c.label}</h3>
                  <p style={{ fontSize:12.5, color:"var(--t-soft)", marginBottom:"1rem", lineHeight:1.5 }}>{c.desc}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {DISPOSAL_GUIDE[c.key].steps.slice(0, 2).map((s, i) => (
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", fontSize:12.5, color:"var(--t-mid)" }}>
                        <ChevronRight size={12} color="var(--leaf)" style={{ flexShrink:0, marginTop:3 }}/><span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:".9rem", padding:"8px 11px", background:DISPOSAL_GUIDE[c.key].bg, borderRadius:9, fontSize:12, color:"var(--t-soft)" }}>
                    <Leaf size={11} color={DISPOSAL_GUIDE[c.key].color} style={{ display:"inline", marginRight:5, verticalAlign:"middle" }}/>
                    {DISPOSAL_GUIDE[c.key].tip}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="divider"/>

          <section className="wrap-alt">
            <div className="inner">
              <p className="eyebrow" style={{ color:"var(--river)" }}>Environmental impact</p>
              <h2 className="sec-title">Why correct disposal matters</h2>
              <div className="g3">
                {[
                  { icon:<TreePine size={18} color="var(--fern)"/>, title:"Saves trees", desc:"1 tonne of recycled paper saves 17 trees and 26,500 litres of water." },
                  { icon:<Zap size={18} color="var(--amber)"/>, title:"Saves energy", desc:"Recycling aluminium uses 95% less energy than producing it from raw bauxite." },
                  { icon:<Globe size={18} color="var(--river)"/>, title:"Reduces emissions", desc:"Proper waste management could cut global GHG emissions by up to 20%." },
                  { icon:<Droplets size={18} color="var(--sky)"/>, title:"Protects water", desc:"Landfill leachate is a major source of groundwater contamination globally." },
                ].map(f => (
                  <div key={f.title} className="card">
                    <div className="card-icon">{f.icon}</div>
                    <h3 className="card-title" style={{ fontSize:"1rem" }}>{f.title}</h3>
                    <p className="card-desc" style={{ marginBottom:0 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
              <PageNav current="guide" go={go}/>
            </div>
          </section>
        </>
      )}

      {/* ══════════════ TEAM & REFERENCES ══════════════ */}
      {activePage === "team" && (
        <section className="wrap">
          <p className="eyebrow" style={{ color:"var(--fern)" }}>The people behind WasteX</p>
          <h2 className="sec-title">Team &amp; references</h2>
          <p className="sec-lead">Department of Data Science and Engineering, Manipal University Jaipur, Jaipur, Rajasthan, India.</p>

          <div className="g3">
            {[
              { n:"Divyanshi Kumari", i:"DK", mail:"divyanshik152@gmail.com" },
              { n:"Shreyashi Pandey", i:"SP", mail:"shreyaship018@gmail.com" },
              { n:"Dr. Santosh Rajak", i:"SR" },
            ].map(a => (
              <div key={a.n} className="card">
                <div className="author">
                  <div className="avatar">{a.i}</div>
                  <div>
                    <h3 className="card-title" style={{ fontSize:"1.1rem", marginBottom:2 }}>{a.n}</h3>
                    <p style={{ fontSize:12.5, color:"var(--t-soft)" }}>Data Science and Engineering<br/>Manipal University Jaipur</p>
                    {a.mail && <a href={`mailto:${a.mail}`}>{a.mail}</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="sub-title">Paper</h3>
          <div className="card">
            <div className="author">
              <div className="card-icon" style={{ marginBottom:0, flexShrink:0 }}><FileText size={21} color="var(--fern)"/></div>
              <div>
                <h3 className="card-title" style={{ fontSize:"1.05rem" }}>WasteX: {PAPER_TITLE}</h3>
                <p style={{ fontSize:13, color:"var(--t-soft)" }}>Kumari, D., Pandey, S., &amp; Rajak, S. Manipal University Jaipur.</p>
              </div>
            </div>
          </div>

          <h3 className="sub-title">Key references</h3>
          <ul className="refs">{REFS.map(r => <li key={r}>{r}</li>)}</ul>
          <p style={{ fontSize:12.5, color:"var(--t-soft)", marginTop:".9rem" }}>This is a selection. The full reference list is in the paper.</p>
          <PageNav current="team" go={go}/>
        </section>
      )}

      {/* ══════════════ PROJECT SETUP ══════════════ */}
      {activePage === "setup" && (
        <section className="wrap">
          <p className="eyebrow" style={{ color:"var(--fern)" }}>Technical reference</p>
          <h2 className="sec-title">Project setup</h2>
          <p className="sec-lead">Run the WasteX demo locally: a React front end that sends images to a Flask API serving the MobileNetV2 model.</p>

          <div className="g2">
            <div className="gcol">
              <div className="card">
                <div className="card-icon"><FlaskConical size={21} color="var(--river)"/></div>
                <h3 className="card-title">Tech stack</h3>
                <div className="setup-list">
                  {["Frontend: React + Vite", "Backend: Python · Flask", "Model: MobileNetV2, two-stage fine-tuned (WasteX)", "Training data: TrashNet (6 classes)", "Serving: Flask REST API on port 5000"].map(t => <div key={t} className="setup-item"><div className="setup-dot"/>{t}</div>)}
                </div>
              </div>
              <div className="card">
                <div className="card-icon"><Settings size={21} color="var(--stone)"/></div>
                <h3 className="card-title">Environment setup</h3>
                <div className="setup-list">
                  {["Python 3.9+ required", "pip install flask flask-cors tensorflow pillow", "Node 18+ for the React frontend", "npm install && npm run dev", "Flask: python app.py (default port 5000)", "CORS enabled on Flask for localhost:5173", "Optional: set VITE_API_URL to point the frontend at another backend"].map(t => <div key={t} className="setup-item"><div className="setup-dot"/>{t}</div>)}
                </div>
              </div>
            </div>

            <div className="gcol">
              <div className="card">
                <div className="card-icon"><Cpu size={21} color="var(--fern)"/></div>
                <h3 className="card-title">Model details</h3>
                <div className="setup-list">
                  {["Architecture: MobileNetV2, ImageNet-pretrained", "Input: 224 × 224 px", "Output: 6-class softmax", "Stage 1: head only, Adam lr 1e-3", "Stage 2: last 30 layers unfrozen, lr 1e-5", "TrashNet test accuracy: 82.81%", "RealWaste accuracy: 47.70%"].map(t => <div key={t} className="setup-item"><div className="setup-dot"/>{t}</div>)}
                </div>
              </div>
              <div className="card">
                <div className="card-icon"><ArrowRight size={21} color="var(--amber)"/></div>
                <h3 className="card-title">API endpoints</h3>
                <div className="setup-list">
                  {["POST /predict — accepts multipart/form-data image", "Returns: predicted_class, confidence (0–1)", "GET / — connection check, returns \"Flask backend is running\"", "Accepted: JPEG, PNG, WEBP"].map(t => <div key={t} className="setup-item"><div className="setup-dot"/>{t}</div>)}
                </div>
              </div>
            </div>
          </div>

          <h3 className="sub-title">Optional: return calibrated confidence</h3>
          <div className="card">
            <p className="card-desc" style={{ marginBottom:0 }}>The API currently returns raw softmax confidence, which the paper shows is overconfident on real-world images. Applying the fitted temperature before returning it brings it closer to true accuracy. T = 2.51 was fitted on RealWaste for WasteX (Table VI), so refit it if your deployment images look different.</p>
            <pre className="code">{`import numpy as np

T = 2.51  # WasteX, fitted on RealWaste (paper, Table VI)

def calibrate(probs, T=T):
    z = np.log(np.clip(probs, 1e-12, 1.0)) / T
    z -= z.max()
    e = np.exp(z)
    return e / e.sum()`}</pre>
          </div>

          <div style={{ marginTop:"1.5rem" }}>
            <div className="info-box">
              <Info size={15} color="var(--river)" style={{ flexShrink:0, marginTop:2 }}/>
              <span>The frontend posts to <strong>{API_URL}/predict</strong>. Make sure Flask is running before classifying. For production, serve over HTTPS and restrict the allowed CORS origins.</span>
            </div>
          </div>
          <PageNav current="setup" go={go}/>
        </section>
      )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, marginBottom:8 }}>
          <Globe size={13} color="var(--stone)"/>
          <span style={{ fontSize:12.5, color:"var(--stone)" }}>WasteX · Manipal University Jaipur</span>
        </div>
        <p style={{ fontSize:12, color:"var(--ash)" }}>Cross-dataset generalization and confidence calibration in MobileNetV2-based waste classification</p>
      </footer>
    </>
  );
}
