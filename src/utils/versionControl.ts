import { PortalProject, ProjectVersion, ProjectDiffItem } from '../types';

/**
 * Calculates differences between two versions of a PortalProject.
 */
export function calculateProjectDiff(
  oldProj: Partial<PortalProject>,
  newProj: Partial<PortalProject>
): ProjectDiffItem[] {
  const diffs: ProjectDiffItem[] = [];

  if (oldProj.title !== newProj.title && newProj.title) {
    diffs.push({
      field: 'title',
      label: 'Nome do Projeto',
      oldValue: oldProj.title || '',
      newValue: newProj.title,
    });
  }

  if (oldProj.client !== newProj.client && newProj.client) {
    diffs.push({
      field: 'client',
      label: 'Cliente / Empreendimento',
      oldValue: oldProj.client || '',
      newValue: newProj.client,
    });
  }

  if (oldProj.location !== newProj.location && newProj.location) {
    diffs.push({
      field: 'location',
      label: 'Localização',
      oldValue: oldProj.location || '',
      newValue: newProj.location,
    });
  }

  if (oldProj.category !== newProj.category && newProj.category) {
    diffs.push({
      field: 'category',
      label: 'Categoria do Imóvel',
      oldValue: oldProj.category || '',
      newValue: newProj.category,
    });
  }

  if (oldProj.style !== newProj.style && newProj.style) {
    diffs.push({
      field: 'style',
      label: 'Tipologia Biofílica',
      oldValue: oldProj.style || '',
      newValue: newProj.style,
    });
  }

  if (oldProj.area !== undefined && newProj.area !== undefined && oldProj.area !== newProj.area) {
    diffs.push({
      field: 'area',
      label: 'Área Projetada',
      oldValue: `${oldProj.area} m²`,
      newValue: `${newProj.area} m²`,
    });
  }

  if (oldProj.status !== newProj.status && newProj.status) {
    diffs.push({
      field: 'status',
      label: 'Status da Obra',
      oldValue: oldProj.statusLabel || oldProj.status || '',
      newValue: newProj.statusLabel || newProj.status,
    });
  }

  if (
    oldProj.estimatedTotal !== undefined &&
    newProj.estimatedTotal !== undefined &&
    oldProj.estimatedTotal !== newProj.estimatedTotal
  ) {
    diffs.push({
      field: 'estimatedTotal',
      label: 'Investimento Estimado',
      oldValue: `R$ ${oldProj.estimatedTotal.toLocaleString('pt-BR')}`,
      newValue: `R$ ${newProj.estimatedTotal.toLocaleString('pt-BR')}`,
    });
  }

  if (
    oldProj.acousticNrc !== undefined &&
    newProj.acousticNrc !== undefined &&
    oldProj.acousticNrc !== newProj.acousticNrc
  ) {
    diffs.push({
      field: 'acousticNrc',
      label: 'Absorção Acústica (NRC)',
      oldValue: `NRC ${oldProj.acousticNrc}`,
      newValue: `NRC ${newProj.acousticNrc}`,
    });
  }

  if (
    oldProj.leedPointsTotal !== undefined &&
    newProj.leedPointsTotal !== undefined &&
    oldProj.leedPointsTotal !== newProj.leedPointsTotal
  ) {
    diffs.push({
      field: 'leedPointsTotal',
      label: 'Pontuação LEED v4.1',
      oldValue: `${oldProj.leedPointsTotal} pts`,
      newValue: `${newProj.leedPointsTotal} pts`,
    });
  }

  if (
    oldProj.wellScore !== undefined &&
    newProj.wellScore !== undefined &&
    oldProj.wellScore !== newProj.wellScore
  ) {
    diffs.push({
      field: 'wellScore',
      label: 'Pontuação WELL Mind',
      oldValue: `${oldProj.wellScore} pts`,
      newValue: `${newProj.wellScore} pts`,
    });
  }

  // Botanical species diff
  const oldSpecies = oldProj.speciesUsed || [];
  const newSpecies = newProj.speciesUsed || [];
  const oldSpeciesStr = oldSpecies.join(', ');
  const newSpeciesStr = newSpecies.join(', ');
  if (oldSpeciesStr !== newSpeciesStr) {
    diffs.push({
      field: 'speciesUsed',
      label: 'Paleta de Espécies Botânicas',
      oldValue: oldSpeciesStr || 'Nenhuma selecionada',
      newValue: newSpeciesStr || 'Nenhuma selecionada',
    });
  }

  if (oldProj.notes !== newProj.notes && newProj.notes) {
    diffs.push({
      field: 'notes',
      label: 'Notas & Memorial',
      oldValue: oldProj.notes || 'Sem observações',
      newValue: newProj.notes,
    });
  }

  return diffs;
}

/**
 * Creates a new ProjectVersion snapshot when a change occurs.
 */
export function createProjectVersion(
  previousProject: PortalProject,
  updatedProject: PortalProject,
  author: string,
  authorRole: string,
  changeType: ProjectVersion['changeType'],
  customSummary?: string
): ProjectVersion {
  const currentHistory = previousProject.versionHistory || [];
  const nextVersionNumber = currentHistory.length + 1;
  const timestamp = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const diffs = calculateProjectDiff(previousProject, updatedProject);

  let defaultSummary = '';
  if (changeType === 'created') {
    defaultSummary = `Criação inicial da obra ${updatedProject.code} no Portal Biofílico.`;
  } else if (changeType === 'status_change') {
    defaultSummary = `Status atualizado para "${updatedProject.statusLabel || updatedProject.status}".`;
  } else if (changeType === 'dimensions_edit') {
    defaultSummary = `Redimensionamento de área de ${previousProject.area}m² para ${updatedProject.area}m².`;
  } else if (changeType === 'botanical_edit') {
    defaultSummary = `Atualização da composição e paleta botânica homologada.`;
  } else if (changeType === 'reverted') {
    defaultSummary = customSummary || `Restauração para versão anterior solicitada pelo usuário.`;
  } else {
    defaultSummary = customSummary || `Revisão técnica de memorial e especificações estruturais.`;
  }

  // Create clean snapshot without cyclical version history
  const { versionHistory: _, ...snapshotData } = updatedProject;

  return {
    id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    projectId: updatedProject.id,
    versionNumber: nextVersionNumber,
    versionLabel: `v${nextVersionNumber}.0 • ${changeType === 'reverted' ? 'Versão Restaurada' : updatedProject.statusLabel || 'Revisão Técnica'}`,
    author,
    authorRole,
    timestamp,
    changeType,
    changeSummary: customSummary || defaultSummary,
    diffs: diffs.length > 0 ? diffs : undefined,
    snapshot: snapshotData,
  };
}

/**
 * Reverts a project to a specific past version snapshot while preserving history.
 */
export function revertProjectToVersion(
  currentProject: PortalProject,
  targetVersion: ProjectVersion,
  author: string,
  authorRole: string
): PortalProject {
  const history = currentProject.versionHistory || [];

  // Snapshot contains previous state
  const restoredSnapshot = targetVersion.snapshot;

  // Build the updated restored project
  const restoredProject: PortalProject = {
    ...restoredSnapshot,
    id: currentProject.id,
    code: currentProject.code,
    versionHistory: history,
  };

  // Record this reversion as a new version
  const revertVersionRecord = createProjectVersion(
    currentProject,
    restoredProject,
    author,
    authorRole,
    'reverted',
    `Projeto revertido para a Versão v${targetVersion.versionNumber}.0 gravada em ${targetVersion.timestamp}.`
  );

  restoredProject.versionHistory = [...history, revertVersionRecord];
  restoredProject.currentVersionId = revertVersionRecord.id;

  return restoredProject;
}

/**
 * Seeds realistic version history for default portal projects.
 */
export function seedProjectHistory(project: PortalProject): PortalProject {
  if (project.versionHistory && project.versionHistory.length > 0) {
    return project;
  }

  const baseDate = project.dateCreated || '10/08/2026';
  const authorName = 'Arq. Camila Valença';
  const authorRole = 'Arquiteta Especificadora';

  if (project.id === 'proj_1') {
    // Lounge Faria Lima - 3 versions
    const v1Snapshot: Omit<PortalProject, 'versionHistory'> = {
      ...project,
      area: 25.0,
      estimatedTotal: 36250,
      status: 'estudo_ia',
      statusLabel: 'Estudo Inicial com IA',
      speciesUsed: ['Moss Dinamarquês Verde Floresta', 'Samambaia Americana Estabilizada'],
      leedPointsTotal: 10,
      wellScore: 78,
      acousticNrc: 0.82,
    };

    const v2Snapshot: Omit<PortalProject, 'versionHistory'> = {
      ...project,
      area: 32.5,
      estimatedTotal: 48750,
      status: 'orcamento_enviado',
      statusLabel: 'Proposta Comercial Emitida',
      speciesUsed: ['Moss Dinamarquês Verde Floresta', 'Costela-de-Adão Preservada', 'Samambaia Americana Estabilizada'],
      leedPointsTotal: 12,
      wellScore: 84,
      acousticNrc: 0.86,
    };

    const v3Snapshot: Omit<PortalProject, 'versionHistory'> = {
      ...project,
    };

    const ver1: ProjectVersion = {
      id: 'ver_proj1_v1',
      projectId: project.id,
      versionNumber: 1,
      versionLabel: 'v1.0 • Estudo IA & Concepção Inicial',
      author: authorName,
      authorRole,
      timestamp: `${baseDate} às 09:30`,
      changeType: 'created',
      changeSummary: 'Concepção inicial gerada via Simulador IA para lounge de 25m².',
      snapshot: v1Snapshot,
    };

    const ver2: ProjectVersion = {
      id: 'ver_proj1_v2',
      projectId: project.id,
      versionNumber: 2,
      versionLabel: 'v2.0 • Ampliação de Parede & Inclusão de Costelas Preservadas',
      author: authorName,
      authorRole,
      timestamp: '14/08/2026 às 14:15',
      changeType: 'dimensions_edit',
      changeSummary: 'Ampliação da parede para 32.5m² atendendo ao layout executivo e acréscimo de Costela-de-Adão.',
      diffs: [
        { field: 'area', label: 'Área Projetada', oldValue: '25.0 m²', newValue: '32.5 m²' },
        { field: 'estimatedTotal', label: 'Investimento', oldValue: 'R$ 36.250', newValue: 'R$ 48.750' },
        { field: 'speciesUsed', label: 'Espécies Botânicas', oldValue: 'Moss e Samambaia', newValue: '+ Costela-de-Adão Preservada' },
        { field: 'leedPointsTotal', label: 'Pontuação LEED', oldValue: '10 pts', newValue: '12 pts' },
      ],
      snapshot: v2Snapshot,
    };

    const ver3: ProjectVersion = {
      id: 'ver_proj1_v3',
      projectId: project.id,
      versionNumber: 3,
      versionLabel: 'v3.0 • Homologação Acústica IPT & Liberação Fabril Plug & Play',
      author: 'Eng. Marcelo Prado (All Green)',
      authorRole: 'Engenheiro de Produção',
      timestamp: '18/08/2026 às 16:40',
      changeType: 'status_change',
      changeSummary: 'Aprovação de fabricação modular em MDF Ultra Naval com laudo IPT NRC 0.88.',
      diffs: [
        { field: 'status', label: 'Status da Obra', oldValue: 'Proposta Comercial Emitida', newValue: 'Em Produção (Módulos Plug & Play)' },
        { field: 'acousticNrc', label: 'Absorção Acústica', oldValue: 'NRC 0.86', newValue: 'NRC 0.88 (IPT ISO 354)' },
        { field: 'wellScore', label: 'WELL Score', oldValue: '84 pts', newValue: '88 pts Platinum' },
      ],
      snapshot: v3Snapshot,
    };

    return {
      ...project,
      versionHistory: [ver1, ver2, ver3],
      currentVersionId: ver3.id,
    };
  }

  if (project.id === 'proj_2') {
    // Varanda Gourmet Jardins - 2 versions
    const v1Snapshot: Omit<PortalProject, 'versionHistory'> = {
      ...project,
      style: 'Jardim Preservado',
      estimatedTotal: 20300,
      notes: 'Estudo inicial com plantas preservadas para varanda.',
    };

    const v2Snapshot: Omit<PortalProject, 'versionHistory'> = {
      ...project,
    };

    const ver1: ProjectVersion = {
      id: 'ver_proj2_v1',
      projectId: project.id,
      versionNumber: 1,
      versionLabel: 'v1.0 • Estudo Inicial com Jardim Preservado',
      author: authorName,
      authorRole,
      timestamp: `${baseDate} às 11:20`,
      changeType: 'created',
      changeSummary: 'Estudo inicial de especificação para varanda gourmet.',
      snapshot: v1Snapshot,
    };

    const ver2: ProjectVersion = {
      id: 'ver_proj2_v2',
      projectId: project.id,
      versionNumber: 2,
      versionLabel: 'v2.0 • Migração para Permanente Real Touch Anti-UV',
      author: authorName,
      authorRole,
      timestamp: '11/08/2026 às 10:05',
      changeType: 'specs_edit',
      changeSummary: 'Ajuste de especificação para Permanente Anti-UV devido à incidência de luz solar matinal direta (ASTM G154).',
      diffs: [
        { field: 'style', label: 'Tipologia', oldValue: 'Jardim Preservado', newValue: 'Jardim Permanente Hiper-Realista' },
        { field: 'estimatedTotal', label: 'Investimento Estimado', oldValue: 'R$ 20.300', newValue: 'R$ 19.600' },
        { field: 'notes', label: 'Memorial', oldValue: 'Uso interno', newValue: 'Tratamento UV anti-fade 3.500h' },
      ],
      snapshot: v2Snapshot,
    };

    return {
      ...project,
      versionHistory: [ver1, ver2],
      currentVersionId: ver2.id,
    };
  }

  // Generic 1-version fallback for new or other projects
  const { versionHistory: _, ...snapshotData } = project;
  const initialVer: ProjectVersion = {
    id: `ver_${project.id}_v1`,
    projectId: project.id,
    versionNumber: 1,
    versionLabel: 'v1.0 • Cadastro Inicial da Obra',
    author: authorName,
    authorRole,
    timestamp: `${baseDate} às 10:00`,
    changeType: 'created',
    changeSummary: `Cadastro das especificações estruturais de ${project.title}.`,
    snapshot: snapshotData,
  };

  return {
    ...project,
    versionHistory: [initialVer],
    currentVersionId: initialVer.id,
  };
}
