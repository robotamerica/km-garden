import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const SRC = './notes-src';
const OUT = './rhizome';
const TAGS_OUT = './rhizome/tags';

mkdirSync(OUT, { recursive: true });
mkdirSync(TAGS_OUT, { recursive: true });

function slug(str){ return str.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,''); }

function nav(current){
  const pages = [
    ['../index.html','welcome'],
    ['../weblog.html','weblog'],
    ['../projects.html','projects'],
    ['index.html','rhizome'],
    ['../clutter.html','clutter'],
    ['../webroll.html','webroll'],
  ];
  return `<ul class="nav-links">
    ${pages.map(([href,label])=>`<li><a ${label===current?'class="is-current" ':''} href="${href}">${label}</a></li>`).join('\n    ')}
  </ul>`;
}

function tagNav(current){
  const pages = [
    ['../../index.html','welcome'],
    ['../../weblog.html','weblog'],
    ['../../projects.html','projects'],
    ['index.html','rhizome'],
    ['../../clutter.html','clutter'],
    ['../../webroll.html','webroll'],
  ];
  return `<ul class="nav-links">
    ${pages.map(([href,label])=>`<li><a ${label===current?'class="is-current" ':''} href="${href}">${label}</a></li>`).join('\n    ')}
  </ul>`;
}

function head(title, depth=''){
  return `<!doctype html>
<html lang="en" data-mode="paper">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${title} — km.garden</title>
  <link rel="icon" href="${depth}../assets/img/potato-sprout.png" type="image/png" />
  <link rel="stylesheet" href="${depth}../styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Bytesized&display=swap" rel="stylesheet">
  </head>`;
}

function brandNav(navHtml, depth='../'){
  return `<aside class="pane nav" aria-label="site menu">
  <header class="brand">
    <div class="brand-mark" aria-hidden="true"></div>
    <div class="brand-text">
      <h1 class="brand-title">km.garden <img class="title-icon" src="${depth}assets/img/potato-sprout.png" alt="" aria-hidden="true"></h1>
      <p class="brand-sub">notes • index • calm web</p>
    </div>
  </header>
  <nav aria-label="sections">
    ${navHtml}
  </nav>
  <section class="nav-block" aria-label="status">
    <p class="nav-meta">welcome to my digital garden <span class="emoji-vis">🧑🏽‍🌾</span>, please take a look around.</p>
  </section>
  <footer class="nav-footer">
    <p class="nav-meta"><span class="emoji-vis">🍄‍🟫 </span>km. | html + css only<span class="emoji-vis">🛠️</span></p>
  </footer>
</aside>`;
}

const files = readdirSync(SRC).filter(f => f.endsWith('.md'));

const notes = files.map(f => {
  const raw = readFileSync(join(SRC, f), 'utf8');
  const { data, content } = matter(raw);
  return {
    id: data.id || slug(basename(f, '.md')),
    title: data.title || basename(f, '.md'),
    tags: data.tags || [],
    links: data.links || [],
    body: content,
  };
});

// build backlink map
const backlinks = {};
notes.forEach(n => {
  n.links.forEach(target => {
    if(!backlinks[target]) backlinks[target] = [];
    backlinks[target].push(n);
  });
});

// build tag map
const tagMap = {};
notes.forEach(n => {
  n.tags.forEach(t => {
    if(!tagMap[t]) tagMap[t] = [];
    tagMap[t].push(n);
  });
});

const allTags = Object.keys(tagMap).sort();

function tagCloud(depth=''){
  return `<div class="tag-cloud">
    ${allTags.map(t =>
      `<a class="tag-chip" href="${depth}tags/${t}.html">${t} <span class="tag-count">${tagMap[t].length}</span></a>`
    ).join('\n    ')}
  </div>`;
}

function rightPane(depth=''){
  return `<aside class="pane panel secondary" aria-label="right content">
  <header class="pane-head">
    <h2 class="pane-title">rhizome</h2>
    <p class="pane-sub">tags • connections</p>
  </header>
  <div class="prose">
    <details open>
      <summary>tags</summary>
      ${tagCloud(depth)}
    </details>
    <details>
      <summary>about rhizome</summary>
      <p class="small">a zettelkasten: small, atomic notes linked by concept not chronology tending to spread adventitiously and every-which-way.</p>
    </details>
  </div>
</aside>`;
}

// generate each note page
notes.forEach(n => {
  const bl = backlinks[n.id] || [];

  const linkedBody = n.body.replace(/\[\[([^\]]+)\]\]/g, (_, id) => {
    const target = notes.find(x => x.id === id);
    if(target) return `<a href="${target.id}.html">${target.title}</a>`;
    return `<span class="broken-link">[[${id}]]</span>`;
  });

  const html = `${head(n.title)}
<body>
  <a class="skip-link" href="#pane-a">skip to content</a>
  <div class="site">
    ${brandNav(nav('rhizome'))}
    <main id="pane-a" class="pane panel" aria-label="center content">
      <header class="pane-head">
        <h2 class="pane-title">${n.title}</h2>
        <p class="pane-sub">${n.tags.map(t=>`<a href="tags/${t}.html">${t}</a>`).join(' · ')}</p>
      </header>
      <div class="prose">
        ${marked(linkedBody)}
      </div>
      ${bl.length ? `<div class="backlinks">
        <h3 class="backlinks-title">linked from</h3>
        <ul>
          ${bl.map(b=>`<li><a href="${b.id}.html">${b.title}</a></li>`).join('\n          ')}
        </ul>
      </div>` : ''}
    </main>
    ${rightPane()}
  </div>
</body>
</html>`;

  writeFileSync(join(OUT, `${n.id}.html`), html);
  console.log(`✓ ${n.id}.html`);
});

// generate tag pages
allTags.forEach(t => {
  const tagged = tagMap[t];
  const html = `${head(t, '../')}
<body>
  <a class="skip-link" href="#pane-a">skip to content</a>
  <div class="site">
    ${brandNav(tagNav('rhizome'), '../../')}
    <main id="pane-a" class="pane panel" aria-label="center content">
      <header class="pane-head">
        <h2 class="pane-title">${t}</h2>
        <p class="pane-sub">${tagged.length} note${tagged.length>1?'s':''}</p>
      </header>
      <div class="prose">
        <ul>
          ${tagged.map(n=>`<li><a href="../${n.id}.html">${n.title}</a></li>`).join('\n          ')}
        </ul>
      </div>
    </main>
    ${rightPane('../')}
  </div>
</body>
</html>`;

  writeFileSync(join(TAGS_OUT, `${t}.html`), html);
  console.log(`✓ tags/${t}.html`);
});

// generate tags index
const tagsIndex = `${head('tags', '../')}
<body>
  <a class="skip-link" href="#pane-a">skip to content</a>
  <div class="site">
    ${brandNav(tagNav('rhizome'), '../../')}
    <main id="pane-a" class="pane panel" aria-label="center content">
      <header class="pane-head">
        <h2 class="pane-title">tags</h2>
        <p class="pane-sub">${allTags.length} tags</p>
      </header>
      <div class="prose">
        ${tagCloud('../')}
      </div>
    </main>
    ${rightPane('../')}
  </div>
</body>
</html>`;

writeFileSync(join(TAGS_OUT, 'index.html'), tagsIndex);
console.log('✓ tags/index.html');

// generate index — organised by tag cluster
const html = `${head('rhizome')}
<body>
  <a class="skip-link" href="#pane-a">skip to content</a>
  <div class="site">
    ${brandNav(nav('rhizome'))}
    <main id="pane-a" class="pane panel" aria-label="center content">
      <header class="pane-head">
        <h2 class="pane-title">rhizome</h2>
        <p class="pane-sub">${notes.length} note${notes.length!==1?'s':''} · ${allTags.length} tags</p>
      </header>
      <div class="prose">
        ${allTags.map(t => `
        <details class="folder">
          <summary>${t} <span class="tag-count">${tagMap[t].length}</span></summary>
          <div class="file-list">
            ${tagMap[t].map(n=>`
            <a class="file-item" href="${n.id}.html">
              <span class="file-icon">⟐</span>
              <span class="file-name">${n.title}</span>
            </a>`).join('')}
          </div>
        </details>`).join('\n        ')}
      </div>
    </main>
    ${rightPane()}
  </div>
</body>
</html>`;

writeFileSync(join(OUT, 'index.html'), html);
console.log('✓ rhizome/index.html');
console.log(`\n🌱 built ${notes.length} notes · ${allTags.length} tags`);
