<?php
$funcId = $_GET['share'] ?? $_GET['f'] ?? '';
$funcId = preg_replace('/\?.*$/', '', $funcId);
$ogTitle = 'GScript API Documentation';
$ogDesc = 'Complete API documentation for GScript';
$ogUrl = 'https://docs.gscript.dev';
$pageTitle = 'GScript API Documentation';
$cacheFile = __DIR__ . '/api_cache.json';
$cacheTime = 300;
$apiData = null;
$shouldFetch = !file_exists($cacheFile) || (time() - filemtime($cacheFile)) >= $cacheTime;
if ($shouldFetch) {
  $fetchedData = @json_decode(@file_get_contents('https://api.moreno.land/api/gscript'), true);
  if ($fetchedData) {
    if (file_exists($cacheFile)) {
      $cachedData = json_decode(file_get_contents($cacheFile), true);
      if (json_encode($cachedData) !== json_encode($fetchedData)) {
        file_put_contents($cacheFile, json_encode($fetchedData));
      } else {
        touch($cacheFile);
      }
    } else {
      file_put_contents($cacheFile, json_encode($fetchedData));
    }
    $apiData = $fetchedData;
  } elseif (file_exists($cacheFile)) {
    $apiData = json_decode(file_get_contents($cacheFile), true);
  }
} else {
  $apiData = json_decode(file_get_contents($cacheFile), true);
}
if ($funcId && $apiData) {
  if ($apiData) {
    $matchKey = null;
    foreach (array_keys($apiData) as $key) {
      if (strcasecmp($key, $funcId) === 0) {
        $matchKey = $key;
        break;
      }
    }
    if ($matchKey && isset($apiData[$matchKey])) {
      $item = $apiData[$matchKey];
      $name = $item['name'] ?? $matchKey;
      $desc = $item['description'] ?? 'GScript API function';
      $desc = str_replace('`', '', $desc);
      $parts = [];
      $parts[] = $desc;
      $type = isset($item['type']) ? ucfirst($item['type']) : 'none';
      $parts[] = "\nType: " . $type;
      if (isset($item['params']) && is_array($item['params']) && count($item['params']) > 0) {
        $parts[] = "Parameters: " . implode(', ', $item['params']);
      }
      if (isset($item['returns'])) {
        $parts[] = "Returns: " . $item['returns'];
      }
      if (isset($item['scope'])) {
        $parts[] = "Scope: " . ucfirst($item['scope']);
      }
      if (isset($item['example']) && !empty($item['example'])) {
        $exampleLines = explode("\n", $item['example']);
        $snippet = implode("\n", array_slice($exampleLines, 0, 3));
        if (count($exampleLines) > 3) $snippet .= '...';
        $parts[] = "\nExample:\n" . $snippet;
      }
      $fullDesc = implode("\n", $parts);
      $ogTitle = $name;
      $ogDesc = $fullDesc;
      $ogUrl = "https://docs.gscript.dev/?share=$matchKey";
      $pageTitle = "$name - GScript API Documentation";
      $funcId = $matchKey;
    }
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?php echo htmlspecialchars($pageTitle); ?></title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
  <meta name="theme-color" content="#4a9eff">
  <meta property="og:title" content="<?php echo htmlspecialchars($ogTitle); ?>" id="og-title">
  <meta property="og:description" content="<?php echo htmlspecialchars($ogDesc); ?>" id="og-description">
  <meta property="og:type" content="website">
  <meta property="og:url" content="<?php echo htmlspecialchars($ogUrl); ?>" id="og-url">
  <meta property="og:site_name" content="GScript Docs">
  <meta property="og:image" content="https://docs.gscript.dev/graal_icon.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?php echo htmlspecialchars($ogTitle); ?>" id="twitter-title">
  <meta name="twitter:description" content="<?php echo htmlspecialchars($ogDesc); ?>" id="twitter-description">
  <meta name="twitter:image" content="https://docs.gscript.dev/graal_icon.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
  <link rel="stylesheet" href="css/shared.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <style>
    :root { --theme-color: #4a9eff; --sidebar-width: 300px; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { overflow-x: hidden; }
    body { background: transparent; color: #fff; font-size: 16px; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #sidebar { position: fixed; left: 0; top: 0; width: var(--sidebar-width); height: 100vh; background: #252525; overflow-y: auto; overflow-x: hidden; border-right: 1px solid #3a3a3a; display: flex; flex-direction: column; transition: transform 0.3s ease; z-index: 100; will-change: transform; -webkit-overflow-scrolling: touch; }
    #sidebar.hidden { transform: translateX(-100%); }
    #sidebar .search-wrapper { position: sticky; top: 0; background: #252525; padding: 20px 60px 10px 20px; z-index: 10; }
    #sidebar input { width: 100%; padding: 10px; background: #2a2a2a; border: 1px solid rgba(74, 158, 255, 0.3); border-radius: 6px; color: #e0e0e0; font-size: 16px; }
    #sidebar input:focus { outline: none; border-color: #5ba5ff; box-shadow: 0 0 0 3px rgba(91, 165, 255, 0.1); }
    #sidebar-links { padding: 10px 20px 20px 20px; overflow-y: auto; flex: 1; -webkit-overflow-scrolling: touch; }
    #sidebar a { display: block; color: #fff; text-decoration: none; padding: 12px 12px; margin: 2px 0; border-radius: 4px; transition: all 0.2s; min-height: 44px; display: flex; align-items: center; }
    #sidebar a:hover { background: rgba(74, 158, 255, 0.1); color: #5ba5ff; }
    #sidebar a.active { background: rgba(74, 158, 255, 0.2); color: #5ba5ff; font-weight: 500; }
    #sidebar a.child { padding-left: 32px; font-size: 14px; min-height: 40px; }
    #sidebar .tree-parent { display: flex; align-items: center; color: #fff; padding: 12px 12px; margin: 2px 0; border-radius: 4px; cursor: pointer; transition: all 0.2s; min-height: 44px; user-select: none; }
    #sidebar .tree-parent:hover { background: rgba(74, 158, 255, 0.1); color: #5ba5ff; }
    #sidebar .tree-parent .arrow { margin-right: 8px; transition: transform 0.2s; font-size: 12px; color: #5ba5ff; }
    #sidebar .tree-parent.expanded .arrow { transform: rotate(90deg); }
    #sidebar .tree-children { display: none; }
    #sidebar .tree-children.show { display: block; }
    #menu-toggle { position: fixed; top: 20px; left: 240px; width: 44px; height: 44px; background: rgba(37, 37, 37, 0.7); border: 1px solid rgba(74, 158, 255, 0.3); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; transition: all 0.3s ease; flex-shrink: 0; z-index: 102; border-radius: 6px; backdrop-filter: blur(10px); }
    #menu-toggle.active { left: 20px; }
    #menu-toggle:hover { background: rgba(74, 158, 255, 0.2); border-color: rgba(74, 158, 255, 0.5); }
    #menu-toggle span { width: 24px; height: 2px; background: #5ba5ff; border-radius: 2px; transition: all 0.3s ease; }
    #menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    #menu-toggle.active span:nth-child(2) { opacity: 0; }
    #menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(6px, -6px); }
    #content { margin-left: var(--sidebar-width); padding: 40px 60px; max-width: 1200px; transition: margin-left 0.3s ease; }
    #content.expanded { margin-left: 0; max-width: 1600px; }
    #sidebar-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 99; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
    #sidebar-overlay.show { opacity: 1; pointer-events: auto; }
    @media (max-width: 768px) {
      :root { --sidebar-width: 280px; }
      #sidebar { transform: translateX(-100%); }
      #sidebar.show { transform: translateX(0); }
      #menu-toggle { left: auto; right: 20px; bottom: 20px; top: auto; }
      #menu-toggle.active { left: 220px; right: auto; top: 20px; bottom: auto; }
      #content { margin-left: 0; padding: 20px; }
      #content h2 { font-size: 1.1em; word-break: break-word; flex-wrap: wrap; }
      #content pre { overflow-x: hidden; font-size: 12px; }
      #content pre code { white-space: pre-wrap; word-wrap: break-word; word-break: break-word; font-size: 12px; }
    }
    #content h1 { color: #5ba5ff; border-bottom: 2px solid rgba(91, 165, 255, 0.3); padding-bottom: 0.75rem; margin: 1.5rem 0 1.75rem 0; font-weight: 600; }
    #content h2 { color: #fff; border-bottom: 1px solid rgba(122, 181, 255, 0.2); padding-bottom: 0.5rem; margin: 3rem 0 1.5rem 0; font-weight: 500; scroll-margin-top: 20px; display: flex; align-items: center; gap: 10px; }
    #content h2 .share-btn { background: rgba(74, 158, 255, 0.15); border: 1px solid rgba(74, 158, 255, 0.3); color: #5ba5ff; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 400; transition: all 0.2s; order: -1; flex-shrink: 0; }
    #content h2 .share-btn:hover { background: rgba(74, 158, 255, 0.25); }
    #content h2 .share-btn.copied { background: rgba(76, 175, 80, 0.3); color: #4caf50; border-color: rgba(76, 175, 80, 0.5); }
    #content h3 { color: #9bc5ff; border-bottom: 1px solid rgba(155, 197, 255, 0.15); padding-bottom: 0.4rem; margin: 2.5rem 0 1.25rem 0; font-weight: 500; }
    #content h4 { color: #a0c8ff; margin: 2rem 0 0.75rem 0; }
    #content p { margin-bottom: 1.75rem; line-height: 1.75; white-space: pre-line; }
    #content ul, #content ol { margin-bottom: 2rem; line-height: 1.8; padding-left: 30px; }
    #content li { margin-bottom: 0.5rem; }
    #content code { background: #2a2a3a; color: #ff6b9d; border: 1px solid #4a4a6a; padding: 0.2em 0.4em; border-radius: 3px; }
    .code-wrapper { position: relative; margin-bottom: 2rem; text-align: right; }
    .code-wrapper .copy-btn { background: rgba(74, 158, 255, 0.2); border: 1px solid rgba(74, 158, 255, 0.3); color: #5ba5ff; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s; margin-bottom: 8px; display: inline-block; }
    .code-wrapper pre { text-align: left; }
    .code-wrapper .copy-btn:hover { background: rgba(74, 158, 255, 0.3); }
    .code-wrapper .copy-btn.copied { background: rgba(76, 175, 80, 0.3); color: #4caf50; border-color: rgba(76, 175, 80, 0.5); }
    #content pre { background: rgba(42, 42, 58, 0.85); border: 1px solid rgba(74, 158, 255, 0.2); border-left: 4px solid rgba(91, 165, 255, 0.6); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5); border-radius: 6px; padding: 1.25rem; overflow-x: auto; margin: 0; }
    #content pre code { background: transparent; color: #e0e0e0; border: none; padding: 0; white-space: pre; display: block; }
    #content hr { border: none; height: 1px; margin: 3.5rem 0; background: linear-gradient(to right, transparent 0%, rgba(58, 58, 58, 0.5) 20%, rgba(91, 165, 255, 0.4) 50%, rgba(58, 58, 58, 0.5) 80%, transparent 100%); }
    #content a { color: #6ab0ff; text-decoration: none; }
    #content a:hover { color: #4a9eff; text-decoration: underline; }
    #content table { border-radius: 6px; overflow: hidden; max-width: 100%; display: block; overflow-x: auto; margin-bottom: 2rem; }
    #content table th { background: rgba(42, 42, 42, 0.8); color: #7bb5ff; border: 1px solid rgba(58, 58, 58, 0.5); font-weight: 600; padding: 0.75rem 1rem; }
    #content table td { border: 1px solid rgba(58, 58, 58, 0.3); padding: 0.75rem 1rem; }
    #content table tr:nth-child(even) { background: rgba(42, 42, 42, 0.4); }
    .token.comment { color: #6a9955; }
    .token.string { color: #ce9178; }
    .token.variable { color: #9cdcfe; }
    .token.number { color: #b5cea8; }
    .token.keyword { color: #569cd6; }
    .token.function { color: #dcdcaa; }
    .token.operator, .token.punctuation { color: #d4d4d4; }
    pre, code, .token { text-shadow: none; }
    .contain-bg2 { background: url('images/gs_bg2.png?v=13') repeat; }
  </style>
</head>
<body>
  <div class="contain-bg2" id="background"></div>
  <div id="sidebar-overlay"></div>
  <div id="menu-toggle">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div id="sidebar">
    <div class="search-wrapper">
      <input type="text" id="search" placeholder="Search...">
    </div>
    <div id="sidebar-links"></div>
  </div>
  <div id="content"></div>

  <script>
    let apiData = {}, currentHash = '', observerEnabled = true, h2Observer = null;
    const isMobile = window.innerWidth <= 768;
    const toggleSidebar = () => {
      const sidebar = document.getElementById('sidebar');
      const content = document.getElementById('content');
      const toggle = document.getElementById('menu-toggle');
      const overlay = document.getElementById('sidebar-overlay');
      if (isMobile) {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
      } else {
        sidebar.classList.toggle('hidden');
        content.classList.toggle('expanded');
      }
      toggle.classList.toggle('active');
    };
    document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', toggleSidebar);
    <?php if ($funcId): ?>
    const initialFunc = <?php echo json_encode($funcId); ?>;
    if (initialFunc) {
      window.history.replaceState(null, '', '#' + initialFunc);
      currentHash = initialFunc;
    }
    <?php endif; ?>
    const updateMetaTags = (id) => {
      if (!apiData[id]) return;
      const item = apiData[id], name = item.name || id, desc = (item.description || 'GScript API function').replace(/`/g, '');
      const parts = [desc];
      const type = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'none';
      parts.push(`\nType: ${type}`);
      if (item.params && item.params.length > 0) parts.push(`Parameters: ${item.params.join(', ')}`);
      if (item.returns) parts.push(`Returns: ${item.returns}`);
      if (item.scope) parts.push(`Scope: ${item.scope.charAt(0).toUpperCase() + item.scope.slice(1)}`);
      if (item.example) {
        const exampleLines = item.example.split('\n');
        const snippet = exampleLines.slice(0, 3).join('\n');
        parts.push(`\nExample:\n${snippet}${exampleLines.length > 3 ? '...' : ''}`);
      }
      const fullDesc = parts.join('\n');
      document.getElementById('og-url')?.setAttribute('content', `https://docs.gscript.dev/?share=${id}`);
      document.getElementById('og-title')?.setAttribute('content', name);
      document.getElementById('og-description')?.setAttribute('content', fullDesc);
      document.getElementById('twitter-title')?.setAttribute('content', name);
      document.getElementById('twitter-description')?.setAttribute('content', fullDesc);
      document.title = `${name} - GScript API Documentation`;
    };

    const loadedSections = new Set();
    const generateSection = (key) => {
      if (loadedSections.has(key)) return;
      loadedSections.add(key);
      const item = apiData[key];
      const name = item.name || key;
      const section = document.createElement('div');
      section.className = 'section-wrapper';
      const h2 = document.createElement('h2');
      h2.id = key;
      h2.textContent = name;
      const shareBtn = document.createElement('button');
      shareBtn.className = 'share-btn';
      shareBtn.textContent = 'Share';
      shareBtn.onclick = () => {
        const shareUrl = `https://docs.gscript.dev/?share=${key}&v=${Date.now()}`;
        navigator.clipboard.writeText(shareUrl);
        shareBtn.textContent = 'Copied!';
        shareBtn.classList.add('copied');
        setTimeout(() => { shareBtn.textContent = 'Share'; shareBtn.classList.remove('copied'); }, 2000);
      };
      h2.appendChild(shareBtn);
      section.appendChild(h2);
      if (item.description) {
        const p = document.createElement('p');
        const escapedDesc = item.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        p.innerHTML = escapedDesc.replace(/`([^`]+)`/g, '<code style="background: #2a2a3a; color: #ff6b9d; padding: 0.2em 0.4em; border-radius: 3px;">$1</code>');
        section.appendChild(p);
      }
      if (item.type || item.params || item.returns || item.scope) {
        const details = document.createElement('div');
        details.style.cssText = 'background: rgba(42, 42, 58, 0.85); padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; border-left: 3px solid rgba(91, 165, 255, 0.5);';
        if (item.type) details.innerHTML += `<div><strong style="color: #7bb5ff;">Type:</strong> <code style="background: #2a2a3a; color: #ff6b9d; padding: 0.2em 0.4em; border-radius: 3px;">${item.type}</code></div>`;
        if (item.params && item.params.length > 0) details.innerHTML += `<div><strong style="color: #7bb5ff;">Parameters:</strong> <code style="background: #2a2a3a; color: #ff6b9d; padding: 0.2em 0.4em; border-radius: 3px;">${item.params.join(', ')}</code></div>`;
        if (item.returns) details.innerHTML += `<div><strong style="color: #7bb5ff;">Returns:</strong> <code style="background: #2a2a3a; color: #ff6b9d; padding: 0.2em 0.4em; border-radius: 3px;">${item.returns}</code></div>`;
        if (item.scope) details.innerHTML += `<div><strong style="color: #7bb5ff;">Scope:</strong> <code style="background: #2a2a3a; color: #ff6b9d; padding: 0.2em 0.4em; border-radius: 3px;">${item.scope}</code></div>`;
        section.appendChild(details);
      }
      if (item.example) {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(item.example);
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
        };
        wrapper.appendChild(copyBtn);
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = 'language-javascript';
        code.textContent = item.example;
        pre.appendChild(code);
        wrapper.appendChild(pre);
        section.appendChild(wrapper);
        requestAnimationFrame(() => { if (window.Prism) Prism.highlightElement(code); });
      }
      const hr = document.createElement('hr');
      section.appendChild(hr);
      if (h2Observer) h2Observer.observe(h2);
      return section;
    };

    const scrollToHash = (hash, skipSidebarScroll = false) => {
      let id = hash.replace('#', '');
      const matchKey = Object.keys(apiData).find(k => k.toLowerCase() === id.toLowerCase());
      if (matchKey) id = matchKey;
      const placeholder = document.getElementById(`placeholder-${id}`);
      if (placeholder && !loadedSections.has(id)) {
        const section = generateSection(id);
        if (section) placeholder.replaceWith(section);
      }
      const el = document.getElementById(id);
      if (el) {
        currentHash = id;
        window.history.replaceState(null, '', `#${id}`);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateMetaTags(id);
        document.querySelectorAll('#sidebar a').forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`#sidebar a[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          if (!skipSidebarScroll) {
            activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          const parentTree = activeLink.closest('.tree-children');
          if (parentTree) {
            const treeParent = parentTree.previousElementSibling;
            if (treeParent && treeParent.classList.contains('tree-parent')) {
              treeParent.classList.add('expanded');
              parentTree.classList.add('show');
            }
          }
        }
      }
    };

    fetch('https://api.moreno.land/api/gscript').then(r => r.json()).then(data => {
      apiData = data;
      const sidebarLinks = document.getElementById('sidebar-links');
      const groups = {};
      const groupMap = {};
      const ungrouped = [];
      Object.keys(data).forEach(key => {
        const item = data[key];
        const name = item.name || key;
        const desc = item.description || '';
        const descParts = desc.split('|').map(p => p.trim());
        const allMatches = [];
        const matchName = name.match(/^([\w$]+)(?:\.|:+|_)/);
        if (matchName) allMatches.push(matchName);
        descParts.forEach(part => {
          const matchDesc = part.match(/^([\w$]+)(?:\.|:+|_)/);
          if (matchDesc) allMatches.push(matchDesc);
        });
        if (allMatches.length > 0) {
          let added = false;
          allMatches.forEach(match => {
            const rawGroup = match[1];
            const groupKey = rawGroup.toLowerCase();
            if (groupKey === 'clientside' || groupKey === 'serverside') return;
            if (!groupMap[groupKey]) {
              groupMap[groupKey] = rawGroup;
              groups[rawGroup] = [];
            }
            groups[groupMap[groupKey]].push(key);
            added = true;
          });
          if (!added) ungrouped.push(key);
        } else {
          ungrouped.push(key);
        }
      });
      const fragment = document.createDocumentFragment();
      ungrouped.forEach(key => {
        const item = data[key], name = item.name || key;
        const nameKey = name.toLowerCase();
        let merged = false;
        for (const groupName in groups) {
          if (groupName.toLowerCase() === nameKey) {
            groups[groupName].unshift(key);
            merged = true;
            break;
          }
        }
        if (merged) return;
        if (name.match(/^on[A-Z]/)) {
          if (!groups['Events']) groups['Events'] = [];
          groups['Events'].push(key);
          return;
        }
        if (name.match(/^mud/i)) {
          if (!groups['Mud']) groups['Mud'] = [];
          groups['Mud'].push(key);
          return;
        }
        if (name.match(/^matrix/i)) {
          if (!groups['Matrix']) groups['Matrix'] = [];
          groups['Matrix'].push(key);
          return;
        }
        if (name.match(/^kingdom/i)) {
          if (!groups['Kingdom']) groups['Kingdom'] = [];
          groups['Kingdom'].push(key);
          return;
        }
        const link = document.createElement('a');
        link.href = `#${key}`;
        link.textContent = name;
        link.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          observerEnabled = false;
          currentHash = key;
          window.history.replaceState(null, '', `#${key}`);
          scrollToHash(`#${key}`, true);
          setTimeout(() => observerEnabled = true, 2000);
          if (isMobile) {
            document.getElementById('sidebar').classList.remove('show');
            document.getElementById('menu-toggle').classList.remove('active');
            document.getElementById('sidebar-overlay').classList.remove('show');
          }
        };
        fragment.appendChild(link);
      });
      sidebarLinks.appendChild(fragment);
      const treeFragment = document.createDocumentFragment();
      Object.keys(groups).sort().forEach(groupName => {
        const parent = document.createElement('div');
        parent.className = 'tree-parent';
        parent.innerHTML = `<span class="arrow">▶</span><span>${groupName}</span>`;
        const children = document.createElement('div');
        children.className = 'tree-children';
        [...new Set(groups[groupName])].forEach(key => {
          const item = data[key], name = item.name || key;
          const link = document.createElement('a');
          link.href = `#${key}`;
          link.textContent = name;
          link.className = 'child';
          link.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            observerEnabled = false;
            currentHash = key;
            window.history.replaceState(null, '', `#${key}`);
            scrollToHash(`#${key}`, true);
            setTimeout(() => observerEnabled = true, 2000);
            if (isMobile) {
              document.getElementById('sidebar').classList.remove('show');
              document.getElementById('menu-toggle').classList.remove('active');
              document.getElementById('sidebar-overlay').classList.remove('show');
            }
          };
          children.appendChild(link);
        });
        parent.onclick = () => {
          parent.classList.toggle('expanded');
          children.classList.toggle('show');
        };
        treeFragment.appendChild(parent);
        treeFragment.appendChild(children);
      });
      sidebarLinks.appendChild(treeFragment);

      const content = document.getElementById('content');
      const orderedKeys = [];
      ungrouped.forEach(key => {
        const item = data[key], name = item.name || key;
        const nameKey = name.toLowerCase();
        let merged = false;
        for (const groupName in groups) {
          if (groupName.toLowerCase() === nameKey) {
            merged = true;
            break;
          }
        }
        if (merged) return;
        if (name.match(/^on[A-Z]/) || name.match(/^mud/i) || name.match(/^matrix/i) || name.match(/^kingdom/i)) return;
        orderedKeys.push(key);
      });
      Object.keys(groups).sort().forEach(groupName => {
        groups[groupName].forEach(key => orderedKeys.push(key));
      });
      const contentFragment = document.createDocumentFragment();
      orderedKeys.forEach(key => {
        const placeholder = document.createElement('div');
        placeholder.id = `placeholder-${key}`;
        placeholder.setAttribute('data-key', key);
        placeholder.style.minHeight = isMobile ? '250px' : '350px';
        contentFragment.appendChild(placeholder);
      });
      content.appendChild(contentFragment);

      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const placeholder = entry.target;
            const key = placeholder.getAttribute('data-key');
            if (!loadedSections.has(key)) {
              requestAnimationFrame(() => {
                const section = generateSection(key);
                if (section) {
                  placeholder.replaceWith(section);
                  lazyObserver.unobserve(placeholder);
                }
              });
            }
          }
        });
      }, { rootMargin: isMobile ? '800px' : '1000px' });

      document.querySelectorAll('[data-key]').forEach(p => lazyObserver.observe(p));

      h2Observer = new IntersectionObserver((entries) => {
        if (!observerEnabled) return;
        let topMostEntry = null;
        let topMostY = Infinity;
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const rect = entry.target.getBoundingClientRect();
            if (rect.top < topMostY && rect.top >= 0) {
              topMostY = rect.top;
              topMostEntry = entry;
            }
          }
        });
        if (topMostEntry) {
          const id = topMostEntry.target.id;
          if (id && id !== currentHash) {
            currentHash = id;
            window.history.replaceState(null, '', `#${id}`);
            updateMetaTags(id);
            document.querySelectorAll('#sidebar a').forEach(a => a.classList.remove('active'));
            const activeLink = document.querySelector(`#sidebar a[href="#${id}"]`);
            if (activeLink) {
              activeLink.classList.add('active');
              activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              const parentTree = activeLink.closest('.tree-children');
              if (parentTree) {
                const treeParent = parentTree.previousElementSibling;
                if (treeParent && treeParent.classList.contains('tree-parent')) {
                  treeParent.classList.add('expanded');
                  parentTree.classList.add('show');
                }
              }
            }
          }
        }
      }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-80px 0px -70% 0px' });

      if (window.location.hash) {
        let id = window.location.hash.replace('#', '');
        const matchKey = Object.keys(data).find(k => k.toLowerCase() === id.toLowerCase());
        if (matchKey) currentHash = matchKey;
        observerEnabled = false;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          scrollToHash(window.location.hash);
          setTimeout(() => observerEnabled = true, 1000);
        }));
      }

      window.addEventListener('hashchange', () => scrollToHash(window.location.hash));

      let searchTimeout;
      document.getElementById('search').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const query = e.target.value.toLowerCase();
          if (!query) {
            document.querySelectorAll('#sidebar a').forEach(link => link.style.display = 'flex');
            document.querySelectorAll('#sidebar .tree-parent').forEach(p => p.style.display = 'flex');
            document.querySelectorAll('#sidebar .tree-children').forEach(c => c.classList.remove('show'));
            document.querySelectorAll('#sidebar .tree-parent').forEach(p => p.classList.remove('expanded'));
            return;
          }
          document.querySelectorAll('#sidebar a').forEach(link => {
            const matches = link.textContent.toLowerCase().includes(query);
            link.style.display = matches ? 'flex' : 'none';
          });
          document.querySelectorAll('#sidebar .tree-parent').forEach(parent => {
            const children = parent.nextElementSibling;
            const hasMatch = Array.from(children.querySelectorAll('a')).some(a => a.style.display === 'flex');
            if (hasMatch) {
              parent.style.display = 'flex';
              children.classList.add('show');
              parent.classList.add('expanded');
            } else {
              parent.style.display = 'none';
            }
          });
        }, 150);
      });
    });
  </script>
</body>
</html>
