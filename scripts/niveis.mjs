/**
 * Nivel tecnico de cada exercicio — NAO e nivel do praticante.
 *
 * O criterio e risco e demanda de coordenacao, nao carga nem "quanto cresce":
 *  - iniciante:    maquina, trajetoria guiada ou padrao simples de aprender
 *  - intermediario: peso livre com estabilizacao, unilateral comum (padrao)
 *  - avancado:     levantamento olimpico, calistenia dificil, alto risco lombar
 *
 * O filtro da interface e cumulativo ("a partir de"): quem marca Avancado
 * continua vendo supino reto e leg press, porque exercicio basico nao deixa
 * de servir quando a pessoa evolui. O que muda entre niveis de praticante e
 * volume e divisao de treino — isso quem carrega sao os combos.
 *
 * Quem nao estiver em nenhuma das duas listas fica como intermediario.
 */

export const INICIANTE = [
  // peito
  'wger-129', 'wger-135', 'wger-926', 'wger-925', 'wger-539', 'wger-75',
  'wger-73', 'wger-537', 'wger-1551', 'wger-1922', 'wger-1084',
  // costas
  'wger-1725', 'wger-1117', 'wger-1119', 'wger-1120', 'wger-158', 'wger-1136',
  'wger-1127', 'wger-394', 'wger-301', 'wger-1143', 'wger-512', 'wger-1726',
  'wger-1635', 'wger-1637',
  // pernas
  'wger-371', 'wger-373', 'wger-375', 'wger-369', 'wger-366', 'wger-364',
  'wger-365', 'wger-367', 'wger-2495', 'wger-1748', 'wger-12', 'wger-1243',
  'wger-265', 'wger-203', 'wger-981', 'wger-1747', 'wger-977', 'wger-984',
  'wger-1963', 'wger-1965', 'wger-320',
  // ombro
  'wger-543', 'wger-567', 'wger-916', 'wger-348', 'wger-1654', 'wger-256',
  'wger-572', 'wger-570', 'wger-487', 'wger-822', 'wger-1338', 'wger-1745',
  // biceps
  'wger-92', 'wger-91', 'wger-94', 'wger-272', 'wger-95', 'wger-912',
  'wger-1448', 'wger-1012', 'wger-1109',
  // triceps
  'wger-1185', 'wger-805', 'wger-1900', 'wger-659', 'wger-1336', 'wger-197',
  'wger-50', 'wger-246', 'wger-1000',
]

export const AVANCADO = [
  // peito — pliometria e peso corporal com carga
  'wger-1554', 'wger-2529', 'wger-2530', 'wger-1902', 'wger-1112', 'wger-194',
  // costas — terra e olimpico cobram caro da lombar com tecnica ruim
  'wger-184', 'wger-484', 'wger-1087', 'wger-475', 'wger-513', 'wger-1022',
  // pernas
  'wger-1801', 'wger-257', 'wger-456', 'wger-630', 'wger-507', 'wger-1947',
  'wger-960', 'wger-1100', 'wger-1392', 'wger-909', 'wger-1736', 'wger-1641',
  'wger-1612', 'wger-2619', 'wger-1325',
  // ombro
  'wger-1901', 'wger-1638', 'wger-1556', 'wger-282', 'wger-1916', 'wger-478',
  'wger-1893', 'wger-79', 'wger-1080',
  // biceps / triceps
  'wger-958', 'wger-152', 'wger-1298',
]
