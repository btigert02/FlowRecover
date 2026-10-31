import streamlit as st
import shutil
from pathlib import Path

# Ensure static/index.html is always in sync with index.html
base_dir = Path(__file__).parent
static_dir = base_dir / "static"
static_dir.mkdir(exist_ok=True)
index_file = base_dir / "index.html"
if index_file.exists():
    shutil.copy(index_file, static_dir / "index.html")

st.set_page_config(
    page_title="FlowRecover x Life Planner",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS & immediate redirect to native static app (breaks out of iframe for Google Auth)
st.markdown("""
    <style>
        #MainMenu, header, footer, .stDeployButton, [data-testid="stToolbar"], [data-testid="stHeader"] {
            display: none !important;
            visibility: hidden !important;
        }
        .main .block-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100vw !important;
            height: 100vh !important;
            background: #0f172a;
        }
    </style>
    <meta http-equiv="refresh" content="0; url=/app/static/index.html">
    <script>
        if (window.location.pathname !== "/app/static/index.html") {
            window.location.replace("/app/static/index.html");
        }
    </script>
""", unsafe_allow_html=True)

st.markdown("""
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:85vh;color:#e5e7eb;font-family:'Segoe UI',sans-serif;text-align:center;padding:24px">
    <div style="font-size:3.5rem;margin-bottom:12px;filter:drop-shadow(0 0 20px #f59e0b)">⚡</div>
    <h1 style="font-size:1.8rem;margin-bottom:8px;font-weight:700">FlowRecover x Life Planner</h1>
    <p style="color:#94a3b8;font-size:1rem;margin-bottom:28px">กำลังเปิดหน้าระบบเต็มจอเพื่อความปลอดภัยในการเข้าสู่ระบบ...</p>
    <a href="/app/static/index.html" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#0f172a;padding:16px 36px;border-radius:99px;font-weight:700;text-decoration:none;font-size:1.1rem;box-shadow:0 10px 25px rgba(245,158,11,.4)">
        🚀 แตะที่นี่เพื่อเปิดแอปทันที
    </a>
</div>
""", unsafe_allow_html=True)
