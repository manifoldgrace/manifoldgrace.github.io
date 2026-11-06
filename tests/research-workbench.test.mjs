import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialDraft, validateDraft, buildPreview, exportMarkdown, storageKey} from '../research-workbench.mjs';

const schema = JSON.parse(readFileSync(new URL('../research-workbench-data.json', import.meta.url)));

test('all 39 project drafts round-trip independently and preserve the project-specific pilot', () => {
  assert.equal(schema.projects.length, 39);
  assert.equal(new Set(schema.projects.map(p => p.id)).size, 39);
  assert.equal(new Set(schema.projects.map(p => storageKey(p.id))).size, 39);
  for (const p of schema.projects) {
    const draft = initialDraft(p, schema.stages);
    assert.equal(Object.keys(draft.sections).length, 14);
    assert.equal(Object.keys(draft.stages).length, 7);
    assert.deepEqual(validateDraft(JSON.parse(JSON.stringify(draft)), p, schema), draft);
    assert.ok(draft.sections.question.includes(p.pilot.input));
    assert.ok(exportMarkdown(p, schema, draft).includes(p.workspace_url));
  }
});

test('draft imports reject wrong projects, malformed types and fabricated milestones', () => {
  const p = schema.projects[0];
  const valid = initialDraft(p, schema.stages);
  for (const value of [null, [], {...valid, project_id: schema.projects[1].id},
    {...valid, sections: []}, {...valid, sections: {...valid.sections, history: []}},
    {...valid, stages: {...valid.stages, scope: 'verified-by-AI'}},
    {...valid, auto_preview: 'yes'}, {...valid, demo: {...valid.demo, js: {}}}]) {
    assert.throws(() => validateDraft(value, p, schema));
  }
});

test('draft validation does not retain arbitrary object properties', () => {
  const p = schema.projects[0], draft = initialDraft(p, schema.stages);
  const result = validateDraft({...draft, privileged_instruction: 'invented'}, p, schema);
  assert.equal(result.privileged_instruction, undefined);
});

test('preview policy restricts resource/API requests and escapes closing script/style tags', () => {
  const preview = buildPreview({html:'<h1>Fixture</h1>',css:'/* </style> */',js:'const text="</script>";'});
  assert.ok(preview.includes("connect-src 'none'"));
  assert.ok(preview.includes("form-action 'none'"));
  assert.ok(preview.includes('<\\/script>'));
  assert.ok(preview.includes('<\\/style>'));
  assert.equal((preview.match(/<\/script>/g) || []).length, 1);
});
