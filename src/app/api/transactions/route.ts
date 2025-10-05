import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

interface TransactionItem {
  date: string;
  payee_name: string;
  decimal_amount: number;
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

function toMonthBounds(year: number, month: number): { startDate: string; endDate: string } {
  const start = Date.UTC(year, month - 1, 1);
  const end = Date.UTC(year, month, 0); // last day of month
  // ISO without time to keep parity with UI parsing (it uses new Date(date))
  const startDate = new Date(start).toISOString().slice(0, 10);
  const endDate = new Date(end).toISOString().slice(0, 10);
  return { startDate, endDate };
}

// YNAB API constants from environment
const YNAB_API_URL = process.env.YNAB_API_URL || 'https://api.ynab.com/v1';
const YNAB_BUDGET_ID = process.env.YNAB_BUDGET_ID;
const YNAB_ACCESS_TOKEN = process.env.YNAB_ACCESS_TOKEN;

// Helper to fetch a transaction by ID from YNAB and return its payee name
async function fetchParentTransactionPayee(parent_transaction_id: string | undefined): Promise<string> {
  if (!parent_transaction_id) return '';

  const url = `${YNAB_API_URL}/budgets/${YNAB_BUDGET_ID}/transactions/${parent_transaction_id}`;
  const resp = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${YNAB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!resp.ok) return '';
  const data = await resp.json();
  const t = data?.data?.transaction;
  return t?.payee_name ?? t?.payeeName ?? t?.payee ?? '';
}

// Map category name to YNAB category ID (should be set in env or config)
function getCategoryId(category: string): string | undefined {
  // Example: process.env.YNAB_CATEGORY_FOOD for category 'food'
  const key = `YNAB_CATEGORY_${category.toUpperCase()}`;
  return process.env[key];
}

type YnabTransaction = {
  date: string;
  amount: number;
  payee_name?: string;
  payeeName?: string;
  payee?: string;
  parent_transaction_id?: string;
  // ...other fields if needed
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Require authentication
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get('category') ?? '';
  const yearParam = url.searchParams.get('year');
  const monthParam = url.searchParams.get('month');

  if (!category) {
    return badRequest('Missing required parameter: category');
  }
  const year = Number(yearParam);
  const month = Number(monthParam);
  if (!Number.isFinite(year) || !Number.isInteger(year)) {
    return badRequest('Invalid year');
  }
  if (!Number.isFinite(month) || !Number.isInteger(month) || month < 1 || month > 12) {
    return badRequest('Invalid month');
  }

  if (!YNAB_API_URL || !YNAB_BUDGET_ID || !YNAB_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Server not configured: missing YNAB_API_URL, YNAB_BUDGET_ID, or YNAB_ACCESS_TOKEN' },
      { status: 500 }
    );
  }

  const categoryId = getCategoryId(category);
  if (!categoryId) {
    return badRequest(`Unknown or unconfigured category: ${category}`);
  }

  const { startDate, endDate } = toMonthBounds(year, month);

  // Build YNAB API URL for category transactions
  const ynabUrl = `${YNAB_API_URL}/budgets/${YNAB_BUDGET_ID}/categories/${categoryId}/transactions?since_date=${startDate}`;

  try {
    const ynabResponse = await fetch(ynabUrl, {
      headers: {
        'Authorization': `Bearer ${YNAB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!ynabResponse.ok) {
      return NextResponse.json(
        { error: 'YNAB request failed', status: ynabResponse.status },
        { status: 502 }
      );
    }
    const raw = await ynabResponse.json();

    // YNAB response: { data: { transactions: [...] } }
    const transactions = raw?.data?.transactions || [];

    // Filter and normalize
    const normalized: TransactionItem[] = await Promise.all(transactions
      .filter((t: YnabTransaction) => t.date >= startDate && t.date <= endDate)
      .sort((a: YnabTransaction, b: YnabTransaction) => b.amount - a.amount)
      .map(async (t: YnabTransaction) => ({
        date: t.date,
        payee_name: t.payee_name ?? t.payeeName ?? t.payee ?? await fetchParentTransactionPayee(t.parent_transaction_id),
        decimal_amount: typeof t.amount === 'number' ? t.amount / 1000 : 0,
      })));
    return NextResponse.json(normalized, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to contact YNAB' }, { status: 502 });
  }
}
