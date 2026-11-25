// Matériel ajouté à une animation pour un niveau précis : identifiant « animation+kit+kit ».
// Les objets se placent tout seuls par rapport au mouvement (voir bakeDef : at / ref / dx, span).
const FOAM = '#f97316', BLUE = '#2563eb', MARK = '#facc15';

export const KITS = {
  // Roue dans un couloir : deux blocs en mousse rectangulaires de part et d'autre
  couloir: [
    { k: 'box', span: true, pad: 0.7, z0: 0.62, z1: 0.95, h: 0.42, color: FOAM, solid: false },
    { k: 'box', span: true, pad: 0.7, z0: -0.95, z1: -0.62, h: 0.42, color: FOAM, solid: false },
  ],
  // Bloc de parade le long du plan incliné
  parade: [{ k: 'box', x0: -0.7, x1: 1.1, z0: 0.55, z1: 1.0, h: 0.45, color: FOAM, solid: false }],
  // Repère visuel au sol, là où se posent les mains / juste avant (à franchir)
  'repere-mains': [{ k: 'mark', at: 'plant:handL', ref: 'wrL', dx: -0.04, x0: 0, x1: 0.08, z0: -0.35, z1: 0.35, h: 0.006, color: MARK }],
  'repere-franchir': [{ k: 'mark', at: 'plant:handL', ref: 'wrL', dx: -0.3, x0: 0, x1: 0.08, z0: -0.35, z1: 0.35, h: 0.006, color: MARK }],
  // Repère avant l'appel du salto (« appel long et rasant par-dessus le repère »)
  'repere-appel': [{ k: 'mark', at: 'fly#2', ref: 'anR', dx: -0.55, x0: 0, x1: 0.08, z0: -0.35, z1: 0.35, h: 0.006, color: MARK }],
  // Sur-tapis (10 cm) à la réception / sous les mains
  surtapis: [{ k: 'box', at: 'land#-1', ref: 'anR', dx: -0.6, x0: 0, x1: 1.8, z0: -0.75, z1: 0.75, h: 0.1, color: '#60a5fa' }],
  'surtapis-mains': [{ k: 'box', at: 'land#-1', ref: 'wrL', dx: -0.45, x0: 0, x1: 2.2, z0: -0.75, z1: 0.75, h: 0.1, color: '#60a5fa' }],
  // Tapis de réception (≈ 20 cm)
  'tapis-reception': [{ k: 'box', at: 'land#-1', ref: 'anR', dx: -0.7, x0: 0, x1: 2.4, z0: -0.85, z1: 0.85, h: 0.2, color: BLUE }],
  // Gros tapis de réception (saut de l'ange : on pose les mains dessus)
  'gros-tapis': [{ k: 'box', at: 'land#-1', ref: 'wrL', dx: -0.4, x0: 0, x1: 2.4, z0: -0.9, z1: 0.9, h: 0.4, color: '#1d4ed8' }],
  // Carpette sous le plinth (roue en longueur)
  carpette: [{ k: 'box', at: 'plant:handL', ref: 'wrL', dx: -1.3, x0: 0, x1: 2.8, z0: -0.45, z1: 0.45, h: 0.015, color: '#7c3aed' }],
  // Obstacle en mousse avant le mini-trampoline
  obstacle: [{ k: 'box', at: 'plant:handL', ref: 'wrL', dx: -0.85, x0: 0, x1: 0.25, z0: -0.4, z1: 0.4, h: 0.22, color: FOAM, solid: false }],
};

/** Ajoute à une définition d'animation le matériel des kits demandés. */
export function withKits(def, kits) {
  const extra = kits.flatMap(k => KITS[k] || []);
  return { ...def, props: [...(def.props || []), ...extra.map(p => ({ ...p }))] };
}
