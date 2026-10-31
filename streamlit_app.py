import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

# Configure Streamlit page for maximum screen estate & mobile responsiveness
st.set_page_config(
    page_title="FlowRecover x Life Planner",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit default chrome & style iframe to take full viewport
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
            overflow: hidden !important;
        }
        div[data-testid="stVerticalBlock"] {
            gap: 0 !important;
        }
        iframe {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            border: none !important;
            z-index: 999999 !important;
        }
    </style>
""", unsafe_allow_html=True)

# Read and render index.html
html_path = Path(__file__).parent / "index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

components.html(html_content, height=1200, scrolling=True)
