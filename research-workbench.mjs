const MAX_TEXT = 200000;
const STAGE_STATES = ['not_started', 'in_progress', 'needs_review', 'complete'];
export function storageKey(id) { return 'manifoldgrace.research.v1.' + id; }
export function seedDemo(project) {
  return {
    html: '<article><p class="label">Fictional pilot · visual fixture</p><h1 id="title"></h1><p id="pilot"></p><h2>What I will inspect</h2><p id="checks"></p><button id="toggle">Show investigation boundary</button><p id="boundary" hidden>No model is being called. This example displays a planned case; it does not establish a research finding.</p></article>',
    css: 'body { font: 17px/1.6 system-ui; background: #eef3f7; color: #173047; padding: 22px; } article { max-width: 750px; margin: auto; } .label { text-transform: uppercase; font-size: 12px; letter-spacing: .08em; } button { padding: 10px 14px; font: inherit; border: 1px solid #345; border-radius: 6px; background: white; } button:focus-visible { outline: 3px solid #258; }',
    js: 'const fixture = ' + JSON.stringify({title: project.title, pilot: project.pilot.input, checks: project.pilot.checks}, null, 2) + ';\n// Your browser code: replace or extend this fixture as you investigate.\ndocument.getElementById("title").textContent = fixture.title;\ndocument.getElementById("pilot").textContent = fixture.pilot;\ndocument.getElementById("checks").textContent = fixture.checks;\ndocument.getElementById("toggle").addEventListener("click", () => { const p = document.getElementById("boundary"); p.hidden = !p.hidden; });'
  };
}
export function initialDraft(project, stages) {
  return {version: 1, project_id: project.id, sections: {...project.initial_sections},
    stages: Object.fromEntries(stages.map(s => [s.id, 'not_started'])),
    terminology: 'Reading to confirm: Infrastructure as Code (IaC), rather than “Internet as Code”.',
    roadmap_note: '', demo: seedDemo(project), auto_preview: true};
}
export function validateDraft(value, project, schema) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1 || value.project_id !== project.id) throw new Error('This draft does not match the selected project or supported version.');
  const text = (v, name) => { if (typeof v !== 'string' || v.length > MAX_TEXT) throw new Error(name + ' must be text within the size limit.'); return v; };
  const object = (v, name) => { if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error(name + ' must be an object.'); return v; };
  object(value.sections, 'Sections'); object(value.stages, 'Milestones'); object(value.demo, 'Demo');
  const result = initialDraft(project, schema.stages);
  for (const s of schema.sections) result.sections[s.id] = text(value.sections[s.id], s.title);
  for (const s of schema.stages) { if (!STAGE_STATES.includes(value.stages[s.id])) throw new Error('Invalid milestone status.'); result.stages[s.id] = value.stages[s.id]; }
  for (const k of ['html', 'css', 'js']) result.demo[k] = text(value.demo[k], 'Demo ' + k);
  result.terminology = text(value.terminology, 'Terminology'); result.roadmap_note = text(value.roadmap_note, 'Roadmap notes');
  if (typeof value.auto_preview !== 'boolean') throw new Error('Preview choice must be true or false.');
  result.auto_preview = value.auto_preview;
  return result;
}
export function buildPreview(demo) {
  const css = demo.css.replace(/<\/style/gi, '<\\/style');
  const js = demo.js.replace(/<\/script/gi, '<\\/script');
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data: blob:; connect-src \'none\'; form-action \'none\'; base-uri \'none\'"><title>Local research demonstration</title><style>' + css + '</style></head><body>' + demo.html + '<script>' + js + '</script></body></html>';
}
export function exportMarkdown(project, schema, draft) {
  let md = '# Research dossier: ' + project.title + '\n\nWorking draft — exported ' + new Date().toISOString() + '\n\nResearch entry: ' + project.canonical_url + '\nWorkspace: ' + project.workspace_url + '\n\n';
  for (const [i, s] of schema.sections.entries()) md += '## ' + (i+1) + '. ' + s.title + '\n\n' + s.prompt + '\n\n' + (draft.sections[s.id] || '_Analysis to add._') + '\n\n';
  md += '## Milestone record\n\n';
  for (const s of schema.stages) md += '- ' + s.title + ': ' + draft.stages[s.id] + '\n';
  return md + '\nDependencies and next action: ' + draft.roadmap_note + '\n\nTerminology corrections: ' + draft.terminology + '\n\nLocal drafts do not certify findings or update the public repository. Preserve your evidence and contribution records.\n';
}

async function initialise() {
  const $ = id => document.getElementById(id);
  const message = text => { $('app-status').textContent = text; };
  let schema, project, draft, renderTimer;
  const textareas = new Map(), stageInputs = new Map();
  function readFields() {
    if (!draft) return;
    for (const [id, field] of textareas) draft.sections[id] = field.value;
    for (const [id, field] of stageInputs) draft.stages[id] = field.value;
    draft.terminology = $('terminology-note').value; draft.roadmap_note = $('roadmap-note').value;
    draft.demo = {html: $('demo-html').value, css: $('demo-css').value, js: $('demo-js').value};
    draft.auto_preview = $('auto-preview').checked;
  }
  function save() {
    readFields();
    try { localStorage.setItem(storageKey(project.id), JSON.stringify(draft)); message('Saved in this browser only. Export a copy before changing device or clearing browser data.'); }
    catch { message('Browser storage is unavailable or full. Your edits remain on this page; export a copy to keep them.'); }
  }
  function runDemo() { readFields(); $('demo-frame').srcdoc = buildPreview(draft.demo); $('demo-status').textContent = 'Browser preview rendered. HTML/CSS/JavaScript only; no model API is connected.'; }
  function clearPreview() { clearTimeout(renderTimer); $('demo-frame').srcdoc = '<!doctype html><html lang="en"><body></body></html>'; $('demo-status').textContent = 'Preview cleared. Choose Run browser preview when ready.'; }
  function link(label, href) { const a = document.createElement('a'); a.textContent = label; a.href = href; return a; }
  function loadProject(id, imported = null) {
    clearPreview();
    project = schema.projects.find(p => p.id === id) || schema.projects[0];
    draft = initialDraft(project, schema.stages);
    let saved = null;
    if (imported) { draft = validateDraft(imported, project, schema); draft.auto_preview = false; }
    else { try { saved = localStorage.getItem(storageKey(project.id)); if (saved) draft = validateDraft(JSON.parse(saved), project, schema); } catch { message('A stored draft could not be loaded. The public starter is displayed; export changes to keep them.'); } }
    $('project-select').value = project.id; $('project-title').textContent = project.title;
    $('project-track').textContent = project.path.split('/')[0]; $('project-status').textContent = project.maturity;
    const links = $('project-links'); links.replaceChildren(link('Research entry', project.canonical_url), link('My project — GitHub', project.workspace_url), link('Source code', project.source_code_url), link('Written dossier', project.workspace_url.replace('/tree/', '/blob/') + '/RESEARCH.md'), link('Roadmap source', project.workspace_url.replace('/tree/', '/blob/') + '/ROADMAP.mmd'));
    const container = $('dossier-sections'); container.replaceChildren(); textareas.clear();
    schema.sections.forEach((s, i) => {
      const details = document.createElement('details'); details.open = i === 0;
      const summary = document.createElement('summary'); summary.textContent = (i+1) + '. ' + s.title;
      const p = document.createElement('p'); p.className = 'method-prompt'; p.textContent = s.prompt;
      const label = document.createElement('label'); label.htmlFor = 'section-' + s.id; label.textContent = 'Your working text';
      const input = document.createElement('textarea'); input.id = label.htmlFor; input.rows = 7; input.maxLength = MAX_TEXT; input.value = draft.sections[s.id]; input.placeholder = 'Write your analysis, sources and decisions here.'; input.addEventListener('input', save);
      textareas.set(s.id, input); details.append(summary, p, label, input); container.append(details);
    });
    const roadmap = $('roadmap-stages'); roadmap.replaceChildren(); stageInputs.clear();
    schema.stages.forEach(s => {
      const li = document.createElement('li'), h = document.createElement('h3'), p = document.createElement('p'), label = document.createElement('label'), select = document.createElement('select');
      h.textContent = s.title; p.textContent = s.evidence; label.textContent = 'Your milestone status'; label.htmlFor = 'stage-' + s.id; select.id = label.htmlFor;
      for (const state of STAGE_STATES) { const option = document.createElement('option'); option.value = state; option.textContent = state.replaceAll('_', ' '); select.append(option); }
      select.value = draft.stages[s.id]; select.addEventListener('change', save); stageInputs.set(s.id, select); li.append(h, p, label, select); roadmap.append(li);
    });
    $('terminology-note').value = draft.terminology; $('roadmap-note').value = draft.roadmap_note;
    for (const k of ['html', 'css', 'js']) { $('demo-' + k).maxLength = MAX_TEXT; $('demo-' + k).value = draft.demo[k]; }
    $('auto-preview').checked = draft.auto_preview; $('project-panel').hidden = false;
    const url = new URL(location.href); url.searchParams.set('project', project.id); history.replaceState(null, '', url);
    document.title = project.title + ' — Research Workbench | Manifold Grace';
    message(imported ? 'Draft imported for this project. Preview is paused until you choose to run it.' : 'Project loaded. Initial prompts are editable plans, not findings.');
    if (draft.auto_preview && !imported) runDemo();
  }
  function download(content, type, suffix) { const blob = new Blob([content], {type}), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = project.id + suffix; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  try {
    const response = await fetch('research-workbench-data.json'); if (!response.ok) throw new Error('Project records could not be fetched.'); schema = await response.json();
    const select = $('project-select'); select.replaceChildren();
    for (const [group, title] of [['companies','20 company investigations'],['avenues','10 MA-connected avenues'],['bottlenecks','9 bottleneck investigations']]) {
      const optgroup = document.createElement('optgroup'); optgroup.label = title;
      for (const p of schema.projects.filter(p => p.path.startsWith(group + '/'))) { const option = document.createElement('option'); option.value = p.id; option.textContent = p.title; optgroup.append(option); } select.append(optgroup);
    }
    select.addEventListener('change', () => { save(); loadProject(select.value); });
    for (const id of ['terminology-note', 'roadmap-note']) $(id).addEventListener('input', save);
    for (const k of ['html','css','js']) $('demo-' + k).addEventListener('input', () => { save(); clearTimeout(renderTimer); if ($('auto-preview').checked) renderTimer = setTimeout(runDemo, 450); });
    $('auto-preview').addEventListener('change', () => { save(); if ($('auto-preview').checked) runDemo(); });
    $('run-demo').addEventListener('click', runDemo); $('stop-demo').addEventListener('click', () => { $('auto-preview').checked = false; clearPreview(); save(); });
    $('export-json').addEventListener('click', () => { save(); download(JSON.stringify(draft, null, 2), 'application/json', '-draft.json'); });
    $('export-md').addEventListener('click', () => { save(); download(exportMarkdown(project, schema, draft), 'text/markdown', '-dossier.md'); });
    $('export-demo').addEventListener('click', () => { save(); download(buildPreview(draft.demo), 'text/html', '-demo.html'); });
    $('import-draft').addEventListener('change', async event => {
      const file = event.target.files[0]; if (!file) return;
      try { if (file.size > 16000000) throw new Error('Draft exceeds the 16 MB import limit.'); const candidate = JSON.parse(await file.text()); validateDraft(candidate, project, schema); loadProject(project.id, candidate); save(); message('Draft imported and saved locally. Preview remains paused; inspect the code before running it.'); }
      catch (error) { message('Import not applied: ' + error.message); } event.target.value = '';
    });
    $('reset-project').addEventListener('click', () => { if (!window.confirm('Reset this project’s browser draft? Export first if you want to keep your edits. GitHub files will not change.')) return; try { localStorage.removeItem(storageKey(project.id)); } catch {} loadProject(project.id); });
    loadProject(new URL(location.href).searchParams.get('project'));
  } catch (error) { message('Workbench unavailable: ' + error.message + ' Read the linked GitHub dossiers instead.'); }
}
if (typeof document !== 'undefined') initialise();
