export interface Trade {
  id: string
  user_id: string
  date: string
  asset: string
  type: 'Long' | 'Short'
  result: number
  emotion: number
  confidence: number
  followed_plan: boolean
  note: string | null
  tags: string[]
  created_at: string
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type TradeFormData = Omit<Trade, 'id' | 'user_id' | 'created_at'>

export const PREDEFINED_TAGS = [
  'emocional',
  'disciplina',
  'revenge trade',
  'fomo',
  'overtrading',
  'setup claro',
  'stop errado',
  'saída antecipada',
  'paciência',
  'impulsivo',
]

export const ASSETS = [
  // ── Futuros ────────────────────────────────────────
  'WINFUT', 'DOLFUT', 'INDFUT', 'BGIFUT', 'CCMFUT', 'ICFFUT', 'OZ1FUT', 'DI1FUT',

  // ── Ações — Ibovespa & mais líquidas ──────────────
  'ABEV3', 'ALOS3', 'ALPA4', 'ALSO3', 'ANIM3', 'ARZZ3', 'ASAI3', 'AZUL4',
  'B3SA3', 'BBAS3', 'BBDC3', 'BBDC4', 'BBSE3', 'BEEF3', 'BPAC11', 'BPAN4',
  'BRFS3', 'BRKM5', 'CASH3', 'CBAV3', 'CCRO3', 'CESP6', 'CMIG4', 'CMIN3',
  'COGN3', 'CPFE3', 'CPLE6', 'CRFB3', 'CSAN3', 'CSNA3', 'CVCB3', 'CYRE3',
  'DXCO3', 'ECOR3', 'EGIE3', 'ELET3', 'ELET6', 'EMBR3', 'ENEV3', 'ENGI11',
  'EQTL3', 'EVEN3', 'EZTC3', 'FESA4', 'FLRY3', 'GGBR4', 'GOAU4', 'GOLL4',
  'HAPV3', 'HYPE3', 'IGTI11', 'INTB3', 'IRBR3', 'ITSA4', 'ITUB3', 'ITUB4',
  'JBSS3', 'JHSF3', 'KLBN11', 'LREN3', 'LWSA3', 'MBLY3', 'MGLU3', 'MILS3',
  'MOVI3', 'MRFG3', 'MRVE3', 'MULT3', 'NTCO3', 'PCAR3', 'PETR3', 'PETR4',
  'PETZ3', 'POMO4', 'PRIO3', 'RADL3', 'RAIL3', 'RAIZ4', 'RANI3', 'RECV3',
  'RENT3', 'RRRP3', 'SANB11', 'SAPR11', 'SBSP3', 'SEER3', 'SIMH3', 'SLCE3',
  'SMTO3', 'STBP3', 'SUZB3', 'TAEE11', 'TGMA3', 'TEND3', 'TIMS3', 'TOTS3',
  'TRPL4', 'TUPY3', 'UGPA3', 'USIM5', 'VALE3', 'VAMO3', 'VIVT3', 'WEGE3', 'YDUQ3',

  // ── ETFs ──────────────────────────────────────────
  'BOVA11', 'DIVO11', 'FIND11', 'GOLD11', 'HASH11', 'IVVB11',
  'MATB11', 'NFTF11', 'QBTC11', 'SMAL11', 'SPXI11', 'XFIX11',

  // ── FIIs ──────────────────────────────────────────
  'ALZR11', 'BCFF11', 'BCRI11', 'BRCO11', 'BTLG11', 'FIIB11', 'GGRC11',
  'HFOF11', 'HGLG11', 'HGRE11', 'KNCR11', 'KNIP11', 'KNRI11', 'MXRF11',
  'RBRF11', 'RBRP11', 'VISC11', 'VILG11', 'VGIP11', 'XPLG11', 'XPML11',

  // ── BDRs ──────────────────────────────────────────
  'AAPL34', 'AMZO34', 'DISB34', 'GOGL34', 'MELI34',
  'META34', 'MSFT34', 'NFLX34', 'NVDC34', 'TSLA34',

  // ── Cripto ────────────────────────────────────────
  'BNB', 'BTC', 'ETH', 'SOL', 'XRP',
]
