import type { CreateProjectRequest } from '../types/project/project-create';

export type { CreateProjectRequest, CreateProjectOptions } from '../types/project/project-create';

/**
 * Request body for auto-creating a missing Virtuous project (integration default field values).
 * @see https://docs.virtuous.org/api-reference/project/create-project
 * @param {string} projectName - Project name and default revenue accounting code.
 * @param {string} [description] - Project description.
 * @returns {CreateProjectRequest} Body ready for {@link VirtuousClient.project.createProject}.
 * @example
 * const request = buildAutoCreateProjectRequest('general-fund');
 * const project = await virtuous.project.createProject(request);
 */
export function buildAutoCreateProjectRequest(
  projectName: string,
  description = 'Project auto-created by integration',
): CreateProjectRequest {
  return {
    name: projectName,
    revenueAccountingCode: projectName,
    inventoryStatus: 'Unspecified',
    type: 'Default',
    onlineDisplayName: projectName,
    description,
    durationType: 'Ongoing',
    financialNeedAmount: 0,
    financialNeedType: 2,
    financialNeedFrequency: 'Annually',
    location: 'US',
    isPublic: true,
    isActive: true,
    isAvailableOnline: true,
    isLimitedToFinancialNeed: false,
    isTaxDeductible: true,
    treatAsAccountsPayable: false,
    isRestrictedToGiftSpecifications: false,
    enableSync: false,
  };
}