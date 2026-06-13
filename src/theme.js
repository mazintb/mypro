export const DARK = {
  bg:'#040a16', surface:'#0a1628', surface2:'#0f2038',
  border:'#1c3458', borderGold:'#c9a84c2e',
  gold:'#cbac57', goldLight:'#ead591', goldDark:'#8a6520',
  text:'#eaf2ff', textMuted:'#6b8bba', textDim:'#33507a',
  success:'#34d667', danger:'#ff5247', warning:'#ffcf2e', info:'#2a93ff',
  tabBar:'rgba(10,22,40,0.82)', inputBg:'#0d1c34',
  cardShadow:'0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(2,8,20,0.9)',
  glassCard:'rgba(255,255,255,0.045)', glassBorder:'rgba(255,255,255,0.08)',
};

export const LIGHT = {
  bg:'#EBEDF1', surface:'#FFFFFF', surface2:'#F4F5F8',
  border:'#DCDEE4', borderGold:'#9A6E0D55',
  gold:'#9A6E0D', goldLight:'#C4860E', goldDark:'#6b4a08',
  text:'#16181D', textMuted:'#5C6270', textDim:'#A6AAB5',
  success:'#1E8A3C', danger:'#D7261A', warning:'#B85C00', info:'#0060CE',
  tabBar:'rgba(248,248,252,0.85)', inputBg:'#F1F2F6',
  cardShadow:'0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 18px -10px rgba(20,28,48,0.22), 0 0 0 1px rgba(20,28,48,0.05)',
  glassCard:'rgba(255,255,255,0.96)', glassBorder:'rgba(20,28,48,0.08)',
};

export function useTheme(isDark){ return isDark?DARK:LIGHT; }
