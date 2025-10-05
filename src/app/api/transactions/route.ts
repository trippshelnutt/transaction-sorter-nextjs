import { NextRequest, NextResponse } from 'next/server';

interface TransactionItem {
  date: string;
  payee_name: string;
  decimal_amount: number;
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

function toMonthBounds(year: number, month: number): { startDate: string; endDate: string } {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // last day of month
  // ISO without time to keep parity with UI parsing (it uses new Date(date))
  const startDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()))
    .toISOString()
    .slice(0, 10);
  const endDate = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()))
    .toISOString()
    .slice(0, 10);
  return { startDate, endDate };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
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

  const { startDate, endDate } = toMonthBounds(year, month);

  const upstreamBase = process.env.UPSTREAM_BASE_URL;
  if (!upstreamBase) {
    return NextResponse.json(
      { error: 'Server not configured: missing UPSTREAM_BASE_URL' },
      { status: 500 }
    );
  }

  // Default upstream path mirrors existing client usage: /Prod/api/transactions/{category}/{year}/{month}
  const upstreamUrl = new URL(`/Prod/api/transactions/${encodeURIComponent(category)}/${year}/${month}`, upstreamBase);

  const headers: Record<string, string> = {};
  if (process.env.UPSTREAM_AUTH_HEADER && process.env.UPSTREAM_AUTH_TOKEN) {
    headers[process.env.UPSTREAM_AUTH_HEADER] = process.env.UPSTREAM_AUTH_TOKEN;
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl.href, { headers, cache: 'no-store' });
    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: 'Upstream request failed', status: upstreamResponse.status },
        { status: 502 }
      );
    }
    const raw = await upstreamResponse.json();

    // Normalize to TransactionItem[]; pass-through if already in desired shape
    const normalized: TransactionItem[] = Array.isArray(raw)
      ? raw.map((t: any) => ({
          date: t.date,
          payee_name: t.payee_name ?? t.payeeName ?? t.payee,
          decimal_amount:
            typeof t.decimal_amount === 'number'
              ? t.decimal_amount
              : typeof t.decimalAmount === 'number'
              ? t.decimalAmount
              : typeof t.amount === 'number'
              ? t.amount / 1000 / 100 // fallback if amount is milliunits then cents; adjust if needed
              : 0,
        }))
      : [];

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to contact upstream' }, { status: 502 });
  }
}


