(() => {
  const form = document.querySelector('#question-form');
  const list = document.querySelector('#saved-questions');
  const status = document.querySelector('#question-status');
  const key = 'manifold-grace-defence-questions-v1';
  let notes;
  try {
    notes = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(notes)) throw new Error('Invalid question notes');
  } catch {
    status.textContent = 'Saved questions could not be read in this browser.';
    return;
  }
  const render = () => {
    list.replaceChildren();
    for (const note of notes) {
      const entry = document.createElement('li');
      entry.textContent = [note.date, note.question, note.context, note.link].filter(Boolean).join(' · ');
      list.append(entry);
    }
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = document.querySelector('#draft-question').value.trim();
    if (!question) {
      status.textContent = 'Enter a research question.';
      return;
    }
    const note = {
      question,
      context: document.querySelector('#draft-context').value.trim(),
      link: document.querySelector('#draft-link').value.trim(),
      date: new Intl.DateTimeFormat('en-GB', {dateStyle: 'long', timeZone: 'Europe/London'}).format(new Date())
    };
    const next = [...notes, note];
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      status.textContent = 'This browser could not save the question. Your draft is still in the form.';
      return;
    }
    notes = next;
    render();
    form.reset();
    status.textContent = 'Question saved on this device.';
  });
  document.querySelector('#download-questions').addEventListener('click', () => {
    if (!notes.length) {
      status.textContent = 'Save a question before downloading.';
      return;
    }
    const markdown = notes.map(({date, question, context, link}) =>
      ['## ' + question, date, context, link].filter(Boolean).join('\n\n')
    ).join('\n\n');
    const url = URL.createObjectURL(new Blob([markdown], {type: 'text/markdown'}));
    const download = document.createElement('a');
    download.href = url;
    download.download = 'defence-research-questions.md';
    download.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  render();
})();
