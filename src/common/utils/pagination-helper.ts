import { Request } from 'express';

// Types for pagination metadata
export interface PaginationMeta {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}

export interface PaginationLinks {
  next: string | null;
  prev: string | null;
}

export interface PaginationData {
  meta: PaginationMeta;
  links: PaginationLinks;
}

/**
 * Generates complete pagination data including metadata and navigation links
 * @function generatePaginationData
 * @param {Request} req - Express request object
 * @param {number} total - Total number of items
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} perPage - Number of items per page
 * @returns {PaginationData} Complete pagination data structure
 *
 * @example
 * // Returns full pagination data in one call
 * const pagination = generatePaginationData(req, 150, 2, 10);
 */
export function generatePaginationData(
  req: Request,
  total: number,
  currentPage: number,
  perPage: number
): PaginationData {
  const lastPage = Math.ceil(total / perPage);

  // Generate metadata
  const meta: PaginationMeta = {
    total,
    currentPage,
    lastPage,
    perPage,
  };

  // Generate links
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
  const queryParams = new URLSearchParams();

  // Preserve existing query parameters except page
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== 'page' && value !== undefined) {
      queryParams.set(key, value.toString());
    }
  });

  queryParams.set('limit', perPage.toString());

  const links: PaginationLinks = {
    next: null,
    prev: null,
  };

  if (currentPage < lastPage) {
    queryParams.set('page', (currentPage + 1).toString());
    links.next = `${baseUrl}?${queryParams.toString()}`;
  }

  if (currentPage > 1) {
    queryParams.set('page', (currentPage - 1).toString());
    links.prev = `${baseUrl}?${queryParams.toString()}`;
  }

  return {
    meta,
    links,
  };
}
