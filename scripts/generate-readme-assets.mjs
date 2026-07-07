#!/usr/bin/env node
// Regenerates the data-driven README SVGs under docs/assets/readme/ from the
// GitHub REST/GraphQL APIs. Uses only public data reachable with the default
// GITHUB_TOKEN — no PAT, no private-org access. Safe to run on a daily schedule.
//
// Usage: GITHUB_TOKEN=... node scripts/generate-readme-assets.mjs

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const USERNAME = 'ultimania';
const OSS_REPO = 'redmine_budget';
const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error('GITHUB_TOKEN is required');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'docs', 'assets', 'readme');

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

async function ghPaginated(path) {
  let out = [];
  let page = 1;
  for (;;) {
    const sep = path.includes('?') ? '&' : '?';
    const batch = await gh(`${path}${sep}per_page=100&page=${page}`);
    out = out.concat(batch);
    if (batch.length < 100) break;
    page++;
  }
  return out;
}

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchContributionStats() {
  const data = await graphql(
    `query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }`,
    { login: USERNAME }
  );
  const cal = data.user.contributionsCollection.contributionCalendar;
  const days = cal.weeks.flatMap((w) => w.contributionDays);
  let best = 0;
  let cur = 0;
  let activeDays = 0;
  for (const d of days) {
    if (d.contributionCount > 0) {
      cur++;
      activeDays++;
      best = Math.max(best, cur);
    } else {
      cur = 0;
    }
  }
  return {
    total: cal.totalContributions,
    longestStreak: best,
    activeDays,
    totalDays: days.length,
  };
}

async function fetchPublicRepos() {
  const repos = await ghPaginated(`/users/${USERNAME}/repos?type=owner`);
  return repos.filter((r) => !r.fork);
}

async function fetchProfile() {
  return gh(`/users/${USERNAME}`);
}

async function fetchOssImpact() {
  const [repo, openIssues, closedIssues] = await Promise.all([
    gh(`/repos/${USERNAME}/${OSS_REPO}`),
    ghPaginated(`/repos/${USERNAME}/${OSS_REPO}/issues?state=open`),
    ghPaginated(`/repos/${USERNAME}/${OSS_REPO}/issues?state=closed`),
  ]);
  return {
    stars: repo.stargazers_count,
    createdAt: repo.created_at,
    openIssues: openIssues.filter((i) => !i.pull_request).length,
    closedIssues: closedIssues.filter((i) => !i.pull_request).length,
  };
}

function svgShell(width, height, ariaLabel, body, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" font-family="'SF Mono','Cascadia Code','JetBrains Mono',Menlo,Consolas,monospace" role="img" aria-label="${ariaLabel}">
  <defs>
    <style>
      .pulse{animation:blink 2.6s ease-in-out infinite;}
      @keyframes blink{0%,100%{opacity:.5;}50%{opacity:1;}}
      .stat{opacity:0;animation:rise .6s cubic-bezier(.16,1,.3,1) forwards;}
      @keyframes rise{from{opacity:0;}to{opacity:1;}}
      @media (prefers-reduced-motion: reduce){.pulse,.stat{animation:none;opacity:1;}}
    </style>
    ${extraDefs}
  </defs>
  <rect width="${width}" height="${height}" rx="14" fill="#04050a"/>
  <rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="14" fill="none" stroke="#ffffff" stroke-opacity=".08"/>
  <circle class="pulse" cx="${width - 56}" cy="20" r="4" fill="#22d3ee"/>
  <text x="${width - 74}" y="25" text-anchor="end" font-size="10.5" letter-spacing="1.2" fill="#8e99ad">GITHUB API</text>
${body}
</svg>
`;
}

function buildActivitySvg({ total, longestStreak, activeDays, totalDays }, repoCount, accountAge) {
  const pct = activeDays / totalDays;
  const r = 92;
  const circumference = 2 * Math.PI * r;
  const restOffset = (circumference * (1 - pct)).toFixed(2);
  const pctLabel = Math.round(pct * 100);
  const extraDefs = `<linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient>
    <style>
      .ring{stroke-dasharray:${circumference.toFixed(2)};stroke-dashoffset:${circumference.toFixed(2)};animation:draw 1.4s cubic-bezier(.16,1,.3,1) .2s forwards;}
      @keyframes draw{to{stroke-dashoffset:${restOffset};}}
      @media (prefers-reduced-motion: reduce){.ring{animation:none;stroke-dashoffset:${restOffset};}}
    </style>`;
  const body = `
  <text x="30" y="42" font-size="19" font-weight="800" fill="#eef2f8">Not a calendar grid — the numbers behind it</text>
  <text x="30" y="64" font-size="13" fill="#8e99ad">GitHub already shows you the green squares. Here's what they add up to.</text>

  <g transform="translate(150 195)">
    <circle r="${r}" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="14"/>
    <circle class="ring" r="${r}" fill="none" stroke="url(#ringGrad)" stroke-width="14" stroke-linecap="round" transform="rotate(-90)"/>
    <text text-anchor="middle" y="-4" font-size="34" font-weight="800" fill="#eef2f8">${pctLabel}%</text>
    <text text-anchor="middle" y="20" font-size="12" fill="#8e99ad">of days shipped</text>
    <text text-anchor="middle" y="38" font-size="11" fill="#5b6577">${activeDays} / ${totalDays} days</text>
  </g>

  <g transform="translate(400 130)"><g class="stat" style="animation-delay:.1s">
    <text font-size="34" font-weight="800" fill="#22d3ee">${total.toLocaleString()}</text>
    <text y="24" font-size="12.5" fill="#8e99ad">contributions, past 12 months</text>
  </g></g>

  <g transform="translate(400 200)"><g class="stat" style="animation-delay:.22s">
    <text font-size="34" font-weight="800" fill="#a78bfa">${longestStreak}</text>
    <text y="24" font-size="12.5" fill="#8e99ad">longest streak, in days</text>
  </g></g>

  <g transform="translate(650 130)"><g class="stat" style="animation-delay:.34s">
    <text font-size="34" font-weight="800" fill="#f472b6">${repoCount}</text>
    <text y="24" font-size="12.5" fill="#8e99ad">public repositories</text>
  </g></g>

  <g transform="translate(650 200)"><g class="stat" style="animation-delay:.46s">
    <text font-size="34" font-weight="800" fill="#eef2f8">${accountAge} yrs</text>
    <text y="24" font-size="12.5" fill="#8e99ad">on GitHub</text>
  </g></g>

  <text x="30" y="300" font-size="11.5" fill="#5b6577">github.com/${USERNAME} · contributionsCollection via GitHub GraphQL API · refreshed daily</text>`;
  return svgShell(940, 320, 'One year of GitHub activity, distilled — not a calendar grid', body, extraDefs);
}

function buildLangsSvg(repos) {
  const counts = {};
  let detected = 0;
  for (const r of repos) {
    if (!r.language) continue;
    detected++;
    counts[r.language] = (counts[r.language] || 0) + 1;
  }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = ranked.length ? ranked[0][1] : 1;
  const colors = ['#22d3ee', '#a78bfa', '#f472b6'];
  const chartLeft = 200;
  const chartRight = 860;
  const rowH = 46;
  const top = 96;
  const maxBarW = chartRight - chartLeft;
  const rows = ranked
    .map(([label, count], i) => {
      const y = top + i * rowH;
      const w = (count / max) * maxBarW;
      const delay = (i * 0.12).toFixed(2);
      return `
    <text x="${chartLeft - 20}" y="${y + 21}" text-anchor="end" font-size="16" font-weight="600" fill="#eef2f8">${label}</text>
    <rect x="${chartLeft}" y="${y}" width="${maxBarW}" height="28" rx="6" fill="#ffffff" opacity="0.04"/>
    <rect class="bar" style="animation-delay:${delay}s" x="${chartLeft}" y="${y}" width="${w.toFixed(1)}" height="28" rx="6" fill="${colors[i % colors.length]}" opacity="0.85"/>
    <text x="${chartLeft + w + 14}" y="${y + 21}" font-size="14" font-family="monospace" fill="#8e99ad">${count} repo${count > 1 ? 's' : ''}</text>`;
    })
    .join('\n');
  const height = top + ranked.length * rowH + 40;
  const extraDefs = `<style>
      .bar{transform-box:fill-box;transform-origin:left center;animation:grow 1.1s cubic-bezier(.16,1,.3,1) both;}
      @keyframes grow{from{transform:scaleX(0);opacity:0;}to{transform:scaleX(1);opacity:.85;}}
      @media (prefers-reduced-motion: reduce){.bar{animation:none;transform:scaleX(1);opacity:.85;}}
    </style>`;
  const body = `
  <text x="30" y="46" font-size="21" font-weight="800" fill="#eef2f8">Public repos, by primary language</text>
  <text x="30" y="70" font-size="13" fill="#8e99ad">${detected} language-detected repos of ${repos.length} public · counted by GitHub's own per-repo "primary language" field</text>
${rows}
  <text x="30" y="${height - 30}" font-size="12" fill="#5b6577">github.com/${USERNAME} · fetched via GitHub REST API · refreshed daily</text>`;
  return svgShell(940, height, 'Public repositories by primary language, computed live from the GitHub API', body, extraDefs);
}

function buildTimelineSvg(repos) {
  const firstYear = {};
  for (const r of repos) {
    if (!r.language) continue;
    const yr = new Date(r.created_at).getUTCFullYear();
    if (!(r.language in firstYear) || yr < firstYear[r.language]) firstYear[r.language] = yr;
  }
  const byYear = {};
  for (const [lang, yr] of Object.entries(firstYear)) {
    (byYear[yr] ||= []).push(lang);
  }
  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b);
  const langCount = Object.keys(firstYear).length;
  const spanYears = years.length ? years[years.length - 1] - years[0] : 0;
  const left = 90;
  const right = 850;
  const step = years.length > 1 ? (right - left) / (years.length - 1) : 0;
  const colors = ['#22d3ee', '#a78bfa', '#f472b6'];
  const nodes = years
    .map((yr, i) => {
      const x = left + i * step;
      const langs = byYear[yr];
      const startY = -16 - (langs.length - 1) * 18;
      const labels = langs
        .map((l, j) => `<text y="${startY + j * 18}" text-anchor="middle" font-size="13" font-weight="700" fill="#eef2f8">${l}</text>`)
        .join('');
      return `
  <g transform="translate(${x.toFixed(1)} 150)">
    <g class="stat" style="animation-delay:${(i * 0.15).toFixed(2)}s">
      ${labels}
      <circle r="6" fill="${colors[i % colors.length]}"/>
      <text y="28" text-anchor="middle" font-size="12" fill="#8e99ad">${yr}</text>
    </g>
  </g>`;
    })
    .join('\n');
  const body = `
  <text x="30" y="42" font-size="19" font-weight="800" fill="#eef2f8">${langCount} languages. Each one, a dated first commit.</text>
  <text x="30" y="64" font-size="13" fill="#8e99ad">Not a claim on a resume — the creation date of my first public repo in that language.</text>
  <line x1="70" y1="150" x2="870" y2="150" stroke="url(#tlLine)" stroke-width="2" opacity=".55"/>
${nodes}
  <text x="30" y="222" font-size="12.5" fill="#8e99ad">${spanYears} years, ${langCount} languages — new stack, new repo, every time the work called for it.</text>
  <text x="30" y="242" font-size="11.5" fill="#5b6577">github.com/${USERNAME} · public repos, earliest creation date per language · refreshed daily</text>`;
  const extraDefs = `<linearGradient id="tlLine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#22d3ee"/><stop offset="55%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#f472b6"/></linearGradient>`;
  return svgShell(940, 260, 'Timeline of first public repository per language', body, extraDefs);
}

function buildOssImpactSvg(oss) {
  const totalIssues = oss.openIssues + oss.closedIssues;
  const years = ((Date.now() - new Date(oss.createdAt).getTime()) / (365.25 * 24 * 3600 * 1000)).toFixed(1);
  const body = `
  <text x="30" y="42" font-size="19" font-weight="800" fill="#eef2f8">${OSS_REPO} — shipped, and other people use it</text>
  <text x="30" y="64" font-size="13" fill="#8e99ad">A public Redmine plugin, live since ${new Date(oss.createdAt).toISOString().slice(0, 7)}. No marketing budget, no team — just usage.</text>

  <g transform="translate(30 100)"><g class="stat" style="animation-delay:.05s">
    <text font-size="34" font-weight="800" fill="#22d3ee">${totalIssues}</text>
    <text y="24" font-size="12.5" fill="#8e99ad">issues filed by users</text>
  </g></g>

  <g transform="translate(260 100)"><g class="stat" style="animation-delay:.18s">
    <text font-size="34" font-weight="800" fill="#a78bfa">${oss.closedIssues}</text>
    <text y="24" font-size="12.5" fill="#8e99ad">resolved and closed</text>
  </g></g>

  <g transform="translate(480 100)"><g class="stat" style="animation-delay:.31s">
    <text font-size="34" font-weight="800" fill="#f472b6">${oss.stars}★</text>
    <text y="24" font-size="12.5" fill="#8e99ad">stargazer${oss.stars === 1 ? '' : 's'}, zero outreach</text>
  </g></g>

  <g transform="translate(710 100)"><g class="stat" style="animation-delay:.44s">
    <text font-size="34" font-weight="800" fill="#eef2f8">${years}+ yrs</text>
    <text y="24" font-size="12.5" fill="#8e99ad">Redmine 5.1.1+</text>
  </g></g>

  <text x="30" y="182" font-size="12.5" fill="#8e99ad">Stars are vanity. Strangers filing ${totalIssues} issues against your code — and ${oss.closedIssues} getting fixed — is not.</text>
  <text x="30" y="202" font-size="11.5" fill="#5b6577">github.com/${USERNAME}/${OSS_REPO} · issues API, all-time · refreshed daily</text>`;
  return svgShell(940, 220, `${OSS_REPO} OSS plugin real-world impact statistics`, body);
}

async function main() {
  const [contrib, repos, profile, oss] = await Promise.all([
    fetchContributionStats(),
    fetchPublicRepos(),
    fetchProfile(),
    fetchOssImpact(),
  ]);
  const accountAge = Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (365.25 * 24 * 3600 * 1000));

  await writeFile(join(OUT_DIR, 'activity.svg'), buildActivitySvg(contrib, repos.length, accountAge));
  await writeFile(join(OUT_DIR, 'langs.svg'), buildLangsSvg(repos));
  await writeFile(join(OUT_DIR, 'timeline.svg'), buildTimelineSvg(repos));
  await writeFile(join(OUT_DIR, 'oss-impact.svg'), buildOssImpactSvg(oss));

  console.log('Regenerated activity.svg, langs.svg, timeline.svg, oss-impact.svg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
