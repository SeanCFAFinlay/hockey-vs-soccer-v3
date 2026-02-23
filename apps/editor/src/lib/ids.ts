let counter = 0;

export function generateId(prefix = 'id'): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  counter += 1;
  return `${prefix}_${ts}_${rand}_${counter}`;
}
