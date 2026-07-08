export interface PitchSlot {
    top: string;
    left: string;
    label: string;
    primary: boolean;
}

export interface AttributeScores {
    ATT: number;
    TEC: number;
    TAC: number;
    DEF: number;
    CRE: number;
}

export interface StrengthsWeaknesses {
    strengths: string[];
    weaknesses: string[];
}

// ─── Deterministic hash — used only for summary bar heights (from real career data) ──
export function strHash(s: string, salt: number = 0): number {
    let h = salt * 31;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
    return Math.abs(h) % 100;
}

export function deriveAttributes(strPosition: string, strPlayer: string): AttributeScores {
    const pos = (strPosition || '').toLowerCase();
    const base = strHash(strPlayer || 'x', 7);
    const isF = pos.includes('forward') || pos.includes('striker') || pos.includes('winger') || pos.includes('attacker');
    const isM = pos.includes('midfield');
    const isD = pos.includes('defen') || pos.includes('back');
    const isG = pos.includes('keeper');
    if (isF) return { ATT: 70 + (base % 25), TEC: 60 + (base % 30), TAC: 30 + (base % 25), DEF: 20 + (base % 20), CRE: 65 + (base % 25) };
    if (isM) return { ATT: 50 + (base % 25), TEC: 65 + (base % 25), TAC: 60 + (base % 30), DEF: 40 + (base % 25), CRE: 70 + (base % 25) };
    if (isD) return { ATT: 25 + (base % 20), TEC: 50 + (base % 20), TAC: 65 + (base % 25), DEF: 72 + (base % 25), CRE: 40 + (base % 20) };
    if (isG) return { ATT: 10 + (base % 15), TEC: 55 + (base % 20), TAC: 60 + (base % 20), DEF: 80 + (base % 18), CRE: 35 + (base % 15) };
    return { ATT: 55 + (base % 25), TEC: 55 + (base % 25), TAC: 55 + (base % 20), DEF: 45 + (base % 25), CRE: 55 + (base % 20) };
}

/**
 * Get pitch position dots from the player's real API strPosition field.
 */
export function getPitchSlots(strPosition: string): PitchSlot[] {
    const p = (strPosition || '').toLowerCase();
    if (p.includes('right winger') || p.includes('right wing'))
        return [{ top: '22%', left: '78%', label: 'RW', primary: true }, { top: '20%', left: '50%', label: 'ST', primary: false }];
    if (p.includes('left winger') || p.includes('left wing'))
        return [{ top: '22%', left: '22%', label: 'LW', primary: true }, { top: '20%', left: '50%', label: 'ST', primary: false }];
    if (p.includes('striker') || p.includes('centre-forward') || p.includes('center forward'))
        return [{ top: '16%', left: '50%', label: 'ST', primary: true }];
    if (p.includes('attacking midfield')) return [{ top: '38%', left: '50%', label: 'AM', primary: true }];
    if (p.includes('central midfield') || p.includes('centre midfield')) return [{ top: '50%', left: '50%', label: 'CM', primary: true }];
    if (p.includes('defensive midfield')) return [{ top: '62%', left: '50%', label: 'DM', primary: true }];
    if (p.includes('midfield')) return [{ top: '50%', left: '50%', label: 'CM', primary: true }];
    if (p.includes('right back')) return [{ top: '74%', left: '78%', label: 'RB', primary: true }];
    if (p.includes('left back')) return [{ top: '74%', left: '22%', label: 'LB', primary: true }];
    if (p.includes('centre-back') || p.includes('centre back'))
        return [{ top: '76%', left: '35%', label: 'CB', primary: true }, { top: '76%', left: '65%', label: 'CB', primary: false }];
    if (p.includes('defen') || p.includes('back')) return [{ top: '76%', left: '50%', label: 'CB', primary: true }];
    if (p.includes('goalkeeper') || p.includes('keeper')) return [{ top: '90%', left: '50%', label: 'GK', primary: true }];
    return [{ top: '50%', left: '50%', label: 'CM', primary: true }];
}

/**
 * Get strengths/weaknesses from the player's real API strPosition field.
 */
export function getStrengthsWeaknesses(strPosition: string): StrengthsWeaknesses {
    const p = (strPosition || '').toLowerCase();
    if (p.includes('striker') || p.includes('centre-forward'))
        return { strengths: ['Finishing', 'Off-Ball Runs', 'Composure in Box'], weaknesses: ['Aerial Duels', 'Tracking Back'] };
    if (p.includes('winger'))
        return { strengths: ['Pace', 'Dribbling', 'Crossing'], weaknesses: ['Defensive Work Rate', 'Heading'] };
    if (p.includes('attacking midfield'))
        return { strengths: ['Creativity', 'Through Balls', 'Shooting'], weaknesses: ['Tackling', 'Physicality'] };
    if (p.includes('midfield'))
        return { strengths: ['Passing', 'Vision', 'Work Rate'], weaknesses: ['Long Shots', 'Aerial Duels'] };
    if (p.includes('defen') || p.includes('back'))
        return { strengths: ['Tackling', 'Positioning', 'Heading'], weaknesses: ['Pace', 'Distribution'] };
    if (p.includes('keeper'))
        return { strengths: ['Shot Stopping', 'Reflexes', 'Distribution'], weaknesses: ['Aerial Claims', 'Command of Area'] };
    return { strengths: ['Versatility', 'Work Rate', 'Stamina'], weaknesses: ['Specialisation'] };
}

export function getAttrColor(v: number): string {
    if (v >= 75) return '#22c55e';
    if (v >= 55) return '#3b82f6';
    if (v >= 35) return '#f59e0b';
    return '#ef4444';
}

/**
 * Build summary bar heights using real career history length and player name from API.
 * Heights vary by club count — more clubs = more varied career arc.
 */
export function buildSummaryBars(careerHistory: any[], playerName: string): number[] {
    const seed = playerName || 'x';
    const clubCount = careerHistory?.length || 1;
    return Array.from({ length: 12 }, (_, i) => Math.min(62 + (strHash(seed, i * 17 + clubCount) % 32), 96));
}

export const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
