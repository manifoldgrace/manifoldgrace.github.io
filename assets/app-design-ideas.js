(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.category;
    document.querySelectorAll('.filter-button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    document.querySelectorAll('.idea').forEach(idea => {
      idea.hidden = category !== 'all' && idea.dataset.category !== category;
      if (!idea.hidden) count++;
    });
    byId('idea-count').textContent = `${count} ${count === 1 ? 'idea' : 'ideas'}`;
  }));
  function heritage() {
    const consent = byId('heritage-consent').checked;
    const admitted = byId('heritage-admission').value === 'approved';
    const kinship = byId('heritage-kinship').value;
    const eligible = consent && admitted && kinship === 'clear';
    let gate = !admitted ? 'On hold: genealogy approval is required before swiping.' : !consent ? 'On hold: consent is required.' : kinship === 'close' ? 'Blocked: this pair falls within a prohibited kinship boundary.' : kinship === 'unknown' ? 'On hold: incomplete kinship evidence requires review.' : 'Eligible in this simulation: the pair has cleared the selected review scenario.';
    byId('heritage-result').textContent = `${gate} Presets: ${byId('heritage-intent').value}; ${byId('heritage-faith').value}; ${byId('heritage-lineage').value}. Personal boundary: no shared ancestor within ${byId('heritage-depth').value} generations of either person. The stricter boundary governs a pair, alongside legal prohibitions. This is not an actual kinship finding.`;
    byId('heritage-swipe').disabled = !eligible;
    byId('heritage-swipe-result').textContent = '';
  }
  function dating() {
    byId('dating-result').textContent = `${byId('dating-intent').value}; ${byId('dating-faith').value.toLowerCase()}; children: ${byId('dating-children').value.toLowerCase()}; location: ${byId('dating-location').value}. ${byId('dating-verified').checked ? 'Identity-check stage required before direct contact.' : 'Identity-check preference not selected.'} No ancestry requirement.`;
  }
  ['heritage-intent','heritage-faith','heritage-depth','heritage-consent','heritage-lineage','heritage-admission','heritage-kinship'].forEach(id => byId(id).addEventListener('change', heritage));
  ['dating-intent','dating-faith','dating-children','dating-location','dating-verified'].forEach(id => byId(id).addEventListener('change', dating));
  const workflows = {
    research: ['Define the question and sources','Gather and compare evidence','Draft a sourced brief','Client reviews the deliverable'],
    support: ['Define scope and escalation rules','Review incoming enquiries','Prepare response drafts','Approve responses before sending'],
    admin: ['Agree the task and access','Organise the supplied information','Prepare proposed updates','Approve changes before execution']
  };
  function agent() {
    byId('agent-steps').replaceChildren(...workflows[byId('agent-task').value].map(text => {
      const li = document.createElement('li'); li.textContent = text; return li;
    }));
    byId('agent-result').textContent = 'Workflow preview ready. No agent has been started.';
  }
  byId('agent-task').addEventListener('change', agent);
  byId('agent-review').addEventListener('click', () => {
    byId('agent-result').textContent = 'Review stage: the client would inspect the output, request changes or approve the next action. This is a local interface demonstration.';
  });
  byId('heritage-swipe').addEventListener('click', () => {
    if (byId('heritage-swipe').disabled) return;
    byId('heritage-swipe-result').textContent = 'The app would show the next mutually eligible profile aligned with your presets. No real profiles are loaded.';
  });
  heritage(); dating(); agent();
})();
