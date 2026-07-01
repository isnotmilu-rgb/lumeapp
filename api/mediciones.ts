import { createClient } from '@supabase/supabase-js';

type MeasurementPayload = {
  vendedor_id: string;
  valor_humedad: number;
};

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string[]) => void;
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!supabase) {
    res.status(500).json({ error: 'Supabase environment variables are not configured.' });
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      status: 'ok',
      endpoint: '/api/mediciones',
      methods: ['GET', 'POST'],
    });
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as Partial<MeasurementPayload>;
    const vendedorId = typeof body?.vendedor_id === 'string' ? body.vendedor_id.trim() : '';
    const rawHumidity = body?.valor_humedad;
    const valorHumedad = typeof rawHumidity === 'number' ? rawHumidity : Number(rawHumidity);

    if (!vendedorId || Number.isNaN(valorHumedad)) {
      res.status(400).json({ error: 'Invalid payload. Required: vendedor_id (string), valor_humedad (number).' });
      return;
    }

    const { error } = await supabase
      .from('mediciones_humedad')
      .insert({
        vendedor_id: vendedorId,
        valor_humedad: valorHumedad,
      });

    if (error) {
      console.error('Error real de Supabase:', error);
      res.status(500).json({ error: 'Failed to insert measurement.' });
      return;
    }

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Error processing /api/mediciones POST:', error);
    res.status(400).json({ error: 'Invalid JSON body.' });
  }
}
