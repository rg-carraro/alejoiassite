export type PortalOptions = {
  ready: () => Promise<boolean>;
  launch: () => void;
  open: () => void;
  state: (message: string) => void;
  wait: () => Promise<void>;
  attempts?: number;
};
export async function openPortal(options: PortalOptions) {
  options.state('Verificando o Portal de notas…');
  const ready = async () => { try { return await options.ready(); } catch { return false; } };
  if (await ready()) { options.open(); return true; }
  options.state('Tentando iniciar o Portal de notas neste PC. Se o navegador pedir, permita abrir o iniciador.');
  try { options.launch(); } catch { /* Pode não haver iniciador instalado. */ }
  for (let i = 0; i < (options.attempts ?? 20); i++) {
    await options.wait();
    if (await ready()) { options.open(); return true; }
  }
  options.state('Não podemos abrir o Portal de notas no momento. Confira se você está no PC do AleJoias e se permitiu a abertura do iniciador.');
  return false;
}
