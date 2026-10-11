export const stages = ['Idea', 'Validation', 'Building', 'Operating'];
export function businessInput(name, stage) {
  name = String(name || '').trim();
  if (!name || name.length > 120 || !stages.includes(stage)) throw Error('Enter a business name and a valid stage.');
  return {name, stage};
}
export function taskInput(title) {
  title = String(title || '').trim();
  if (!title || title.length > 300) throw Error('Enter a task of up to 300 characters.');
  return title;
}
export function passwordMatches(password, confirmation) {
  if (password.length < 12 || password.length > 128) throw Error('Use a password of 12–128 characters.');
  if (password !== confirmation) throw Error('The passwords do not match.');
}
export function connectionReady(config) {
  return Boolean(config && /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl) &&
    /^(sb_publishable_|eyJ)/.test(config.publishableKey));
}
export function mayOpenWorkspace(aal) { return aal === 'aal2'; }

