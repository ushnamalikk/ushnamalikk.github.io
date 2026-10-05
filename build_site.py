import re, time
VER=str(int(time.time()))
SITE="/Users/u_malik/Documents/search_divergence-main/ushna-site"

NAV=[("About","index.html"),("Research","research.html"),("Teaching & Service","teaching.html")]
def page(title, active, body, desc="", brand=True):
    items=""
    for name,href in NAV:
        cur=' active' if name==active else ''
        sr='<span class="sr-only">(current)</span>' if name==active else ''
        items+=f'            <li class="nav-item{cur}"><a class="nav-link" href="{href}">{name} {sr}</a></li>\n'
    items+='            <li class="nav-item"><a class="nav-link" href="assets/pdf/cv.pdf" target="_blank" rel="noopener">CV</a></li>\n'
    items+='            <li class="toggle-container"><button id="light-toggle" type="button" title="Change theme" aria-label="Change color theme"><i class="fa-solid fa-circle-half-stroke" id="light-toggle-system"></i><i class="fa-solid fa-moon" id="light-toggle-dark"></i><i class="fa-solid fa-sun" id="light-toggle-light"></i></button></li>\n'
    brand_html='<a class="navbar-brand title font-weight-lighter" href="index.html"><span class="font-weight-bold">Ushna</span> Malik</a>\n        ' if brand else ''
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="icon" type="image/png" sizes="512x512" href="assets/img/favicon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png">
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/img/favicon-180.png">
  <meta name="theme-color" content="#d6336c">
  <link rel="stylesheet" href="assets/css/tailwind.css?v={VER}">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/css/all.min.css" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/academicons@1.9.5/css/academicons.min.css" crossorigin="anonymous">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Ysabeau:500,700&display=swap">
  <link rel="stylesheet" href="assets/css/main.css?v={VER}">
  <script src="assets/js/theme.js?v={VER}"></script>
</head>
<body class="fixed-top-nav sticky-bottom-footer">
  <header>
    <nav id="navbar" class="navbar navbar-light navbar-expand-sm fixed-top" role="navigation">
      <div class="container">
        {brand_html}<button class="navbar-toggler collapsed navbar-toggler-main" type="button" data-nav-toggle="navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar top-bar"></span><span class="icon-bar middle-bar"></span><span class="icon-bar bottom-bar"></span>
        </button>
        <div class="collapse navbar-collapse navbar-collapse-main" id="navbarNav">
          <ul class="navbar-nav navbar-menu-list flex-nowrap">
{items}          </ul>
        </div>
      </div>
    </nav>
  </header>
  <div class="container mt-5" role="main">
    <div class="post">
{body}
    </div>
  </div>
  <footer class="sticky-bottom mt-5" role="contentinfo">
    <div class="container">&copy; Copyright 2026 Ushna Malik.</div>
  </footer>
  <script src="assets/js/nav-toggle.js?v={VER}"></script>
</body>
</html>
'''

def card(title, meta_lines, body, contrib=None, link=None, tag=None, title_href=None):
    t=f'<a href="{title_href}" target="_blank" rel="noopener">{title}</a>' if title_href else title
    kicker=f'<span class="kicker">{tag}</span><br>\n            ' if tag else ''
    metas="".join(f'<span class="{cls}">{txt}</span><br>\n            ' for cls,txt in meta_lines)
    link_html=f'<a class="paper-btn" href="{link}" target="_blank" rel="noopener">Paper</a>' if link else ''
    contrib_html=f'<p class="contrib"><span class="contrib-label">My contribution.</span> {contrib}</p>' if contrib else ''
    return f'''        <details class="paper-card">
          <summary>
            {kicker}<b class="ptitle">{t}</b><br>
            {metas}<span class="card-foot"><span class="abs-hint"></span>{link_html}</span>
          </summary>
          <div class="abstract-body">
            <p>{body}</p>
            {contrib_html}
          </div>
        </details>
'''

# ---------------- About ----------------
about='''      <header class="post-header">
        <h1 class="post-title"><span class="font-weight-bold">Ushna Malik</span></h1>
        <p class="desc"></p>
      </header>
      <article>
        <div class="profile float-right">
          <figure>
            <picture>
              <img src="assets/img/headshot.jpg" class="img-fluid rounded-circle" width="100%" height="auto" alt="Ushna Malik" loading="eager">
            </picture>
          </figure>
          <div class="more-info">
            <div class="minimal-icons">
              <a href="mailto:mushna@uiowa.edu" title="Email" aria-label="Email"><i class="fa-regular fa-envelope"></i></a>
              <a href="https://scholar.google.com/citations?user=27Q7xxIAAAAJ&amp;hl=en" title="Google Scholar" aria-label="Google Scholar" target="_blank" rel="noopener"><i class="fa-solid fa-graduation-cap"></i></a>
              <a href="https://www.linkedin.com/in/ushnamalik" title="LinkedIn" aria-label="LinkedIn" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <div class="clearfix">
          <p>Hi! I am Ushna, a second-year PhD student in Computer Science at the <a href="https://cs.uiowa.edu" target="_blank" rel="noopener">University of Iowa</a>, where I work with <a href="https://nithyanand.org/" target="_blank" rel="noopener">Rishab Nithyanand</a> in the <a href="https://sparta.cs.uiowa.edu/" target="_blank" rel="noopener">SPARTA Lab</a>.</p>
          <p>My research examines how generative AI shapes human decision-making, learning, and communication. I combine <strong>audits of AI systems</strong> with <strong>human-subjects studies</strong> to examine what information these systems surface and how it influences people&rsquo;s judgments, beliefs, and behavior. I investigate these questions in <strong>high-stakes domains</strong>, including healthcare and politics. My current work focuses on how the shift from conventional web search to <strong>AI-mediated information seeking</strong> shapes information exposure, learning, and trust.</p>
          <p>Before UIowa, I attended the <a href="https://lums.edu.pk" target="_blank" rel="noopener">Lahore University of Management Sciences</a>, where I graduated with Distinction with a BSc in Computer Science.</p>
          <p>I am always interested in research collaborations and summer/winter research internships in computational social science, human-AI interaction, responsible AI, and software engineering. Please feel free to reach out with opportunities or suggestions!</p>
          <p>You can reach me at <a href="mailto:mushna@uiowa.edu">mushna@uiowa.edu</a>.</p>
        </div>
        <div class="news">
          <h2>News</h2>
          <div class="news-scroll">
          <table>
            <tr><th scope="row">Oct 2026</th><td>Attending <a href="https://cscw.acm.org/2026/" target="_blank" rel="noopener">CSCW 2026</a> as a student volunteer, where I will present <em>The Assistant Erased You</em>.</td></tr>
            <tr><th scope="row">Sep 2026</th><td>Our short paper, <em>The Assistant Erased You</em>, was accepted to the <a href="https://broader-impacts-workshop.github.io/cscw2026-website/" target="_blank" rel="noopener">CSCW 2026 Workshop on the Broader Impacts of Generative AI in Communication</a>.</td></tr>
            <tr><th scope="row">Apr 2026</th><td>Presented my first paper, <em>Prompting, Oversight, and Adoption</em>, at <a href="https://chi2026.acm.org" target="_blank" rel="noopener">CHI 2026</a> in Barcelona.</td></tr>
            <tr><th scope="row">Aug 2025</th><td>Started my PhD in Computer Science at the University of Iowa.</td></tr>
            <tr><th scope="row">May 2025</th><td>Graduated with Distinction from LUMS.</td></tr>
          </table>
          </div>
        </div>
      </article>'''

# ---------------- Research ----------------
pub1=card("Prompting, Oversight, and Adoption: Physicians&rsquo; Use of Large Language Models for Diagnostic Reasoning in an LMIC",
  [("coauthors","<b>Ushna Malik</b>*, Laiba Intizar Ahmad*, Amna Hassan, Izzah Shafique, Eilya Mohsin, Ayesha Ali, Muhammad Hamad Alizai, Ihsan Ayyub Qazi"),("venue","ACM CHI 2026")],
  "We studied how practicing physicians in Pakistan used ChatGPT for diagnostic reasoning by analyzing their interactions with the system and interviewing them about its use in clinical practice. We find that physicians&rsquo; prompting and oversight behaviors, as well as how these behaviors change over the course of an interaction, are more consequential for diagnostic accuracy than LLM use alone.",
  link="https://dl.acm.org/doi/10.1145/3772318.3791761", tag="Conference paper")
pub2=card("The Assistant Erased You: Measuring Loss of Authorship Signals in AI-Mediated Communication",
  [("coauthors","<b>Ushna Malik</b>, Moiz Sadiq Awan"),("venue","CSCW 2026 Workshop on the Broader Impacts of Generative AI in Communication")],
  "We study how AI-assisted rewriting affects the linguistic signals that distinguish an individual&rsquo;s writing and introduce the Idiolect Erasure Rate to quantify this loss. We find that extensive AI rewriting substantially reduces recoverable authorship signals in personal and workplace writing, even when the AI is instructed to preserve the author&rsquo;s voice.",
  link="https://broader-impacts-workshop.github.io/cscw2026-website/papers/the-assistant-erased-you-measuring-loss-of-authorship.pdf", tag="Workshop paper")
wip0=card("How does the shift from conventional web search to AI-mediated systems for information seeking affect what information people see, what they learn, and what they trust?",
  [("venue","Audit of AI-mediated search systems and systematization of evidence on their effects on users")],
  "When people turn to AI-mediated systems instead of search engines, the system chooses the information they receive, and that choice shapes their learning and their trust. This project follows that chain from end to end. We first audit what AI-mediated search systems surface, and whether they expose different groups of people to more divergent information than conventional search does. We then systematize the evidence on how the properties of these systems translate into consequences for users&rsquo; learning and trust, so that what we observe at the system level can be connected to its effects on people.",
  tag="Ongoing")
wip1=card("The persuasive power of multimodal AI: a randomized controlled trial of microtargeting effectiveness",
  [("venue","Manuscript in preparation for PNAS Nexus")],
  "We studied whether microtargeted, AI-generated political content can influence political attitudes through a randomized controlled trial in Pakistan, providing evidence from an understudied Global South context. We found substantial shifts in political attitudes without evidence of a backfire effect, demonstrating the persuasive potential of AI-generated microtargeting in this setting.",
  contrib="With my co-authors, I contributed to the study design, participant recruitment and randomization, baseline and endline survey instrument design, development of the microtargeted stimulus-generation pipeline, and statistical analysis.",
  tag="In preparation")
rx1=card("Large language model diagnostic assistance for physicians in a lower-middle-income country",
  [("venue","Nature Health, 2026")],
  "We studied whether LLMs can improve diagnostic reasoning in settings with limited access to specialist expertise through a randomized trial with AI-trained physicians in Pakistan. We found that LLM assistance substantially improved diagnostic performance, demonstrating its potential to augment clinical decision-making in resource-constrained settings.",
  contrib="I was responsible for participant recruitment and randomization, developing the clinical vignettes and answer keys with the medical team, building the experimental platform, and designing the grading rubric and blinded evaluation process.",
  link="https://doi.org/10.1038/s44360-025-00007-8", tag="Journal article")
rx2=card("Automation bias in LLM-assisted diagnostic reasoning among AI-trained physicians",
  [("venue","NEJM AI, 2026")],
  "We studied whether AI-trained physicians remain susceptible to automation bias when LLM recommendations are incorrect. In a randomized trial using error-seeded LLM suggestions, we found that incorrect recommendations reduced diagnostic accuracy, suggesting that AI-literacy training alone may not prevent over-reliance on LLM output.",
  contrib="I was responsible for designing the error-seeded LLM suggestions with the medical team, developing the clinical vignettes and answer keys, extending the experimental platform, and building the blinded grading interface.",
  link="https://ai.nejm.org/doi/abs/10.1056/AIoa2501001", tag="Journal article")

research=f'''      <header class="post-header">
        <h1 class="post-title">Research</h1>
        <p class="post-description"></p>
      </header>
      <article>
        <h2 class="section first" id="publications">Publications</h2>
{pub1}{pub2}        <p class="footnote">* Equal contribution.</p>

        <h2 class="section" id="work-in-progress">Work in Progress</h2>

        <h3 class="subsection">AI-mediated information seeking</h3>
        <p class="group-meta">PhD Research, University of Iowa &middot; SPARTA Lab &middot; Advisor: Rishab Nithyanand</p>
{wip0}
        <h3 class="subsection">AI-generated political persuasion</h3>
        <p class="group-meta">Research Assistant, LUMS &middot; Internet, Data and Society Lab &middot; Advisors: Ihsan Ayyub Qazi, Ayesha Ali, and Zafar Ayyub Qazi</p>
{wip1}
        <h2 class="section" id="research-experience">Research Experience</h2>

        <h3 class="subsection">LLM assistance in clinical decision-making</h3>
        <p class="group-meta">Research Assistant, LUMS &middot; Internet, Data and Society Lab &middot; Advisors: Ihsan Ayyub Qazi, Ayesha Ali, and Muhammad Hamad Alizai</p>
{rx1}{rx2}      </article>'''

# ---------------- Teaching & Service ----------------
teaching='''      <header class="post-header">
        <h1 class="post-title">Teaching &amp; Service</h1>
        <p class="post-description"></p>
      </header>
      <article class="teaching">
        <h2 class="section first" id="teaching">Teaching</h2>

        <div class="paper-card teach-card">
          <div class="teach-head"><span class="teach-inst">University of Iowa</span><span class="teach-role">Graduate Teaching Assistant</span></div>
          <ul class="teach-list">
            <li><span class="course">CS:1110</span> Introduction to Computer Science <span class="when">Fall 2025 &middot; Spring 2026 &middot; Fall 2026</span></li>
          </ul>
        </div>

        <div class="paper-card teach-card">
          <div class="teach-head"><span class="teach-inst">Lahore University of Management Sciences</span><span class="teach-role">Undergraduate Teaching Assistant</span></div>
          <ul class="teach-list">
            <li><span class="course">CS 334 / EE 334</span> Principles and Techniques of Data Science <span class="when">Fall 2024</span></li>
            <li><span class="course">CS 202 / EE 202</span> Data Structures <span class="when">Spring 2024</span></li>
            <li><span class="course">CS 210 / MATH 252</span> Discrete Mathematics <span class="when">Fall 2023</span></li>
          </ul>
        </div>

        <div class="paper-card teach-card">
          <div class="teach-head"><span class="teach-inst">LUMS Learning Institute and Health Services Academy</span><span class="teach-role">Teaching Assistant</span></div>
          <ul class="teach-list">
            <li><span class="course">Health Data Science</span> Quantitative Techniques, Certificate in Health Professions Education <span class="when">Aug 2024 &ndash; May 2025</span></li>
          </ul>
          <p class="teach-note">Trained practising physicians in exploratory analysis, statistical and causal inference, and predictive analytics.</p>
        </div>

        <div class="paper-card teach-card">
          <div class="teach-head"><span class="teach-inst">LUMS Summer School, FutureTech</span><span class="teach-role">Teaching Assistant</span></div>
          <ul class="teach-list">
            <li><span class="course">Data Science Module</span> FutureTech summer boot camp in computing <span class="when">Summer 2024</span></li>
          </ul>
          <p class="teach-note">Assisted hands-on sessions introducing high-school students to analysing, visualising, and interpreting data.</p>
        </div>

        <div class="paper-card teach-card">
          <div class="teach-head"><span class="teach-inst">Stanford University</span><span class="teach-role">Course Support</span></div>
          <ul class="teach-list">
            <li><span class="course">COMM 102S</span> Deception and Technology <span class="when">Summer 2023</span></li>
          </ul>
        </div>

        <h2 class="section" id="service">Service</h2>

        <div class="paper-card teach-card">
          <ul class="teach-list">
            <li><span class="course">Reviewer</span> <a href="https://bmjdigitalhealth.bmj.com/" target="_blank" rel="noopener">BMJ Digital Health &amp; AI</a> <span class="when">2026 &ndash; 2027</span></li>
            <li><span class="course">Reviewer</span> <a href="https://chi2027.acm.org/" target="_blank" rel="noopener">ACM CHI 2027</a></li>
          </ul>
        </div>
      </article>'''

open(f"{SITE}/index.html","w").write(page("Ushna Malik","About",about,"Ushna Malik, PhD student in Computer Science at the University of Iowa.",brand=False))
open(f"{SITE}/research.html","w").write(page("Research | Ushna Malik","Research",research,"Publications, work in progress, and research experience."))
open(f"{SITE}/teaching.html","w").write(page("Teaching & Service | Ushna Malik","Teaching & Service",teaching,"Teaching and service."))

# ---------------- CSS additions (replace previous site block) ----------------
p=f"{SITE}/assets/css/main.css"; css=open(p).read()
css=css.split("/* --- site additions --- */")[0]
css+="""/* --- site additions --- */
.news h2{margin-top:2.5rem}
.news table{width:100%;border-collapse:collapse}
.news th{font-weight:600;white-space:nowrap;width:7.5rem;vertical-align:top;padding:.45rem 1rem .45rem 0;border-top:1px solid var(--global-divider-color)}
.news td{padding:.45rem 0;border-top:1px solid var(--global-divider-color);vertical-align:top}
.news tr:first-child th,.news tr:first-child td{border-top:none}
.news-scroll{max-height:13.5rem;overflow-y:auto;padding-right:.75rem;scrollbar-width:thin;scrollbar-color:var(--global-divider-color) transparent}
.news-scroll::-webkit-scrollbar{width:6px;background:transparent}
.news-scroll::-webkit-scrollbar-track{background:transparent}
.news-scroll::-webkit-scrollbar-thumb{background:var(--global-divider-color);border-radius:3px}

/* cross-browser text: no automatic hyphenation, left-aligned prose */
.post p,.post li,.post td,.paper-card .abstract-body{text-align:left !important;-webkit-hyphens:manual !important;hyphens:manual !important}

/* section dividers */
h2.section{margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--global-divider-color);margin-bottom:1.1rem}
h2.section.first{margin-top:1rem;padding-top:0;border-top:none}
h3.subsection{font-size:1.15rem;margin-top:1.5rem;margin-bottom:.15rem}
.group-meta{color:var(--global-text-color-light);font-size:.9rem;margin:0 0 .9rem}

/* cards (Connie's paper-card, with a Summary toggle) */
details.paper-card{padding:0}
.paper-card summary{padding:1.1rem 1.4rem}
.paper-card .coauthors{font-style:normal;font-size:.95rem;color:var(--global-text-color)}
.paper-card .coauthors b{font-weight:700}
.paper-card .ptitle{font-size:1.02rem}
.paper-card .kicker{display:inline-block;font-size:.72rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--global-theme-color);margin-bottom:.35rem}
.paper-card .card-foot{display:flex;align-items:center;gap:1.5rem;margin-top:.8rem}
html details.paper-card .paper-btn{display:inline-block;margin-left:1.4rem;padding:.2rem .7rem;border:1px solid var(--global-theme-color);border-radius:5px;color:var(--global-theme-color);font-size:.8rem;font-weight:500;text-decoration:none}
.paper-card .paper-btn:hover{background:var(--global-theme-color);color:#fff;text-decoration:none}
.clearfix strong{font-weight:600}
.footnote{font-size:.85rem;color:var(--global-text-color-light);margin:-.5rem 0 0 .25rem}
.paper-card .venue{color:var(--global-text-color-light);font-size:.9rem}
html details.paper-card .abs-hint::after{content:"Summary ▾" !important;color:var(--global-theme-color)}
html details.paper-card[open] .abs-hint::after{content:"Summary ▴" !important}
.paper-card .card-foot a{color:var(--global-theme-color)}
.paper-card .abstract-body{padding:1rem 1.4rem 1.1rem;border-top:1px solid var(--global-divider-color);text-align:justify}
.paper-card .abstract-body p{margin:0 0 .5rem}
.paper-card .contrib{font-size:.93rem;margin-top:.6rem !important}
.paper-card .contrib-label{color:var(--global-theme-color);font-weight:600}

/* teaching & service */
.teach-card{padding:1rem 1.4rem}
.teach-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.25rem .75rem;margin-bottom:.5rem}
.teach-inst{font-weight:700}
.teach-role{color:var(--global-theme-color);font-size:.9rem;font-weight:500}
.teach-list{list-style:none;margin:0;padding:0}
.teach-list li{display:flex;flex-wrap:wrap;align-items:baseline;gap:.35rem .5rem;padding:.35rem 0;border-top:1px solid var(--global-divider-color)}
.teach-list li:first-child{border-top:none}
.teach-list .course{color:var(--global-theme-color);font-weight:600;white-space:nowrap}
.teach-list .when{margin-left:auto;color:var(--global-text-color-light);font-size:.88rem;white-space:nowrap}
.teach-note{margin:.6rem 0 0;font-size:.93rem;color:var(--global-text-color)}
.teach-list a{color:inherit;text-decoration:none;border-bottom:1px solid var(--global-divider-color)}
.teach-list a:hover{color:var(--global-theme-color);border-bottom-color:var(--global-theme-color);text-decoration:none}
@media (max-width:575px){.teach-list .when{margin-left:0;flex-basis:100%}}
"""
open(p,"w").write(css)
print("built")
