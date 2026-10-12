import type { QueryCondition, QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse, QueryParameterOption } from '../types/shared/query-options';

/**
 * One problem found in a query body.
 *
 * Virtuous silently ignores unknown parameters and returns the whole table,
 * so a typo like `"Gift date"` looks like a successful unfiltered query.
 * These issues are how we fail before that request is sent.
 */
export interface QueryValidationIssue {
  /** Machine-readable reason. */
  code:
    | 'unknown-parameter'
    | 'unknown-operator'
    | 'missing-value'
    | 'values-not-allowed'
    | 'value-not-in-options';
  /** Human-readable explanation, including a suggestion when we have one. */
  message: string;
  /** Condition parameter, when the issue is about a condition. */
  parameter?: string;
  /** Operator that was rejected. */
  operator?: string;
  /** Value that was not in `valueOptions`. */
  value?: string;
  /** Case-insensitive near-match for an unknown parameter. */
  suggestion?: string;
}

/**
 * Thrown when `validateQueries` is on and the body does not match QueryOptions.
 * The request is not sent.
 */
export class VirtuousQueryValidationError extends Error {
  /** Every issue found in the body. Empty means the query was valid. */
  public readonly issues: QueryValidationIssue[];

  /**
   * @param issues - Problems found by {@link validateQuery}.
   */
  constructor(issues: QueryValidationIssue[]) {
    const summary = issues.map((issue) => issue.message).join('; ');
    super(summary || 'Query failed validation');
    this.name = 'VirtuousQueryValidationError';
    this.issues = issues;
  }
}

function suggestParameter(parameter: string, known: QueryParameterOption[]): string | undefined {
  const folded = parameter.toLowerCase();
  const match = known.find((option) => option.parameter.toLowerCase() === folded);
  return match && match.parameter !== parameter ? match.parameter : undefined;
}

function checkCondition(
  condition: QueryCondition,
  options: QueryOptionsResponse,
): QueryValidationIssue[] {
  const issues: QueryValidationIssue[] = [];
  const parameter = options.options.find((option) => option.parameter === condition.parameter);

  if (!parameter) {
    const suggestion = suggestParameter(condition.parameter, options.options);
    const hint = suggestion ? ` Did you mean "${suggestion}"?` : '';
    issues.push({
      code: 'unknown-parameter',
      parameter: condition.parameter,
      suggestion,
      message: `Unknown query parameter "${condition.parameter}".${hint} Virtuous would ignore it and return unfiltered rows.`,
    });
    return issues;
  }

  const operator = parameter.operatorOptions.find((option) => option.operator === condition.operator);
  if (!operator) {
    const allowed = parameter.operatorOptions.map((option) => option.operator).join(', ');
    issues.push({
      code: 'unknown-operator',
      parameter: condition.parameter,
      operator: condition.operator,
      message: `Operator "${condition.operator}" is not allowed for "${condition.parameter}". Allowed: ${allowed || '(none)'}.`,
    });
    return issues;
  }

  const hasValue = condition.value != null && condition.value !== '';
  if (operator.valueRequired && !hasValue && !(condition.values && condition.values.length > 0)) {
    issues.push({
      code: 'missing-value',
      parameter: condition.parameter,
      operator: condition.operator,
      message: `Operator "${condition.operator}" on "${condition.parameter}" requires a value.`,
    });
  }

  const usesValues = condition.values != null && condition.values.length > 0;
  if (usesValues && !operator.multipleValuesAllowed) {
    issues.push({
      code: 'values-not-allowed',
      parameter: condition.parameter,
      operator: condition.operator,
      message: `Operator "${condition.operator}" on "${condition.parameter}" does not allow "values". Send "value" instead.`,
    });
  }

  if (parameter.valueOptions.length > 0 && hasValue) {
    const value = String(condition.value);
    if (!parameter.valueOptions.includes(value)) {
      issues.push({
        code: 'value-not-in-options',
        parameter: condition.parameter,
        operator: condition.operator,
        value,
        message: `Value "${value}" is not in the allowed options for "${condition.parameter}".`,
      });
    }
  }

  return issues;
}

/**
 * Checks a query body against a QueryOptions catalog.
 *
 * Parameter names are case-sensitive, matching Virtuous. A case-only mismatch
 * is reported as unknown, with the correctly cased name in `suggestion`.
 *
 * @param req - Body you would POST to a Query endpoint.
 * @param options - Catalog from the matching `get*QueryOptions()` call.
 * @returns Issues found. An empty array means the body is safe to send.
 */
export function validateQuery(req: QueryRequest, options: QueryOptionsResponse): QueryValidationIssue[] {
  const issues: QueryValidationIssue[] = [];
  for (const group of req.groups ?? []) {
    for (const condition of group.conditions ?? []) {
      issues.push(...checkCondition(condition, options));
    }
  }
  return issues;
}

/**
 * Same checks as {@link validateQuery}, thrown as {@link VirtuousQueryValidationError}.
 *
 * @param req - Query body.
 * @param options - QueryOptions catalog.
 */
export function assertValidQuery(req: QueryRequest, options: QueryOptionsResponse): void {
  const issues = validateQuery(req, options);
  if (issues.length > 0) {
    throw new VirtuousQueryValidationError(issues);
  }
}
